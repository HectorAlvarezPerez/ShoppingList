-- Add is_favorite column to recipes table
alter table recipes add column if not exists is_favorite boolean default false;
