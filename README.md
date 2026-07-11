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

## Ejecutarlo

```bash
git clone <URL_DEL_REPOSITORIO>
cd providers-app
cp .env.example .env
docker compose up --build -d
```

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

- `admin@providers.local` / `password123` (ADMIN)
- `executive@providers.local` / `password123` (EXECUTIVE)

Ejemplo de login:

```bash
curl -X POST http://localhost:3187/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@providers.local","password":"password123"}'
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

Backend:

```bash
cd backend
npm run start:dev
npm run build
npm run lint
npm run migration:run
npm run seed:users
npm run seed:suppliers
npm run test
npm run test:e2e
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run test
```

## pgAdmin

Es opcional y no arranca con `docker compose up -d`.

Iniciar:

```bash
docker compose --profile tools up -d
```

Detener:

```bash
docker compose --profile tools down
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

- `docs/FASE_1.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/DEVELOPMENT.md`
- `docs/ROADMAP.md`
