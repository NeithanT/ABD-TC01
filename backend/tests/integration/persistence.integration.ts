import { request as httpRequest } from "node:http";

//Lo uncico que ocupamos
interface EstrellaPersistencia {
  id: number;
  nombre: string;
}


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

const api = `http://127.0.0.1:${PUERTO}`;
const NOMBRE = "integracion_persistencia";


// pide un token real a Keycloak
function obtenerToken(): Promise<string> {
  const password = obtenerVariable("KEYCLOAK_TEST_PASSWORD");

  const datos = new URLSearchParams({
    grant_type: "password",
    client_id: CLIENT_ID,
    username: "test_con_rol",
    password: password,
    scope: "openid roles",
  }).toString();

  return new Promise<string>((resolve, reject) => {
    const peticion = httpRequest(
      {
        hostname: KEYCLOAK_INTERNO.hostname,
        port: Number(KEYCLOAK_INTERNO.port),
        path: `/realms/${REALM}/protocol/openid-connect/token`,
        method: "POST",
        headers: {
          // usa Keycloak por la red interna, pero conserva el issuer publico
          Host: KEYCLOAK_ISSUER.host,
          "Content-Type": "application/x-www-form-urlencoded",
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
            const json = JSON.parse(cuerpo) as {
              access_token?: string;
            };

            if (respuesta.statusCode !== 200 || !json.access_token) {
              return reject(
                new Error(`Keycloak no entrego token: ${cuerpo}`)
              );
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


// crea el dato que debe sobrevivir al reinicio
async function crear() {
  const token = await obtenerToken();

  // limpia restos si una ejecucion anterior fallo
  const anteriores = await fetch(
    `${api}/star?nombre=${NOMBRE}`
  );

  const estrellas =
    await anteriores.json() as EstrellaPersistencia[];

  for (const estrella of estrellas) {
    await fetch(`${api}/star/${estrella.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const respuesta = await fetch(`${api}/star`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: NOMBRE,
      color: 100,
      masa: 10,
      cord_x: 1,
      cord_y: 2,
    }),
  });

  if (respuesta.status !== 201) {
    const cuerpo = await respuesta.text();

    throw new Error(
      `No se pudo crear la estrella: ${respuesta.status} ${cuerpo}`
    );
  }

  console.log("Dato creado para probar persistencia");
}


// verifica que el dato siga despues del down y up
async function verificar() {
  const respuesta = await fetch(
    `${api}/star?nombre=${NOMBRE}`
  );

  if (respuesta.status !== 200) {
    throw new Error(
      `No se pudo consultar la estrella: ${respuesta.status}`
    );
  }

  const estrellas =
    await respuesta.json() as EstrellaPersistencia[];

  const estrella = estrellas.find(
    (item) => item.nombre === NOMBRE
  );

  if (!estrella) {
    throw new Error(
      "El dato no sobrevivio al reinicio"
    );
  }

  console.log("Persistencia PostgreSQL comprobada");

  // limpia el dato de prueba al terminar
  const token = await obtenerToken();

  await fetch(`${api}/star/${estrella.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


const modo = process.argv[2];

if (modo === "crear") {
  await crear();
} else if (modo === "verificar") {
  await verificar();
} else {
  throw new Error("Use: crear o verificar");
}