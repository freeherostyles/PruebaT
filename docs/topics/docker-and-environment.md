# Docker y Entorno

## Servicios

- `providers-postgres`
- `providers-backend`
- `providers-frontend`
- `providers-pgadmin` opcional

## Flujo principal

1. copiar `.env.example` a `.env`
2. ejecutar `docker compose up --build -d`
3. validar con `docker compose ps -a`

## Comportamiento del backend en Docker

Al iniciar, el backend ejecuta:

- migraciones
- seed de usuarios
- seed de proveedores
- arranque en modo desarrollo

## URLs importantes

- frontend: `http://localhost:4178`
- backend: `http://localhost:3187`
- Swagger: `http://localhost:3187/api/docs`
- pgAdmin: `http://localhost:5057`

## Variables relevantes

- `PORT`
- `FRONTEND_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `VITE_API_URL`
