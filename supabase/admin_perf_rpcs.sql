-- Performance optimization: Indexes & Server-side paginated RPCs for Admin Orders & Customers

create or replace function public.normalize_vn_phone(p_phone text)
returns text
language sql
immutable
as $$
  select case
    when digits = '' then ''
    when left(digits, 2) = '84' and length(digits) >= 10 then '0' || substring(digits from 3)
    when length(digits) = 9 and left(digits, 1) <> '0' then '0' || digits
    else digits
  end
  from (select regexp_replace(coalesce(p_phone, ''), '\D+', '', 'g') as digits) s;
$$;

-- Functional indexes for instant customer <-> order matching & sorting
create index if not exists orders_created_at_desc_idx on public.orders(created_at desc);
create index if not exists orders_source_domain_idx on public.orders(source_domain);
create index if not exists orders_norm_phone_idx on public.orders(public.normalize_vn_phone(customer_phone));
create index if not exists orders_lower_email_idx on public.orders(lower(customer_email));
create index if not exists customers_norm_phone_idx on public.customers(public.normalize_vn_phone(phone));
create index if not exists customers_lower_email_idx on public.customers(lower(email));

create or replace function public.get_admin_orders_page(
  p_search text default null,
  p_status text default 'all',
  p_source text default 'all',
  p_limit integer default 25,
  p_offset integer default 0
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_search text := nullif(trim(coalesce(p_search, '')), '');
  v_status text := coalesce(nullif(trim(p_status), ''), 'all');
  v_source text := coalesce(nullif(trim(p_source), ''), 'all');
  v_limit integer := greatest(1, least(coalesce(p_limit, 25), 5000));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_stats jsonb;
  v_filtered_total integer;
  v_orders jsonb;
begin
  if not public.current_user_is_admin() then
    raise exception 'Forbidden';
  end if;

  select jsonb_build_object(
    'total', count(*),
    'new', count(*) filter (where status = 'new'),
    'processing', count(*) filter (where status in ('contacted', 'confirmed', 'shipping')),
    'completed', count(*) filter (where status = 'completed'),
    'cancelled', count(*) filter (where status = 'cancelled')
  )
  into v_stats
  from public.orders;

  with filtered as (
    select o.*
    from public.orders o
    where
      (
        v_status = 'all'
        or (v_status = 'processing' and o.status in ('contacted', 'confirmed', 'shipping'))
        or (v_status <> 'processing' and o.status = v_status)
      )
      and (
        v_source = 'all'
        or (v_source = 'hammer' and lower(coalesce(o.source_domain, '')) like '%hammer%')
        or (v_source = 'profitness' and lower(coalesce(o.source_domain, '')) not like '%hammer%')
      )
      and (
        v_search is null
        or o.order_code ilike '%' || v_search || '%'
        or o.customer_name ilike '%' || v_search || '%'
        or o.customer_phone ilike '%' || v_search || '%'
        or coalesce(o.customer_email, '') ilike '%' || v_search || '%'
        or o.shipping_address ilike '%' || v_search || '%'
      )
  ),
  counted as (
    select count(*)::integer as cnt from filtered
  ),
  paged as (
    select *
    from filtered
    order by created_at desc
    limit v_limit
    offset v_offset
  )
  select
    (select cnt from counted),
    coalesce(
      (
        select jsonb_agg(
          to_jsonb(p) || jsonb_build_object(
            'order_items',
            coalesce(
              (
                select jsonb_agg(to_jsonb(oi) order by oi.created_at asc)
                from public.order_items oi
                where oi.order_id = p.id
              ),
              '[]'::jsonb
            )
          )
          order by p.created_at desc
        )
        from paged p
      ),
      '[]'::jsonb
    )
  into v_filtered_total, v_orders;

  return jsonb_build_object(
    'stats', v_stats,
    'filteredTotal', coalesce(v_filtered_total, 0),
    'orders', v_orders
  );
end;
$$;

create or replace function public.get_admin_customers_page(
  p_search text default null,
  p_source text default 'all',
  p_segment text default 'all',
  p_limit integer default 25,
  p_offset integer default 0
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_search text := nullif(trim(coalesce(p_search, '')), '');
  v_source text := coalesce(nullif(trim(p_source), ''), 'all');
  v_segment text := coalesce(nullif(trim(p_segment), ''), 'all');
  v_limit integer := greatest(1, least(coalesce(p_limit, 25), 5000));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_stats jsonb;
  v_filtered_total integer;
  v_customers jsonb;
begin
  if not public.current_user_is_admin() then
    raise exception 'Forbidden';
  end if;

  with order_norm as materialized (
    select
      id,
      total_amount,
      status,
      created_at,
      public.normalize_vn_phone(customer_phone) as norm_phone,
      lower(nullif(trim(coalesce(customer_email, '')), '')) as norm_email
    from public.orders
  ),
  customer_base as materialized (
    select
      c.*,
      public.normalize_vn_phone(c.phone) as norm_phone,
      lower(nullif(trim(coalesce(c.email, '')), '')) as norm_email
    from public.customers c
  ),
  matched_pairs as (
    select c.id as customer_id, o.id as order_id, o.total_amount, o.status, o.created_at
    from customer_base c
    join order_norm o on c.norm_phone <> '' and o.norm_phone = c.norm_phone
    union
    select c.id as customer_id, o.id as order_id, o.total_amount, o.status, o.created_at
    from customer_base c
    join order_norm o on c.norm_email is not null and o.norm_email = c.norm_email
  ),
  agg_by_customer as (
    select
      customer_id,
      count(*)::integer as order_count,
      coalesce(sum(case when status <> 'cancelled' then total_amount else 0 end), 0)::numeric as total_spent,
      max(created_at) as last_order_at
    from matched_pairs
    group by customer_id
  ),
  customer_enriched as materialized (
    select
      c.id,
      c.legacy_id,
      c.full_name,
      c.phone,
      c.email,
      c.address,
      c.notes,
      c.source_domain,
      c.created_at,
      c.updated_at,
      coalesce(a.order_count, 0) as order_count,
      coalesce(a.total_spent, 0) as total_spent,
      a.last_order_at
    from customer_base c
    left join agg_by_customer a on a.customer_id = c.id
  ),
  all_stats as (
    select jsonb_build_object(
      'total', count(*),
      'withOrders', count(*) filter (where order_count > 0),
      'repeat', count(*) filter (where order_count >= 2),
      'hammer', count(*) filter (where lower(coalesce(source_domain, '')) like '%hammer%'),
      'profitness', count(*) filter (where lower(coalesce(source_domain, '')) not like '%hammer%')
    ) as s
    from customer_enriched
  ),
  filtered as (
    select *
    from customer_enriched c
    where
      (
        v_source = 'all'
        or (v_source = 'hammer' and lower(coalesce(c.source_domain, '')) like '%hammer%')
        or (v_source = 'profitness' and lower(coalesce(c.source_domain, '')) not like '%hammer%')
      )
      and (
        v_segment = 'all'
        or (v_segment = 'with_orders' and c.order_count > 0)
        or (v_segment = 'repeat' and c.order_count >= 2)
        or (v_segment = 'no_orders' and c.order_count = 0)
      )
      and (
        v_search is null
        or c.full_name ilike '%' || v_search || '%'
        or coalesce(c.phone, '') ilike '%' || v_search || '%'
        or coalesce(c.email, '') ilike '%' || v_search || '%'
        or coalesce(c.address, '') ilike '%' || v_search || '%'
      )
  ),
  counted as (
    select count(*)::integer as cnt from filtered
  ),
  paged as (
    select *
    from filtered
    order by created_at desc
    limit v_limit
    offset v_offset
  )
  select
    (select s from all_stats),
    (select cnt from counted),
    coalesce((select jsonb_agg(to_jsonb(p) order by p.created_at desc) from paged p), '[]'::jsonb)
  into v_stats, v_filtered_total, v_customers;

  return jsonb_build_object(
    'stats', v_stats,
    'filteredTotal', coalesce(v_filtered_total, 0),
    'customers', v_customers
  );
end;
$$;

grant execute on function public.get_admin_orders_page(text, text, text, integer, integer) to authenticated;
grant execute on function public.get_admin_customers_page(text, text, text, integer, integer) to authenticated;

create or replace function public.get_admin_customer_orders(p_customer_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_phone text;
  v_email text;
  v_orders jsonb;
begin
  if not public.current_user_is_admin() then
    raise exception 'Forbidden';
  end if;

  select
    public.normalize_vn_phone(phone),
    lower(nullif(trim(coalesce(email, '')), ''))
  into v_phone, v_email
  from public.customers
  where id = p_customer_id;

  if v_phone is null and v_email is null then
    return '[]'::jsonb;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', o.id,
        'order_code', o.order_code,
        'total_amount', o.total_amount,
        'status', o.status,
        'source_domain', o.source_domain,
        'created_at', o.created_at
      )
      order by o.created_at desc
    ),
    '[]'::jsonb
  )
  into v_orders
  from public.orders o
  where
    (coalesce(v_phone, '') <> '' and public.normalize_vn_phone(o.customer_phone) = v_phone)
    or (v_email is not null and lower(nullif(trim(coalesce(o.customer_email, '')), '')) = v_email);

  return v_orders;
end;
$$;

grant execute on function public.get_admin_customer_orders(uuid) to authenticated;
