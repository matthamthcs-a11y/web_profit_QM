create or replace function public.replace_product_children(
  p_product_id uuid,
  p_sizes jsonb default '[]'::jsonb,
  p_flavors jsonb default '[]'::jsonb,
  p_benefits jsonb default '[]'::jsonb,
  p_usage jsonb default '[]'::jsonb,
  p_audiences jsonb default '[]'::jsonb,
  p_variants jsonb default '[]'::jsonb,
  p_related_products jsonb default '[]'::jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.current_user_is_admin() then
    raise exception 'Admin permission required';
  end if;

  if not exists (select 1 from public.products where id = p_product_id) then
    raise exception 'Product not found: %', p_product_id;
  end if;

  delete from public.related_products where product_id = p_product_id;
  delete from public.product_variants where product_id = p_product_id;
  delete from public.product_sizes where product_id = p_product_id;
  delete from public.product_flavors where product_id = p_product_id;
  delete from public.product_benefits where product_id = p_product_id;
  delete from public.product_usage where product_id = p_product_id;
  delete from public.product_audiences where product_id = p_product_id;

  insert into public.product_sizes (product_id, label, label_i18n, sort_order)
  select
    p_product_id,
    coalesce(row_data.label, ''),
    row_data.label_i18n,
    coalesce(row_data.sort_order, 0)
  from jsonb_to_recordset(coalesce(p_sizes, '[]'::jsonb)) as row_data(
    label text,
    label_i18n jsonb,
    sort_order integer
  );

  insert into public.product_flavors (product_id, name, sort_order)
  select
    p_product_id,
    coalesce(row_data.name, '{"vi":"","en":""}'::jsonb),
    coalesce(row_data.sort_order, 0)
  from jsonb_to_recordset(coalesce(p_flavors, '[]'::jsonb)) as row_data(
    name jsonb,
    sort_order integer
  );

  insert into public.product_benefits (product_id, content, sort_order)
  select
    p_product_id,
    coalesce(row_data.content, '{"vi":"","en":""}'::jsonb),
    coalesce(row_data.sort_order, 0)
  from jsonb_to_recordset(coalesce(p_benefits, '[]'::jsonb)) as row_data(
    content jsonb,
    sort_order integer
  );

  insert into public.product_usage (product_id, content, sort_order)
  select
    p_product_id,
    coalesce(row_data.content, '{"vi":"","en":""}'::jsonb),
    coalesce(row_data.sort_order, 0)
  from jsonb_to_recordset(coalesce(p_usage, '[]'::jsonb)) as row_data(
    content jsonb,
    sort_order integer
  );

  insert into public.product_audiences (product_id, content, sort_order)
  select
    p_product_id,
    coalesce(row_data.content, '{"vi":"","en":""}'::jsonb),
    coalesce(row_data.sort_order, 0)
  from jsonb_to_recordset(coalesce(p_audiences, '[]'::jsonb)) as row_data(
    content jsonb,
    sort_order integer
  );

  insert into public.product_variants (
    product_id,
    flavor_name,
    size_label,
    size_name,
    combination_key,
    list_price,
    price,
    currency,
    image_path,
    nutrition_image_path,
    is_default,
    is_published,
    sort_order
  )
  select
    p_product_id,
    coalesce(row_data.flavor_name, '{"vi":"","en":""}'::jsonb),
    coalesce(row_data.size_label, ''),
    row_data.size_name,
    coalesce(row_data.combination_key, ''),
    row_data.list_price,
    row_data.price,
    row_data.currency,
    row_data.image_path,
    row_data.nutrition_image_path,
    coalesce(row_data.is_default, false),
    coalesce(row_data.is_published, true),
    coalesce(row_data.sort_order, 0)
  from jsonb_to_recordset(coalesce(p_variants, '[]'::jsonb)) as row_data(
    flavor_name jsonb,
    size_label text,
    size_name jsonb,
    combination_key text,
    list_price numeric,
    price numeric,
    currency text,
    image_path text,
    nutrition_image_path text,
    is_default boolean,
    is_published boolean,
    sort_order integer
  );

  insert into public.related_products (product_id, related_product_id, sort_order)
  select
    p_product_id,
    row_data.related_product_id,
    coalesce(row_data.sort_order, 0)
  from jsonb_to_recordset(coalesce(p_related_products, '[]'::jsonb)) as row_data(
    related_product_id uuid,
    sort_order integer
  )
  where row_data.related_product_id is not null
    and row_data.related_product_id <> p_product_id;
end;
$$;

revoke all on function public.replace_product_children(
  uuid,
  jsonb,
  jsonb,
  jsonb,
  jsonb,
  jsonb,
  jsonb,
  jsonb
) from public;

revoke execute on function public.replace_product_children(
  uuid,
  jsonb,
  jsonb,
  jsonb,
  jsonb,
  jsonb,
  jsonb,
  jsonb
) from anon;

grant execute on function public.replace_product_children(
  uuid,
  jsonb,
  jsonb,
  jsonb,
  jsonb,
  jsonb,
  jsonb,
  jsonb
) to authenticated;
