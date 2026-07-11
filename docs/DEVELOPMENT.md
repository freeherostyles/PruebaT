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

Seed de usuarios:

```bash
docker compose exec providers-backend npm run seed:users
```

Seed de proveedores (10 registros de prueba):

```bash
docker compose exec providers-backend npm run seed:suppliers
```

Ambos seeds son idempotentes.

## Test

Backend unitarios:

```bash
cd backend && npm run test
```

Backend E2e:

```bash
cd backend && npm run test:e2e
```

Frontend:

```bash
cd frontend && npm run test        # una vez
cd frontend && npm run test:watch  # modo watch
```

## Suppliers

Endpoints protegidos por JWT y roles:

| Metodo | Ruta | Roles |
| --- | --- | --- |
| POST | `/api/suppliers` | ADMIN |
| GET | `/api/suppliers` | ADMIN, EXECUTIVE |
| GET | `/api/suppliers/stats` | ADMIN, EXECUTIVE |
| GET | `/api/suppliers/:id` | ADMIN, EXECUTIVE |
| PATCH | `/api/suppliers/:id` | ADMIN |
| PATCH | `/api/suppliers/:id/status` | ADMIN |
| DELETE | `/api/suppliers/:id` | ADMIN |

### Tipos de proveedor

- `PERSONA_FISICA` — requiere firstName, lastName, RFC 13 chars
- `PERSONA_MORAL` — requiere businessName, RFC 12 chars

Estados: `ACTIVE` (default), `INACTIVE`.

### Filtros en listado

`GET /api/suppliers?page=1&limit=10&search=&type=PERSONA_FISICA&status=ACTIVE&sortBy=createdAt&sortOrder=DESC`

Busqueda por RFC, firstName, lastName, secondLastName, businessName, tradeName, email, phone (case-insensitive).

### Strategy Pattern

Cada tipo tiene su propia estrategia de validacion. RFC se valida por formato (13 chars fisica, 12 chars moral), no contra SAT. CURP tambien se valida cuando se proporciona.

### CQRS

Commands: CreateSupplier, UpdateSupplier, ChangeSupplierStatus, DeleteSupplier.
Queries: GetSupplierById, ListSuppliers, GetSupplierStats.

### Soft delete

Los proveedores se eliminan con soft delete (`deleted_at`). Las consultas excluyen eliminados. RFC es unico globalmente incluso entre eliminados.

### Seguridad

- Helmet activado con configuracion por defecto (security headers HTTP)
- Rate limiting global: 60 requests/minuto por IP
- Rate limiting en login: 5 intentos/minuto por IP (proteccion brute-force)
- Swagger desactivado en produccion (`NODE_ENV=production`)
- `JWT_SECRET` es requerido; el proyecto falla al iniciar si no esta definido
- CORS limitado al origen del frontend

### Codigos de respuesta

| Codigo | Significado |
| --- | --- |
| 201 | Creado |
| 200 | OK |
| 204 | Eliminado |
| 400 | Validacion |
| 401 | Sin token |
| 403 | Rol sin permiso |
| 404 | No encontrado |
| 409 | RFC duplicado |
| 429 | Demasiadas solicitudes (rate limit) |

## Proveedores (Frontend)

### Estructura

```
src/features/suppliers/
  api/            # Llamadas a la API (axios)
  components/     # Componentes reutilizables
  config/         # Configuracion de columnas del DataGrid
  dialogs/        # Dialog de detalle
  hooks/          # Hooks de React Query y estado
  pages/          # SuppliersPage (< 150 lineas)
  store/          # Zustand para filtros locales
  types/          # Tipos TypeScript
  utils/          # Query keys centralizadas
```

### Data Grid

Se usa `@mui/x-data-grid` (Community). Caracteristicas:

- Paginacion servidor (page, limit, total)
- Sorting servidor (sortBy, sortOrder)
- PlaceholderData para evitar parpadeo al cambiar pagina
- Skeletons en cards y tabla
- Columnas desacopladas en `config/supplier-columns.tsx`

### Query Keys

Centralizadas en `utils/supplier-query-keys.ts`:

```typescript
supplierKeys.all          // ['suppliers']
supplierKeys.list(filters) // ['suppliers', 'list', { page, limit, ... }]
supplierKeys.detail(id)    // ['suppliers', 'detail', id]
supplierKeys.stats()       // ['suppliers', 'stats']
```

### Filtros

Sincronizados con React Query via Zustand:

- Busqueda con debounce (400ms)
- Tipo (Todos / Persona Fisica / Persona Moral)
- Estado (Todos / Activo / Inactivo)
- Orden (Fecha / RFC, ASC/DESC)
- Boton "Limpiar" cuando hay filtros activos

### Componentes creados

| Componente | Uso |
|---|---|
| `StatusChip` | Estado activo/inactivo |
| `SupplierTypeChip` | Tipo persona fisica/moral |
| `SearchBar` | Input con debounce |
| `LoadingState` | Skeletons para tabla |
| `EmptyState` | Mensaje sin datos |
| `ErrorState` | Error con reintentar |
| `SupplierStatsCards` | 5 cards con metricas |
| `SupplierToolbar` | Filtros + busqueda |
| `SupplierGrid` | DataGrid configurado |
| `ErrorBoundary` | Captura errores de render |

### Roles

- **ADMIN**: CRUD completo (crear, editar, eliminar, cambiar estado, ver detalle)
- **EXECUTIVE**: solo listado y detalle, sin acciones administrativas

### CRUD visual

| Accion | Dialog | Mutation | Endpoint |
|---|---|---|---|
| Crear | `CreateSupplierDialog` | `useCreateSupplier` | POST `/api/suppliers` |
| Editar | `EditSupplierDialog` | `useUpdateSupplier` | PATCH `/api/suppliers/:id` |
| Eliminar | `ConfirmDialog` | `useDeleteSupplier` | DELETE `/api/suppliers/:id` |
| Cambiar estado | `ConfirmDialog` | `useChangeSupplierStatus` | PATCH `/api/suppliers/:id/status` |

### Formulario

Un solo `SupplierForm` reutilizable que renderiza:

- `PhysicalSupplierFields` cuando supplierType = PERSONA_FISICA
- `CompanySupplierFields` cuando supplierType = PERSONA_MORAL

Integrado con React Hook Form (Controller, watch, reset, setValue).

### ConfirmDialog

Componente reutilizable en `shared/components/ConfirmDialog.tsx`.

Props: title, description, confirmLabel, cancelLabel, loading, onConfirm, onCancel.

Se usa para:

- Confirmar eliminacion
- Confirmar cambio de estado
- Confirmar salida del formulario con cambios sin guardar (unsaved changes)

### Toasts

Se usa `notistack` (SnackbarProvider). Mensajes de exito y error en todas las mutations.

Mensajes:

- "Proveedor creado correctamente."
- "Proveedor actualizado correctamente."
- "Proveedor eliminado correctamente."
- "Estado actualizado correctamente."
- "Error al crear/actualizar/eliminar proveedor."

### Componentes compartidos

Movidos a `shared/components/`:

- `StatusChip`
- `LoadingState`
- `EmptyState`
- `ErrorState`
- `ConfirmDialog`

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

## pgAdmin

Herramienta opcional para inspeccionar PostgreSQL.

Iniciar:

```bash
docker compose --profile tools up -d
```

Detener:

```bash
docker compose --profile tools down
```

Acceso:

```text
http://localhost:5057
```

Conexion:

- Host: `providers-postgres`
- Port: `5432`
- Database: `providers_db`
- Username: `providers_user`
- Password: `providers_password`

No es un requisito del proyecto. Solo queda como herramienta de desarrollo.
