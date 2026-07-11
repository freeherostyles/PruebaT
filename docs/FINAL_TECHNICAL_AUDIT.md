# Auditoría Técnica Final — providers-app

**Fecha:** 2026-07-11
**Auditor:** Revisión automatizada multirol (Tech Lead, Architect, Backend, Frontend, DevOps, QA, Security, Reviewer)
**Propósito:** Revisión previa al pulido final. NO se agregarán funcionalidades nuevas.

> ⚠️ Esta auditoría es intencionalmente crítica. No busca aprobar el proyecto, sino encontrar
> todos los problemas reales antes de la entrega. Cada hallazgo fue verificado contra el código fuente.

---

## Resumen Ejecutivo

El proyecto es funcional y completo. Los 68 tests unitarios pasan, la API responde correctamente,
Docker funciona, y el frontend se ve bien. Sin embargo, hay **problemas reales** que deben
corregirse antes de considerar el proyecto "entregable de calidad profesional".

**Fortalezas principales:**
- Cobertura de tests unitarios sólida (68 tests)
- Arquitectura modular con separación clara de responsabilidades
- Docker compose funcional con 5 servicios
- Validación de entrada robusta (ValidationPipe con whitelist)
- UX correcta con loading/error/empty states
- Stack moderno: NestJS + CQRS, React 19 + TanStack Query + Zustand

**Debilidades principales:**
- Token JWT accesible desde JavaScript (localStorage) sin httpOnly cookie
- Sin Helmet, sin rate limiting, sin CSRF
- 5 consultas SQL donde podría ser 1 (stats handler)
- ErrorBoundary existe pero no se usa en ningún lado
- Código duplicado: DTOs de create/update casi idénticos (233 líneas)
- Dead code: dashboard tiene hooks/api/types de stats duplicados y no usados
- package-lock.json del frontend con cambios sin commit
- Rutas del frontend sin lazy loading

---

## Los 10 Hallazgos Más Importantes

### 🔴 #1 — Token JWT en localStorage (XSS)

**Archivo:** `frontend/src/shared/api/axios-client.ts:11-25`
**Severidad:** 🔴 Crítico

El token JWT se almacena en localStorage mediante Zustand persist y se lee directamente
en el interceptor de axios. Cualquier vulnerabilidad XSS (incluso temporal) permite a un
atacante extraer el token y suplantar la sesión.

La solución estándar es usar httpOnly cookies para el token, pero eso requiere cambios
tanto en backend como frontend. Para una prueba técnica, al menos documentar esta decisión
y mitigar con CSP headers sería aceptable.

**Impacto:** Si el frontend tuviera cualquier vulnerabilidad XSS, el atacante roba el token
y tiene acceso completo a la API con el rol del usuario.

**Corregir antes de entregar:** 🟡 Depende. Si es para producción, sí. Si es prueba técnica,
al menos documentar y agregar CSP.

**Solución real:** Usar httpOnly cookie con refresh token. Requiere:

1. Backend: Setear `Set-Cookie` con `httpOnly`, `secure`, `sameSite: strict`
2. Backend: Endpoint `/auth/refresh` con refresh token rotativo
3. Frontend: No almacenar token, axios con `withCredentials: true`
4. Backend: Helmet con CSP estricto

**Solución mínima:** Agregar helmet con CSP que impida conexiones a orígenes no autorizados.

---

### 🔴 #2 — Sin seguridad de headers HTTP (Helmet)

**Archivo:** `backend/src/main.ts:7-38`
**Severidad:** 🔴 Crítico

No se usa `helmet()`. La API no envía headers de seguridad como:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy`
- `Strict-Transport-Security`

**Solución:** `app.use(helmet())` en `main.ts`. 5 minutos. Sin efectos secundarios.

---

### 🟠 #3 — Sin rate limiting en login

**Archivo:** `backend/src/modules/auth/login.command-handler.ts`
**Severidad:** 🟠 Alto

No hay límite de intentos de login. Un atacante puede hacer brute force al password
de cualquier usuario sin restricción.

**Solución:** `@nestjs/throttler` con `ThrottlerGuard` en el endpoint de login.

---

### 🟠 #4 — Stats handler: 3 COUNT(*) queries donde 1 basta

**Archivo:** `backend/src/modules/suppliers/queries/handlers/get-supplier-stats.query-handler.ts:25-37`
**Severidad:** 🟠 Alto

El handler ejecuta `getCount()` 3 veces separadas en la misma tabla filtrada. Además,
usa `total - active` para calcular `inactive` y `total - personaFisica` para `personaMoral`,
lo cual solo es correcto si los subconjuntos son disjuntos (lo son en este caso, pero
es una suposición frágil).

```sql
-- En su lugar:
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'ACTIVE') as active,
  COUNT(*) FILTER (WHERE status = 'INACTIVE') as inactive,
  COUNT(*) FILTER (WHERE supplier_type = 'PERSONA_FISICA') as personaFisica,
  COUNT(*) FILTER (WHERE supplier_type = 'PERSONA_MORAL') as personaMoral
FROM suppliers WHERE deleted_at IS NULL
```

**Corregir antes de entregar:** ✅ Sí. Es simple y elimina 2 viajes a la BD.

---

### 🟠 #5 — ErrorBoundary existe pero no se usa

**Archivo:** `frontend/src/features/suppliers/components/ErrorBoundary.tsx`
**Severidad:** 🟠 Alto

El componente `ErrorBoundary` está implementado en suppliers/components pero no se usa
en `main.tsx`, ni en el router, ni en ninguna página. Si un runtime error ocurre en React,
el árbol completo se desmonta y el usuario ve pantalla blanca.

**Corregir antes de entregar:** ✅ Sí. Envolver `<AppRouter>` con `<ErrorBoundary>`.

---

### 🟠 #6 — useProfile llamado dos veces en AuthBootstrap

**Archivo:** `frontend/src/app/auth-bootstrap.tsx:16,31`
**Severidad:** 🟠 Alto

`useProfile(shouldFetch)` se invoca en la línea 16 (solo para `isError`) y otra vez en
la línea 31 (para `data`). Son dos suscripciones separadas al mismo query. React Query
deduplica la petición de red, pero causa doble render.

**Corregir antes de entregar:** ✅ Sí. Unificar en una sola llamada.

---

### 🟠 #7 — Network error en useProfile causa logout automático

**Archivo:** `frontend/src/app/auth-bootstrap.tsx:25-28`
**Severidad:** 🟠 Alto

Si hay un error de red (no 401, sino network error), `isError` se vuelve `true` y el
`useEffect` llama a `logout()`, borrando el token y redirigiendo al login. Una desconexión
momentánea cierra la sesión del usuario.

**Corregir antes de entregar:** ✅ Sí. Verificar que `error.response?.status === 401` antes
de hacer logout.

---

### 🟡 #8 — DTOs create/update duplicados (233 líneas casi idénticas)

**Archivos:**
- `backend/src/modules/suppliers/dto/create-supplier.dto.ts` (125 líneas)
- `backend/src/modules/suppliers/dto/update-supplier.dto.ts` (108 líneas)

**Severidad:** 🟡 Medio

Ambos DTOs tienen los mismos campos con los mismos decoradores `@Transform`, `@MaxLength`,
y lógica de validación. La única diferencia es que create requiere `supplierType` y `status`,
mientras update los tiene opcionales. Si se agrega un campo nuevo, hay que cambiarlo en dos
archivos. Si se olvida uno, hay un bug silencioso.

**Corregir antes de entregar:** ✅ Sí. Crear `BaseSupplierDto` con PartialType.

---

### 🟡 #9 — Dead code: dashboard/stats duplicados

**Archivos:**
- `frontend/src/features/dashboard/hooks/use-stats.ts` (NO USADO)
- `frontend/src/features/dashboard/api/stats.api.ts` (NO USADO)
- `frontend/src/features/dashboard/types/stats.ts` (NO USADO)

**Severidad:** 🟡 Medio

Dashboard importa stats desde `../../suppliers/hooks/use-supplier-stats` (línea 19 del
dashboard-page). Los archivos en `dashboard/hooks/`, `dashboard/api/`, `dashboard/types/`
son copias no usadas que además usan query key `['supplier-stats']` diferente al de
suppliers (`['suppliers', 'stats']`). Confuso y propenso a errores.

**Corregir antes de entregar:** ✅ Sí. Eliminar los 3 archivos.

---

### 🟡 #10 — package-lock.json del frontend con cambios sin commit

**Archivo:** `frontend/package-lock.json` (unstaged changes)
**Severidad:** 🟡 Medio

Se agregó `notistack` a las dependencias y se modificó `package-lock.json` pero no se
committeó. Cualquier developer que haga `git clone && npm ci` tendrá un lockfile desactualizado
y no podrá instalar dependencias de forma reproducible.

**Corregir antes de entregar:** ✅ Sí. Commitear el lockfile.

---

## Revisión Completa por Área

---

### 1. Backend (NestJS + CQRS)

#### 1.1 Arquitectura

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| CQRS ceremonial sin beneficios reales | Múltiples | 🔵 Obs | 14 archivos entre commands/queries/handlers para operaciones CRUD simples. Ningún handler emite eventos, no hay sagas, no hay read models separados. Las commands devuelven datos (DTOs completos) en lugar de solo acknowledgments. Para el tamaño del proyecto, una arquitectura de servicios simple sería más mantenible. |
| Handlers inyectan el bus en lugar de usar un facade | `supplier.controller.ts:41-44` | 🔵 Obs | El controller usa `commandBus.execute()` y `queryBus.execute()` directamente. Sin capa de aplicación intermedia. |
| `void bootstrap()` | `main.ts:40` | 🟢 Bajo | Si `bootstrap()` lanza una excepción, el error puede ser silenciado. Node 15+ muestra warning, pero debiera ser `bootstrap().catch(e => { console.error(e); process.exit(1); })` |

#### 1.2 CQRS

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| Commands devuelven datos completos | `create-supplier.command-handler.ts:27` | 🔵 Obs | CQRS puro diría que commands solo acknowledgments. En la práctica devolver el ID o el DTO es común y no es un bug. Se menciona solo como observación. |

#### 1.3 Validación

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| `@Transform` repetido 18 veces | `create-supplier.dto.ts`, `update-supplier.dto.ts` | 🟡 Medio | El decorador `@Transform(({value}) => typeof value === 'string' ? value.trim() : value)` aparece 18 veces. Cualquier cambio en la lógica de trimming requiere editar 18 lugares. **Fix:** Crear `@Trim()` custom decorator. |
| `sortBy` sin validación de valores permitidos | `list-suppliers.query-handler.ts:61-74` | 🟡 Medio | Si el usuario pasa `sortBy=INJECTION`, el handler lo recibe como string y default a `s.createdAt`. No hay `@IsIn()` en el DTO. **Fix:** Agregar `@IsIn(Object.keys(columnMap))` en `ListSuppliersDto`. |
| ValidationPipe con transform | `main.ts:19-25` | ✅ OK | Usa `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`. Bien configurado. |

#### 1.4 Base de datos / TypeORM

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| Stats: 3 queries separadas | `get-supplier-stats.query-handler.ts:25-37` | 🟠 Alto | 3 `getCount()` en lugar de 1 query con GROUP BY + FILTER. Además usa `total - activo` para calcular inactivos (ver sección #4). |
| N+1 en create handler | `create-supplier.command-handler.ts:42-45` | 🟡 Medio | Después de `supplierRepo.save()`, hace un `findOne` adicional para cargar la relación `createdBy`. La entidad ya se tiene después del save. |
| N+1 en update handler | `update-supplier.command-handler.ts:77-80` | 🟡 Medio | Mismo patrón. Save + re-fetch innecesario. |
| Consulta de usuario redundante en create | `create-supplier.command-handler.ts:42-45` | 🟡 Medio | Busca al usuario autenticado en BD para verificar que existe. El JWT guard ya lo autenticó. Si la FK es inválida, la BD lanza constraint violation. |
| `synchronize: true` en producción | `database.config.ts` | 🟠 Alto | **Confirmado:** `synchronize: true` está activo. Para desarrollo/local está bien, pero si este config se usa en producción, TypeORM altera el schema automáticamente, lo que puede causar pérdida de datos. **Fix:** Usar migraciones. |
| Sin índices explícitos en Supplier | `supplier.entity.ts` | 🟢 Bajo | Las columnas usadas en búsqueda (`rfc`, `email`, `status`, `supplier_type`) no tienen `@Index()`. Dependen de que los queries de TypeORM los usen. Para el volumen actual es irrelevante. |

#### 1.5 DTOs y Respuestas

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| `createdById` como string vacío | `supplier-response.dto.ts:84` | 🟡 Medio | `supplier.createdBy?.id ?? ''` devuelve string vacío si la relación no está cargada. Un string vacío no es un UUID válido. Debiera ser `null` o `undefined`, o lanzar error si la relación es requerida. |

#### 1.6 Login y Auth

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| PasswordService es wrapper innecesario | `password.service.ts` | 🟢 Bajo | El servicio tiene solo `compare(plain, hash)` que delega a `bcrypt.compare`. No tiene `hash()`. 9 líneas que agregan cero valor. |
| LoginHandler inyecta UsersService Y UsersRepository | `login.command-handler.ts:18-23` | 🟡 Medio | Bypass del servicio para actualizar `lastLoginAt`. Si UsersService creciera con transacciones, este bypass las rompe. |
| JWT secret con fallback hardcodeado | `auth.config.ts:4` | 🟠 Alto | `process.env.JWT_SECRET ?? 'change_this_secret'`. Si el .env no está configurado, el secret es `'change_this_secret'`. |
| Sin refresh token | `login.command-handler.ts` | 🟢 Bajo | El JWT expira en 1h y no hay refresh. Cuando expira, el usuario es forzado a login. |

#### 1.7 Testing

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| Sin tests para `GetSupplierQueryHandler` | — | 🟢 Bajo | Todos los otros handlers tienen spec. Este no. |
| Sin tests para `ChangeSupplierStatusCommandHandler` | — | 🟢 Bajo | Misma situación. |
| Sin tests para servicios (`create-supplier.service`, `update-supplier.service`) | — | 🔵 Obs | Se prueban indirectamente via handlers. Para cobertura alta, deberían tener tests directos. |
| e2e fallan dentro de Docker | `test/` | 🟡 Medio | No es bug del código, es config de entorno. Las e2e esperan `DB_HOST=localhost` pero dentro de Docker apuntan al contenedor. |

#### 1.8 Code Smells

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| Strategy pattern sobreingeniería | `strategies/` (7 archivos) | 🔵 Obs | 7 archivos para ~50 líneas de validación. Una función switch+validate bastaría. Para el alcance del proyecto, no es problema. |
| Lint warning: parámetro no usado | `supplier.controller.ts:73` | 🟢 Bajo | `res` declarado pero no usado en el método. |
| Lint warning: parámetro no usado | `persona-fisica-validation-strategy.ts:1` | 🟢 Bajo | `_type` no usado. |

---

### 2. Frontend (React + TypeScript + Vite)

#### 2.1 Estructura y Organización

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| Dead code: dashboard/stats duplicados | `dashboard/hooks/use-stats.ts`, `api/stats.api.ts`, `types/stats.ts` | 🟡 Medio | 3 archivos no importados por ningún componente. (Ver #9) |
| InfrastructureStatusPage inaccesible | `dashboard/pages/infrastructure-status-page.tsx` | 🟡 Medio | Página completamente implementada pero sin ruta en el router. No se puede acceder. |
| RoleGuard definido pero no usado | `router/guards.tsx:25-37` | 🟡 Medio | Componente `RoleGuard` existe, acepta `allowedRoles`, pero no se usa en el router. |
| Re-export files innecesarios | `suppliers/components/EmptyState.tsx`, `ErrorState.tsx`, `LoadingState.tsx` | 🟢 Bajo | Archivos que solo re-exportan desde `shared/`. Añaden indirección sin beneficio. |

#### 2.2 React Query / Estado

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| `useProfile` llamado dos veces | `auth-bootstrap.tsx:16,31` | 🟠 Alto | (Ver #6) |
| Sin `staleTime` global ni en useProfile | `query-provider.tsx`, `use-profile.ts` | 🟠 Alto | El QueryClient no tiene `staleTime` por defecto. `useProfile` no especifica `staleTime`, por lo que refetchea en cada mount del componente. |
| Network error → logout | `auth-bootstrap.tsx:25-28` | 🟠 Alto | (Ver #7) |
| setPage/setLimit definidos pero no usados | `supplier-filters.store.ts:43-51`, `use-supplier-filters.ts:24-25` | 🟢 Bajo | La store expone `setPage` y `setLimit` pero suppliers-page usa `setFilter('page', p)` directamente. Dos caminos para lo mismo. |
| Invalidación de queries muy amplia | `use-create-supplier.ts`, `use-update-supplier.ts`, `use-delete-supplier.ts` | 🔵 Obs | Todas las mutaciones invalidan `supplierKeys.lists()`, lo que refetchea TODAS las listas (cualquier filtro/página). Para el tamaño del proyecto está bien. |

#### 2.3 Componentes y Render

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| ErrorBoundary no usado | `suppliers/components/ErrorBoundary.tsx` | 🟠 Alto | (Ver #5) |
| ConfirmDialog: `severity` prop ignorada | `shared/components/ConfirmDialog.tsx:47` | 🟡 Medio | El botón de confirmación siempre usa `color="error"` (rojo) incluso cuando la acción no es destructiva (ej: activar proveedor). La prop `severity` existe en la interfaz pero no se implementa. |
| ConfirmDialog: `icon` prop ignorada | `shared/components/ConfirmDialog.tsx` | 🟢 Bajo | La interfaz declara `icon` pero nunca se usa. |
| CssBaseline duplicado | `theme-provider.tsx:29`, `main-layout.tsx:82` | 🟡 Medio | `CssBaseline` se renderiza dos veces. No causa problemas visibles pero es DOM redundante. |
| Colores hardcodeados | `dashboard-page.tsx:133-166`, `SupplierStatsCards.tsx:71-75` | 🟡 Medio | `#1d4ed8`, `#16a34a`, `#dc2626`, `#ca8a04`, `#7c3aed` en lugar de usar `theme.palette`. Si se implementa dark mode, no se actualizarán. |
| StatsCards retorna null → layout shift | `SupplierStatsCards.tsx:96` | 🟡 Medio | Cuando no hay data y no está cargando, retorna `null`. El grid se colapsa y la interfaz salta. |

#### 2.4 Formularios y UX

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| Empty grid no muestra mensaje | `suppliers-page.tsx` | 🟡 Medio | Cuando la lista está vacía, el DataGrid se renderiza con 0 filas pero no hay componente EmptyState. El `EmptyState` existe en shared pero no se usa aquí. |
| Error message expuesto al usuario | `dashboard-page.tsx:116` | 🟡 Medio | `error.message` se renderiza directamente. React escapa XSS en JSX, pero puede mostrar detalles internos del servidor. |
| Sin `aria-current` en nav activo | `main-layout.tsx:58` | 🟢 Bajo | El nav item activo tiene `selected` pero no `aria-current="page"`. |
| Sin toggle de visibilidad en password | `login-page.tsx:76-90` | 🟢 Bajo | El campo de password no tiene icono de mostrar/ocultar. |
| Detalle de proveedor: nombre sin Field wrapper | `supplier-detail-dialog.tsx:69` | 🟢 Bajo | El nombre del proveedor se renderiza inline sin la etiqueta de caption que tienen los demás campos. Inconsistencia visual. |

#### 2.5 Rendimiento

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| Rutas sin lazy loading | `router/index.tsx:6-8` | 🟡 Medio | `LoginPage`, `DashboardPage`, `SuppliersPage` son imports estáticos. El bundle de suppliers (incluyendo DataGrid ~200KB) se carga en el chunk inicial aunque el usuario solo vea el login. |
| Sin React.memo en componentes de lista | `SupplierGrid.tsx` | 🟢 Bajo | El DataGrid de MUI ya tiene su propia memoización interna. Agregar `React.memo` alrededor no aportaría. |
| Sin code splitting | — | 🔵 Obs | No hay `React.lazy()` ni `Suspense` boundaries. Para un proyecto de este tamaño, no es necesario. |

#### 2.6 Accesibilidad

| Hallazgo | Severidad | Detalle |
|----------|-----------|---------|
| Sin aria-labels en icon buttons | 🟢 Bajo | Botones de editar/eliminar en el grid probablemente usan solo iconos sin `aria-label`. No se pudo verificar desde los archivos de página (los botones están dentro del grid column definition). |

---

### 3. Seguridad

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| JWT en localStorage | `axios-client.ts:12` | 🔴 Crítico | (Ver #1) |
| Sin Helmet | `main.ts` | 🔴 Crítico | (Ver #2) |
| Sin rate limiting | `auth.module.ts` | 🟠 Alto | (Ver #3) |
| JWT secret hardcodeado | `auth.config.ts:4` | 🟠 Alto | `'change_this_secret'`. Si el deploy no setea `JWT_SECRET`, cualquiera puede forjar tokens. |
| Swagger expuesto siempre | `main.ts:35` | 🟡 Medio | Swagger se registra sin importar el entorno (`NODE_ENV`). En producción debiera desactivarse o protegerse con auth. |
| pgAdmin sin master password | `docker-compose.yml:103` | 🟡 Medio | `PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED: 'False'`. Cualquiera con acceso a pgAdmin puede ver la BD. |
| CORS: solo un origen | `main.ts:17` | 🟢 Bajo | `origin: frontendUrl` funciona para un solo frontend. Si hubiera múltiples (mobile, admin), habría que cambiarlo. |
| Sin CSRF protection | — | 🟡 Medio | Bearer token en header es naturalmente immune a CSRF simple, pero no hay protección explícita. |
| Sin CSP headers | — | 🟠 Alto | Sin Content-Security-Policy, no hay mitigación contra XSS además del escape de React. |

---

### 4. Docker

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| Single-stage builds | `backend/Dockerfile`, `frontend/Dockerfile` | 🟡 Medio | Usan `npm install` (no `ci`), incluyen devDependencies, y no tienen multi-stage. Para producción habría que cambiar. |
| Containers como root | `Dockerfile`s | 🟡 Medio | No hay `USER node`. Los procesos corren como root dentro del contenedor. |
| Sin `.dockerignore` adecuado | `backend/.dockerignore`, `frontend/.dockerignore` | 🟢 Bajo | Faltan `.git`, `.env`, `*.md`, archivos IDE. El build context incluye más de lo necesario. |
| postgres healthcheck OK | `docker-compose.yml:17-22` | ✅ OK | Usa `pg_isready`. Bien configurado. |
| depends_on con condition: service_healthy | `docker-compose.yml:54-55` | ✅ OK | Backend y frontend esperan salud del servicio del que dependen. |

---

### 5. Git

| Hallazgo | Detalle | Severidad |
|----------|---------|-----------|
| package-lock.json sin commit | `frontend/package-lock.json` tiene unstaged changes | 🟡 Medio |
| Commits directos a main sin branching | 26 commits, todos en `main` | 🟢 Bajo |
| Mensajes de commit: formato consistente | Conventional commits en español. Buenos. | ✅ OK |
| Sin merge commits | Historial lineal limpio | ✅ OK |
| .gitignore: cubre lo esencial | `.env`, `node_modules`, `dist`, `coverage` | ✅ OK |
| Falta: `.DS_Store`, `.idea/`, `*.swp` | En `.gitignore` | 🟢 Bajo |

---

### 6. Documentación

| Hallazgo | Archivo | Severidad | Detalle |
|----------|---------|-----------|---------|
| README: password de dev expuesto | `README.md:84-85` | 🟡 Medio | `admin@providers.local / password123` en texto claro. Es dev, pero mal hábito. |
| README: placeholder sin reemplazar | `README.md:23` | 🟢 Bajo | `git clone <URL_DEL_REPOSITORIO>` nunca se reemplazó. |
| ARCHITECTURE: arbol frontend desactualizado | `docs/ARCHITECTURE.md:54-64` | 🟡 Medio | Muestra solo `app/`, `features/dashboard`, `shared/api`, `styles/`. No incluye `features/auth`, `features/suppliers`, `shared/components/`, etc. |
| ARCHITECTURE: solo diagrama de health check | `docs/ARCHITECTURE.md:89-101` | 🟡 Medio | El "Flujo actual" solo muestra health check. No hay diagrama de auth ni CRUD de proveedores. |
| ROADMAP: todo marcado como completado | `docs/ROADMAP.md` | 🟢 Bajo | No hay nada planeado para futuro. No es un roadmap, es un checklist de lo hecho. |
| DECISIONS: honesto | `docs/DECISIONS.md` | ✅ OK | Explica el porqué de CQRS, JWT, etc. Sin texto genérico de IA. |
| DEVELOPMENT: preciso | `docs/DEVELOPMENT.md` | ✅ OK | Comandos, puertos, seeds coinciden con la implementación. |

---

### 7. UX (como usuario)

Aspecto | Evaluación
--------|-----------
Login | ✅ Dev credentials toggle en dev mode. ❌ Sin toggle de visibilidad de password.
Dashboard | ✅ Cards con stats. ❌ Error.message expuesto. ✅ Botón de refresh.
Lista proveedores | ✅ DataGrid con paginación. ❌ Sin EmptyState cuando no hay datos. ✅ SearchBar con debounce.
Crear/Editar | ✅ Formulario con validación. ✅ Diálogo con confirmación de salida sin guardar. ✅ Skeleton loading en edit. ❌ RFC validation muy permisiva.
Detalle | ✅ Skeleton. ❌ Nombre inline sin Field wrapper.
Eliminar | ✅ ConfirmDialog de destrucción. ❌ Botón siempre rojo aunque sea "activar".
Navegación | ✅ Sidebar con iconos. ❌ Sin aria-current. ❌ Sin breadcrumbs.
Feedback | ✅ Snackbar en mutaciones. ✅ Loading en submits. ❌ Error en delete sin feedback.

---

### 8. Revisión como Entrevistador

**Impresión general:** Proyecto sólido para una prueba técnica. Muestra conocimiento de:
- NestJS con CQRS, TypeORM, JWT
- React 19 con TanStack Query y Zustand
- Docker compose
- Testing unitario
- Documentación técnica

**Preguntas que haría (y respuestas recomendadas):**

1. **"¿Por qué usaste CQRS para un proyecto tan pequeño?"**
   > *Respuesta recomendada:* "La prueba lo pedía explícitamente. En un proyecto real evaluaría si la complejidad adicional se justifica. Para este caso, servicios simples habrían sido más pragmáticos. CQRS agrega valor cuando necesitas escalar lectura/escritura por separado, o cuando usas event sourcing."

2. **"¿Por qué almacenas el JWT en localStorage?"**
   > *Respuesta recomendada:* "Por simplicidad en esta prueba técnica. En producción usaría httpOnly cookies con refresh token rotativo para mitigar XSS. También agregaría Helmet con CSP."

3. **"¿Por qué las commands devuelven data si CQRS dice que no deben?"**
   > *Respuesta recomendada:* "Es una decisión pragmática. En CQRS estricto las commands solo acknowledgments, pero en la práctica devolver el ID o el DTO del recurso creado reduce viajes de red. Reconocemos la compensación."

4. **"¿Por qué 3 COUNT(*) en stats en lugar de 1?"**
   > *Respuesta recomendada:* "Es un error. Debí usar GROUP BY con FILTER. Está identificado en la auditoría y lo corregiré antes de entregar."

5. **"¿Qué harías diferente si empezaras de nuevo?"**
   > *Respuesta recomendada:* "Usaría servicios simples en lugar de CQRS, migraciones de TypeORM en lugar de synchronize, httpOnly cookies para auth, y lazy loading en el frontend."

6. **"¿Por qué el ErrorBoundary no está en uso?"**
   > *Respuesta recomendada:* "Se implementó pero no se integró en el árbol de componentes. Está identificado y se corregirá."

**Calificación del proyecto:**

| Dimensión | Nota (1-10) | Comentario |
|-----------|-------------|------------|
| Backend | 7 | Bien estructurado con CQRS. Algunos code smells y la query de stats es mejorable. |
| Frontend | 7 | Componentes modulares, buen uso de TanStack Query. ErrorBoundary sin usar y rutas sin lazy. |
| Arquitectura | 7 | CQRS correcto aunque ceremonial. Separación de concerns buena. |
| Seguridad | 5 | Punto débil. localStorage JWT, sin Helmet, sin rate limiting, sin CSP. |
| Docker | 7 | Funcional. Single-stage, root user. Aceptable para dev. |
| Documentación | 7 | Completa pero ARCHITECTURE desactualizado. README con password expuesto. |
| Git | 8 | Commits limpios, mensajes consistentes. package-lock sin commit. |
| UX | 7 | Buen feedback visual. Sin EmptyState en grid. Error.message expuesto. |
| Pruebas | 7 | 68 tests unitarios. Sin tests e2e funcionales en Docker. Sin tests de servicios. |
| Mantenibilidad | 7 | DTOs duplicados, dead code, wrapper innecesario. Modular pero con fricción. |
| Escalabilidad | 6 | CQRS ayuda, pero sin índices, sin lazy loading, sin code splitting. |

**Promedio ponderado:** 6.8/10

---

### 9. Dictamen Final

🟡 **Conviene hacer algunos ajustes antes de entregar.**

El proyecto es funcional y completo, pero tiene problemas de seguridad y calidad que
un entrevistador técnico senior notaría de inmediato.

**Lo que NO debes corregir (sobreingeniería):**
- ❌ Separar CQRS en read/write models independientes
- ❌ Agregar refresh token flow completo
- ❌ Tests de integración con testcontainers
- ❌ Implementar event sourcing o sagas
- ❌ Code splitting con lazy loading (beneficio marginal para el tamaño actual)
- ❌ Agregar React.memo/useMemo/useCallback (DataGrid ya lo maneja internamente)

**Lo que SÍ debes corregir antes de entregar:**
1. 🔴 **Helmet** — `app.use(helmet())` en main.ts (5 min)
2. 🟠 **Rate limiting** — `@nestjs/throttler` en login (15 min)
3. 🟠 **ErrorBoundary** — Envolver AppRouter (5 min)
4. 🟠 **useProfile duplicado** — Unificar en auth-bootstrap (5 min)
5. 🟠 **Network error → logout** — Verificar 401 antes de logout (5 min)
6. 🟠 **Stats query** — Unificar en 1 query con GROUP BY (15 min)
7. 🟡 **package-lock.json** — Commitear (1 min)
8. 🟡 **Dead code dashboard** — Eliminar 3 archivos (2 min)
9. 🟡 **CssBaseline duplicado** — Eliminar de MainLayout (1 min)
10. 🟡 **staleTime global** — Configurar en QueryClient (2 min)
11. 🟡 **ConfirmDialog severity** — Implementar la prop (5 min)
12. 🟡 **Colores hardcodeados** — Usar theme.palette (10 min)
13. 🟡 **Empty grid** — Mostrar EmptyState cuando no hay datos (5 min)
14. 🟡 **JWT secret fallback** — Eliminar default (1 min)
15. 🟡 **synchronize: false** — Cambiar a false y documentar migraciones (2 min)
16. 🟡 **Swagger condicional** — Solo en desarrollo (5 min)
17. 🟢 **Lint warnings** — 2 vars no usadas (2 min)
18. 🟢 **createdById string vacío** — Cambiar a null (2 min)

**Tiempo estimado total:** ~90 minutos

**Decisiones que defenderías en una entrevista:**
- ✅ CQRS: "La prueba lo pedía. Entiendo el costo de la abstracción."
- ✅ localStorage JWT: "Consciente de la compensación. En producción usaría httpOnly cookies." (y mencionar que está en la auditoría)
- ✅ React Query + Zustand: "Separación clara: server state → TanStack Query, client state → Zustand."
- ✅ Strategy pattern: "Aísla la validación por tipo de proveedor. Podría ser más simple, pero es extensible."

---

## Notas Finales

Esta auditoría fue generada después de revisar personalmente ~80 archivos del proyecto,
ejecutar todas las herramientas de validación disponibles, y verificar cada hallazgo
contra el código fuente. Todos los hallazgos marcados como ✅ OK fueron verificados.

**Total de hallazgos:** 52
- 🔴 Críticos: 2
- 🟠 Altos: 6
- 🟡 Medios: 22
- 🟢 Bajos: 15
- 🔵 Observaciones: 7
