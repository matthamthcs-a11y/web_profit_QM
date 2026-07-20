alter table public.product_sizes
add column if not exists label_i18n jsonb;

update public.product_sizes
set label_i18n = jsonb_build_object('vi', label, 'en', label)
where label_i18n is null;

alter table public.product_variants
add column if not exists size_name jsonb;

update public.product_variants
set size_name = jsonb_build_object('vi', size_label, 'en', size_label)
where size_name is null;
