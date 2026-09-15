import { Router, type Request, type Response } from "express";
import conexionBD from "../db.ts";

const starRouter = Router();


//Metodos http

//===============================
// GET:
//GET  /star   => lista todas
//GET  /star?=color=123 => filtra por color
//GET  /star?masa=5.2 => filtra por masa
//GET  /star?usuario=erik => filtra por usuario_creador
//===============================
starRouter.get("/", async(req: Request, res: Response) => {
    const {color, masa, usuario} = req.query;

    // WHERE dinamicamente segun que filtros vengan
    const condiciones: string[] = [];
    const valores: unknown[] = [];

    if (color !== undefined) {
        valores.push(color);
        condiciones.push(`color = $${valores.length}`);
    }
    if (masa !== undefined) {
        valores.push(masa);
        condiciones.push(`masa = $${valores.length}`);
    }

    const where = condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "";
    
    try {
        const resultado = await conexionBD.query(
            `SELECT * FROM estrellas ${where}`,
            valores
        );
        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error("Error en GET /star:", error);
        res.status(500).json({ error: "Error interno"});
    }
})

export default starRouter;
