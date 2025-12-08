-- Insert recipes into the database
-- Run this in your Supabase SQL Editor

INSERT INTO recipes (name, instructions, category) VALUES
  ('Salmorejo Cordobés (sin pan o con poco pan integral) 🥣', 'Preparar en Thermomix', 'Thermomix'),
  ('Lentejas "viudas" (estofadas solo con verduras) 🥣', 'Preparar en Thermomix', 'Thermomix'),
  ('Salmón con costra de hierbas y espárragos 🌬️', 'Preparar en Airfryer', 'Airfryer'),
  ('Chips de berenjena con miel de caña (versión light) 🌬️', 'Preparar en Airfryer', 'Airfryer'),
  ('Sepia a la plancha con majado de ajo y perejil 🍳', 'Preparar a la plancha/paella', 'Plancha'),
  ('Brochetas de pollo marinado al limón y romero 🍳', 'Preparar a la plancha/paella', 'Plancha'),
  ('Dorada a la sal (o a la espalda) 🔥', 'Preparar al horno', 'Horno'),
  ('Escalivada (Pimientos, berenjenas y cebollas asadas) 🔥', 'Preparar al horno', 'Horno'),
  ('Falafel de garbanzos casero 🌬️', 'Triturar en Thermomix, cocinar en Airfryer', 'Airfryer'),
  ('Champiñones rellenos de verduras y taquitos de pavo 🔥', 'Preparar al horno', 'Horno');

-- Also add the new categories if they don't exist
INSERT INTO categories (name, icon) VALUES
  ('Thermomix', '🥣'),
  ('Airfryer', '🌬️'),
  ('Plancha', '🍳'),
  ('Horno', '🔥')
ON CONFLICT (name) DO NOTHING;
