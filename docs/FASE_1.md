# Fase 1

## Alcance

- estructura base del repo
- backend NestJS
- frontend React
- PostgreSQL
- Docker Compose
- TypeORM con migraciones
- Swagger
- endpoint `/api/health`
- lint, format y build

## Lo que quedo montado

### Infraestructura

- `docker-compose.yml` en la raiz
- servicios `providers-postgres`, `providers-backend`, `providers-frontend`
- red `providers-network`
- volumen `providers-postgres-data`
- volumenes separados para `node_modules`

### Backend

- `ConfigModule`
- validacion de entorno
- `TypeOrmModule`
- `ValidationPipe` global
- CORS con `FRONTEND_URL`
- Swagger en `/api/docs`
- healthcheck en `/api/health`

### Frontend

- Vite en `4178`
- React Router
- React Query
- Material UI
- Axios centralizado
- pantalla temporal para verificar backend y base de datos

## Base de datos

PostgreSQL configurado con:

- `providers_db`
- `providers_user`
- `providers_password`
- healthcheck con `pg_isready`

## Variables de entorno

Las variables viven en `.env` y `.env.example` en la raiz.

Principales:

- `PORT`
- `FRONTEND_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `VITE_API_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

## Validaciones hechas

- `npm run lint` y `npm run build` en backend
- `npm run lint` y `npm run build` en frontend
- `docker compose up --build -d`
- healthchecks de los tres servicios
- `GET /api/health`
- `GET /api/docs`
- carga del frontend en `http://localhost:4178`

## Problema encontrado durante el desarrollo

El daemon Docker principal del host tenia un problema con el image store. Las imagenes se descargaban o se construian, pero no siempre quedaban resolubles por tag.

Para aislar el proyecto y terminar la validacion se uso Docker Rootless solo en este entorno local.

Puntos importantes:

- la arquitectura no se modifico por ese problema
- el proyecto sigue pensado para correr con Docker Compose normal
- Docker Rootless no es un requisito en otros equipos

## Resultado

✅ Fase 1 cerrada y validada.
