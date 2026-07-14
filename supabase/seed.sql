begin;

with seed_categories(slug, name, description, sort_order, is_featured, is_active) as (
  values
    ('energy', '{"vi":"Gel năng lượng","en":"Energy Gel"}'::jsonb, '{"vi":"Bổ sung năng lượng nhanh cho chạy bộ, đạp xe và các buổi tập dài.","en":"Quick energy support for running, cycling and long training sessions."}'::jsonb, 10, true, true),
    ('hydration', '{"vi":"Điện giải","en":"Electrolyte"}'::jsonb, '{"vi":"Hỗ trợ bù khoáng, duy trì hiệu suất và hạn chế chuột rút.","en":"Mineral support for hydration, performance and cramp prevention."}'::jsonb, 20, true, true),
    ('protein', '{"vi":"Protein","en":"Protein"}'::jsonb, '{"vi":"Bổ sung protein cho phục hồi sau tập và khẩu phần hằng ngày.","en":"Protein support for recovery and daily nutrition."}'::jsonb, 30, true, true),
    ('recovery', '{"vi":"Phục hồi","en":"Recovery"}'::jsonb, '{"vi":"Công thức phục hồi sau vận động cường độ cao hoặc thời lượng dài.","en":"Recovery formulas after intense or long-duration exercise."}'::jsonb, 40, true, true),
    ('vitamin', '{"vi":"Vitamin & Supplement","en":"Vitamin & Supplement"}'::jsonb, '{"vi":"Vi chất và supplement nền hỗ trợ sức khỏe cho người tập luyện.","en":"Micronutrients and daily supplements for active lifestyles."}'::jsonb, 50, true, true),
    ('weight-management', '{"vi":"Quản lý cân nặng","en":"Weight Management"}'::jsonb, '{"vi":"Sản phẩm hỗ trợ kiểm soát cân nặng theo mục tiêu tập luyện.","en":"Products that support weight management and training goals."}'::jsonb, 60, true, true)
)
insert into public.categories (slug, name, description, sort_order, is_featured, is_active)
select slug, name, description, sort_order, is_featured, is_active
from seed_categories
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    sort_order = excluded.sort_order,
    is_featured = excluded.is_featured,
    is_active = excluded.is_active;

with seed_brands(slug, name, origin, description, sort_order, is_active) as (
  values
    ('profuel', 'ProFuel', 'USA', '{"vi":"Dòng sản phẩm năng lượng và phục hồi cho vận động sức bền.","en":"Energy and recovery products for endurance sports."}'::jsonb, 10, true),
    ('hydramax', 'HydraMax', 'Germany', '{"vi":"Giải pháp điện giải và hydration cho tập luyện ngoài trời.","en":"Electrolyte and hydration solutions for outdoor training."}'::jsonb, 20, true),
    ('nutricore', 'NutriCore', 'New Zealand', '{"vi":"Protein và supplement nền cho người tập luyện đều đặn.","en":"Protein and daily supplements for regular training."}'::jsonb, 30, true)
)
insert into public.brands (slug, name, origin, description, sort_order, is_active)
select slug, name, origin, description, sort_order, is_active
from seed_brands
on conflict (slug) do update
set name = excluded.name,
    origin = excluded.origin,
    description = excluded.description,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active;

with seed_products(
  slug,
  category_slug,
  brand_slug,
  name,
  short_description,
  primary_goal,
  origin,
  price,
  package_type,
  visual_accent,
  visual_background,
  is_featured,
  is_best_seller,
  sort_order
) as (
  values
    ('endurance-gel-citrus', 'energy', 'profuel', '{"vi":"Endurance Gel Citrus","en":"Endurance Gel Citrus"}'::jsonb, '{"vi":"Gel năng lượng dễ dùng cho runner, cyclist và triathlete trong buổi tập dài.","en":"Easy-to-use energy gel for runners, cyclists and triathletes during long sessions."}'::jsonb, '{"vi":"Năng lượng","en":"Energy"}'::jsonb, 'USA', 45000, 'gel', '#ce1732', '#fff1f2', true, true, 10),
    ('electrolyte-tabs', 'hydration', 'hydramax', '{"vi":"Electrolyte Tabs","en":"Electrolyte Tabs"}'::jsonb, '{"vi":"Viên sủi điện giải cho buổi tập ra nhiều mồ hôi hoặc thi đấu ngoài trời.","en":"Electrolyte tablets for heavy sweating sessions or outdoor racing."}'::jsonb, '{"vi":"Bù khoáng","en":"Hydration"}'::jsonb, 'Germany', 320000, 'tube', '#0f766e', '#ecfdf5', true, true, 20),
    ('whey-protein-isolate', 'protein', 'nutricore', '{"vi":"Whey Protein Isolate","en":"Whey Protein Isolate"}'::jsonb, '{"vi":"Protein isolate cho phục hồi sau tập và bổ sung protein trong khẩu phần.","en":"Protein isolate for post-workout recovery and daily protein intake."}'::jsonb, '{"vi":"Protein","en":"Protein"}'::jsonb, 'New Zealand', 1250000, 'tub', '#1f2937', '#f1f5f9', true, true, 30),
    ('recovery-drink-mix', 'recovery', 'profuel', '{"vi":"Recovery Drink Mix","en":"Recovery Drink Mix"}'::jsonb, '{"vi":"Công thức phục hồi sau buổi tập dài với carbohydrate, protein và điện giải.","en":"Recovery formula with carbohydrates, protein and electrolytes after long sessions."}'::jsonb, '{"vi":"Phục hồi","en":"Recovery"}'::jsonb, 'USA', 780000, 'pouch', '#c9972f', '#fffbeb', true, false, 40)
)
insert into public.products (
  slug,
  category_id,
  brand_id,
  name,
  short_description,
  primary_goal,
  origin,
  price,
  currency,
  package_type,
  visual_accent,
  visual_background,
  is_featured,
  is_best_seller,
  is_published,
  sort_order
)
select
  seed_products.slug,
  categories.id,
  brands.id,
  seed_products.name,
  seed_products.short_description,
  seed_products.primary_goal,
  seed_products.origin,
  seed_products.price,
  'VND',
  seed_products.package_type,
  seed_products.visual_accent,
  seed_products.visual_background,
  seed_products.is_featured,
  seed_products.is_best_seller,
  true,
  seed_products.sort_order
from seed_products
join public.categories on categories.slug = seed_products.category_slug
join public.brands on brands.slug = seed_products.brand_slug
on conflict (slug) do update
set category_id = excluded.category_id,
    brand_id = excluded.brand_id,
    name = excluded.name,
    short_description = excluded.short_description,
    primary_goal = excluded.primary_goal,
    origin = excluded.origin,
    price = excluded.price,
    currency = excluded.currency,
    package_type = excluded.package_type,
    visual_accent = excluded.visual_accent,
    visual_background = excluded.visual_background,
    is_featured = excluded.is_featured,
    is_best_seller = excluded.is_best_seller,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

delete from public.related_products
where product_id in (select id from public.products where slug in ('endurance-gel-citrus', 'electrolyte-tabs', 'whey-protein-isolate', 'recovery-drink-mix'))
   or related_product_id in (select id from public.products where slug in ('endurance-gel-citrus', 'electrolyte-tabs', 'whey-protein-isolate', 'recovery-drink-mix'));

delete from public.product_sizes
where product_id in (select id from public.products where slug in ('endurance-gel-citrus', 'electrolyte-tabs', 'whey-protein-isolate', 'recovery-drink-mix'));

delete from public.product_flavors
where product_id in (select id from public.products where slug in ('endurance-gel-citrus', 'electrolyte-tabs', 'whey-protein-isolate', 'recovery-drink-mix'));

delete from public.product_benefits
where product_id in (select id from public.products where slug in ('endurance-gel-citrus', 'electrolyte-tabs', 'whey-protein-isolate', 'recovery-drink-mix'));

delete from public.product_usage
where product_id in (select id from public.products where slug in ('endurance-gel-citrus', 'electrolyte-tabs', 'whey-protein-isolate', 'recovery-drink-mix'));

delete from public.product_audiences
where product_id in (select id from public.products where slug in ('endurance-gel-citrus', 'electrolyte-tabs', 'whey-protein-isolate', 'recovery-drink-mix'));

delete from public.product_ingredients
where product_id in (select id from public.products where slug in ('endurance-gel-citrus', 'electrolyte-tabs', 'whey-protein-isolate', 'recovery-drink-mix'));

with seed_sizes(product_slug, label, sort_order) as (
  values
    ('endurance-gel-citrus', '35g', 10),
    ('endurance-gel-citrus', 'Box 24', 20),
    ('electrolyte-tabs', 'Tube 20 tablets', 10),
    ('whey-protein-isolate', '900g', 10),
    ('whey-protein-isolate', '2.2kg', 20),
    ('recovery-drink-mix', '600g', 10)
)
insert into public.product_sizes (product_id, label, sort_order)
select products.id, seed_sizes.label, seed_sizes.sort_order
from seed_sizes
join public.products on products.slug = seed_sizes.product_slug;

with seed_flavors(product_slug, name, sort_order) as (
  values
    ('endurance-gel-citrus', '{"vi":"Cam chanh","en":"Citrus"}'::jsonb, 10),
    ('endurance-gel-citrus', '{"vi":"Dâu rừng","en":"Berry"}'::jsonb, 20),
    ('endurance-gel-citrus', '{"vi":"Cola","en":"Cola"}'::jsonb, 30),
    ('electrolyte-tabs', '{"vi":"Chanh vàng","en":"Lemon"}'::jsonb, 10),
    ('electrolyte-tabs', '{"vi":"Cam","en":"Orange"}'::jsonb, 20),
    ('whey-protein-isolate', '{"vi":"Chocolate","en":"Chocolate"}'::jsonb, 10),
    ('whey-protein-isolate', '{"vi":"Vanilla","en":"Vanilla"}'::jsonb, 20),
    ('recovery-drink-mix', '{"vi":"Dâu rừng","en":"Berry"}'::jsonb, 10),
    ('recovery-drink-mix', '{"vi":"Xoài","en":"Mango"}'::jsonb, 20)
)
insert into public.product_flavors (product_id, name, sort_order)
select products.id, seed_flavors.name, seed_flavors.sort_order
from seed_flavors
join public.products on products.slug = seed_flavors.product_slug;

with seed_benefits(product_slug, content, sort_order) as (
  values
    ('endurance-gel-citrus', '{"vi":"Bổ sung năng lượng nhanh trong lúc vận động.","en":"Supports quick energy intake during exercise."}'::jsonb, 10),
    ('endurance-gel-citrus', '{"vi":"Dễ mang theo khi chạy bộ hoặc đạp xe.","en":"Easy to carry for running or cycling."}'::jsonb, 20),
    ('endurance-gel-citrus', '{"vi":"Phù hợp cho buổi tập từ 60 phút trở lên.","en":"Suitable for sessions lasting 60 minutes or more."}'::jsonb, 30),
    ('electrolyte-tabs', '{"vi":"Bổ sung sodium, potassium và magnesium.","en":"Provides sodium, potassium and magnesium."}'::jsonb, 10),
    ('electrolyte-tabs', '{"vi":"Hỗ trợ duy trì nước và khoáng trong lúc tập.","en":"Supports fluid and mineral balance during exercise."}'::jsonb, 20),
    ('electrolyte-tabs', '{"vi":"Dễ pha với bình nước tập luyện.","en":"Easy to mix in a training bottle."}'::jsonb, 30),
    ('whey-protein-isolate', '{"vi":"Hàm lượng protein cao.","en":"High protein content."}'::jsonb, 10),
    ('whey-protein-isolate', '{"vi":"Hỗ trợ phục hồi cơ sau tập.","en":"Supports muscle recovery after training."}'::jsonb, 20),
    ('whey-protein-isolate', '{"vi":"Dễ pha, phù hợp dùng sau tập.","en":"Easy to mix and suitable after workouts."}'::jsonb, 30),
    ('recovery-drink-mix', '{"vi":"Hỗ trợ nạp lại glycogen.","en":"Supports glycogen replenishment."}'::jsonb, 10),
    ('recovery-drink-mix', '{"vi":"Bổ sung protein cho phục hồi cơ.","en":"Provides protein for muscle recovery."}'::jsonb, 20),
    ('recovery-drink-mix', '{"vi":"Phù hợp sau chạy dài hoặc đạp dài.","en":"Suitable after long runs or rides."}'::jsonb, 30)
)
insert into public.product_benefits (product_id, content, sort_order)
select products.id, seed_benefits.content, seed_benefits.sort_order
from seed_benefits
join public.products on products.slug = seed_benefits.product_slug;

with seed_usage(product_slug, content, sort_order) as (
  values
    ('endurance-gel-citrus', '{"vi":"Dùng 1 gói trước hoặc trong khi tập.","en":"Take 1 sachet before or during training."}'::jsonb, 10),
    ('endurance-gel-citrus', '{"vi":"Uống kèm nước để hỗ trợ hấp thụ.","en":"Drink with water for better absorption."}'::jsonb, 20),
    ('electrolyte-tabs', '{"vi":"Pha 1 viên với 500-750ml nước.","en":"Dissolve 1 tablet in 500-750ml of water."}'::jsonb, 10),
    ('electrolyte-tabs', '{"vi":"Dùng trước và trong khi tập.","en":"Use before and during training."}'::jsonb, 20),
    ('whey-protein-isolate', '{"vi":"Pha 1 muỗng với 250ml nước hoặc sữa.","en":"Mix 1 scoop with 250ml water or milk."}'::jsonb, 10),
    ('whey-protein-isolate', '{"vi":"Dùng sau tập hoặc như bữa phụ.","en":"Use after training or as a protein snack."}'::jsonb, 20),
    ('recovery-drink-mix', '{"vi":"Dùng trong vòng 30-60 phút sau tập.","en":"Use within 30-60 minutes after training."}'::jsonb, 10),
    ('recovery-drink-mix', '{"vi":"Pha với 300ml nước lạnh.","en":"Mix with 300ml cold water."}'::jsonb, 20)
)
insert into public.product_usage (product_id, content, sort_order)
select products.id, seed_usage.content, seed_usage.sort_order
from seed_usage
join public.products on products.slug = seed_usage.product_slug;

with seed_audiences(product_slug, content, sort_order) as (
  values
    ('endurance-gel-citrus', '{"vi":"Runner","en":"Runner"}'::jsonb, 10),
    ('endurance-gel-citrus', '{"vi":"Cyclist","en":"Cyclist"}'::jsonb, 20),
    ('endurance-gel-citrus', '{"vi":"Triathlete","en":"Triathlete"}'::jsonb, 30),
    ('electrolyte-tabs', '{"vi":"Runner","en":"Runner"}'::jsonb, 10),
    ('electrolyte-tabs', '{"vi":"Cyclist","en":"Cyclist"}'::jsonb, 20),
    ('electrolyte-tabs', '{"vi":"Thể thao ngoài trời","en":"Outdoor sports"}'::jsonb, 30),
    ('whey-protein-isolate', '{"vi":"Gym","en":"Gym"}'::jsonb, 10),
    ('whey-protein-isolate', '{"vi":"Người cần bổ sung protein","en":"Protein supplementation"}'::jsonb, 20),
    ('recovery-drink-mix', '{"vi":"Runner","en":"Runner"}'::jsonb, 10),
    ('recovery-drink-mix', '{"vi":"Cyclist","en":"Cyclist"}'::jsonb, 20),
    ('recovery-drink-mix', '{"vi":"Triathlete","en":"Triathlete"}'::jsonb, 30)
)
insert into public.product_audiences (product_id, content, sort_order)
select products.id, seed_audiences.content, seed_audiences.sort_order
from seed_audiences
join public.products on products.slug = seed_audiences.product_slug;

with seed_ingredients(product_slug, name, amount, sort_order) as (
  values
    ('endurance-gel-citrus', 'Carbohydrate', '23g', 10),
    ('endurance-gel-citrus', 'Sodium', '90mg', 20),
    ('endurance-gel-citrus', 'Potassium', '35mg', 30),
    ('electrolyte-tabs', 'Sodium', '250mg', 10),
    ('electrolyte-tabs', 'Potassium', '80mg', 20),
    ('electrolyte-tabs', 'Magnesium', '45mg', 30),
    ('whey-protein-isolate', 'Protein', '25g', 10),
    ('whey-protein-isolate', 'BCAA', '5.5g', 20),
    ('whey-protein-isolate', 'Sugar', '1g', 30),
    ('recovery-drink-mix', 'Carbohydrate', '38g', 10),
    ('recovery-drink-mix', 'Protein', '12g', 20),
    ('recovery-drink-mix', 'Sodium', '180mg', 30)
)
insert into public.product_ingredients (product_id, name, amount, sort_order)
select products.id, seed_ingredients.name, seed_ingredients.amount, seed_ingredients.sort_order
from seed_ingredients
join public.products on products.slug = seed_ingredients.product_slug;

with seed_related(product_slug, related_slug, sort_order) as (
  values
    ('endurance-gel-citrus', 'electrolyte-tabs', 10),
    ('endurance-gel-citrus', 'recovery-drink-mix', 20),
    ('electrolyte-tabs', 'endurance-gel-citrus', 10),
    ('electrolyte-tabs', 'recovery-drink-mix', 20),
    ('whey-protein-isolate', 'recovery-drink-mix', 10),
    ('recovery-drink-mix', 'endurance-gel-citrus', 10),
    ('recovery-drink-mix', 'whey-protein-isolate', 20)
)
insert into public.related_products (product_id, related_product_id, sort_order)
select products.id, related_products.id, seed_related.sort_order
from seed_related
join public.products on products.slug = seed_related.product_slug
join public.products related_products on related_products.slug = seed_related.related_slug
on conflict (product_id, related_product_id) do update
set sort_order = excluded.sort_order;

insert into public.home_banners (id, image_path, mobile_image_path, alt, link_url, sort_order, is_active)
values
  ('5d865399-2ddd-4e67-bff9-000000000001', '/logo.webp', null, '{"vi":"Pro-Fitness Sports Nutrition","en":"Pro-Fitness Sports Nutrition"}'::jsonb, '/products', 10, true),
  ('5d865399-2ddd-4e67-bff9-000000000002', '/logo.webp', null, '{"vi":"Danh mục sản phẩm Pro-Fitness","en":"Pro-Fitness product catalog"}'::jsonb, '/products', 20, true)
on conflict (id) do update
set image_path = excluded.image_path,
    mobile_image_path = excluded.mobile_image_path,
    alt = excluded.alt,
    link_url = excluded.link_url,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active;

insert into public.documents (id, type, title, description, file_path, thumbnail_path, is_published, sort_order)
values
  ('19a5b83b-a1f6-4afb-9dc2-000000000001', 'catalog', '{"vi":"Catalog sản phẩm","en":"Product catalog"}'::jsonb, '{"vi":"Tổng quan danh mục sản phẩm và thương hiệu phân phối.","en":"Overview of products and distributed brands."}'::jsonb, null, null, true, 10),
  ('19a5b83b-a1f6-4afb-9dc2-000000000002', 'certificate', '{"vi":"Chứng nhận phân phối","en":"Distribution certificate"}'::jsonb, '{"vi":"Tài liệu xác thực thương hiệu và giấy tờ phân phối.","en":"Brand verification and distribution documents."}'::jsonb, null, null, true, 20),
  ('19a5b83b-a1f6-4afb-9dc2-000000000003', 'attp', '{"vi":"Công bố ATTP","en":"Food safety declaration"}'::jsonb, '{"vi":"Bộ tài liệu minh bạch cho sản phẩm thực phẩm bổ sung.","en":"Compliance documents for supplement products."}'::jsonb, null, null, true, 30)
on conflict (id) do update
set type = excluded.type,
    title = excluded.title,
    description = excluded.description,
    file_path = excluded.file_path,
    thumbnail_path = excluded.thumbnail_path,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.dealers (id, name, city, address, phone, zalo, map_url, is_active, sort_order)
values
  ('2fa60ce5-4bfd-4ad3-a275-000000000001', 'Pro-Fitness Ho Chi Minh', 'Ho Chi Minh City', 'District 1, Ho Chi Minh City', '02838481014', '02838481014', null, true, 10),
  ('2fa60ce5-4bfd-4ad3-a275-000000000002', 'Pro-Fitness Ha Noi Partner', 'Ha Noi', 'Ba Dinh, Ha Noi', '02838481014', '02838481014', null, true, 20)
on conflict (id) do update
set name = excluded.name,
    city = excluded.city,
    address = excluded.address,
    phone = excluded.phone,
    zalo = excluded.zalo,
    map_url = excluded.map_url,
    is_active = excluded.is_active,
    sort_order = excluded.sort_order;

insert into public.testimonials (id, name, role, rating, quote, is_published, sort_order)
values
  ('1e1fba77-f11a-497d-92a0-000000000001', 'Minh Anh', 'Marathon runner', 5, '{"vi":"Mình dễ chọn sản phẩm hơn khi có giá, vị và cách dùng rõ ràng.","en":"It is easier to choose products when price, flavors and usage are clear."}'::jsonb, true, 10),
  ('1e1fba77-f11a-497d-92a0-000000000002', 'Quốc Huy', 'Cyclist', 5, '{"vi":"Thông tin sản phẩm gọn, dễ xem và có hotline để hỏi nhanh.","en":"Product information is concise, easy to review and has a hotline for quick advice."}'::jsonb, true, 20)
on conflict (id) do update
set name = excluded.name,
    role = excluded.role,
    rating = excluded.rating,
    quote = excluded.quote,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.site_settings (key, value, is_public)
values
  ('contact', '{"hotline":"02838481014","email":"hello@profitness.vn","zalo_url":"tel:02838481014","address":"Ho Chi Minh City, Vietnam"}'::jsonb, true),
  ('social_links', '{"facebook_label":"Pro-Fitness Vietnam","facebook_url":""}'::jsonb, true),
  ('seo', '{"site_name":"Pro-Fitness Sports Nutrition","default_title":"Pro-Fitness Sports Nutrition","default_description":"Website tham khảo sản phẩm dinh dưỡng thể thao: giá, vị, công dụng và cách sử dụng."}'::jsonb, true)
on conflict (key) do update
set value = excluded.value,
    is_public = excluded.is_public;

commit;
