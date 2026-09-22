import { useEffect, useState } from 'react';
import type { Estrella } from '../types';
import '../App.css';
import { readEstrellas } from '../Api';

function StarSky() {
  const [estrellas, setEstrellas] = useState<Estrella[]>([]);

  useEffect(() => {
    const fetchEstrellas = async () => {
      const data = await readEstrellas();
      if (Array.isArray(data)) {
        setEstrellas(data);
      }
    };

    fetchEstrellas();
  }, []);

  // TODO hacer un hook para calcular la posición, para reajustar resize de screen
  return (
    <>
      {estrellas.map((estrella, index) => (
        <div
          key={estrella.id ?? index}
          className='estrella'
          style={{
            width: estrella.masa,
            height: estrella.masa,

            left: estrella.cord_x,
            top: estrella.cord_y,
          }}
        />
      ))}
    </>
  );
}

export default StarSky;
