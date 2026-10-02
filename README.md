# Urban Style

Portal de moda e-commerce desarrollado como ejercicio de JavaScript. La aplicación gestiona un catálogo de productos, un carrito de compras con cálculo financiero en tiempo real, un sistema de ofertas por temporizador y un módulo de reseñas con persistencia en el navegador.

---

## Descripcion general

Urban Style simula el frontend de una tienda de moda online. No utiliza frameworks ni librerías de JavaScript externas: toda la lógica está escrita en vanilla JS con modo estricto activado. El objetivo del proyecto es practicar manipulación del DOM, gestión de estado, operaciones financieras con formateo regional y persistencia con localStorage.

---

## Tecnologias utilizadas

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)

---

## Estructura del proyecto

```
urban_styles/
├── assets/
│   ├── data/
│   └── images/
│       ├── chaqueta negra.jfif
│       ├── camiseta_miles_morales.jfif
│       ├── miles morales air_jordan.jfif
│       └── Real Madrid 2026-27 camiseta.jfif
├── public/
│   └── index.html
└── src/
    └── app.js
```

---

## Funcionalidades

### Sesion de usuario

Al cargar la pagina, la aplicacion lee los parametros `user` y `role` de la URL mediante `URLSearchParams`. Si no existen, se asignan valores por defecto con el operador `??`. La fecha actual se formatea en texto extendido en español con `toLocaleDateString`. El ID del cliente se rellena con ceros a la izquierda usando `padStart`.

Para probar con un usuario especifico, añade los parametros a la URL:

```
index.html?user=Carlos&role=admin
```

### Catalogo de productos

Los cuatro productos se renderizan dinamicamente mediante `renderizarProductos()`. Los precios se inyectan con `textContent` para prevenir ataques XSS. Cada tarjeta incluye un boton de "Anadir al carrito" que incrementa las unidades del producto correspondiente.

### Carrito de compras

La funcion `actualizarCarrito()` se ejecuta cada vez que se añade un producto. Calcula en tiempo real:

- Subtotal: suma de todos los productos por sus unidades
- Descuento: importe del cupon si la oferta relampago esta activa
- IVA: 21% sobre la base imponible
- Total a pagar: base imponible mas IVA

Todos los valores se formatean con `Intl.NumberFormat` en la locale `es-ES` con moneda EUR.

### Oferta relampago

### Oferta relampago

Al pulsar el boton "Iniciar oferta relampago", se inicia una marcha atras de 15 segundos mediante `setInterval`. Durante ese intervalo, el boton cambia a "Activar oferta" y permanece clickable:

- Si el usuario hace clic en "Activar oferta" antes de que los 15 segundos expiren, el cupon se activa y se aplica inmediatamente al carrito.
- Si transcurren los 15 segundos sin que el usuario pulse el boton, el tiempo se agota y la oferta no se aplica.

Cuando el cupon es activado, el descuento se calcula de forma dinamica y porcentual sobre el subtotal segun los estandares de comercio electronico, evitando importes negativos:

- Subtotal mayor o igual a 500 euros: 15% de descuento (el cliente paga el 85% del importe)
- Subtotal entre 300 y 499.99 euros: 12% de descuento
- Subtotal entre 150 y 299.99 euros: 10% de descuento
- Subtotal entre 50 y 149.99 euros: 8% de descuento
- Subtotal menor a 50 euros: 5% de descuento

Al finalizar la cuenta atras, el estado se restablece tras un breve lapso para permitir futuras activaciones.

### Resenas

Las reseñas se guardan en `localStorage` con un timestamp como identificador. Al cargar la pagina, se leen y muestran en orden de mas reciente a mas antiguo.

Cada reseña permite:

- Editar: abre un editor en el mismo lugar del comentario. Los cambios se persisten en localStorage.
- Eliminar: borra la reseña por su identificador y la quita del DOM sin re-renderizar el historial completo.

La hora se muestra en formato `H:MM a.m/p.m - D/M/AA`.

---

## Como ejecutar el proyecto en local

El proyecto no tiene dependencias de npm ni proceso de compilacion. Solo necesitas un navegador y un servidor de archivos estaticos para que las rutas relativas funcionen correctamente.

### Opcion 1: Visual Studio Code con Live Server

1. Clona o descarga el repositorio en tu equipo.
2. Abre la carpeta `urban_styles` en Visual Studio Code.
3. Instala la extension **Live Server** de Ritwick Dey si no la tienes.
4. Haz clic derecho sobre `public/index.html` y selecciona **Open with Live Server**.
5. El navegador abrira automaticamente la aplicacion.

### Opcion 2: Servidor HTTP con Node.js

Si tienes Node.js instalado, puedes usar el paquete `serve`:

```bash
npx serve .
```

Despues accede a `http://localhost:3000/public/index.html` en el navegador.

### Opcion 3: Servidor HTTP con Python

Si tienes Python instalado:

```bash
# Python 3
python -m http.server 8080
```

Despues accede a `http://localhost:8080/public/index.html` en el navegador.

> No abras `index.html` directamente como archivo (`file://`). El script de Google Analytics y algunas rutas relativas pueden no funcionar correctamente sin un servidor.

---

## Detalles tecnicos relevantes

| Aspecto | Implementacion |
|---|---|
| Modo estricto | `'use strict'` al inicio de `app.js` |
| Prevencion XSS | Se usa `textContent` en lugar de `innerHTML` para todo dato dinamico |
| Persistencia | `localStorage` con `try/catch` para manejar errores de cuota o modo privado |
| Formateo de precios | `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })` |
| Identificador de sesion | `crypto.randomUUID()` |
| Estado de conexion | `navigator.onLine` |
| Idioma del navegador | `navigator.language` |

---

## Autor

Enmanuel Feliciano Lemos
