create table if not exists public.product_badges (
  id uuid primary key default gen_random_uuid(),
  label jsonb not null default '{"vi":"","en":""}'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_badges enable row level security;

grant select on public.product_badges to anon, authenticated;
grant insert, update, delete on public.product_badges to authenticated;

drop policy if exists product_badges_public_select_active on public.product_badges;
create policy product_badges_public_select_active
on public.product_badges
for select
to anon
using (is_active = true);

drop policy if exists product_badges_authenticated_select on public.product_badges;
create policy product_badges_authenticated_select
on public.product_badges
for select
to authenticated
using (true);

drop policy if exists product_badges_authenticated_insert on public.product_badges;
create policy product_badges_authenticated_insert
on public.product_badges
for insert
to authenticated
with check (true);

drop policy if exists product_badges_authenticated_update on public.product_badges;
create policy product_badges_authenticated_update
on public.product_badges
for update
to authenticated
using (true)
with check (true);

drop policy if exists product_badges_authenticated_delete on public.product_badges;
create policy product_badges_authenticated_delete
on public.product_badges
for delete
to authenticated
using (true);

alter table public.products
add column if not exists badge_id uuid references public.product_badges(id) on delete set null;

insert into public.product_badges (label, is_active, sort_order)
select '{"vi":"Bán chạy","en":"Best seller"}'::jsonb, true, 10
where not exists (
  select 1 from public.product_badges
  where label->>'vi' = 'Bán chạy' or label->>'en' = 'Best seller'
);

insert into public.product_badges (label, is_active, sort_order)
select '{"vi":"Khuyên dùng","en":"Recommended"}'::jsonb, true, 20
where not exists (
  select 1 from public.product_badges
  where label->>'vi' = 'Khuyên dùng' or label->>'en' = 'Recommended'
);

insert into public.product_badges (label, is_active, sort_order)
select '{"vi":"Mới","en":"New"}'::jsonb, true, 30
where not exists (
  select 1 from public.product_badges
  where label->>'vi' = 'Mới' or label->>'en' = 'New'
);

insert into public.product_badges (label, is_active, sort_order)
select '{"vi":"Nổi bật","en":"Featured"}'::jsonb, true, 40
where not exists (
  select 1 from public.product_badges
  where label->>'vi' = 'Nổi bật' or label->>'en' = 'Featured'
);

with best_seller_badge as (
  select id
  from public.product_badges
  where label->>'vi' = 'Bán chạy' or label->>'en' = 'Best seller'
  order by sort_order asc, created_at asc
  limit 1
)
update public.products p
set badge_id = b.id
from best_seller_badge b
where p.badge_id is null
  and (p.badge_type = 'best_seller' or p.is_best_seller = true);

with recommended_badge as (
  select id
  from public.product_badges
  where label->>'vi' = 'Khuyên dùng' or label->>'en' = 'Recommended'
  order by sort_order asc, created_at asc
  limit 1
)
update public.products p
set badge_id = b.id
from recommended_badge b
where p.badge_id is null
  and p.badge_type = 'recommended';

with new_badge as (
  select id
  from public.product_badges
  where label->>'vi' = 'Mới' or label->>'en' = 'New'
  order by sort_order asc, created_at asc
  limit 1
)
update public.products p
set badge_id = b.id
from new_badge b
where p.badge_id is null
  and p.badge_type = 'new';

with featured_badge as (
  select id
  from public.product_badges
  where label->>'vi' = 'Nổi bật' or label->>'en' = 'Featured'
  order by sort_order asc, created_at asc
  limit 1
)
update public.products p
set badge_id = b.id
from featured_badge b
where p.badge_id is null
  and p.badge_type = 'featured';
