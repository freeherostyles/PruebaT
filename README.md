# Providers App

Prueba tecnica Full Stack para gestion de proveedores.

## Que hay ahora

- backend NestJS con TypeORM, Swagger y healthcheck
- frontend React con Vite y una pantalla temporal para validar infraestructura
- PostgreSQL en Docker
- Compose listo para levantar todo con un solo comando

Ahora mismo existe autenticacion completa (Fase 2) y el modulo de proveedores (Fase 3): CRUD completo con CQRS, Strategy Pattern, validacion de RFC, soft delete, paginacion y busqueda.

## Stack

- Backend: NestJS, TypeScript, TypeORM, PostgreSQL, Swagger, Helmet, Throttler
- Frontend: React, TypeScript, Vite, React Router, Axios, Material UI, React Query, Zustand, React Hook Form
- Infraestructura: Docker, Docker Compose

## Requisitos

- Docker Desktop o Docker Engine con Docker Compose disponible
- Node.js 20.x y npm 10+ si vas a correr backend/frontend fuera de Docker
- Git

## Ejecutarlo

1. Clona el repositorio y entra a la carpeta.

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>
```

2. Crea el archivo `.env` desde `.env.example`.

macOS / Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Windows CMD:

```bat
copy .env.example .env
```

3. Levanta la aplicacion.

```bash
docker compose up --build -d
```

Ese flujo deja la base migrada y carga los usuarios/suppliers de desarrollo automaticamente.

Ver estado:

```bash
docker compose ps -a
```

Detener:

```bash
docker compose down
```

## Variables de entorno

El proyecto usa un unico `.env` en la raiz. La base esta en `.env.example`.

Variables principales:

```env
PORT=3187
FRONTEND_URL=http://localhost:4178
DB_HOST=providers-postgres
DB_PORT=5432
DB_NAME=providers_db
DB_USER=providers_user
DB_PASSWORD=providers_password
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=10
DEV_ADMIN_PASSWORD=change_admin_password
DEV_EXECUTIVE_PASSWORD=change_executive_password
VITE_API_URL=http://localhost:3187/api
POSTGRES_DB=providers_db
POSTGRES_USER=providers_user
POSTGRES_PASSWORD=providers_password
```

## Puertos y URLs

| Recurso | URL |
| --- | --- |
| Frontend | `http://localhost:4178` |
| Backend | `http://localhost:3187` |
| Swagger | `http://localhost:3187/api/docs` |
| Health | `http://localhost:3187/api/health` |
| PostgreSQL | `localhost:5547` |
| pgAdmin | `http://localhost:5057` |

## Auth rapido

Endpoints:

- `POST /api/auth/login` (rate limited: 5 intentos/minuto)
- `GET /api/auth/profile`

Usuarios de desarrollo:

- `admin@providers.local` / `change_admin_password` (ADMIN)
- `executive@providers.local` / `change_executive_password` (EXECUTIVE)

Esas credenciales salen de `.env`. Si cambias `DEV_ADMIN_PASSWORD` o
`DEV_EXECUTIVE_PASSWORD`, el seed actualiza los usuarios con esos valores en el siguiente arranque.

Ejemplo de login:

macOS / Linux:

```bash
curl -X POST http://localhost:3187/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@providers.local","password":"change_admin_password"}'
```

Windows PowerShell:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3187/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"email":"admin@providers.local","password":"change_admin_password"}'
```

En Swagger, primero haces login y luego pegas el token en `Authorize` como `Bearer <token>`.

> Nota: `JWT_SECRET` es obligatorio. Si no se define en `.env`, el backend falla al iniciar.
> La variable `JWT_EXPIRES_IN` es opcional (default: `1h`). Swagger se desactiva en producción (`NODE_ENV=production`).

## Suppliers API

Endpoints protegidos con JWT y roles:

| Metodo | Ruta | Roles |
| --- | --- | --- |
| POST | `/api/suppliers` | ADMIN |
| GET | `/api/suppliers` | ADMIN, EXECUTIVE |
| GET | `/api/suppliers/stats` | ADMIN, EXECUTIVE |
| GET | `/api/suppliers/:id` | ADMIN, EXECUTIVE |
| PATCH | `/api/suppliers/:id` | ADMIN |
| PATCH | `/api/suppliers/:id/status` | ADMIN |
| DELETE | `/api/suppliers/:id` | ADMIN |

Filtros en listado: `page`, `limit`, `search`, `type`, `status`, `sortBy`, `sortOrder`.

## Scripts utiles

Para desarrollo diario, la forma mas simple y portable es usar Docker.
Los comandos locales de esta seccion son opcionales.

Backend:

```bash
cd backend
npm install
npm run start:dev
npm run build
npm run lint
npm run migration:run
npm run seed:users
npm run seed:suppliers
npm run test
npm run test:e2e
```

Si corres el backend fuera de Docker, ejecuta `npm run migration:run`,
`npm run seed:users` y `npm run seed:suppliers` antes de probar login o endpoints protegidos.

Si quieres reutilizar la base que levanta Docker desde tu host, cambia estas variables en `.env`:

```env
DB_HOST=localhost
DB_PORT=5547
```

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run test
```

Si corres el frontend fuera de Docker, define `VITE_API_URL` antes de arrancarlo.

Ejemplo con archivo `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3187/api
```

## pgAdmin

Es opcional y no arranca con `docker compose up -d`.

Iniciar:

```bash
docker compose --profile tools up -d providers-pgadmin
```

Detener:

```bash
docker compose stop providers-pgadmin
docker compose rm -f providers-pgadmin
```

Acceso:

```text
http://localhost:5057
```

Conexion a PostgreSQL:

- Host: `providers-postgres`
- Port: `5432`
- Database: `providers_db`
- Username: `providers_user`
- Password: `providers_password`

## Estado del proyecto

- ✅ Fase 1 cerrada
- ✅ Fase 2 autenticacion y autorizacion base
- ✅ Fase 3 gestion de proveedores
- ✅ Fase 4 frontend (autenticacion, layout, dashboard)
- ✅ Fase 5A frontend (listado de proveedores con DataGrid, filtros, busqueda, paginacion, detalle)
- ✅ Fase 5B frontend (CRUD visual completo: crear, editar, eliminar, cambio de estatus)

## Nota sobre Docker Rootless

En este host el daemon Docker principal tenia un problema con el image store. Para validar la fase se uso un contexto `rootless` separado.

Eso fue solo una solucion local. No es un requisito del proyecto ni cambia la forma esperada de ejecutarlo en otros equipos.

Si hace falta volver a ese contexto:

```bash
docker context use rootless
docker context show
```

## Mas detalle

- [Indice tecnico](docs/README.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Decisiones tecnicas](docs/DECISIONS.md)
- [Guia de desarrollo](docs/DEVELOPMENT.md)
- [Roadmap](docs/ROADMAP.md)
- [Documentacion por fases](docs/phases/)
- [Documentacion por temas](docs/topics/)
