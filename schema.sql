-- No-Login Shared Database Schema
-- RLS is DISABLED for friction-free family access.

-- 1. Profiles Table
create table profiles (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  color_theme text, -- e.g., "emerald", "blue", "orange"
  avatar_url text
);

-- Pre-populate profiles (Spanish)
insert into profiles (name, color_theme) values 
  ('Mamá', 'emerald'),
  ('Papá', 'blue'),
  ('Héctor', 'orange');

-- 2. Weekly Plan Table
create table weekly_plan (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  day_of_week text not null, -- "Lunes", "Martes", etc.
  meal_type text not null, -- "Desayuno", "Comida", "Cena", "Snack"
  dish_name text,
  profile_id uuid references profiles(id) on delete cascade
);

-- 3. Shopping List Table (Global)
create table shopping_list (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  item_name text not null,
  quantity text, -- Optional
  is_checked boolean default false
);

-- DISABLE RLS (Allow public access)
alter table profiles disable row level security;
alter table weekly_plan disable row level security;
alter table shopping_list disable row level security;
