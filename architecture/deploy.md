# Arquitectura de Kubernetes

Para el despliegue del sistema en Kubernetes (Diseñado unicamente para KIND), se por separar en deployments y services de cada imagen, y 
utilizar un Kustomization para aplicar las .env variables.

---

## Estructura de Kubernetes

La Estructura es:

```text
ABD-TC01/
├── kustomization.yaml           # Archivo para cargar el .env
├── deploy/
│   ├── frontend/
│   │   ├── deployment.yaml      # Deployment del frontend (React / Nginx)
│   │   └── service.yaml         # Service ClusterIP puerto 5173
│   ├── backend/
│   │   ├── deployment.yaml      # Deployment de Express API
│   │   └── service.yaml         # Service ClusterIP puerto 3000
│   ├── database/
│   │   ├── deployment.yaml      # Deployment de PostgreSQL 17
│   │   ├── pvc.yaml             # PersistentVolumeClaim (1Gi) para datos de PostgreSQL
│   │   └── service.yaml         # Service ClusterIP puerto 5432
│   └── keycloak/
│       ├── deployment.yaml      # Deployment de Keycloak 26.7
│       └── service.yaml         # Service ClusterIP puerto 8080
```

Por qué el kustomization.yaml en la base?
Si estuviera en deploy/ o en alguna subcarpeta, da errores de permisos,
donde kubectl no puede acceder a configuraciones afuera de donde se esta aplicando.
Por lo que no podia cargar archivos como el .env

---

## Inyectar el .env con Kustomization

En lugar de cargar el .env a pata cada vez que se debia utilizar, se utilizó el `kustomization.yaml`, usando el configMapGenerator, solo se necesitaba
referirse al .env una vez, y se compartir con los resources necesitados.

1. ConfigMap **`app-env`**:
   - Carga el archivo .env
   - Se usa para inyectar las variables, con el `envFrom: configMapRef` en todos los deployments. Cualquier cambio, con cambiarlo en el .env, ya estaria en todos los pods.

2. File **`realm-config`**:
   - Se carga el archivo `./keycloak/realm-export.json`, para poder cargarlo en el inicio del keycloak(Si no, habria que crear un Dockerfile).
  
3. File **`db-init`**:
   - Se carga en el postresql como `/docker-entrypoint-initdb.d/` en el pod de la base de datos para inicia la tabla de estrellas.
  
4. File **`env-config`**:
   - Mantiene el archivo `.env` disponible para el backend.

---

## Por qué Servicios,

Al final los pods van cambiando de IP, los Servicios NO, entonces redireccionan trafico a todos los pods creados.

- **`database-service` (Puerto 5432)**: Redirecciona trafico a Postgres
- **`keycloak-service` (Puerto 8080)**: Redirecciona trafico a Keycloak
- **`backend-service` (Puerto 3000)**: Redirecciona trafico a Express
- **`frontend-service` (Puerto 5173)**: Redirecciona trafico a Nginx

## Flujo de Kubernetes

Primero crear un cluster(desde root):
```bash
kind create cluster --name miCluster --config kind-config.yaml
```

Levantar los deploys:
```bash
kubectl apply -k .
```

Accede a localhost:5173 para probar
