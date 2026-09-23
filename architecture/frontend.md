# Por qué hicimos frontend?

Por dos simples cosas:
1. Nos confudimos
2. Se ve bonito para ver la aplicación


Tomamos la decisión de utilizar React con TypeScript en Vite, inicializado con el template:

```bash
npm create vite@latest frontend -- --template react-ts
```

Para correr el proyecto en modo desarrollo se utiliza:

```bash
npm run dev
```

---

## Dependencias

En `package.json` se puede ver que usamos:
- **react**: El react como tal.
- **react-oidc-context & oidc-client-ts**: Para la autenticación OpenID Connect (OIDC) con Keycloak.
- **vite & TypeScript**: El observer de vite con npm run dev es muy bonito

---

## Arquitectura y Decisiones de Diseño

Como tal no se siguió un patrón como Redux, o MVC, solo se crearon los componentes, patron de componentes se podria decir.

```text
frontend/
├── index.html
├── src/
│   ├── main.tsx         # Monta la app en React, y adjunta AuthLayer
│   ├── App.tsx          # En este caso, solo retorna la pagina principal, no tenemos nada más
│   ├── Config.ts        # Configuración para Keycloak
│   ├── Constants.ts     # URLs base, APIs y cargar .env.
│   ├── Api.ts           # Capa para los fetch, y jwt
│   ├── types.ts         # Tipos de TypeScript (Estrella, NuevaEstrella, ApiError)
│   ├── Components/      
│   │   ├── AuthLayer.tsx # Si no esta autenticado redirige, y pone que esta cargando
│   │   └── StarSky.tsx   # Las estrellas y el CRUD 
│   ├── Profile.tsx      # Autenticación
│   ├── App.css          # Estilos
│   └── index.css        # Estilos
└── package.json
```


---

## Carga de Datos y Variables de Entorno

Como tal, la idea es que las configuraciones se carguen del .env y que funcionen dentro de Docker / Kubernetes. En el frontend se cargan mediante Vite (`import.meta.env`):

Y para vite, las variables se ocupan cargar antes con VITE_ entonces, se carga del docker-compose con ese prefijo,
Todas las configuraciones son:

- **Configuración de Keycloak:**
  - `VITE_AUTHORITY`: URL del realm de Keycloak para redireccionar al usuario.
  - `VITE_CLIENT_ID`: Identificador de que app estamos haciendo
- **Ruta hacia el backend:**
  - `VITE_BACKEND_ROUTE`: URL base van los fetch (`/star`, `/health`, etc.).
- **Tiempos y timeouts:**
  - `VITE_TIMEOUT_TIME`: Tiempo máximo de espera para peticiones o timeouts en la app(Para ver si esta healthy por ejemplo).
