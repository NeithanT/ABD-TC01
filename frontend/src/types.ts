type Estrella = {
  id: number;
  nombre: string;
  masa: number;
  color: number;
  cord_x: number;
  cord_y: number;
  usuario_creador?: string;
};

type NuevaEstrella = {
  nombre: string;
  masa: number;
  color: number;
  cord_x: number;
  cord_y: number;
};

enum TipoError {
  ERROR,
  WARN,
  INFO
}

type ApiError = {
  mensajeError: string;
  tipoDeError: TipoError;
};

export { TipoError };
export type { Estrella, NuevaEstrella, ApiError };


