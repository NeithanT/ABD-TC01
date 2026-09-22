import { describe, it, expect, vi } from "vitest";
import { requiereToken, requiereRol } from "../middleware/auth.ts";

//Crea un objeto res falso para simular la respuesta de Express
//vi.fn crea una funcion mockeada que permite revisar si status o json fueron llamados
const resFalso = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);  //Crea un status que devuelve res para permitir encadenar .json()
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

//Pruebas para la funcion requiereToken
describe("requiereToken", () => {
  it("responde 401 si no hay header Authorization", async () => {

    //Simula una que sin token
    const req: any = { headers: {} };
    const res = resFalso();
    const next = vi.fn();

    await requiereToken(req, res, next);

    //Sin token, la respuesta debe ser 401 y next no debe ser llamado
    expect(res.status).toHaveBeenCalledWith(401);

    //Verifica que next no fue llamado
    expect(next).not.toHaveBeenCalled();
  });

  it("responde 401 si el header no empieza con 'Bearer '", async () => {

    //Hay autorizacion, pero tiene un formato incorrecto
    const req: any = { headers: { authorization: "Token abc123" } };
    const res = resFalso();
    const next = vi.fn();

    await requiereToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});