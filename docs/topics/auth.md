# Auth

## Resumen

La autenticacion se resolvio con JWT y control de roles fijos (`ADMIN`, `EXECUTIVE`).

## Backend

- `POST /api/auth/login`
- `GET /api/auth/profile`
- `JwtStrategy`
- `JwtAuthGuard`
- `RolesGuard`
- rate limit especifico en login: 5 intentos por minuto

## Frontend

- store de sesion con Zustand
- persistencia de token y usuario
- interceptor de Axios para enviar `Authorization: Bearer <token>`
- redireccion a `/login` al recibir `401`

## Archivos clave

- `backend/src/modules/auth/*`
- `backend/src/common/guards/*`
- `frontend/src/features/auth/*`
- `frontend/src/shared/api/axios-client.ts`

## Pendientes

- no hay refresh token
- el token vive en `localStorage`
