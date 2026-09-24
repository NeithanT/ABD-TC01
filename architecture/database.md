# Arquitectura de Base de Datos

Usamos **PostgreSQL 17** (`postgres:17-alpine`).

## Esquema (`init_db.sql`)
- **Tabla `estrellas`**: `id` (SERIAL PK), `usuario_creador` (TEXT), `nombre` (VARCHAR), `masa` (REAL), `color` (INT), `cord_x` (REAL), `cord_y` (REAL).
- 
## Conexión y Persistencia
- **Backend**: Conexión con `pg` en `backend/db.ts` , y se conecta con variables de entorno.
- **Docker Compose**: Persistencia con volumen `pgdata` e inicialización montando `./database` en `/docker-entrypoint-initdb.d`.
- **Kubernetes**: Deployment con PVC `database-pvc` (1Gi).

## Seguridad
- Aislada en la red `private_net` (`internal: true`) , solo el backend puede accederlo.
