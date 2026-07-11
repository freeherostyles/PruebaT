# Fase 5A: Listado de Proveedores

## Objetivo

Desarrollar la experiencia de consulta de proveedores con enfoque operativo: listado, filtros, busqueda, detalle y estadisticas.

## Alcance

- DataGrid en desktop
- vista movil adaptada
- filtros por tipo, estado y orden
- busqueda con debounce
- detalle del proveedor
- estadisticas de proveedores

## Resultado

- toolbar de filtros
- cards de estadisticas
- grid desktop y lista movil
- dialog de detalle

## Archivos clave

- `frontend/src/features/suppliers/pages/suppliers-page.tsx`
- `frontend/src/features/suppliers/components/SupplierToolbar.tsx`
- `frontend/src/features/suppliers/components/SupplierGrid.tsx`
- `frontend/src/features/suppliers/components/SupplierMobileList.tsx`
- `frontend/src/features/suppliers/dialogs/supplier-detail-dialog.tsx`
