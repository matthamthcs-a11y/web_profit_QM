-- Migration: Customers table and order-to-customer sync RPC

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  legacy_id integer null unique,
  full_name text not null,
  phone text null,
  email text null,
  address text null,
  notes text null,
  source_domain text not null default 'profitness',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists customers_phone_idx on public.customers(phone);
create index if not exists customers_email_idx on public.customers(email);
create index if not exists customers_created_at_idx on public.customers(created_at desc);
create index if not exists customers_source_domain_idx on public.customers(source_domain);

-- Updated_at trigger
drop trigger if exists set_customers_updated_at on public.customers;
create trigger set_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

-- Enable Row Level Security
alter table public.customers enable row level security;

-- Grants
grant select, insert, update, delete on public.customers to authenticated;

-- RLS Policies (Admins only)
drop policy if exists "Admins can select customers" on public.customers;
create policy "Admins can select customers"
on public.customers
for select
to authenticated
using (public.current_user_is_admin());

drop policy if exists "Admins can insert customers" on public.customers;
create policy "Admins can insert customers"
on public.customers
for insert
to authenticated
with check (public.current_user_is_admin());

drop policy if exists "Admins can update customers" on public.customers;
create policy "Admins can update customers"
on public.customers
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "Admins can delete customers" on public.customers;
create policy "Admins can delete customers"
on public.customers
for delete
to authenticated
using (public.current_user_is_admin());

-- Safe SECURITY DEFINER RPC to sync customer from public checkout without exposing customer table to anon
create or replace function public.upsert_customer_from_order(
  p_full_name text,
  p_phone text,
  p_email text default null,
  p_address text default null,
  p_source_domain text default 'profitness'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_clean_phone text := regexp_replace(coalesce(p_phone, ''), '\s+', '', 'g');
  v_clean_email text := nullif(trim(coalesce(p_email, '')), '');
  v_clean_name text := nullif(trim(coalesce(p_full_name, '')), '');
  v_clean_address text := nullif(trim(coalesce(p_address, '')), '');
  v_existing_id uuid;
begin
  if v_clean_phone = '' and v_clean_email is null then
    return;
  end if;

  if v_clean_phone <> '' then
    select id into v_existing_id
    from public.customers
    where regexp_replace(coalesce(phone, ''), '\s+', '', 'g') = v_clean_phone
    order by created_at asc
    limit 1;
  end if;

  if v_existing_id is null and v_clean_email is not null then
    select id into v_existing_id
    from public.customers
    where lower(email) = lower(v_clean_email)
    order by created_at asc
    limit 1;
  end if;

  if v_existing_id is not null then
    update public.customers
    set
      full_name = coalesce(nullif(full_name, ''), v_clean_name, 'Khách hàng'),
      email = coalesce(v_clean_email, email),
      address = coalesce(v_clean_address, address),
      updated_at = now()
    where id = v_existing_id;
  else
    insert into public.customers (full_name, phone, email, address, source_domain)
    values (
      coalesce(v_clean_name, 'Khách hàng'),
      nullif(v_clean_phone, ''),
      v_clean_email,
      v_clean_address,
      coalesce(nullif(trim(p_source_domain), ''), 'profitness')
    );
  end if;
end;
$$;

grant execute on function public.upsert_customer_from_order(text, text, text, text, text) to anon, authenticated;
