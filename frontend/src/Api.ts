import type { Estrella, NuevaEstrella, TipoError, Error } from './types';
import { RUTAS_API, RUTA_ESTANDAR } from './Constants'

// Las dos llamadas que no piden permiso de jwt
// 200 OK, OTRO ERROR DEL SERVER
const readEstrellas = async() => {
  try {
    const respuesta = await fetch(RUTA_ESTANDAR + RUTAS_API.star);
    if (!respuesta.ok) {
      throw new Error(`Error leyendo estrellas: ${respuesta.status}`)
    }

    const json = await respuesta.json();
    return json;

  } catch (error) {
    console.error("Fallo Fetch: ", error.message);
    const nuevoError: Error = { mensajeError: "Error Leyendo Estrellas", tipoDeError: TipoError.ERROR };
    return nuevoError;
  }
}

// 200 EXISTE, 404 NO EXISTE,
const readEstrella = async(idEstrella: number) => {
  try {
    const respuesta = await fetch(RUTA_ESTANDAR + RUTAS_API.star + `/${idEstrella}`);

    if (!respuesta.ok) {
      throw new Error(`Error leyendo estrella ${idEstrella}: ${respuesta.status}`)
    }

    const json = await respuesta.json();
    return json;

  } catch (error) {
    console.error("Fallo Fetch: ", error.message);
    const nuevoError: Error = { mensajeError: "Error Leyendo Estrella", tipoDeError: TipoError.ERROR };
    return nuevoError;
  }
}


// Rutas que si usan JWT
// 201 CREADO, 400 INCOMPLETO
const createEstrella = async (nuevaEstrella: NuevaEstrella) => {
  try {
    const respuesta = await fetch(RUTA_ESTANDAR + RUTAS_API.star, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nuevaEstrella.nombre,
        masa: nuevaEstrella.masa,
        color: nuevaEstrella.color,
        cord_x: nuevaEstrella.cord_x,
        cord_y: nuevaEstrella.cord_y
      })
    });

    if(respuesta.status == 400) {
      throw new Error(`Error en createEstrella, cuerpo incompleto: ${respuesta.status}`);
    } else if (!respuesta.ok) {
      throw new Error(`Error en createEstrella: ${respuesta.status}`);
    }

    const json = await respuesta.json();
    console.log(json);

  } catch (error) {
    console.error("Fallo Fetch: ", error.message);
    const nuevoError: Error = { mensajeError: "Error Creando Estrella", tipoDeError: TipoError.ERROR };
    return nuevoError;
  }
}

// 200 FUNCIONO + VERSION ACTUALIZADA, 404 NO EXISTE, 400 INVALIDO
const updateEstrella = async (idEstrella: number, nuevaEstrella: NuevaEstrella) => {
  try {
    const respuesta = await fetch(RUTA_ESTANDAR + RUTAS_API.star + `/${idEstrella}`, {
      method: 'PUT',
      headers: {
        'Contect-type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nuevaEstrella.nombre,
        masa: nuevaEstrella.masa,
        color: nuevaEstrella.color,
        cord_x: nuevaEstrella.cord_x,
        cord_y: nuevaEstrella.cord_y
      })
    });

    switch (respuesta.status) {
      case 404:
        throw new Error(`Error en updateEstrella, no existe id ${idEstrella}: ${respuesta.status}`);
      case 400:
        throw new Error(`Error en updateEstrella, cuerpo invalido: ${respuesta.status}`)
    }
    if (!respuesta.ok) {
      throw new Error(`Response status: ${respuesta.status}`);
    }

    const json = await respuesta.json();
    return json;

  } catch (error) {
    console.error("Fallo Fetch: ", error.message);
    const nuevoError: Error = { mensajeError: "Error Actualizando Estrella", tipoDeError: TipoError.ERROR };
    return nuevoError;
  }
}

// 204 FUNCIONO, 404 NO EXISTE
const deleteEstrella = async (idEstrella: number) => {
  try {
    const respuesta = await fetch(RUTA_ESTANDAR + RUTAS_API.star + `/${idEstrella}`, {
      method: 'DELETE'
    });

    if (respuesta.status == 404) {
      throw new Error(`Error borrando estrella, con id ${idEstrella}: ${respuesta.status}`);
    }

    const json = respuesta.json();
    return json;

  } catch (error) {
    console.error("Fallo Fetch: ", error.message);
    const nuevoError: Error = { mensajeError: "Error Borrando Estrella", tipoDeError: TipoError.ERROR };
    return nuevoError;
  }
}

export { readEstrellas, readEstrella, createEstrella, updateEstrella,deleteEstrella };
