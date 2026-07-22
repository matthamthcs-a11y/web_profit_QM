alter table public.products
add column if not exists badge_type text not null default 'none';

update public.products
set badge_type = 'best_seller'
where is_best_seller = true
  and badge_type = 'none';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_badge_type_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
    add constraint products_badge_type_check
    check (badge_type in ('none', 'best_seller', 'recommended', 'new', 'featured'));
  end if;
end $$;
