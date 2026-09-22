# 🔥👟 Hype Sneakers

CRUD y catálogo de sneakers construido como una **PWA instalable**: servidor propio
con **Express**, frontend en **JavaScript puro**, estilos con **Tailwind CSS** y
datos persistidos en un archivo JSON.

---

## Requisitos

- Node.js **20.11 o superior** (`node -v`)
- npm 10+

## Puesta en marcha

```bash
git clone https://github.com/TheofiloHenrique/TDM_TALLER_CRUD.git
cd TDM_TALLER_CRUD

npm install          # instala las dependencias
cp .env.example .env # crea tu configuración local

npm run dev          # arranca el servidor + el compilador de CSS en modo watch
```

Abre <http://localhost:3000>.

> **¿La página se ve sin estilos?** El archivo `public/css/styles.css` **no está en
> el repositorio**, lo genera Tailwind. Espera a que la terminal muestre el proceso
> `[CSS]` corriendo antes de abrir el navegador.

## Variables de entorno

| Variable   | Descripción                         | Valor por defecto |
| ---------- | ------------------------------------ | ------------------ |
| `PORT`     | Puerto donde corre el servidor       | `3000`             |
| `NODE_ENV` | Entorno de ejecución                 | `development`      |

## Scripts de npm

| Script             | Qué hace                                                      |
| ------------------ | -------------------------------------------------------------- |
| `npm run dev`       | Servidor con recarga (nodemon) **+** Tailwind en modo `--watch` |
| `npm start`         | Servidor en modo producción, sin recarga                      |
| `npm run build`     | Compila y minifica el CSS. Recomendado antes de desplegar     |
| `npm run lint`      | Revisa el código con ESLint                                    |
| `npm run lint:fix`  | Arregla lo que ESLint pueda arreglar solo                      |
| `npm run format`    | Formatea todo el proyecto con Prettier                         |

## API

Base: `/api/sneakers`

| Método   | Ruta          | Body                                                      | Respuesta                     |
| -------- | ------------- | ---------------------------------------------------------- | ------------------------------ |
| `GET`    | `/`           | —                                                          | `200` lista de sneakers        |
| `GET`    | `/:id`        | —                                                          | `200` sneaker · `404` no existe |
| `POST`   | `/`           | `{ name, description?, category, price, stock, image }`   | `201` sneaker creado · `400`   |
| `PUT`    | `/:id`        | igual al POST, todos los campos opcionales                | `200` sneaker · `404` · `400`  |
| `DELETE` | `/:id`        | —                                                          | `200` `{ mensaje, id }` · `404` |

Los errores de validación siempre vienen como `{ "error": "mensaje", "errors": [...] }`.

### Query params de `GET /`

Se pueden combinar libremente. Sin ninguno, se devuelve la lista completa.

| Parámetro  | Ejemplo             | Qué hace                                             |
| ---------- | -------------------- | ------------------------------------------------------ |
| `q`        | `?q=jordan`          | Busca el texto en `name` y `description`               |
| `category` | `?category=Masculino`| Filtra por categoría exacta                            |
| `sort`     | `?sort=price`        | Ordena por precio, de menor a mayor                    |

Un filtro sin coincidencias responde `200` con un arreglo vacío, no un error.

## Modelo de datos

```json
{
  "id": 1,
  "name": "Air Jordan 1 Retro High 'Lost & Found'",
  "description": "Edición icónica inspirada en el stock de 1985...",
  "category": "Jordan",
  "price": 10000,
  "stock": 5,
  "image": "https://..."
}
```

- `price` y `stock`: números, deben ser **mayores o iguales a 0**.
- `category`: debe ser uno de estos valores: **Masculino, Femenino, Infantil**.

## Probar la PWA

1. `npm run build` y luego `npm start`.
2. Abre Chrome → **DevTools → Application**.
3. **Manifest**: revisa que no haya errores de nombre o iconos. **Service Workers**:
   debe decir *activated and is running*.
4. Marca **Offline** en la pestaña *Network* y recarga: el catálogo sigue mostrando
   los datos guardados en caché, con el aviso correspondiente.
5. El botón **Instalar app** de la navbar aparece cuando el navegador confirma que
   la PWA es instalable.

> La instalación y el modo offline se probaron en Chrome/Edge sobre `localhost`.
> la instalación se hace manualmente desde el menú del navegador.

Las capturas de este proceso están en la carpeta `docs/`.
