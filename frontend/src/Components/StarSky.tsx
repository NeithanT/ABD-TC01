import { useEffect, useState } from 'react'
import { useAuth } from 'react-oidc-context';
import type { Estrella, NuevaEstrella, TipoError, Error } from '../types'
import { readEstrellas, readEstrella, createEstrella, updateEstrella, deleteEstrella } from '../Api';
import '../App.css'

function StarSky() {

  const total_estrellas = 10;
  const estrellas: NuevaEstrella[] = [];

  for (let i = 0; i < total_estrellas; i++) {
    let nuevaEstrella: NuevaEstrella = { nombre:'pepe', masa: 0, color: 123312,cord_x: 0, cord_y: 0 };

    nuevaEstrella.masa = Math.random() * 18 + 2; // tamaño de [2, 10]
    nuevaEstrella.cord_x = Math.random() * 1024; // A esto hay que sumarle la posición anterior
    nuevaEstrella.cord_y = Math.random() * 1024; // falta CAMBIAR EL 1O24 por height

    estrellas.push(nuevaEstrella);
  }

  // TODO hacer un hook para calcular la posición, para reajustar resize de screen
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

export default StarSky;
