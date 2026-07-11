# Suppliers

## Resumen

Es el modulo principal del sistema. Implementa el ciclo de vida del proveedor tanto en backend como en frontend.

## Backend

- entidad `Supplier`
- commands y queries con CQRS
- validacion por strategy segun `supplierType`
- filtros por `search`, `type`, `status`, `sortBy`, `sortOrder`
- soft delete

## Frontend

- estadisticas
- toolbar de filtros
- vista desktop y vista movil
- detalle
- crear, editar, eliminar, activar y desactivar

## Reglas clave

- `ADMIN` puede modificar
- `EXECUTIVE` solo consulta
- RFC es unico
- persona fisica y persona moral validan distinto

## Archivos clave

- `backend/src/modules/suppliers/*`
- `frontend/src/features/suppliers/*`
