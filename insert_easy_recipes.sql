-- Insert "Super Easy" recipes into the database
-- Run this in your Supabase SQL Editor

INSERT INTO recipes (name, instructions, category) VALUES
  (
    'Hummus clásico de garbanzos 🥣',
    'Ingredientes: 1 bote de garbanzos cocidos (400g) lavado y escurrido, zumo de medio limón, 1 diente de ajo, 40g de sésamo tostado (o tahini), 50g de agua, 30g de aceite de oliva, sal y comino.

Pasos:
1. Pon todos los ingredientes en el vaso.
2. Tritura 1 minuto / velocidad progresiva 5-10.
3. Sirve en un bol, echa un chorrito de aceite virgen por encima y pimentón dulce. Acompaña con bastones de zanahoria cruda para dipear.',
    'Thermomix'
  ),
  (
    'Crema fría de pepino, yogur y menta 🥣',
    'Preparar en Thermomix. Refrescante y ligera.',
    'Thermomix'
  ),
  (
    'Mini-pizzas de base de berenjena 🌬️',
    'Ingredientes: 1 berenjena grande, tomate frito (casero o estilo casero), queso mozzarella rallado y orégano.

Pasos:
1. Lava la berenjena y córtala en rodajas de 1 cm de grosor (la piel se deja).
2. Coloca las rodajas en la cesta de la airfryer (sin amontonar mucho). Cocina 8 min a 180°C.
3. Abre, pon encima de cada rodaja una cucharadita de tomate, un poco de queso y orégano.
4. Cocina 3-4 min a 200°C hasta que el queso gratine.',
    'Airfryer'
  ),
  (
    'Garbanzos crunchy especiados 🌬️',
    'Snack saludable. Preparar en Airfryer hasta que queden crujientes.',
    'Airfryer'
  ),
  (
    'Tortilla francesa rellena de espinacas y queso fresco 🍳',
    'Preparar a la plancha. Rápido y nutritivo.',
    'Plancha'
  ),
  (
    'Gambones a la plancha con sal gorda 🍳',
    'Ingredientes: 8-10 gambones enteros (sin pelar), sal gorda y aceite de oliva.

Pasos:
1. Calienta la plancha a fuego muy fuerte.
2. Echa un puñado de sal gorda directamente sobre la superficie de la plancha.
3. Coloca los gambones encima. Añade un chorrito pequeño de aceite sobre ellos.
4. Cocina 2 minutos por un lado y 1 minuto por el otro.
5. Sírvelos inmediatamente. Se pelan en la mesa (¡chuparse los dedos es obligatorio!).',
    'Plancha'
  ),
  (
    'Papillote de merluza con verduritas juliana 🔥',
    'Ingredientes: 2 filetes de merluza (limpios y sin espinas), 1/2 calabacín, 1 zanahoria, aceite y sal. Papel de aluminio o papel de horno.

Pasos:
1. Precalienta el horno a 200°C.
2. Corta dos cuadrados grandes de papel de aluminio.
3. Ralla el calabacín y la zanahoria (o córtalos en tiritas muy finas) y pon una "cama" de verdura en el centro del papel.
4. Pon el pescado encima. Añade sal y un chorrito de aceite.
5. Cierra el papel formando un paquete hermético (dobla bien los bordes para que no salga el vapor).
6. Hornea 12-15 minutos a 200°C. Sirve abriendo el paquete en el plato (cuidado con el vapor al abrir).',
    'Horno'
  ),
  (
    'Frittata de calabacín y cebolla 🔥',
    'Tortilla abierta al horno. Preparar en horno.',
    'Horno'
  ),
  (
    'Tostadas integrales con aguacate y huevo poché 🌬️',
    'Huevo se hace en Airfryer. Servir sobre tostada integral con aguacate.',
    'Airfryer'
  ),
  (
    'Espárragos trigueros envueltos en jamón serrano 🍳',
    'Preparar a la plancha hasta que el jamón quede crujiente.',
    'Plancha'
  );
