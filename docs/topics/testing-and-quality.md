# Testing y Calidad

## Backend

- tests unitarios con Jest
- cobertura sobre auth, roles y suppliers
- e2e presentes en `backend/test/`

## Frontend

- tests con Vitest y Testing Library
- cobertura sobre auth, router, dashboard y suppliers

## Calidad tecnica

- lint en backend y frontend
- build de backend y frontend
- validacion de entrada con `ValidationPipe`
- throttling global y de login

## Comandos utiles

### Backend

```bash
cd backend
npm run lint
npm run build
npm run test
npm run test:e2e
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
npm run test
```
