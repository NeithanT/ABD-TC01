# Arquitectura del docker

Docker es glorioso, pero necesitabamos que tuviera todas las variables de entorno, y que todo simplemente funcionara,
Por eso, como tal se crearon las imagenes con Dockerfiles, y algunas configuraciones se pasaban con
el docker compose, segun era para producción o para dev.

---

## Servicios en docker

El sistema se compone de cuatro servicios principales:

1. **Frontend (`frontend`)**:
   - Para este se construyo una imagen, como tal, los dos dockerfiles son lo siguiente:
   - En **prod** (`Dockerfile normal`): Se utiliza un build con `node:26.7` para compilar el react, y se inyectan las variables env en ese paso, despues esos archivos se pasan a un nginx, que los comparte de manera eficiente, y liviana.
   - En **desarrollo** (`Dockerfile.dev`): Una imagen liviana, `node:26.7-alpine` , para que sea más facil y más rapido estar desarrollado, EN ESTE, como es de desarrollo se van a estar cambiando las cosas, entonces no se hace build, se hace un `npm run dev`, y se crean binds a los archivos en src/, para que si se hace un cambio en desarrollo, se cambien en el contenedor.

2. **Backend (`backend`)**:
   - Las dos imagenes son muy parecidas
   - En **prod** (`Dockerfile`): Imagen `node:26.7-alpine`, instala dependencias y copia todos los archivos, junto a `node --env-file=.env server.ts` para ejecutar.
   - En **desarrollo** (`Dockerfile.dev`): Monta el install, y el docker compose hace bind de los  archivos base, para poder volver a ejecutarlo, con `node server.ts`.
   - Aca como tal, faltaria similar al npm run dev, ya que no se actualiza immediato, y ya se tiene vite en desarrollo.    

3. **Base de Datos (`database`)**:
   - Aqui solo se usa la imagen oficial `postgres:17-alpine`.
   - Se monta un volumen para persistencia (`pgdata` -> `/var/lib/postgresql/data`).
   - Se inicializa montando `./database` en `/docker-entrypoint-initdb.d:ro` (para el `init_db.sql`).
  
4. **keycloak**:
   - Imagen oficial `quay.io/keycloak/keycloak:26.7.0`.
   - Modo `start-dev --import-realm` y se importa la configuración del realm desde `./keycloak/realm-export.json`.
   - No hay modo de producción como tal, porque involucra tener cifrado.

---

## Diferencias entre Prod y Dev

En prod se compila de manera liviana, con las variables necesarias inyectadas de una,
mientras los dev estan con ligas-bind para estar desarrollando constatemente.

## Decisión de seguridad en redes

Se definieron dos redes para proteger el acceso a la DB.

- **`public_net`**: Red accesible para todos (Frontend, Backend y Keycloak).
- **`private_net` (`internal: true`)**: Para que solo el backend accese la DB.

---

## Variables de Entorno y Configuración

Al final, todo se carga mediante variables de entorno,
algo muy chiva de los docker compose es utilizarlos para construir todas las imagenes,
como se les pasa en el build: del docker compose,
se construyen con un nombre de manera correcta y estandar.
