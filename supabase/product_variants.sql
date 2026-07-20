create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  flavor_name jsonb not null default '{"vi":"","en":""}'::jsonb,
  size_label text not null default '',
  size_name jsonb,
  combination_key text not null,
  price numeric null check (price is null or price >= 0),
  currency text null,
  image_path text null,
  nutrition_image_path text null,
  is_default boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_product_combination_key unique (product_id, combination_key)
);

create index if not exists product_variants_product_id_sort_order_idx
  on public.product_variants(product_id, sort_order);

create unique index if not exists product_variants_one_default_per_product_idx
  on public.product_variants(product_id)
  where is_default = true;

drop trigger if exists set_product_variants_updated_at on public.product_variants;
create trigger set_product_variants_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

alter table public.product_variants enable row level security;

grant select on public.product_variants to anon;
grant select, insert, update, delete on public.product_variants to authenticated;

drop policy if exists "Anon can read published product variants" on public.product_variants;
create policy "Anon can read published product variants"
on public.product_variants
for select
to anon
using (
  is_published = true
  and exists (
    select 1
    from public.products
    where products.id = product_variants.product_id
      and products.is_published = true
  )
);

drop policy if exists "Admins can read product variants" on public.product_variants;
create policy "Admins can read product variants"
on public.product_variants
for select
to authenticated
using (public.current_user_is_admin());

drop policy if exists "Admins can insert product variants" on public.product_variants;
create policy "Admins can insert product variants"
on public.product_variants
for insert
to authenticated
with check (public.current_user_is_admin());

drop policy if exists "Admins can update product variants" on public.product_variants;
create policy "Admins can update product variants"
on public.product_variants
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "Admins can delete product variants" on public.product_variants;
create policy "Admins can delete product variants"
on public.product_variants
for delete
to authenticated
using (public.current_user_is_admin());

with combinations as (
  select
    products.id as product_id,
    product_flavors.name as flavor_name,
    product_sizes.label as size_label,
    jsonb_build_object('vi', product_sizes.label, 'en', product_sizes.label) as size_name,
    trim(
      both '-' from regexp_replace(
        lower(
          coalesce(product_flavors.name->>'en', product_flavors.name->>'vi', 'flavor')
          || '-'
          || product_sizes.label
        ),
        '[^a-z0-9]+',
        '-',
        'g'
      )
    ) as combination_key,
    null::numeric as price,
    null::text as currency,
    null::text as image_path,
    null::text as nutrition_image_path,
    row_number() over (
      partition by products.id
      order by product_flavors.sort_order, product_sizes.sort_order
    ) = 1 as is_default,
    true as is_published,
    row_number() over (
      partition by products.id
      order by product_flavors.sort_order, product_sizes.sort_order
    ) as sort_order
  from public.products
  join public.product_flavors on product_flavors.product_id = products.id
  join public.product_sizes on product_sizes.product_id = products.id
)
insert into public.product_variants (
  product_id,
  flavor_name,
  size_label,
  size_name,
  combination_key,
  price,
  currency,
  image_path,
  nutrition_image_path,
  is_default,
  is_published,
  sort_order
)
select
  product_id,
  flavor_name,
  size_label,
  size_name,
  combination_key,
  price,
  currency,
  image_path,
  nutrition_image_path,
  is_default,
  is_published,
  sort_order
from combinations
where combination_key <> ''
on conflict (product_id, combination_key) do nothing;
