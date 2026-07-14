# Database & Backend Development Plan

## 0. Muc tieu backend

Website Pro-Fitness la catalog tham khao san pham, khong phai ecommerce.

Backend can giai quyet cac viec sau:

- Luu va quan ly san pham, gia, vi, cong dung, cach dung.
- Luu va quan ly danh muc, thuong hieu, banner trang chu.
- Luu va quan ly chung nhan, catalog, COA, ATTP.
- Luu va quan ly dai ly, thong tin lien he, hotline, Zalo, Facebook.
- Cho admin them/sua/xoa noi dung ma khong can sua code.
- Luu lead tu form lien he neu can.
- Public website chi doc du lieu da publish.

Khong lam trong backend:

- Gio hang.
- Thanh toan.
- Don hang.
- Tai khoan khach hang.
- Ma giam gia.
- Subscription.

## 1. Quy trinh ra soat frontend truoc khi thiet ke database

Muc tieu cua buoc nay la khong thiet ke database theo cam tinh. Ta doc frontend truoc de biet giao dien that su can du lieu gi.

### 1.1. Lap ban do route

Can kiem tra tat ca route trong `app/`:

- `/`
- `/products`
- `/products/[slug]`
- `/certificates`
- `/dealers`
- `/about`
- `/contact`
- `/brands` hien redirect sang `/certificates`

Voi moi route, ghi lai:

- Trang hien thi nhung khoi noi dung nao.
- Khoi nao can dynamic data.
- Khoi nao la static copy.
- Khoi nao can admin quan ly.
- Khoi nao can song ngu.

### 1.2. Lap ban do component dung chung

Can kiem tra cac component co lay data:

- `components/header.tsx`
  - Can danh muc san pham cho dropdown.
  - Can hotline.
- `components/footer.tsx`
  - Can hotline, email, dia chi, social links.
- `components/quick-contact.tsx`
  - Can hotline, Zalo URL.
- `components/hero-banner.tsx`
  - Can list banner trang chu.
  - Hien tai banner khong co text overlay.
- `components/product-catalog.tsx`
  - Can products, categories, brands.
  - Can search/filter.
- `components/product-card.tsx`
  - Can thong tin tom tat san pham.
- `components/product-visual.tsx`
  - Hien la placeholder, sau nay can image asset that.

### 1.3. Lap ban do mock data hien tai

Nguon du lieu hien tai la `lib/mock-data.ts`.

Entities dang co:

- `categories`
- `products`
- `brands`
- `testimonials`
- `dealers`
- `documents`
- `blogPosts` dang de rong

Tu day suy ra cac bang database ban dau.

### 1.4. Lap ban do field dang dung tren UI

Product listing can:

- id
- slug
- name
- brand
- category
- price
- flavors
- short description
- primary goal
- is best seller
- visual/image

Product detail can:

- name
- slug
- brand
- category
- origin
- price
- sizes
- flavors
- short description
- benefits
- usage
- audience
- ingredients
- nutrition facts image
- related products
- contact CTA

Home can:

- banners
- featured categories
- best-selling products
- documents
- testimonials
- hotline/contact settings

Certificates can:

- title
- type
- description
- file/thumbnail

Dealers can:

- name
- city
- address
- phone
- map URL

Contact/Header/Footer can:

- hotline
- Zalo URL
- email
- address
- Facebook URL

### 1.5. Xac dinh field nao can admin quan ly

Admin nen quan ly:

- San pham.
- Danh muc.
- Thuong hieu.
- Banner trang chu.
- Tai lieu/chung nhan.
- Dai ly.
- Feedback/testimonial.
- Site settings.
- Lead lien he.

Admin chua can quan ly:

- Static layout.
- Mau sac thiet ke.
- Navigation hard-coded, tru khi client yeu cau.

## 2. Trang thai Supabase hien tai

Hien tai code da co phan chuan bi local cho Supabase:

- `@supabase/supabase-js`
- `@supabase/ssr`
- `lib/supabase/env.ts`
- `lib/supabase/browser.ts`
- `lib/supabase/server.ts`
- `.env.example` co:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Tuy nhien frontend van dang dung `lib/mock-data.ts`.

Chua co:

- Supabase project duoc xac nhan trong repo.
- Migration SQL.
- Data access layer doc Supabase.
- Admin routes.
- Storage buckets.
- RLS policies.

## 3. Nguyen tac thiet ke database

### 3.1. Song ngu

Dung `jsonb` cho cac field can song ngu:

```json
{
  "vi": "Gel năng lượng",
  "en": "Energy Gel"
}
```

Ap dung cho:

- category name/description
- product name/description/goal
- flavor names
- benefits
- usage
- audience
- document title/description
- banner alt text
- testimonial quote

Ly do:

- Website chi co 2 ngon ngu.
- Admin nhap 2 ngon ngu tren cung mot record.
- Query public don gian.
- Khong can join bang translation phuc tap o giai doan dau.

### 3.2. Trang thai publish

Nhung bang public nen co:

- `is_active`
- hoac `is_published`
- `sort_order`

Frontend chi hien row da active/published.

### 3.3. Anh va file

Database chi luu path/URL, file nam trong Supabase Storage.

Vi du:

- `image_path`
- `mobile_image_path`
- `thumbnail_path`
- `file_path`
- `nutrition_image_path`

### 3.4. Khong luu secret vao frontend

Chi dua vao frontend:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Khong bao gio dua `service_role` vao browser hoac Vercel public env.

## 4. Schema database de xuat

### 4.1. `categories`

Dung cho dropdown header, trang product filter, home featured categories.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `slug text unique not null`
- `name jsonb not null`
- `description jsonb`
- `sort_order int default 0`
- `is_featured boolean default false`
- `is_active boolean default true`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Index:

- unique index on `slug`
- index on `(is_active, sort_order)`

### 4.2. `brands`

Fields:

- `id uuid primary key default gen_random_uuid()`
- `slug text unique not null`
- `name text not null`
- `origin text`
- `description jsonb`
- `logo_path text`
- `is_active boolean default true`
- `sort_order int default 0`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### 4.3. `products`

Fields:

- `id uuid primary key default gen_random_uuid()`
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
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Constraints:

- `price >= 0`
- `package_type in ('gel', 'tube', 'tub', 'pouch')` neu van giu visual placeholder.

Index:

- unique index on `slug`
- index on `category_id`
- index on `brand_id`
- index on `(is_published, sort_order)`
- index on `is_best_seller`
- index on `is_featured`

### 4.4. Product detail child tables

Dung child tables thay vi luu tat ca vao mot JSON lon, vi admin CRUD va sort_order se de quan ly hon.

`product_sizes`

- `id uuid primary key default gen_random_uuid()`
- `product_id uuid references products(id) on delete cascade`
- `label text not null`
- `sort_order int default 0`

`product_flavors`

- `id uuid primary key default gen_random_uuid()`
- `product_id uuid references products(id) on delete cascade`
- `name jsonb not null`
- `sort_order int default 0`

`product_benefits`

- `id uuid primary key default gen_random_uuid()`
- `product_id uuid references products(id) on delete cascade`
- `content jsonb not null`
- `sort_order int default 0`

`product_usage`

- `id uuid primary key default gen_random_uuid()`
- `product_id uuid references products(id) on delete cascade`
- `content jsonb not null`
- `sort_order int default 0`

`product_audiences`

- `id uuid primary key default gen_random_uuid()`
- `product_id uuid references products(id) on delete cascade`
- `content jsonb not null`
- `sort_order int default 0`

`product_ingredients`

- `id uuid primary key default gen_random_uuid()`
- `product_id uuid references products(id) on delete cascade`
- `name text not null`
- `amount text not null`
- `sort_order int default 0`

### 4.5. `related_products`

Fields:

- `product_id uuid references products(id) on delete cascade`
- `related_product_id uuid references products(id) on delete cascade`
- `sort_order int default 0`

Primary key:

- `(product_id, related_product_id)`

Constraint:

- `product_id <> related_product_id`

### 4.6. `home_banners`

Fields:

- `id uuid primary key default gen_random_uuid()`
- `image_path text not null`
- `mobile_image_path text`
- `alt jsonb`
- `link_url text`
- `sort_order int default 0`
- `is_active boolean default true`
- `starts_at timestamptz`
- `ends_at timestamptz`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Frontend rule:

- Banner slide chi render anh.
- Khong render text overlay.
- Neu banner co chu, chu nam san trong file anh.

### 4.7. `documents`

Fields:

- `id uuid primary key default gen_random_uuid()`
- `type text not null`
- `title jsonb not null`
- `description jsonb`
- `file_path text`
- `thumbnail_path text`
- `is_published boolean default true`
- `sort_order int default 0`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Type de xuat:

- `catalog`
- `certificate`
- `coa`
- `attp`

### 4.8. `dealers`

Fields:

- `id uuid primary key default gen_random_uuid()`
- `name text not null`
- `city text`
- `address text`
- `phone text`
- `zalo text`
- `map_url text`
- `is_active boolean default true`
- `sort_order int default 0`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### 4.9. `testimonials`

Fields:

- `id uuid primary key default gen_random_uuid()`
- `name text not null`
- `role text`
- `rating int default 5`
- `quote jsonb not null`
- `is_published boolean default true`
- `sort_order int default 0`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Constraint:

- `rating between 1 and 5`

### 4.10. `site_settings`

Fields:

- `key text primary key`
- `value jsonb not null`
- `is_public boolean default true`
- `updated_at timestamptz default now()`

Suggested keys:

- `contact`
- `social_links`
- `seo`

Example `contact`:

```json
{
  "hotline": "02838481014",
  "email": "hello@profitness.vn",
  "zalo_url": "tel:02838481014",
  "address": "Ho Chi Minh City, Vietnam"
}
```

### 4.11. `contact_leads`

Fields:

- `id uuid primary key default gen_random_uuid()`
- `name text`
- `phone text not null`
- `email text`
- `message text`
- `source text default 'website'`
- `product_id uuid references products(id)`
- `status text default 'new'`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Status:

- `new`
- `contacted`
- `closed`
- `spam`

### 4.12. `admin_profiles`

Fields:

- `id uuid primary key references auth.users(id) on delete cascade`
- `role text not null default 'admin'`
- `display_name text`
- `created_at timestamptz default now()`

Role giai doan dau:

- `admin`
- `editor`

## 5. Storage design

### 5.1. Bucket `site-assets`

Dung cho:

- logo
- home banners
- brand logos

Public read: yes.

### 5.2. Bucket `product-assets`

Dung cho:

- product image
- nutrition facts image
- thumbnails

Public read: yes.

### 5.3. Bucket `documents`

Dung cho:

- PDF catalog
- certificate files
- COA
- ATTP

Public read:

- yes neu client muon khach download truc tiep.
- no neu chi admin xem file, public chi hien metadata.

Giai doan dau nen public read de don gian cho website catalog.

## 6. RLS va security plan

### 6.1. Public tables

Bat RLS tren tat ca bang.

Anon/public duoc select:

- `categories` where `is_active = true`
- `brands` where `is_active = true`
- `products` where `is_published = true`
- child product tables qua products published
- `home_banners` where `is_active = true`
- `documents` where `is_published = true`
- `dealers` where `is_active = true`
- `testimonials` where `is_published = true`
- `site_settings` where `is_public = true`

### 6.2. Admin write

Authenticated admin duoc:

- insert
- update
- delete
- select all

Dieu kien admin:

- user id ton tai trong `admin_profiles`
- role in `admin`, `editor`

### 6.3. Contact leads

Anon:

- insert only.
- khong select.

Admin:

- select/update/delete.

### 6.4. Storage policies

Public read:

- site-assets
- product-assets
- documents neu client cho public download.

Admin write:

- upload/update/delete trong cac bucket.

## 7. Backend architecture trong Next.js

### 7.1. Supabase clients

Da co nen giu:

- `lib/supabase/env.ts`
- `lib/supabase/browser.ts`
- `lib/supabase/server.ts`

Can bo sung:

- `lib/supabase/types.ts` generated tu database sau khi co schema.

### 7.2. Data access layer

Tao folder `lib/data/`.

Files:

- `lib/data/categories.ts`
- `lib/data/products.ts`
- `lib/data/banners.ts`
- `lib/data/documents.ts`
- `lib/data/dealers.ts`
- `lib/data/testimonials.ts`
- `lib/data/site-settings.ts`
- `lib/data/contact-leads.ts`

Moi file chi chua query va mapper. UI khong goi Supabase truc tiep.

### 7.3. Mapping layer

Frontend hien dang dung types:

- `Category`
- `Product`
- `Dealer`
- `DocumentAsset`
- `Testimonial`

Supabase row shape se khac UI shape, nen can mapper:

- `mapCategoryRowToCategory`
- `mapProductRowsToProduct`
- `mapDocumentRowToDocumentAsset`
- `mapDealerRowToDealer`
- `mapTestimonialRowToTestimonial`

Muc tieu:

- Giai doan dau khong phai sua qua nhieu UI.
- Chuyen data source tu mock sang Supabase an toan hon.

### 7.4. Fallback strategy

Trong giai doan migration:

- Neu thieu env Supabase: dung mock data.
- Neu Supabase query fail: co the fallback mock data trong development.
- Production nen fail ro rang hoac hien empty state.

De xuat:

- `lib/data/source.ts`
  - detect `hasSupabaseEnv`
  - return Supabase data neu co env
  - return mock data neu chua co env

## 8. Admin backend plan

### 8.1. Admin auth

Routes:

- `/admin/login`
- `/admin`

Dung Supabase Auth email/password.

Can:

- middleware bao ve `/admin`
- check user co row trong `admin_profiles`
- redirect neu khong co quyen

### 8.2. Admin dashboard modules

Lam theo thu tu:

1. Products
2. Categories
3. Brands
4. Home banners
5. Documents
6. Dealers
7. Testimonials
8. Site settings
9. Contact leads

### 8.3. Product admin form

Can quan ly:

- name vi/en
- slug
- category
- brand
- origin
- price
- sizes
- flavors vi/en
- short description vi/en
- primary goal vi/en
- benefits vi/en
- usage vi/en
- audience vi/en
- ingredients
- image
- nutrition facts image
- best seller
- featured
- published
- related products

### 8.4. Upload flow

Admin upload:

- banner image
- product image
- nutrition facts image
- document PDF/image

Sau upload:

- luu storage path vao table.
- frontend render public URL.

## 9. Search/filter plan

### 9.1. Giai doan dau

Neu so san pham it:

- Query all published products.
- Filter/search client-side nhu hien tai.

Uu diem:

- Nhanh lam.
- It query phuc tap.
- Phu hop demo client.

### 9.2. Khi so san pham tang

Chuyen sang server query:

- filter category
- filter brand
- search text
- pagination

Co the them:

- `pg_trgm` cho fuzzy search.
- search function/RPC.
- materialized/search column neu can.

## 10. Cac phase trien khai chi tiet

### Phase 1: Audit & cleanup frontend data boundaries

Muc tieu:

- Biet chinh xac UI can data gi.
- Tach UI khoi mock data de chuan bi doi data source.

Cong viec:

- Sua encoding loi tren cac trang con.
- Xoa/ignore file root `logo.webp` neu khong dung.
- Tao `lib/data/` voi mock-backed functions.
- Doi UI tu import `lib/mock-data.ts` sang goi `lib/data/*`.
- Dam bao UI van chay y het hien tai.

Ket qua mong doi:

- Frontend chua can Supabase nhung da co data access layer.
- Sau nay doi Supabase chi sua `lib/data`, khong sua UI nhieu.

Verification:

- `npm run lint`
- `npm run build`
- check `/`, `/products`, `/products/[slug]`, `/certificates`, `/dealers`, `/contact`

### Phase 2: Supabase project & local configuration

Muc tieu:

- Co project Supabase that va env local.

Cong viec:

- Tao Supabase project.
- Lay project URL va anon key.
- Tao `.env.local`.
- Dam bao `.env.local` khong vao Git.
- Tao storage buckets.
- Chuan bi Supabase CLI/MCP neu can.

Ket qua mong doi:

- App co the tao Supabase client.
- Chua can query data that.

Verification:

- test query Supabase health/simple select sau khi co table.
- `npm run build`

### Phase 3: Database schema migration

Muc tieu:

- Tao schema core cho catalog.

Cong viec:

- Tao migration SQL.
- Tao tables:
  - categories
  - brands
  - products
  - product child tables
  - related_products
  - home_banners
  - documents
  - dealers
  - testimonials
  - site_settings
  - contact_leads
  - admin_profiles
- Tao indexes.
- Tao updated_at trigger.
- Bat RLS.
- Tao policies.

Ket qua mong doi:

- Database co schema dung voi frontend.
- Public read va admin write duoc bao ve.

Verification:

- chay advisors security/performance neu tool kha dung.
- test anon select published data.
- test anon khong doc contact leads.
- test anon insert contact lead.

### Phase 4: Seed data

Muc tieu:

- Dua mock data hien tai vao Supabase.

Cong viec:

- Tao seed script/SQL.
- Insert categories.
- Insert brands.
- Insert products.
- Insert sizes/flavors/benefits/usage/audience/ingredients.
- Insert related products.
- Insert testimonials.
- Insert dealers.
- Insert documents.
- Insert site settings.
- Upload logo/banner/product placeholder neu can.

Ket qua mong doi:

- Supabase co du data de frontend hien giong mock.

Verification:

- query count tung table.
- query product detail theo slug.
- query home data.

### Phase 5: Connect public frontend to Supabase

Muc tieu:

- Public pages doc data tu Supabase.

Cong viec:

- Implement `lib/data/*` bang Supabase.
- Home lay:
  - banners
  - featured categories
  - best sellers
  - documents
  - testimonials
  - site settings
- Products page lay:
  - products
  - categories
  - brands
- Product detail lay:
  - product by slug
  - child data
  - related products
- Header lay categories.
- Footer/QuickContact lay site settings.
- Certificates lay documents.
- Dealers lay dealers.

Ket qua mong doi:

- Mock data khong con la source chinh.
- UI khong doi ve mat thiet ke.

Verification:

- `npm run lint`
- `npm run build`
- check pages local.
- test khi Supabase env thieu trong dev.

### Phase 6: Contact lead backend

Muc tieu:

- Form lien he co the luu database.

Cong viec:

- Thiet ke form contact toi gian.
- Tao server action hoac route handler insert `contact_leads`.
- Validate phone/message.
- Gan `source`.
- Product detail CTA co the gui lead voi `product_id` neu can.

Ket qua mong doi:

- Lead tu website luu vao Supabase.
- Khong co public read lead.

Verification:

- submit form thanh cong.
- check Supabase co row lead.
- anon khong select duoc leads.

### Phase 7: Admin authentication

Muc tieu:

- Co khu vuc admin bao ve.

Cong viec:

- Tao `/admin/login`.
- Tao middleware/session check.
- Tao `admin_profiles`.
- Tao dashboard shell.
- Chi user trong `admin_profiles` moi vao duoc.

Ket qua mong doi:

- Admin login duoc.
- User khong co quyen bi redirect.

Verification:

- login admin.
- logout.
- test user khong role.

### Phase 8: Admin CRUD

Muc tieu:

- Admin quan ly du lieu tu web.

Thu tu lam:

1. Site settings.
2. Categories.
3. Brands.
4. Products.
5. Banners.
6. Documents.
7. Dealers.
8. Testimonials.
9. Contact leads.

Moi module can:

- list
- create
- edit
- delete/archive
- publish/active toggle
- sort_order
- validation

Verification:

- Tao/sua/xoa data tren admin.
- Public page cap nhat dung.
- RLS khong cho anon ghi.

### Phase 9: Production deployment

Muc tieu:

- Vercel production doc Supabase that.

Cong viec:

- Them env tren Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy.
- Check public pages.
- Check admin login.
- Check contact lead.

Verification:

- Vercel build pass.
- Public URL hien data Supabase.
- Khong lo secret.

## 11. Thu tu uu tien thuc te

Neu lam tung buoc nho, de xuat thu tu:

1. Cleanup frontend encoding va data boundaries.
2. Tao `lib/data` mock-backed.
3. Tao Supabase project.
4. Tao schema + RLS.
5. Seed mock data.
6. Doi public frontend sang Supabase read.
7. Them contact leads.
8. Lam admin auth.
9. Lam admin CRUD products.
10. Lam admin CRUD cac module con lai.

## 12. Checklist truoc khi bat dau code backend

Can xac nhan:

- Ten Supabase project.
- Organization Supabase.
- Region Supabase, de xuat gan Viet Nam nhat: `ap-southeast-1`.
- Co can public download documents hay chi hien thong tin?
- Co can admin upload anh ngay phase dau khong?
- Co can form lien he ngay phase dau khong?
- So luong san pham du kien trong 3 thang dau.

## 13. Ket luan

Huong phu hop nhat la xay Supabase backend theo tung lop:

1. Data boundary trong frontend.
2. Database schema + seed.
3. Public read.
4. Lead capture.
5. Admin auth.
6. Admin CRUD.

Cach nay tranh viec lam admin qua som khi schema chua on dinh, dong thoi giu frontend hien tai khong bi vo trong luc chuyen tu mock data sang database that.

## 14. Phase 1 implementation status

Trang thai: **completed**.

Da thuc hien:

- Tao data access layer mock-backed:
  - `lib/data/categories.ts`
  - `lib/data/products.ts`
  - `lib/data/documents.ts`
  - `lib/data/dealers.ts`
  - `lib/data/testimonials.ts`
  - `lib/data/site-settings.ts`
- Doi UI khong import truc tiep `lib/mock-data.ts` nua trong `app/` va `components/`.
- Sua encoding tieng Viet trong cac trang/chunk copy chinh:
  - `lib/i18n.ts`
  - `lib/mock-data.ts`
  - `app/page.tsx`
  - `app/about/page.tsx`
  - `app/certificates/page.tsx`
  - `app/dealers/page.tsx`
  - `app/contact/page.tsx`
  - `app/products/[slug]/page.tsx`
  - `components/footer.tsx`
- Dua hotline/email/Zalo/address vao `getSiteSettings()` de chuan bi map sang bang `site_settings`.
- Chay kiem tra:
  - `npm run lint`: pass
  - `npm run build`: pass

Ket qua:

- Frontend van dung mock data, nhung data source da duoc tach sau `lib/data/*`.
- Phase tiep theo co the thay implementation trong `lib/data/*` bang Supabase query ma khong can sua nhieu UI.

## 15. Phase 2 implementation status

Trang thai: **completed**.

Da thuc hien:

- Supabase connector da hoat dong.
- Organization da xac nhan:
  - name: `matthamthcs`
  - id: `poywmrizywtbmgmqieaz`
- Da tao Supabase project:
  - name: `profitness-catalog`
  - id/ref: `jcclhiphtmyyzhofxbdt`
  - region: `ap-southeast-1`
  - status: `ACTIVE_HEALTHY`
  - database host: `db.jcclhiphtmyyzhofxbdt.supabase.co`
  - project URL: `https://jcclhiphtmyyzhofxbdt.supabase.co`
- Cost tao project theo Supabase tool:
  - amount: `0`
  - recurrence: `monthly`
- Local project da co:
  - `@supabase/supabase-js`
  - `@supabase/ssr`
  - `lib/supabase/env.ts`
  - `lib/supabase/browser.ts`
  - `lib/supabase/server.ts`
  - `.env.example` voi bien Supabase
- `.gitignore` da ignore `.env.local`, nen co the luu key local ma khong day len Git.

Da tao `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jcclhiphtmyyzhofxbdt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-key>
```

Verification:

- `npm run build` da nhan `.env.local`.
- `.env.local` dang duoc ignore boi `.gitignore`.

## 16. Phase 3 implementation status

Trang thai: **completed**.

Supabase project:

- project id/ref: `jcclhiphtmyyzhofxbdt`
- URL: `https://jcclhiphtmyyzhofxbdt.supabase.co`

Da apply migrations:

- `20260713071538_init_catalog_schema`
- `20260713071752_create_catalog_storage_buckets`
- `20260713071856_harden_catalog_security_policies`
- `20260713072036_optimize_catalog_rls_and_indexes`

Da tao core schema:

- `categories`
- `brands`
- `products`
- `product_sizes`
- `product_flavors`
- `product_benefits`
- `product_usage`
- `product_audiences`
- `product_ingredients`
- `related_products`
- `home_banners`
- `documents`
- `dealers`
- `testimonials`
- `site_settings`
- `contact_leads`
- `admin_profiles`

Da tao storage buckets:

- `site-assets`
- `product-assets`
- `documents`

Da cau hinh bao mat:

- Bat RLS cho tat ca 17 bang public.
- Anon chi doc du lieu public/published/active.
- Anon chi insert duoc `contact_leads` hop le, khong doc lai lead.
- Admin authenticated chi co quyen ghi neu co row trong `admin_profiles` voi role `admin` hoac `editor`.
- Khong dung `SECURITY DEFINER` cho helper admin.
- Storage public read cho bucket catalog, admin write qua RLS policy.

Da toi uu theo advisors:

- Sua `set_updated_at` co `search_path`.
- Sua insert policy cua `contact_leads` khong con `WITH CHECK (true)`.
- Them index cho foreign key:
  - `contact_leads.product_id`
  - `related_products.related_product_id`
- Tach policy public `anon` va admin `authenticated` de tranh multiple permissive policies.

Verification:

- `public` co 17 bang, tat ca `rls_enabled = true`.
- Security advisors: pass, khong con lint.
- Performance advisors: chi con `unused_index` info vi database chua co data/query thuc te. Giu lai cac index nay vi can cho filter, sort va foreign key query sau nay.
- Test anon insert `contact_leads` hop le: pass neu khong `RETURNING`, dung voi flow public form.
- `npm run lint`: pass.
- `npm run build`: pass.

Repo da cap nhat:

- Them `lib/supabase/database.types.ts`.
- Gan type `Database` vao:
  - `lib/supabase/browser.ts`
  - `lib/supabase/server.ts`

Luu y tiep theo:

- Phase 4 seed mock data vao Supabase, sau do Phase 5 doi public frontend sang Supabase read.

## 17. Phase 4 implementation status

Trang thai: **completed**.

Da them file seed co the tai su dung:

- `supabase/seed.sql`

Da seed du lieu demo len Supabase project `jcclhiphtmyyzhofxbdt`:

- categories: 6
- brands: 3
- products: 4
- product_sizes: 6
- product_flavors: 9
- product_benefits: 12
- product_usage: 8
- product_audiences: 11
- product_ingredients: 12
- related_products: 7
- home_banners: 2
- documents: 3
- dealers: 2
- testimonials: 2
- site_settings: 3

Da chuan hoa lai noi dung tieng Viet khi seed:

- Khong copy cac chuoi bi loi encoding trong `lib/mock-data.ts`.
- Product/category/document/testimonial dung `jsonb` song ngu `vi` va `en`.

Da verify:

- Query product detail theo slug `endurance-gel-citrus` tra ve dung:
  - category: `Gel năng lượng`
  - brand: `ProFuel`
  - price: `45000`
  - flavors: 3
  - benefits: 3
  - related products: 2
- RLS voi role `anon` doc duoc du lieu public:
  - categories: 6
  - products: 4
  - home_banners: 2
  - documents: 3
  - dealers: 2
  - testimonials: 2
  - site_settings: 3

Luu y:

- `home_banners.image_path` hien dang dung placeholder `/logo.webp` vi chua co file banner that tren Supabase Storage.
- Phase sau khi co anh banner/product/documents that thi upload vao Storage va update `image_path`, `file_path`, `thumbnail_path`.
- `.env.local` da co Supabase URL va publishable key, nen frontend co the doc Supabase that.

## 18. Phase 5 implementation status

Trang thai: **completed and verified with Supabase env**.

Da thuc hien:

- Them public Supabase client cho data read:
  - `lib/supabase/public.ts`
- Them data source detector:
  - `lib/data/source.ts`
  - `hasSupabaseEnv()` trong `lib/supabase/env.ts`
- Them mapper database row sang UI type:
  - `lib/data/mappers.ts`
- Doi cac data access functions sang Supabase-first, mock-fallback:
  - `lib/data/categories.ts`
  - `lib/data/products.ts`
  - `lib/data/documents.ts`
  - `lib/data/dealers.ts`
  - `lib/data/testimonials.ts`
  - `lib/data/site-settings.ts`
- Cap nhat `.env.example` voi Supabase project URL:
  - `https://jcclhiphtmyyzhofxbdt.supabase.co`

Cach hoat dong:

- Neu co `NEXT_PUBLIC_SUPABASE_URL` va `NEXT_PUBLIC_SUPABASE_ANON_KEY`, frontend public doc data tu Supabase.
- Neu thieu env hoac query Supabase loi, frontend fallback ve mock data de localhost/build khong bi crash.
- Public data dung anon client rieng, khong dung cookie session, de tranh viec user authenticated khong phai admin bi RLS chan data public.

Verification:

- `npm run lint`: pass.
- `npm run build`: pass va da load `.env.local`.
- Local dev route checks: pass.
  - `/`: 200
  - `/products`: 200
  - `/products/endurance-gel-citrus`: 200
  - `/certificates`: 200
  - `/dealers`: 200
  - `/contact`: 200
- `/products` co text `Gel năng lượng` sach tu Supabase seed va khong con chuoi mojibake `Gel nÄƒng`.
- `/products/endurance-gel-citrus` co brand `ProFuel`, price `45.000` va category `Gel năng lượng`.

Da bat data Supabase that tren localhost:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jcclhiphtmyyzhofxbdt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-key>
```

Can lam tiep de bat data Supabase that tren Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jcclhiphtmyyzhofxbdt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-key>
```

Sau khi them env tren Vercel, deploy lai de production doc Supabase.

## 19. Phase 6 implementation status

Trang thai: **completed**.

Da thuc hien:

- Them data function luu lead:
  - `lib/data/contact-leads.ts`
- Them server action submit form:
  - `app/contact/actions.ts`
- Them contact form client:
  - `components/contact-lead-form.tsx`
- Cap nhat trang contact:
  - `app/contact/page.tsx`
  - Thay panel placeholder bang form that.
  - Sua mot so chuoi tieng Viet bi loi encoding tren trang contact.

Form hien co:

- Ho ten: optional.
- So dien thoai: required.
- Email: optional.
- Noi dung can tu van: required.
- Hidden source: `contact_page`.
- Hidden honeypot field de giam spam co ban.

Validation:

- Phone phai co 8-15 chu so.
- Email neu co phai dung dinh dang co ban.
- Message phai tu 10 den 1000 ky tu.
- Name gioi han 120 ky tu.

Security:

- Insert lead dung Supabase publishable key/anon role.
- Khong dung service role trong frontend hoac server action.
- Public chi insert duoc `contact_leads`, khong doc lai danh sach lead.
- RLS yeu cau lead co `status = new`.

Verification:

- `npm run lint`: pass.
- `npm run build`: pass.
- `/contact`: 200.
- Test insert public vao `contact_leads` bang publishable key: pass.
- Database ghi nhan test lead:
  - source: `phase6_test`
  - status: `new`
- Da xoa test lead sau khi verify:
  - `remaining_phase6_test_rows = 0`

Luu y tiep theo:

- Phase 7 nen lam admin authentication de co man hinh xem va xu ly `contact_leads`.
- Khi co admin, can hien thi lead theo status: `new`, `contacted`, `closed`, `spam`.

## 20. Phase 7 implementation status

Trang thai: **completed in code, pending real admin account verification**.

Da thuc hien:

- Them helper kiem tra quyen admin:
  - `lib/admin/auth.ts`
- Them middleware redirect nhanh cho khu vuc admin:
  - `middleware.ts`
  - User chua co Supabase session cookie se bi redirect tu `/admin` ve `/admin/login`.
  - Middleware chi la lop dieu huong UX; check bao mat that van nam trong server page/action bang `auth.getUser()` va `admin_profiles`.
- Them server actions:
  - `app/admin/login/actions.ts`
  - `loginAdmin`
  - `logoutAdmin`
- Them form dang nhap admin:
  - `components/admin-login-form.tsx`
- Them trang dang nhap:
  - `app/admin/login/page.tsx`
- Them dashboard shell:
  - `app/admin/page.tsx`

Cach phan quyen:

- Dang nhap bang Supabase Auth email/password.
- Sau khi dang nhap, server query bang `admin_profiles`.
- Chi user co row trong `admin_profiles` voi role `admin` hoac `editor` moi vao duoc dashboard.
- User da dang nhap nhung khong co quyen se bi sign out va hien thong bao loi.

Can thuc hien tren Supabase dashboard de test login thanh cong:

1. Tao user trong `Authentication > Users`.
2. Copy `User UID`.
3. Chay SQL:

```sql
insert into public.admin_profiles (id, role, display_name)
values ('<AUTH_USER_UID>', 'admin', '<TEN_ADMIN>')
on conflict (id) do update
set role = excluded.role,
    display_name = excluded.display_name;
```

Verification can chay:

- `npm run lint`
- `npm run build`
- `/admin/login` tra ve 200.
- `/admin` redirect ve `/admin/login` khi chua dang nhap.
- Sau khi co admin user that, dang nhap `/admin/login` va kiem tra `/admin`.

## 21. Phase 8 implementation status

Trang thai: **completed for basic admin CRUD shell and Auth/RLS smoke test**.

Da thuc hien:

- Them helper form cho admin:
  - `lib/admin/form.ts`
  - `components/admin-fields.tsx`
- Them admin data queries:
  - `lib/admin/data.ts`
- Them admin navigation:
  - `components/admin-nav.tsx`
  - `app/admin/layout.tsx`
- Cap nhat dashboard:
  - `app/admin/page.tsx`
  - Hien count san pham, danh muc, thuong hieu, banner, tai lieu, dai ly, testimonial va lead moi.
- Them server actions CRUD:
  - `app/admin/actions.ts`

Admin routes da co:

- `/admin/products`
  - List san pham.
  - Them/sua/xoa san pham.
  - Sua thong tin chinh: ten VI/EN, slug, gia, category, brand, xuat xu, image path, nutrition image path, visual colors, featured, best seller, published.
  - Sua danh sach con bang textarea: sizes, flavors VI/EN, benefits VI/EN, usage VI/EN, audiences VI/EN, ingredients.
- `/admin/categories`
  - Them/sua/xoa danh muc.
  - Quan ly name/description VI/EN, slug, featured, active, sort_order.
- `/admin/brands`
  - Them/sua/xoa thuong hieu.
  - Quan ly slug, origin, description VI/EN, logo_path, active, sort_order.
- `/admin/banners`
  - Them/sua/xoa banner.
  - Quan ly image path, mobile image path, alt VI/EN, link URL, active, sort_order.
- `/admin/documents`
  - Them/sua/xoa tai lieu.
  - Quan ly type, title/description VI/EN, file path, thumbnail path, published, sort_order.
- `/admin/dealers`
  - Them/sua/xoa dai ly.
  - Quan ly city, address, phone, Zalo, map URL, active, sort_order.
- `/admin/testimonials`
  - Them/sua/xoa feedback khach hang.
  - Quan ly name, role, rating, quote VI/EN, published, sort_order.
- `/admin/leads`
  - Xem lead lien he.
  - Cap nhat status: `new`, `contacted`, `closed`, `spam`.
  - Xoa lead.
- `/admin/settings`
  - Cap nhat hotline, email, Zalo URL, address, Facebook, SEO co ban.

Gioi han hien tai:

- Da co upload file truc tiep trong admin qua Supabase Storage bucket `profitness-assets`.
- Da co UI chon related products trong form san pham.
- Chua co form rieng cho storage buckets.
- Chua verify day du CRUD tung module bang browser sau moi dot sua UI.

Verification:

- `npm run lint`: pass.
- `npm run build`: pass.
- `/admin/login`: 200.
- `/admin/products` khi chua dang nhap: redirect 307 ve `/admin/login?next=%2Fadmin%2Fproducts`.
- Da tao admin user test trong Supabase Auth voi email `admin@profitness.vn`.
- Da them row `admin_profiles` role `admin`.
- Da verify Supabase Auth password login thanh cong bang Auth API.
- Da verify admin RLS CRUD bang REST:
  - insert category test: pass.
  - update category test: pass.
  - delete category test: pass.
  - leftover test category: 0.

Can lam tiep:

- Dang nhap `/admin/login` bang browser de test giao dien admin that.
- Test tao/sua/xoa tren tung module voi quyen admin/editor qua UI.
- Neu can quan ly file nang cao hon, bo sung media library rieng de xem/xoa/tai su dung file da upload.
