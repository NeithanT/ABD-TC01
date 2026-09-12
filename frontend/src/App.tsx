import { useEffect, useState } from 'react'
import './App.css'

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

  // los 3 api endpoints
  // TODO: Los diferentes response status

  useEffect(() => {

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

        if(!respuesta.ok) {
          throw new Error(`Response status: ${respuesta.status}`);
        }

      } catch {

      }
    }

    const readEstrellas = async() => {
      try {
        const respuesta = await fetch(RUTA_ESTANDAR + DICCIONARIO_RUTAS.star);
        if (!respuesta.ok) {
          throw new Error(`Response status: ${respuesta.status}`)
        }

        const json = await respuesta.json();
        console.log(json);

      } catch {

      }
    }

    const readEstrella = async(idEstrella: number) => {
      try {
        const respuesta = await fetch(RUTA_ESTANDAR + DICCIONARIO_RUTAS.star, {
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            id: idEstrella
          })
        });

        if (!respuesta.ok) {
          throw new Error(`Response status: ${respuesta.status}`)
        }

        const json = await respuesta.json();
        console.log(json);

      } catch {

      }
    }

    const updateEstrella = async (idEstrella: number, nuevaEstrella: NuevaEstrella) => {
      try {
        const respuesta = await fetch(RUTA_ESTANDAR + DICCIONARIO_RUTAS.star, {
          method: 'PUT',
          headers: {
            'Contect-type': 'application/json'
          },
          body: JSON.stringify({
            id: idEstrella,
            nombre: nuevaEstrella.nombre,
            masa: nuevaEstrella.masa,
            color: nuevaEstrella.color,
            cord_x: nuevaEstrella.cord_x,
            cord_y: nuevaEstrella.cord_y
          })
        });

        if (!respuesta.ok) {
          throw new Error(`Response status: ${respuesta.status}`);
        }

      } catch {

      }
    }

    const deleteEstrella = async (idEstrella: number) => {
      try {
        const respuesta = await fetch(RUTA_ESTANDAR + DICCIONARIO_RUTAS.star, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json'
          },
          body: {
            id: idEstrella
          }
        });

        if (!respuesta.ok) {
          throw new Error(`Response status: ${respuesta.status}`);
        }

      } catch {

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
