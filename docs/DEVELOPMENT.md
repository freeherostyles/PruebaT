# Development

## Levantar el proyecto

```bash
cp .env.example .env
docker compose up --build -d
```

Ver estado:

```bash
docker compose ps -a
```

Ver logs:

```bash
docker compose logs --tail=200
```

Detener:

```bash
docker compose down
```

Eliminar volumenes:

```bash
docker compose down -v
```

## Backend

```bash
cd backend
npm run start:dev
npm run build
npm run lint
npm run lint:fix
npm run format
```

## Frontend

```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run lint:fix
npm run format
```

## Migraciones

Ejecutar:

```bash
docker compose exec providers-backend npm run migration:run
```

Generar:

```bash
docker compose exec providers-backend npm run migration:generate -- src/database/migrations/InitialMigration
```

Crear vacia:

```bash
docker compose exec providers-backend npm run migration:create -- src/database/migrations/ManualMigration
```

Revertir:

```bash
docker compose exec providers-backend npm run migration:revert
```

Seed de usuarios:

```bash
docker compose exec providers-backend npm run seed:users
```

El seed es idempotente. Puedes correrlo varias veces y no duplica usuarios.

## Auth

Endpoints:

- `POST /api/auth/login`
- `GET /api/auth/profile`

Usuarios de desarrollo:

- `admin@providers.local`
- `executive@providers.local`

Ejemplo de login:

```bash
curl -X POST http://localhost:3187/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@providers.local","password":"change_admin_password"}'
```

Para usar rutas protegidas desde Swagger:

1. haces login;
2. copias `accessToken`;
3. lo pegas en `Authorize` como `Bearer <token>`.

## Swagger

```text
http://localhost:3187/api/docs
```

## Ramas sugeridas

- `main`
- `feature/<nombre>`
- `fix/<nombre>`
- `docs/<nombre>`

## Commits

Formato sugerido:

```text
tipo: descripcion breve
```

Ejemplos:

```text
feat: add backend health check and Swagger
docs: finalize phase 1 infrastructure and documentation
chore: polish documentation and improve project consistency
```

## Nota local

En este host se valido el proyecto usando el contexto `rootless`.

```bash
docker context use rootless
docker context show
```

En un equipo normal no deberia hacer falta.

## pgAdmin

No se agrego.

Se dejo fuera porque es opcional y no aporta nada al cierre funcional de la Fase 2.
