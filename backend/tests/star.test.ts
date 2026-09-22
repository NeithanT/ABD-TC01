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

    it("responde 200 con la lista cuando el filtro es valido", async () => {
    //Simula que la bd devuelve una estrella.
    (conexionBD.query as any).mockResolvedValueOnce({
      rows: [{ id: 1, nombre: "Sol", color: 100 }],
    });

    const respuesta = await request(app).get("/star?color=100");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual([{ id: 1, nombre: "Sol", color: 100 }]);
  });

  it("responde 200 con arreglo vacio si el filtro no encuentra nada", async () => {

    //Simula que la bd devuelve un arreglo vacio.
    (conexionBD.query as any).mockResolvedValueOnce({ rows: [] });

    const respuesta = await request(app).get("/star?color=1");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual([]);
  });

  it("responde 500 si la base falla", async () => {
    
    //Simula que la bd falla.
    (conexionBD.query as any).mockRejectedValueOnce(new Error("Error en la BD"));

    const respuesta = await request(app).get("/star");

    expect(respuesta.status).toBe(500);
  });

});