-- Profiles table to store user info beyond auth.users
-- Run this in Supabase SQL editor (or via CLI) on the project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  company text,
  phone text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Keep email unique to avoid conflicts
create unique index if not exists profiles_email_key on public.profiles (email);

-- Update timestamp trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Insert a skeleton profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  meta jsonb;
begin
  meta := new.raw_user_meta_data;
  insert into public.profiles (id, email, name, company, phone)
  values (
    new.id,
    new.email,
    coalesce(meta->>'name', null),
    coalesce(meta->>'company', null),
    coalesce(meta->>'phone', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Keep profiles in sync when user metadata is updated later (e.g., after email confirmation)
create or replace function public.handle_user_metadata_updated()
returns trigger as $$
declare
  meta jsonb;
begin
  meta := new.raw_user_meta_data;
  update public.profiles p set
    email = new.email,
    name = coalesce(meta->>'name', p.name),
    company = coalesce(meta->>'company', p.company),
    phone = coalesce(meta->>'phone', p.phone)
  where p.id = new.id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update on auth.users
for each row execute function public.handle_user_metadata_updated();

-- Row Level Security
alter table public.profiles enable row level security;

-- Policies: users can read and update their own profile
drop policy if exists "Enable read own profile" on public.profiles;
create policy "Enable read own profile" on public.profiles
for select using ( auth.uid() = id );

drop policy if exists "Enable update own profile" on public.profiles;
create policy "Enable update own profile" on public.profiles
for update using ( auth.uid() = id );

-- Allow insert by trigger/service role only; no direct insert by anon
drop policy if exists "Allow service role insert" on public.profiles;
create policy "Allow service role insert" on public.profiles
for insert with check ( auth.role() = 'service_role' );

comment on table public.profiles is 'User profiles associated to auth.users';


