# AgoodShop-Carrito de la compra

Actividad 1 de Desarrollo Web en Entorno Cliente

Carrito de la compra hecho con JavaScript:
- Clase `Carrito` que guarda los productos y hace los cálculos (sin tocar el DOM).
- Listado de productos creado dinámicamente, botones − / + y total actualizado.
- Productos obtenidos con `fetch` desde una API local (`api.php`).

## Cómo ejecutarlo
1. Copiar la carpeta en `C:\xampp\htdocs\agoodshop-simple`.
2. Iniciar Apache en XAMPP.
3. Abrir http://localhost/agoodshop-simple/

No funciona abriendo `index.html` con doble clic: `fetch` necesita un servidor.

## Archivos
- `index.html`: estructura de la página.
- `estilos.css`: estilos.
- `app.js`: clase Carrito, petición a la API.
- `api.php`: API local que devuelve los productos en JSON.