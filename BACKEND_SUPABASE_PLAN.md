# Backend Supabase Plan

## 1. Ket qua ra soat hien tai

### Trang thai ket noi Supabase

Hien tai website **chua ket noi Supabase**.

Bang chung trong codebase:

- `package.json` chua co `@supabase/supabase-js` hoac `@supabase/ssr`.
- `.env.example` dang ghi ro frontend mock preview chua can bien moi truong.
- Khong co file Supabase client nhu `lib/supabase/*`.
- Khong co migration, schema SQL, Supabase CLI config, hoac `.mcp.json`.
- Cac trang dang lay du lieu tu `lib/mock-data.ts`.

### Frontend dang phu thuoc mock data o dau

- Home: `app/page.tsx`
  - `categories`
  - `products`
  - `documents`
  - `testimonials`
- Product listing: `app/products/page.tsx`
  - `categories`
  - `products`
- Product detail: `app/products/[slug]/page.tsx`
  - `products`
  - `getProductBySlug`
  - `relatedProductIds`
- Certificates: `app/certificates/page.tsx`
  - `documents`
- Dealers: `app/dealers/page.tsx`
  - `dealers`
- Header dropdown:
  - `categories`
- Footer/contact:
  - hotline/email/location dang hard-code trong `lib/i18n.ts` va components.

### Diem frontend nen sua truoc khi noi backend

- Mot so file con co chu tieng Viet bi loi encoding trong source, dac biet:
  - `app/certificates/page.tsx`
  - `app/dealers/page.tsx`
  - `app/contact/page.tsx`
  - `components/footer.tsx`
  - mot vai chuoi trong `lib/i18n.ts`
- Root folder con file `logo.webp` chua track; file dang dung dung la `public/logo.webp`.
- Product image hien la visual placeholder bang CSS, chua co cau truc anh that.
- Product search hien dang chay client-side tren mock data. Khi du lieu lon hon nen chuyen sang query Supabase co filter/search.

## 2. Huong backend phu hop

Backend nen lam theo huong **catalog CMS nhe**, khong phai ecommerce.

Muc tieu:

- Quan ly san pham, danh muc, thuong hieu, gia, huong vi, cong dung, cach dung.
- Quan ly banner homepage.
- Quan ly tai lieu chung nhan/catalog/COA/ATTP.
- Quan ly dai ly va thong tin lien he.
- Luu lead tu form lien he neu can.
- Admin co the them/sua/xoa du lieu qua dashboard noi bo.

Khong can lam:

- Gio hang.
- Thanh toan.
- Tai khoan khach hang.
- Don hang.
- Coupon.
- Subscription.

## 3. Supabase modules nen dung

- Supabase Database: luu du lieu catalog.
- Supabase Storage: luu anh san pham, banner, tai lieu PDF/anh chung nhan.
- Supabase Auth: dang nhap admin.
- Row Level Security: public chi doc du lieu da publish, admin moi duoc ghi.
- Next.js App Router server components: lay du lieu public tu Supabase server-side.

## 4. Schema de xuat

### `categories`

Dung cho nhom san pham va dropdown header.

Fields:

- `id uuid primary key`
- `slug text unique not null`
- `name jsonb not null`
- `description jsonb`
- `sort_order int default 0`
- `is_featured boolean default false`
- `is_active boolean default true`
- `created_at timestamptz`
- `updated_at timestamptz`

`name` va `description` dung JSON:

```json
{ "vi": "Gel năng lượng", "en": "Energy Gel" }
```

### `brands`

Dung cho thuong hieu/nhan hang.

Fields:

- `id uuid primary key`
- `slug text unique not null`
- `name text not null`
- `origin text`
- `description jsonb`
- `logo_path text`
- `is_active boolean default true`
- `created_at timestamptz`
- `updated_at timestamptz`

### `products`

Bang trung tam.

Fields:

- `id uuid primary key`
- `slug text unique not null`
- `category_id uuid references categories(id)`
- `brand_id uuid references brands(id)`
- `name jsonb not null`
- `short_description jsonb`
- `primary_goal jsonb`
- `origin text`
- `price numeric(12,2) not null`
- `currency text default 'VND'`
- `image_path text`
- `nutrition_image_path text`
- `package_type text`
- `visual_accent text`
- `visual_background text`
- `is_featured boolean default false`
- `is_best_seller boolean default false`
- `is_published boolean default true`
- `sort_order int default 0`
- `created_at timestamptz`
- `updated_at timestamptz`

### `product_sizes`

- `id uuid primary key`
- `product_id uuid references products(id) on delete cascade`
- `label text not null`
- `sort_order int default 0`

### `product_flavors`

- `id uuid primary key`
- `product_id uuid references products(id) on delete cascade`
- `name jsonb not null`
- `sort_order int default 0`

### `product_benefits`

- `id uuid primary key`
- `product_id uuid references products(id) on delete cascade`
- `content jsonb not null`
- `sort_order int default 0`

### `product_usage`

- `id uuid primary key`
- `product_id uuid references products(id) on delete cascade`
- `content jsonb not null`
- `sort_order int default 0`

### `product_audiences`

- `id uuid primary key`
- `product_id uuid references products(id) on delete cascade`
- `content jsonb not null`
- `sort_order int default 0`

### `product_ingredients`

- `id uuid primary key`
- `product_id uuid references products(id) on delete cascade`
- `name text not null`
- `amount text not null`
- `sort_order int default 0`

### `related_products`

- `product_id uuid references products(id) on delete cascade`
- `related_product_id uuid references products(id) on delete cascade`
- primary key: `(product_id, related_product_id)`

### `home_banners`

Dung cho slide anh dau trang.

- `id uuid primary key`
- `image_path text not null`
- `mobile_image_path text`
- `alt jsonb`
- `link_url text`
- `sort_order int default 0`
- `is_active boolean default true`
- `starts_at timestamptz`
- `ends_at timestamptz`
- `created_at timestamptz`
- `updated_at timestamptz`

Luu y: theo yeu cau hien tai, banner **khong render chu overlay**. Neu anh co chu, chu nam san trong file anh.

### `documents`

Dung cho catalog, chung nhan phan phoi, COA, ATTP.

- `id uuid primary key`
- `type text not null`
- `title jsonb not null`
- `description jsonb`
- `file_path text`
- `thumbnail_path text`
- `is_published boolean default true`
- `sort_order int default 0`
- `created_at timestamptz`
- `updated_at timestamptz`

### `dealers`

- `id uuid primary key`
- `name text not null`
- `city text`
- `address text`
- `phone text`
- `zalo text`
- `map_url text`
- `is_active boolean default true`
- `sort_order int default 0`
- `created_at timestamptz`
- `updated_at timestamptz`

### `testimonials`

- `id uuid primary key`
- `name text not null`
- `role text`
- `rating int default 5`
- `quote jsonb not null`
- `is_published boolean default true`
- `sort_order int default 0`
- `created_at timestamptz`
- `updated_at timestamptz`

### `site_settings`

Dung cho hotline, email, Zalo, Facebook, dia chi.

- `key text primary key`
- `value jsonb not null`
- `updated_at timestamptz`

Vi du:

```json
{
  "hotline": "02838481014",
  "email": "hello@profitness.vn",
  "zalo_url": "tel:02838481014",
  "facebook_url": ""
}
```

### `contact_leads`

Neu can form lien he luu database.

- `id uuid primary key`
- `name text`
- `phone text not null`
- `email text`
- `message text`
- `source text default 'website'`
- `status text default 'new'`
- `created_at timestamptz`

### `admin_profiles`

Dung de phan quyen admin.

- `id uuid primary key references auth.users(id)`
- `role text not null default 'admin'`
- `display_name text`
- `created_at timestamptz`

## 5. Storage buckets

### `product-assets`

Public read:

- product images
- nutrition facts images
- thumbnails

### `site-assets`

Public read:

- logo
- home banners
- brand images

### `documents`

Tuy nhu cau:

- Public read neu khach duoc xem/download truc tiep.
- Private read neu chi admin quan ly, public chi xem metadata.

## 6. RLS va bao mat

Nguyen tac:

- Tat ca bang trong `public` bat RLS.
- Public/anon chi duoc `select` cac row `is_published = true` hoac `is_active = true`.
- Admin authenticated duoc insert/update/delete.
- Khong dung `service_role` trong frontend.
- Khong dua secret key vao `NEXT_PUBLIC_*`.
- Admin role nen nam trong `admin_profiles`, khong dua vao user metadata.

Policy goi y:

- `categories`, `brands`, `products`, `documents`, `dealers`, `testimonials`, `home_banners`
  - anon select published/active.
  - authenticated admin full access.
- `contact_leads`
  - anon insert.
  - authenticated admin select/update.
  - khong cho anon select.
- `site_settings`
  - anon select chi cac key public.
  - authenticated admin update.

## 7. Loi trinh trien khai

### Phase 1: Ket noi Supabase public read

Muc tieu: frontend het phu thuoc mock data cho cac trang public.

Cong viec:

- Tao Supabase project.
- Cai package:
  - `@supabase/supabase-js`
  - `@supabase/ssr` neu can SSR cookie/auth sau nay.
- Them env:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Tao `lib/supabase/client.ts` va `lib/supabase/server.ts`.
- Tao data access layer:
  - `lib/data/categories.ts`
  - `lib/data/products.ts`
  - `lib/data/documents.ts`
  - `lib/data/dealers.ts`
  - `lib/data/site-settings.ts`
- Chuyen home/products/product detail/certificates/dealers sang lay data tu Supabase.
- Tam thoi giu fallback mock data khi chua co env de local dev khong bi crash.

### Phase 2: Schema, storage va seed data

Muc tieu: co database thuc de demo client.

Cong viec:

- Tao migration SQL cho cac bang core.
- Bat RLS.
- Tao policies public read/admin write.
- Tao storage buckets.
- Import mock data hien tai vao Supabase.
- Upload logo/banner/product placeholder vao Storage.

### Phase 3: Admin dang nhap va CRUD noi bo

Muc tieu: admin tu quan ly du lieu.

Cong viec:

- Them route `/admin/login`.
- Them route `/admin`.
- Supabase Auth email/password.
- Middleware bao ve `/admin`.
- CRUD:
  - categories
  - brands
  - products
  - banners
  - documents
  - dealers
  - testimonials
  - site settings
- Upload image/PDF vao Storage.

### Phase 4: Contact lead va tracking co ban

Muc tieu: website khong chi la catalog ma con thu lead.

Cong viec:

- Them form lien he nhe.
- Luu vao `contact_leads`.
- Them trang admin xem lead.
- Them trang thai lead: `new`, `contacted`, `closed`.
- Them source cho lead: `contact_page`, `product_detail`, `quick_contact`.

### Phase 5: Search tot hon

Muc tieu: tim san pham nhanh, co chiu loi go sai nhe.

Giai doan dau co the giu search client-side neu so san pham it.

Khi san pham nhieu:

- Them generated/search column hoac RPC search.
- Can nhac `pg_trgm` cho fuzzy search.
- Search theo:
  - ten san pham
  - thuong hieu
  - danh muc
  - huong vi
  - cong dung

## 8. Thu tu nen lam tiep theo

De it rui ro, nen lam theo thu tu:

1. Sua cac chuoi bi loi encoding tren cac trang con.
2. Tao Supabase project va lay URL + anon key.
3. Cai package Supabase.
4. Tao schema + RLS + seed data.
5. Ket noi public read cho frontend.
6. Deploy len Vercel voi env Supabase.
7. Sau khi client duyet public data, moi lam admin CRUD.

## 9. Ket luan

Frontend hien tai **chua ket noi Supabase** va van la mock-data preview.

Backend phu hop nhat la Supabase CMS/catalog backend, bat dau bang public read cho san pham/danh muc/banner/tai lieu/dai ly, sau do moi them admin CRUD va contact leads. Cach nay giu website dung nhu yeu cau: tham khao san pham, gia, vi, cong dung, cach su dung va lien he sales, khong bi lech sang ecommerce.
