alter table public.products
add column if not exists list_price numeric null check (list_price is null or list_price >= 0);

alter table public.product_variants
add column if not exists list_price numeric null check (list_price is null or list_price >= 0);
