-- Create Recipes Table
create table if not exists recipes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  instructions text,
  image_url text
);

-- Create Recipe Ingredients Table
create table if not exists recipe_ingredients (
  id uuid default gen_random_uuid() primary key,
  recipe_id uuid references recipes(id) on delete cascade,
  ingredient_name text not null,
  quantity text -- e.g. "200g", "1 cup"
);

-- Disable RLS (Allow public access as per project convention)
alter table recipes disable row level security;
alter table recipe_ingredients disable row level security;
