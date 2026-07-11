# Frontend

## Stack

- React
- TypeScript
- Vite
- React Router
- Material UI
- React Query
- Zustand

## Estructura

- `app/`: providers, router, layout
- `features/auth/`: login y sesion
- `features/dashboard/`: metricas principales
- `features/suppliers/`: consulta y CRUD visual
- `shared/`: API y componentes reutilizables

## Responsividad

- layout con drawer movil y desktop
- dark mode con persistencia
- login adaptado a movil
- suppliers con lista movil y grid desktop

## Puntos de entrada clave

- `frontend/src/main.tsx`
- `frontend/src/app/router/index.tsx`
- `frontend/src/app/layout/main-layout.tsx`
