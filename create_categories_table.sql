-- Create categories table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique,
  icon text -- optional emoji/icon for the category
);

-- Enable RLS
alter table categories enable row level security;

-- Policy: Allow authenticated users full access
create policy "authenticated_access" on categories
  for all
  to authenticated
  using (true)
  with check (true);

-- Insert default categories
insert into categories (name, icon) values
  ('Desayuno', '🌅'),
  ('Comida', '🍽️'),
  ('Cena', '🌙'),
  ('Postre', '🍰'),
  ('Snack', '🍿'),
  ('Dulce', '🍬'),
  ('Salado', '🧂')
on conflict (name) do nothing;
