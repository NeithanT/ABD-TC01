
const RUTA_ESTANDAR = import.meta.env.VITE_BACKEND_ROUTE;
const RUTAS_API = {
  star: '/star',
  ready: '/ready',
  health: '/health',
}

const RUTAS = {
  home: '/'
}

const TIMEOUT_MAX = import.meta.env.VITE_TIMEOUT_TIME * 1000;

export { RUTA_ESTANDAR, RUTAS_API, RUTAS, TIMEOUT_MAX };
