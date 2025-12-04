-- Update profiles to Spanish and fix colors
-- Run this in your Supabase SQL Editor

TRUNCATE TABLE profiles CASCADE; -- Clear existing profiles to reset

INSERT INTO profiles (name, color_theme) VALUES 
  ('Mamá', 'emerald'),
  ('Papá', 'blue'),
  ('Héctor', 'orange');
