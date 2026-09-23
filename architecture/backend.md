# Arquitectura y Decisiones de Diseño: Backend

La decisión que tomamos fue utilizar Nodejs, con el default de Express.

---

## Dependencias

En `package.json` se puede ver que usamos:
- **jose**: Para los JWT de Keycloak.
- **pg**: El driver de PostgreSQL.
- **vitest, supertest & TypeScript**: Para el desarrollo y testing.

---

## Arquitectura y Decisiones de Diseño

Como tal no se siguió un patrón estricto, pero sí un conjunto de buenas prácticas:

```text
backend/
├── app.ts               # Acá se definen las rutas como tal (aquí entran los tests)
├── server.ts            # Se separó el listener del app.ts para poder correr los tests unitarios
├── db.ts                # Carga la conexión de la DB
├── dtos.ts              # Los DTOs (tipos de TypeScript) utilizados en la app
├── middleware/          
│   └── auth.ts          # Archivo para manejar la validación de JWTs
├── routes/              # Todas las rutas /
│   ├── health.ts        # Comprueba si el backend responde (/health)
│   ├── ready.ts         # Comprueba postgres (/ready)
│   └── star.ts          # El CRUD (/star)
└── tests/               # Pruebas de vitest
    ├── health.test.ts
    ├── ready.test.ts
    └── star.test.ts
```

Como tal, solo se programó conforme a las necesidades del proyecto y los requerimientos para realizar los tests.
Patrones como MVC o arquitecturas para microservicios no fueron utilizados.

---

## Carga de Datos y Configuración

Como tal, la idea es que todas las ENV variables se pudieran cambiar en el `.env` del root del proyecto, y que funcionara en todo el proyecto.

Para todo, en el backend se cargan 3 elementos:

- **Elementos del frontend:** URLs y puertos, para ver que se permite con el CORS.
- **Elementos de PostgreSQL:** Se carga el usuario, contraseña, host, necesarios para conectarse.
- **Puertos del propio backend:** `BACKEND_PORT` si se quisiera cambiar el puerto en el que esta disponible el contenedor.

---

## Autenticación y Autorización

Se requieren de ciertos permisos para realizar ciertas acciones. Como tal:

### No requieren permisos
- `GET /`
- `GET /health`
- `GET /ready`
- `GET /star` (Get de 1 estrella o multiples)

### Requieren autenticación (Token JWT válido)
- `POST /star`

### Requieren que sea el mismo usuario que creó la estrella
- `PUT /star`
- `DELETE /star`
