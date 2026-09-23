import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { request as httpRequest } from "node:http";


// obtiene una variable de entorno y falla si no existe
function obtenerVariable(nombre: string): string {
  const valor = process.env[nombre];

  if (!valor) {
    throw new Error(`Falta la variable de entorno ${nombre}`);
  }
  return valor;
}


const PUERTO = obtenerVariable("BACKEND_INTERNAL_PORT");
const REALM = obtenerVariable("REALM_NAME");
const CLIENT_ID = obtenerVariable("KEYCLOAK_TEST_CLIENT_ID");

const KEYCLOAK_INTERNO = new URL(
  obtenerVariable("KEYCLOAK_INTERNAL_URL")
);

const KEYCLOAK_ISSUER = new URL(
  obtenerVariable("KEYCLOAK_ISSUER")
);

const api = request(`http://127.0.0.1:${PUERTO}`);

let tokenSinRol: string;
let tokenConRol: string;
let idCreada: number | null = null;


// pide un token real a Keycloak
function obtenerToken(conRol: boolean): Promise<string> {
  const password = obtenerVariable("KEYCLOAK_TEST_PASSWORD");

  // el scope roles solo se pide cuando necesitamos el rol user dentro del token
  const datos = new URLSearchParams({
    grant_type: "password",
    client_id: CLIENT_ID,
    username: "test_con_rol",
    password: password,
    scope: conRol ? "openid roles" : "openid",
  }).toString();

  return new Promise((resolve, reject) => {
    const peticion = httpRequest(
      {
        hostname: KEYCLOAK_INTERNO.hostname,
        port: Number(KEYCLOAK_INTERNO.port),
        path: `/realms/${REALM}/protocol/openid-connect/token`,
        method: "POST",
        headers: {
          // se conecta a Keycloak por Docker, pero el issuer del token debe ser el publico
          Host: KEYCLOAK_ISSUER.host,
          "Content-Type": "application/x-www-form-urlencoded", //los datos vienen en formato formulario
          "Content-Length": Buffer.byteLength(datos),
        },
      },
      (respuesta) => {
        let cuerpo = "";

        respuesta.on("data", (parte) => {
          cuerpo += parte;
        });

        respuesta.on("end", () => {
          try {
            const json = JSON.parse(cuerpo);

            if (respuesta.statusCode !== 200 || !json.access_token) {
              return reject(new Error(`Keycloak no entrego token: ${cuerpo}`));
            }

            resolve(json.access_token);
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    peticion.on("error", reject);
    peticion.write(datos);
    peticion.end();
  });
}


// obtiene ambos tokens antes de comenzar las pruebas
beforeAll(async () => {
  tokenSinRol = await obtenerToken(false);
  tokenConRol = await obtenerToken(true);
});


// pruebas de autenticacion con Keycloak real
describe("Keycloak - autenticacion", () => {
  it("responde 401 si no se envia token", async () => {
    const respuesta = await api
      .post("/star")
      .send({ nombre: "integracion_sin_token", color: 100, masa: 10, cord_x: 1, cord_y: 2 });

    expect(respuesta.status).toBe(401);
  });

  it("responde 403 si el token no tiene el rol user", async () => {
    const respuesta = await api
      .post("/star")
      .set("Authorization", `Bearer ${tokenSinRol}`)
      .send({ nombre: "integracion_sin_rol", color: 100, masa: 10, cord_x: 1, cord_y: 2 });

    expect(respuesta.status).toBe(403);
  });

  it("responde 401 si la firma del token fue alterada", async () => {
    // un JWT tiene tres partes: header,payload y firma
    const partes = tokenConRol.split(".");
    const firma = partes[2];
    const posicion = Math.floor(firma.length / 2);

    // altera un caracter para comprobar que el backend valida la firma
    partes[2] =
      firma.slice(0, posicion) +
      (firma[posicion] === "A" ? "B" : "A") +
      firma.slice(posicion + 1);

    const tokenAlterado = partes.join(".");

    const respuesta = await api
      .post("/star")
      .set("Authorization", `Bearer ${tokenAlterado}`)
      .send({ nombre: "integracion_token_invalido", color: 100, masa: 10, cord_x: 1, cord_y: 2 });

    expect(respuesta.status).toBe(401);
  });
});


// prueba el CRUD usando un token valido emitido por Keycloak
describe("Keycloak - token valido", () => {
  it("permite crear, consultar, actualizar y eliminar una estrella", async () => {
    // evita repetir el mismo nombre entre ejecuciones
    const nombre = `integracion_keycloak_${Date.now()}`;

    const crear = await api
      .post("/star")
      .set("Authorization", `Bearer ${tokenConRol}`)
      .send({ nombre: nombre, color: 100, masa: 10, cord_x: 1, cord_y: 2 });

    expect(crear.status).toBe(201);

    // guarda el id generado por PostgreSQL para continuar el CRUD
    idCreada = crear.body.id;

    const consultar = await api.get(`/star/${idCreada}`);

    expect(consultar.status).toBe(200);
    expect(consultar.body.nombre).toBe(nombre);

    const actualizar = await api
      .put(`/star/${idCreada}`)
      .set("Authorization", `Bearer ${tokenConRol}`)
      .send({ nombre: `${nombre}_actualizada`, color: 200, masa: 20, cord_x: 3, cord_y: 4 });

    expect(actualizar.status).toBe(200);
    expect(actualizar.body.nombre).toBe(`${nombre}_actualizada`);

    const eliminar = await api
      .delete(`/star/${idCreada}`)
      .set("Authorization", `Bearer ${tokenConRol}`);

    expect(eliminar.status).toBe(204);

    const comprobar = await api.get(`/star/${idCreada}`);

    expect(comprobar.status).toBe(404);

    // ya fue eliminada, por lo que afterAll no necesita limpiarla
    idCreada = null;
  });
});


// limpia la estrella si la prueba falla antes de poder eliminarla
afterAll(async () => {
  if (idCreada !== null && tokenConRol) {
    await api
      .delete(`/star/${idCreada}`)
      .set("Authorization", `Bearer ${tokenConRol}`);
  }
});