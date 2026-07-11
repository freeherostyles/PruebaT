# Fase 1: Infraestructura

## Objetivo

Montar la base del proyecto para que backend, frontend y base de datos puedan ejecutarse de forma integrada desde Docker Compose.

## Alcance

- estructura base del repositorio
- backend NestJS
- frontend React con Vite
- PostgreSQL en Docker
- TypeORM con migraciones
- Swagger
- endpoint `/api/health`

## Resultado

- `docker-compose.yml` funcional
- servicios `providers-postgres`, `providers-backend`, `providers-frontend`
- healthchecks operativos
- Swagger disponible en `/api/docs`
- health disponible en `/api/health`

## Archivos clave

- `docker-compose.yml`
- `backend/src/main.ts`
- `backend/src/app.module.ts`
- `backend/src/database/typeorm.config.ts`
- `frontend/src/main.tsx`

## Validacion realizada

- levantamiento con `docker compose up --build -d`
- acceso a frontend, backend y Swagger
- verificacion de salud de PostgreSQL
