export interface CrearEstrellaDTO {
  nombre: string;
  color: number;
  masa: number;
  cord_x: number;
  cord_y: number;
  usuario_creador: string; // temporal, sin Keycloak todavía
}

export type FiltroEstrellaDTO = Partial<
  Pick<CrearEstrellaDTO, "nombre" | "color" | "masa" | "usuario_creador">
>;