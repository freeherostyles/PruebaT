# Decisions

## NestJS

Se eligio porque da una base modular bastante clara y encaja bien con TypeScript, Swagger, ConfigModule y TypeORM.

Ventaja:
- ordena bien el backend

Costo:
- si no se cuida, invita a meter mas capas de las necesarias

## PostgreSQL

Buena opcion para un sistema administrativo con datos estructurados y reglas claras.

Ventaja:
- integridad de datos

Costo:
- menos flexible que una base documental para esquemas muy cambiantes

## TypeORM

Va alineado con la prueba y con NestJS. Se dejo listo para trabajar con migraciones desde el principio.

Ventaja:
- integracion rapida

Costo:
- hay que evitar que el ORM termine empujando el diseño del dominio

## React

Es el stack esperado para el frontend de la prueba y combina bien con Vite para desarrollo rapido.

Ventaja:
- ecosistema conocido

Costo:
- sin una estructura por features se desordena facil

## React Query

Se eligio para datos del servidor. Evita meter fetch manual y cache casero en cada pantalla.

Ventaja:
- estado remoto bien resuelto

Costo:
- agrega una capa mas si la app fuera minima

## Zustand

Queda reservado para sesion y UI ligera. No para reemplazar React Query.

Ventaja:
- simple y liviano

Costo:
- mal usado puede duplicar estado remoto

## Docker Compose

Se uso como punto unico de arranque. Era la forma mas directa de dejar frontend, backend y base corriendo juntos.

Ventaja:
- onboarding simple

Costo:
- depende bastante de la salud del daemon local

## CQRS

Se va a usar porque la prueba lo pide y tiene sentido en el modulo de proveedores.

Ventaja:
- deja mas claro que es lectura y que es escritura

Costo:
- si se aplica demasiado pronto, mete complejidad sin beneficio real

## Strategy Pattern

Se reserva para validar proveedores por tipo.

Ventaja:
- evita condicionales repartidos por todos lados

Costo:
- no aporta nada si el comportamiento fuera unico

## Una sola tabla `suppliers`

Se eligio por alcance. Para esta prueba es mas simple y mas facil de explicar que dividir en varias tablas desde el inicio.

Ventaja:
- menos complejidad inicial

Costo:
- algunos campos van a quedar `nullable`

## Roles como enum

Los roles son fijos en la prueba, asi que no hace falta una tabla de roles dinamicos.

Ventaja:
- menos infraestructura

Costo:
- menos flexible si mas adelante se quisiera administrar permisos desde base de datos

## Docker Rootless en este entorno

Se uso solo porque el daemon principal del host tenia un problema con el image store.

Ventaja:
- permitio validar el proyecto sin tocar recursos ajenos del host

Costo:
- es una particularidad de este entorno local

No cambia la arquitectura ni es un requisito para otros equipos.
