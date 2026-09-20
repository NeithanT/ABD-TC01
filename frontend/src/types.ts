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

export type { Estrella, NuevaEstrella, TipoError, Error };
