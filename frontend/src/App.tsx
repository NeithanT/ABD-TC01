import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {

  type Estrella = {
    tamanno: number;
    x: number;
    y: number;
  };

  const total_estrellas = 10;
  const estrellas: Estrella[] = [];

  for (let i = 0; i < total_estrellas; i++) {
    let nuevaEstrella: Estrella = { tamanno: 0, x: 0, y: 0 };

    nuevaEstrella.tamanno = Math.random() * 18 + 2; // tamaño de [2, 10]
    nuevaEstrella.x = Math.random() * 1024; // A esto hay que sumarle la posición anterior
    nuevaEstrella.y = Math.random() * 1024; // falta CAMBIAR EL 1O24 por height

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
            width: estrella.tamanno,
            height: estrella.tamanno,

            left: estrella.x,
            top: estrella.y
          }}>

        </div>
      ))

      }
    </>
  )
}

export default App
