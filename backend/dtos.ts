export interface CrearEstrellaDTO {
  nombre: string;
  color: number;
  masa: number;
  cord_x: number;
  cord_y: number;
  usuario_creador: string; // temporal, sin Keycloak todavía
}

export interface FiltroEstrellaDTO {
  nombre?: string;
  color?: number;
  masa?: number;
  usuario_creador?: string;
}