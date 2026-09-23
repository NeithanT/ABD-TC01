# Sistema Mirador de Estrellas

El tema que escogimos fue de estrellas, esto se refleja en el schema de la base de datos, en el frontend y en los API.

## Requisitos

Se ocupa tener el siguiente software, con permisos para ejecutarlos y que estén en el `$PATH`:

- [Docker](https://docs.docker.com/engine/install/) - El suficientemente nuevo para tener docker compose
- [kubectl](https://kubernetes.io/docs/tasks/tools/) - CLI de Kubernetes
- [KIND](https://kind.sigs.k8s.io/docs/user/quick-start/) - Kubernetes in Docker

## Variables de Entorno

Antes de usar esta bomba en producción, tiene que copiar el archivo `.env.example` a un archivo llamado `.env`.

Ahí debe tener sus contraseñas seguras especialmente, los puertos se pueden dejar así:

```bash
cp .env.example .env
```

## Despliegue y Ejecución

### Opción 1: Despliegue con Kubernetes

> **Nota:** El Keycloak tarda como 10 minutos para iniciar, tenga paciencia, es muy ineficiente.

Pasos:

1. Ejecuta el script:
   ```bash
   ./init.sh
   ```

2. Rezar.

3. Ver si funciona:
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Keycloak:** [http://localhost:8080](http://localhost:8080)
   - **Backend ver Estrellas:** [http://localhost:3000/star](http://localhost:3000/star)

### Opción 2: Despliegue con Docker Compose

Para levantar todo:

```bash
docker compose up -d
```

### Opción 3: Entorno de Desarrollo Local

Pa desarrollar, la diferencia viene más que todo del `npm run dev`:

```bash
docker compose -f docker-compose-dev.yml up -d
```

## Pruebas

Para correr las pruebas, solo ejecuten:

```bash
bash test.sh
```

## Cosas para Debuguear que han sido Útiles

- **Ver los pods que están corriendo:**
  ```bash
  kubectl get pod
  ```
- **Ver errores:**
  ```bash
  kubectl describe pod <nombre-pod>
  kubectl logs <nombre-pod>
  ```
- **Ayuda mucho para ver si hay problemas de puertos:**
  ```bash
  kubectl port-forward frontend 5173:5173
  ```
- Si el cluster no funca, pelearse con kind.

## Documentación de Arquitectura

Todas las decisiones de diseño fueron documentadas en la carpeta de arquitectura, para saber por qué susha están hechas así.

## Cosas Pendientes

Este repositorio está diseñado para correr localmente. Para tenerlo desplegado y seguro se ocuparía:

- **Habilitar SSL y TLS en Keycloak:** en vez de usar `start-dev`.
- **Terminación TLS con Certificados Seguros:** se ocupa un certificado para nginx y un dominio HTTPS.


## Política de Uso de IA

Todo este proyecto fue realizado por nosotros; no se utilizó ningún agente autónomo desatendido. Siempre hubo una persona al frente decidiendo la dirección técnica y evaluando qué era lo mejor para la arquitectura.

### Desarrollado a Pata:
- **Estructura y DevOps:** Se crearon los Dockerfiles, `docker-compose.yml`, el `docker-compose-dev.yml` para desarrollar de manera facil, los deployment de K8s (Kind, manifests) y el `init.sh`.
- **Los diferentes servicios:** Se hicieron las rutas, los queries en el backend, el frontend, las apis, el Keycloak, haciendo el realm-export casi que a pata, inyección y gestión de variables de entorno (`.env`).
- **Mantenimiento** Configuración de `.gitignore`, `.dockerignore`, Y NO SE INCLUYO .env.
- **Diseño del Sistema:** Planteamiento general de la arquitectura.
 
### Con Asistencia y Recomendaciones de IA:
- **Testing:** Apoyo en las pruebas de integración.
- **Middleware:** La validación de JWTs en `backend/middleware/auth.ts`.
- **Componentes UI:** Los elementos visuales como el cartelito para crear y editar estrellas en el frontend.
- **Documentación:** Ayuda para que quede bonito los `.md` y correcciones de redacción.
