-- Add category column to recipes table
alter table recipes add column category text;

-- Comment: Categories will be 'Desayuno', 'Comida', 'Cena', 'Postre', 'Snack', 'Otro'
