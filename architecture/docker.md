# Arquitectura de Docker

Docker es glorioso, pero necesitábamos que tuviera todas las variables de entorno y que todo simplemente funcionara.
Por eso, como tal se crearon las imágenes con Dockerfiles y algunas configuraciones se pasaban con
el Docker Compose, según si era para producción o para dev.

---

## Servicios en Docker

El sistema se compone de cuatro servicios principales:

1. **Frontend (`frontend`)**:
   - Para este se construyó una imagen; como tal, los dos Dockerfiles son lo siguiente:
   - En **prod** (`Dockerfile` normal): Se utiliza un build con `node:26.7` para compilar el React y se inyectan las variables env en ese paso; después, esos archivos se pasan a un Nginx, que los comparte de manera eficiente y liviana.
   - En **desarrollo** (`Dockerfile.dev`): Una imagen liviana, `node:26.7-alpine`, para que sea más fácil y rápido estar desarrollando. EN ESTE, como es de desarrollo se van a estar cambiando las cosas, entonces no se hace build: se hace un `npm run dev` y se crean binds a los archivos en `src/`, para que si se hace un cambio en desarrollo, se cambie en el contenedor.

2. **Backend (`backend`)**:
   - Las dos imágenes son muy parecidas:
   - En **prod** (`Dockerfile`): Imagen `node:26.7-alpine`, instala dependencias y copia todos los archivos, junto a `node --env-file=.env server.ts` para ejecutar.
   - En **desarrollo** (`Dockerfile.dev`): Corre el install y el Docker Compose hace bind de los archivos base para poder volver a ejecutarlo con `node server.ts`.
   - Acá como tal, faltaría algo similar al `npm run dev`, ya que no se actualiza de inmediato, a diferencia de Vite en desarrollo.    

3. **Base de Datos (`database`)**:
   - Aquí solo se usa la imagen oficial `postgres:17-alpine`.
   - Se monta un volumen para persistencia (`pgdata` -> `/var/lib/postgresql/data`).
   - Se inicializa montando `./database` en `/docker-entrypoint-initdb.d:ro` (para el `init_db.sql`).
  
4. **Keycloak**:
   - Imagen oficial `quay.io/keycloak/keycloak:26.7.0`.
   - Modo `start-dev --import-realm` y se importa la configuración del realm desde `./keycloak/realm-export.json`.
   - No hay modo de producción como tal, porque involucra tener cifrado.

---

## Diferencias entre Prod y Dev

En prod se compila de manera liviana, con las variables necesarias inyectadas de una,
mientras que los de dev están con ligas/binds para estar desarrollando constantemente.

## Decisión de seguridad en redes

Se definieron dos redes para proteger el acceso a la DB:

- **`public_net`**: Red accesible para todos (Frontend, Backend y Keycloak).
- **`private_net` (`internal: true`)**: Para que solo el backend acceda a la DB.

---

## Variables de Entorno y Configuración

Al final, todo se carga mediante variables de entorno.
Algo muy chiva de Docker Compose es utilizarlo para construir todas las imágenes:
como se les pasa en el `build:` del Docker Compose,
se construyen con un nombre de manera correcta y estándar.
