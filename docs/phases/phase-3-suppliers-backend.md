# Fase 3: Suppliers Backend

## Objetivo

Implementar el modulo principal del dominio de proveedores cumpliendo CQRS, Strategy Pattern, validaciones y control por roles.

## Alcance

- CRUD de proveedores
- cambio de estatus
- soft delete
- paginacion, busqueda y filtros
- CQRS real con commands y queries
- Strategy Pattern para persona fisica y persona moral

## Resultado

- `POST /api/suppliers`
- `GET /api/suppliers`
- `GET /api/suppliers/stats`
- `GET /api/suppliers/:id`
- `PATCH /api/suppliers/:id`
- `PATCH /api/suppliers/:id/status`
- `DELETE /api/suppliers/:id`

## Archivos clave

- `backend/src/modules/suppliers/suppliers.controller.ts`
- `backend/src/modules/suppliers/commands/handlers/*`
- `backend/src/modules/suppliers/queries/handlers/*`
- `backend/src/modules/suppliers/strategies/*`
- `backend/src/modules/suppliers/supplier.entity.ts`

## Validacion realizada

- tests unitarios de handlers y strategies
- prueba real de login + endpoints protegidos
- seeds de usuarios y proveedores
