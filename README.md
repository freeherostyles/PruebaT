# Providers App

Prueba tecnica Full Stack para gestion de proveedores.

## Que hay ahora

- backend NestJS con TypeORM, Swagger y healthcheck
- frontend React con Vite y una pantalla temporal para validar infraestructura
- PostgreSQL en Docker
- Compose listo para levantar todo con un solo comando

La parte funcional todavia no esta implementada. Autenticacion, usuarios, proveedores y reglas de negocio arrancan en las siguientes fases.

## Stack

- Backend: NestJS, TypeScript, TypeORM, PostgreSQL, Swagger
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

## Scripts utiles

Backend:

```bash
cd backend
npm run start:dev
npm run build
npm run lint
npm run migration:run
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

## Estado del proyecto

- ✅ Fase 1 cerrada
- ⬜ Fase 2 autenticacion
- ⬜ Fase 3 usuarios
- ⬜ Fase 4 suppliers
- ⬜ Fase 5 frontend completo
- ⬜ Fase 6 pruebas
- ⬜ Fase 7 entrega final

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
