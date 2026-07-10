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
