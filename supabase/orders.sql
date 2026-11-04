-- Migration: Orders and Order Items for Profitness / Hammer Nutrition VN

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_email text null,
  shipping_address text not null,
  province_city text null,
  district text null,
  payment_preference text not null default 'cod' check (payment_preference in ('cod', 'bank_transfer')),
  customer_notes text null,
  subtotal numeric not null default 0 check (subtotal >= 0),
  shipping_fee numeric not null default 0 check (shipping_fee >= 0),
  total_amount numeric not null default 0 check (total_amount >= 0),
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'shipping', 'completed', 'cancelled')),
  staff_notes text null,
  source_domain text null default 'profitness',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid null references public.products(id) on delete set null,
  variant_id uuid null references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_label text null,
  price numeric not null default 0 check (price >= 0),
  quantity integer not null default 1 check (quantity > 0),
  total_price numeric not null default 0 check (total_price >= 0),
  image_path text null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists orders_status_created_at_idx on public.orders(status, created_at desc);
create index if not exists orders_order_code_idx on public.orders(order_code);
create index if not exists orders_customer_phone_idx on public.orders(customer_phone);
create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- Updated_at trigger
drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- Enable Row Level Security
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Grants
grant select, insert on public.orders to anon;
grant select, insert on public.order_items to anon;
grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.order_items to authenticated;

-- Policies for public.orders
drop policy if exists "Anon can insert orders" on public.orders;
create policy "Anon can insert orders"
on public.orders
for insert
to anon
with check (true);

drop policy if exists "Admins can select orders" on public.orders;
create policy "Admins can select orders"
on public.orders
for select
to authenticated
using (public.current_user_is_admin());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "Admins can delete orders" on public.orders;
create policy "Admins can delete orders"
on public.orders
for delete
to authenticated
using (public.current_user_is_admin());

-- Policies for public.order_items
drop policy if exists "Anon can insert order items" on public.order_items;
create policy "Anon can insert order items"
on public.order_items
for insert
to anon
with check (true);

drop policy if exists "Admins can select order items" on public.order_items;
create policy "Admins can select order items"
on public.order_items
for select
to authenticated
using (public.current_user_is_admin());

drop policy if exists "Admins can delete order items" on public.order_items;
create policy "Admins can delete order items"
on public.order_items
for delete
to authenticated
using (public.current_user_is_admin());

