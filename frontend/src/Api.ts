import { TipoError } from './types';
import type { NuevaEstrella, ApiError, Estrella } from './types';
import { RUTAS_API, RUTA_ESTANDAR } from './Constants';
import { userManager } from './Config';

const obtenerToken = async (token?: string): Promise<string | undefined> => {
  if (token) return token;
  try {
    const user = await userManager.getUser();
    return user?.access_token;
  } catch {
    return undefined;
  }
};

// Las dos llamadas que no piden permiso de jwt
// 200 OK, OTRO ERROR DEL SERVER
const readEstrellas = async (): Promise<Estrella[] | ApiError> => {
  try {
    const respuesta = await fetch(RUTA_ESTANDAR + RUTAS_API.star);
    if (!respuesta.ok) {
      throw new Error(`Error leyendo estrellas: ${respuesta.status}`);
    }

    const json = await respuesta.json();
    return json;

  } catch (error) {
    console.error("Fallo Fetch: ", error instanceof Error ? error.message : error);
    const nuevoError: ApiError = { mensajeError: "Error Leyendo Estrellas", tipoDeError: TipoError.ERROR };
    return nuevoError;
  }
};

// 200 EXISTE, 404 NO EXISTE
const readEstrella = async (idEstrella: number): Promise<Estrella | ApiError> => {
  try {
    const respuesta = await fetch(RUTA_ESTANDAR + RUTAS_API.star + `/${idEstrella}`);

    if (!respuesta.ok) {
      throw new Error(`Error leyendo estrella ${idEstrella}: ${respuesta.status}`);
    }

    const json = await respuesta.json();
    return json;

  } catch (error) {
    console.error("Fallo Fetch: ", error instanceof Error ? error.message : error);
    const nuevoError: ApiError = { mensajeError: "Error Leyendo Estrella", tipoDeError: TipoError.ERROR };
    return nuevoError;
  }
};

// Rutas que si usan JWT
// 201 CREADO, 400 INCOMPLETO
const createEstrella = async (nuevaEstrella: NuevaEstrella, token?: string): Promise<Estrella | ApiError> => {
  try {
    const authToken = await obtenerToken(token);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const respuesta = await fetch(RUTA_ESTANDAR + RUTAS_API.star, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        nombre: nuevaEstrella.nombre,
        masa: Number(nuevaEstrella.masa),
        color: Number(nuevaEstrella.color),
        cord_x: Number(nuevaEstrella.cord_x),
        cord_y: Number(nuevaEstrella.cord_y),
      }),
    });

    if (!respuesta.ok) {
      const errData = await respuesta.json().catch(() => null);
      throw new Error(errData?.error || `Error en createEstrella: ${respuesta.status}`);
    }

    const json = await respuesta.json();
    return json;

  } catch (error) {
    console.error("Fallo Fetch: ", error instanceof Error ? error.message : error);
    const nuevoError: ApiError = {
      mensajeError: error instanceof Error ? error.message : "Error Creando Estrella",
      tipoDeError: TipoError.ERROR,
    };
    return nuevoError;
  }
};

// 200 FUNCIONO + VERSION ACTUALIZADA, 404 NO EXISTE, 400 INVALIDO
const updateEstrella = async (idEstrella: number, nuevaEstrella: NuevaEstrella, token?: string): Promise<Estrella | ApiError> => {
  try {
    const authToken = await obtenerToken(token);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const respuesta = await fetch(RUTA_ESTANDAR + RUTAS_API.star + `/${idEstrella}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        nombre: nuevaEstrella.nombre,
        masa: Number(nuevaEstrella.masa),
        color: Number(nuevaEstrella.color),
        cord_x: Number(nuevaEstrella.cord_x),
        cord_y: Number(nuevaEstrella.cord_y),
      }),
    });

    if (!respuesta.ok) {
      const errData = await respuesta.json().catch(() => null);
      throw new Error(errData?.error || `Error en updateEstrella: ${respuesta.status}`);
    }

    const json = await respuesta.json();
    return json;

  } catch (error) {
    console.error("Fallo Fetch: ", error instanceof Error ? error.message : error);
    const nuevoError: ApiError = {
      mensajeError: error instanceof Error ? error.message : "Error Actualizando Estrella",
      tipoDeError: TipoError.ERROR,
    };
    return nuevoError;
  }
};

// 204 FUNCIONO, 404 NO EXISTE
const deleteEstrella = async (idEstrella: number, token?: string): Promise<boolean | ApiError> => {
  try {
    const authToken = await obtenerToken(token);
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const respuesta = await fetch(RUTA_ESTANDAR + RUTAS_API.star + `/${idEstrella}`, {
      method: 'DELETE',
      headers,
    });

    if (!respuesta.ok) {
      const errData = await respuesta.json().catch(() => null);
      throw new Error(errData?.error || `Error borrando estrella: ${respuesta.status}`);
    }

    return true;

  } catch (error) {
    console.error("Fallo Fetch: ", error instanceof Error ? error.message : error);
    const nuevoError: ApiError = {
      mensajeError: error instanceof Error ? error.message : "Error Borrando Estrella",
      tipoDeError: TipoError.ERROR,
    };
    return nuevoError;
  }
};

export { readEstrellas, readEstrella, createEstrella, updateEstrella, deleteEstrella };

