-- Enable Row Level Security
alter table profiles enable row level security;
alter table weekly_plan enable row level security;
alter table shopping_list enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;

-- Create Policies for "Authenticated Users" (Family Members)
-- We allow ALL operations (SELECT, INSERT, UPDATE, DELETE) for any logged-in user.

-- Profiles
create policy "Enable full access for authenticated users"
on profiles for all
to authenticated
using (true)
with check (true);

-- Weekly Plan
create policy "Enable full access for authenticated users"
on weekly_plan for all
to authenticated
using (true)
with check (true);

-- Shopping List
create policy "Enable full access for authenticated users"
on shopping_list for all
to authenticated
using (true)
with check (true);

-- Recipes
create policy "Enable full access for authenticated users"
on recipes for all
to authenticated
using (true)
with check (true);

-- Recipe Ingredients
create policy "Enable full access for authenticated users"
on recipe_ingredients for all
to authenticated
using (true)
with check (true);
