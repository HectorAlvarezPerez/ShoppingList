-- Insert Catalan family recipes into the database
-- Run this in your Supabase SQL Editor

-- First, add new categories for better organization
INSERT INTO categories (name, icon) VALUES
  ('Llegums', '🥘'),
  ('Arrossos', '🍚'),
  ('Pasta', '🍝'),
  ('Carns', '🥩'),
  ('Peix', '🐟'),
  ('Verdures', '🥬'),
  ('Ous', '🥚'),
  ('Guarnicions', '🥔')
ON CONFLICT (name) DO NOTHING;

-- 1. LEGUMBRES Y PLATOS DE CUCHARA
INSERT INTO recipes (name, instructions, category) VALUES
  ('Cigrons a la catalana', 'Garbanzos a la catalana. Receta tradicional con butifarra, espinacas y huevo duro.', 'Llegums'),
  ('Favada / Faves amb all i llonganissa', 'Habas con ajo y longaniza. Plato tradicional catalán.', 'Llegums'),
  ('Llenties', 'Lentejas estofadas con verduras.', 'Llegums'),
  ('Sopa de carbassó', 'Sopa de calabacín. Ligera y reconfortante.', 'Llegums'),
  ('Caldo', 'Caldo casero para risotto o sopa.', 'Llegums');

-- 2. ARROCES Y PASTAS
INSERT INTO recipes (name, instructions, category) VALUES
  ('Fideus arròs amb verdura i salmó', 'Fideos de arroz con verdura y salmón.', 'Arrossos'),
  ('Arròs negre', 'Arroz negro con setas y pollo o sepia con tinta. Clásico catalán.', 'Arrossos'),
  ('Risotto', 'Risotto cremoso con caldo y parmesano.', 'Arrossos'),
  ('Pasta amb salsa bolognesa', 'Pasta con salsa boloñesa casera.', 'Pasta'),
  ('Ñoquis amb tonyina', 'Ñoquis con atún.', 'Pasta'),
  ('Pasta amb tomàquet i tonyina', 'Pasta con tomate y atún.', 'Pasta'),
  ('Pasta amb carn estofada', 'Pasta con carne estofada desmigada.', 'Pasta');

-- 3. CARNES Y AVES
INSERT INTO recipes (name, instructions, category) VALUES
  ('Fajitas de carn', 'Fajitas con carne picada, calabacín y cebolla. Servir con tortillas.', 'Carns'),
  ('Hamburguesa de vedella', 'Hamburguesa de ternera con lechuga, tomate y queso.', 'Carns'),
  ('Llom amb formatge', 'Lomo de cerdo con queso gratinado.', 'Carns'),
  ('Pit de pollastre', 'Pechuga de pollo a la plancha o al horno.', 'Carns'),
  ('Mandonguilles', 'Albóndigas caseras. Servir solas o con pasta/arroz.', 'Carns'),
  ('Barbacoa', 'Carne a la barbacoa.', 'Carns'),
  ('Xai al forn amb patates', 'Cordero al horno con patatas. Plato de domingo.', 'Carns'),
  ('Carn estofada', 'Carne estofada lentamente con verduras.', 'Carns'),
  ('Botifarra / Salxixes', 'Butifarra o salchichas a la plancha.', 'Carns');

-- 4. PESCADOS
INSERT INTO recipes (name, instructions, category) VALUES
  ('Salmó al forn amb verdura', 'Salmón al horno con verduras. Saludable y fácil.', 'Peix'),
  ('Filet de llobarro', 'Filete de lubina a la plancha o al horno.', 'Peix'),
  ('Quiche de peixet', 'Quiche de pescado troceado.', 'Peix'),
  ('Peixet fregit', 'Pescadito frito. Clásico mediterráneo.', 'Peix'),
  ('Sepia / Calamar', 'Sepia o calamar a la plancha. Ideal con arroz negro.', 'Peix');

-- 5. VERDURAS, HUEVOS Y CENAS LIGERAS
INSERT INTO recipes (name, instructions, category) VALUES
  ('Crema de carbassó', 'Crema de calabacín. Preparar en Thermomix.', 'Verdures'),
  ('Albergínia farcida amb bolognesa', 'Berenjena rellena con boloñesa y longaniza.', 'Verdures'),
  ('Truita de patates', 'Tortilla de patatas clásica.', 'Ous'),
  ('Truita d''espinacs', 'Tortilla de espinacas.', 'Ous'),
  ('Ous farcits', 'Huevos rellenos. Aperitivo clásico.', 'Ous'),
  ('Nius de carbassó amb ou', 'Nidos de calabacín rallado con huevo al centro.', 'Ous'),
  ('Escalivada', 'Verduras asadas: pimientos, berenjenas y cebollas.', 'Verdures'),
  ('Amanida d''espinacs, boniato i formatge de cabra', 'Ensalada de espinacas con boniato asado y queso de cabra.', 'Verdures'),
  ('Poké bowl', 'Bowl estilo poké con base de arroz, aguacate y proteína.', 'Verdures');

-- 6. GUARNICIONES
INSERT INTO recipes (name, instructions, category) VALUES
  ('Patates Thermomix', 'Patatas preparadas en Thermomix.', 'Guarnicions'),
  ('Patates Air Fryer', 'Patatas crujientes en Airfryer.', 'Guarnicions'),
  ('Croquetes', 'Croquetas caseras.', 'Guarnicions'),
  ('Patates al forn amb all i julivert', 'Patatas al horno con ajo y perejil.', 'Guarnicions');
