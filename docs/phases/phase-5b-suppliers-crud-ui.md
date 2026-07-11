# Fase 5B: CRUD Visual de Proveedores

## Objetivo

Completar la operacion visual de proveedores en frontend respetando permisos por rol y estados de carga/error.

## Alcance

- crear proveedor
- editar proveedor
- eliminar proveedor
- cambiar estatus
- restricciones visuales por perfil

## Resultado

- `CreateSupplierDialog`
- `EditSupplierDialog`
- confirmaciones reutilizables
- acciones administrativas visibles solo para `ADMIN`

## Archivos clave

- `frontend/src/features/suppliers/dialogs/CreateSupplierDialog.tsx`
- `frontend/src/features/suppliers/dialogs/EditSupplierDialog.tsx`
- `frontend/src/features/suppliers/components/SupplierForm.tsx`
- `frontend/src/shared/components/ConfirmDialog.tsx`

## Nota

El formulario existe y funciona como dialogo modal reutilizable, no como ruta independiente.
