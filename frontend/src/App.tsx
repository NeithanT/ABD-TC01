import { useEffect, useState } from 'react'
import './App.css'
import React from 'react';
import ReactDOM from 'react-dom';

// Esto habria que leerlo de config
const oidcConfig = {
  
};

function App() {

  const RUTA_ESTANDAR = import.meta.env.VITE_BACKEND_ROUTE;
  const DICCIONARIO_RUTAS = {
    star: '/star',
    ready: '/ready',
    health: '/health',
  }

  type Estrella = {
    id: number;
    nombre: string;
    masa: number;
    color: number;
    cord_x: number;
    cord_y: number;
  };

  type NuevaEstrella = {
    nombre: string;
    masa: number;
    color: number;
    cord_x: number;
    cord_y: number;
  };

  const enum TipoError {
    ERROR,
    WARN,
    INFO
  };

  type Error = {
    mensajeError: string;
    tipoDeError: TipoError;
  };

  // los 3 api endpoints
  // TODO: Los diferentes response status

  useEffect(() => {

    // Las dos llamadas que no piden permiso de jwt
    // 200 OK, OTRO ERROR DEL SERVER
    const readEstrellas = async() => {
      try {
        const respuesta = await fetch(RUTA_ESTANDAR + DICCIONARIO_RUTAS.star);
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
        const respuesta = await fetch(RUTA_ESTANDAR + DICCIONARIO_RUTAS.star + `/${idEstrella}`);

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
        const respuesta = await fetch(RUTA_ESTANDAR + DICCIONARIO_RUTAS.star, {
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
        const respuesta = await fetch(RUTA_ESTANDAR + DICCIONARIO_RUTAS.star + `/${idEstrella}`, {
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
        const respuesta = await fetch(RUTA_ESTANDAR + DICCIONARIO_RUTAS.star + `/${idEstrella}`, {
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

  })

  const total_estrellas = 10;
  const estrellas: NuevaEstrella[] = [];

  for (let i = 0; i < total_estrellas; i++) {
    let nuevaEstrella: NuevaEstrella = { nombre:'pepe', masa: 0, color: 123312,cord_x: 0, cord_y: 0 };

    nuevaEstrella.masa = Math.random() * 18 + 2; // tamaño de [2, 10]
    nuevaEstrella.cord_x = Math.random() * 1024; // A esto hay que sumarle la posición anterior
    nuevaEstrella.cord_y = Math.random() * 1024; // falta CAMBIAR EL 1O24 por height

    estrellas.push(nuevaEstrella);
  }

  // hacer un hook para calcular la posición, para prevenir resize de screen

  return (
    <>
      {estrellas.map((estrella, index) => (
        <div
          key={index}
          className='estrella'
          style={{
            width: estrella.masa,
            height: estrella.masa,

            left: estrella.cord_x,
            top: estrella.cord_y
          }}>

        </div>
      ))

      }
    </>
  )
}

export default App
