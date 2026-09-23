import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import conexionBD from "../../db.ts";

//datos que vamos a usar solo para estas pruebas
const USUARIO_PRUEBA = "integracion_postgresql";

//obtiene el puerto del backend dentro del contenedor
const PUERTO = process.env.BACKEND_INTERNAL_PORT ?? "3000";

//permite hacer solicitudes HTTP al backend que ya esta corriendo
const api = request(`http://127.0.0.1:${PUERTO}`);

//guardamos los ids que PostgreSQL genere para usarlos en las pruebas
let idSirio: number;
let idVega: number;



beforeAll(async () => {

  // elimina datos viejos de una ejecucion anterior
  await conexionBD.query(
    "DELETE FROM estrellas WHERE usuario_creador = $1",
    [USUARIO_PRUEBA]
  );

  // inserta dos estrellas reales en PostgreSQL para poder probar los endpoints
  const resultado = await conexionBD.query(
    `INSERT INTO estrellas
    (usuario_creador, nombre, masa, color, cord_x, cord_y)
    VALUES
    ($1, $2, $3, $4, $5, $6),
    ($1, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      USUARIO_PRUEBA,
      "integracion_sirio",
      10,
      123456,
      1,
      2,
      "integracion_vega",
      20,
      654321,
      3,
      4,
    ]
  );


  idSirio = resultado.rows.find(
    (estrella: any) => estrella.nombre === "integracion_sirio"
  ).id;

  idVega = resultado.rows.find(
    (estrella: any) => estrella.nombre === "integracion_vega"
  ).id;
});


//prueba para ready 
describe("GET /ready", () => {
  it("responde 200 si PostgreSQL acepta consultas", async () => {
    const respuesta = await api.get("/ready");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ status: "READY" });
  });
});


//prueba para GET sin id /PostgreSQL real
describe("GET /star", () => {
  it("responde 200 con estrellas guardadas en PostgreSQL", async () => {
    const respuesta = await api.get("/star");

    expect(respuesta.status).toBe(200);
    expect(Array.isArray(respuesta.body)).toBe(true);
    const sirio = respuesta.body.find(
      (estrella: any) => estrella.id === idSirio
    );

    const vega = respuesta.body.find(
      (estrella: any) => estrella.id === idVega
    );

    expect(sirio).toBeDefined();
    expect(vega).toBeDefined();
  });

  it("responde 200 y filtra por usuario usando PostgreSQL", async () => {
    const respuesta = await api.get(`/star?usuario=${USUARIO_PRUEBA}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.length).toBe(2);

    expect(
      respuesta.body.every(
        (estrella: any) => estrella.usuario_creador === USUARIO_PRUEBA
      )
    ).toBe(true);
  });
});


// prueba para GET con id 
describe("GET /star/:id", () => {
  it("responde 200 si la estrella existe", async () => {
    const respuesta = await api.get(`/star/${idSirio}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.id).toBe(idSirio);
    expect(respuesta.body.nombre).toBe("integracion_sirio");
    expect(respuesta.body.usuario_creador).toBe(USUARIO_PRUEBA);
  });

  it("responde 404 si la estrella no existe", async () => {
    const respuesta = await api.get("/star/2147483647");

    expect(respuesta.status).toBe(404);
  });
});


// limpia los datos de prueba cuando termina todo
afterAll(async () => {
  await conexionBD.query(
    "DELETE FROM estrellas WHERE usuario_creador = $1",
    [USUARIO_PRUEBA]
  );

  await conexionBD.end();
});

