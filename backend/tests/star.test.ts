import { vi, describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import conexionBD from "../db.ts";
import app from "../app.ts";

//Simula la conexion a la base de datos
vi.mock("../db.ts", () => ({
  default: { query: vi.fn() },
}));

//Simula un usuario autenticado para probar las rutas de /star
vi.mock("../middleware/auth.ts", () => ({
  requiereToken: (req: any, _res: any, next: any) => {
    req.usuario = { id: "1", username: "erik", roles: ["user"] };
    next();
  },
  requiereRol: (_rol: string) => (_req: any, _res: any, next: any) => next(),
}));



beforeEach(() => {
  vi.clearAllMocks();
});


// prueba para GET sin id
describe("GET /star", () => {
  it("responde 400 si color no es un entero", async () => {
    const respuesta = await request(app).get("/star?color=abc");
    expect(respuesta.status).toBe(400);
  });

  it("responde 400 con un parametro no reconocido", async () => {
    const respuesta = await request(app).get("/star?feaf=algo");
    expect(respuesta.status).toBe(400);
  });

  it("responde 400 si masa no es numerica", async () => {
    const respuesta = await request(app).get("/star?masa=hola");
    expect(respuesta.status).toBe(400);
  });

  it("responde 400 si usuario viene vacio", async () => {
    const respuesta = await request(app).get("/star?usuario=");
    expect(respuesta.status).toBe(400);
  });

  it("responde 400 si nombre viene vacio", async () => {
    const respuesta = await request(app).get("/star?nombre=");
    expect(respuesta.status).toBe(400);
  });

  it("responde 400 si color esta fuera de rango", async () => {
    const respuesta = await request(app).get("/star?color=99999999");
    expect(respuesta.status).toBe(400);
  });

});