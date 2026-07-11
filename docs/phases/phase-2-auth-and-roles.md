# Fase 2: Auth y Roles

## Objetivo

Incorporar autenticacion con JWT y autorizacion por roles para separar operaciones administrativas de las consultas ejecutivas.

## Alcance

- login con JWT
- endpoint de perfil autenticado
- usuarios de desarrollo sembrados por seed
- guardas de autenticacion y roles
- roles `ADMIN` y `EXECUTIVE`

## Resultado

- `POST /api/auth/login`
- `GET /api/auth/profile`
- `JwtStrategy`
- `JwtAuthGuard`
- `RolesGuard`
- decorador `@Roles`

## Archivos clave

- `backend/src/modules/auth/auth.controller.ts`
- `backend/src/modules/auth/login.command-handler.ts`
- `backend/src/modules/auth/jwt.strategy.ts`
- `backend/src/common/guards/jwt-auth.guard.ts`
- `backend/src/common/guards/roles.guard.ts`
- `backend/src/common/decorators/roles.decorator.ts`

## Validacion realizada

- login real con usuario `ADMIN`
- login real con usuario `EXECUTIVE`
- restricciones de rol en endpoints protegidos
