-- Supabase Storage setup for Pro-Fitness admin assets.
-- Run this once on the target Supabase project if the bucket/policies are missing.

insert into storage.buckets (id, name, public, file_size_limit)
values ('profitness-assets', 'profitness-assets', true, 52428800)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "Admin can read Profitness assets metadata" on storage.objects;
drop policy if exists "Admin can upload Profitness assets" on storage.objects;
drop policy if exists "Admin can update Profitness assets" on storage.objects;
drop policy if exists "Admin can delete Profitness assets" on storage.objects;

create policy "Admin can read Profitness assets metadata"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profitness-assets'
  and public.current_user_is_admin()
);

create policy "Admin can upload Profitness assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profitness-assets'
  and public.current_user_is_admin()
);

create policy "Admin can update Profitness assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profitness-assets'
  and public.current_user_is_admin()
)
with check (
  bucket_id = 'profitness-assets'
  and public.current_user_is_admin()
);

create policy "Admin can delete Profitness assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profitness-assets'
  and public.current_user_is_admin()
);
