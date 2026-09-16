import { Router, type Request, type Response } from "express";
import conexionBD from "../db.ts";
import type { CrearEstrellaDTO, FiltroEstrellaDTO } from "../dtos.ts";

const PARAMS_PERMITIDOS = ["color", "masa", "usuario", "nombre"];
const starRouter = Router();
//Metodos http

//===============================
// GET:
//GET  /star   => lista todas
//GET  /star?color=123 => filtra por color
//GET  /star?masa=5.2 => filtra por masa
//GET  /star?usuario=erik => filtra por usuario_creador
//GET /star?nombre=pluton => filtra por nombre 
//===============================
starRouter.get("/", async(req: Request, res: Response) => {
    // para manejar parametros sucios
    const parametrosRecibidos = Object.keys(req.query);
    const parametrosInvalidos = parametrosRecibidos.filter(p => !PARAMS_PERMITIDOS.includes(p));

    if (parametrosInvalidos.length > 0) {
        return res.status(400).json({
            error: `parámetros no reconocidos ${parametrosInvalidos.join(", ")}`
        })
    }

    const {color, masa, usuario, nombre} = req.query;
    const filtro: FiltroEstrellaDTO = {};
    // WHERE dinamicamente segun que filtros vengan
    const condiciones: string[] = [];
    const valores: unknown[] = [];

    // validaciones de color si todo bien => push
    if (color !== undefined) {
        if (typeof color !== "string" || !/^\d+$/.test(color)) {
            return res.status(400).json({error: "color debe ser un entero"});
        }
        const colorNum = Number(color);
        if (colorNum >= 16777216) {
             return res.status(400).json({error: "color fuera de rango"});
        }

        filtro.color = colorNum;
        valores.push(colorNum);
        condiciones.push(`color = $${valores.length}`);
    }

    // validaciones de masa 
    if (masa !== undefined) {
        if (typeof masa !== "string" || Number.isNaN(Number(masa))) {
            return res.status(400).json({error: "masa debe ser un numero"});
        }

        filtro.masa = Number(masa);
        valores.push(masa);
        condiciones.push(`masa = $${valores.length}`);
    }
    
    //usuario 
    if (usuario !== undefined) {
        if (typeof usuario !== "string" || usuario.trim() === "") {
        return res.status(400).json({ error: "usuario inválido" });
        }

        filtro.usuario_creador = usuario;
        valores.push(usuario);
        condiciones.push(`usuario_creador = $${valores.length}`);
    }

    // nombre
    if (nombre !== undefined) {
        if (typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({ error: "nombre inválido" });
        }

        filtro.nombre = nombre;
        valores.push(nombre);
        condiciones.push(`nombre = $${valores.length}`);
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

//=====================================
// POST:
// POST /star   body: CrearEstrellaDTO
// 201 creado, //body 404 not found
// para quien lo vea : falta validacion del radio ya estoy cansado jefe, alguien que migre esto a un ORM 
//==========================================
starRouter.post("/", async(req: Request, res: Response) => {
    const { nombre, color, masa, cord_x, cord_y, usuario_creador } =req.body;

    //validaciones:
    // validaciones.nombre
    if (typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(404).json({ error: "nombre inválido"});
    }

    // validaciones.color
    if (typeof color !== "number" || !Number.isInteger(color) || color < 0 || color >= 16777216 ) {
        return res.status(404).json({ error: "color inválido"});
    }

    // validaciones.masa
    if (typeof masa !== "number" || Number.isNaN(masa)){
        return res.status(404).json({ error: "masa inválida"});
    }

    // validaciones.cord_x
    if (typeof cord_x !== "number" || Number.isNaN(cord_x)){
        return res.status(404).json({ error: "cord_x inválida"});
    }

    // validaciones.cord_y
    if (typeof cord_y !== "number" || Number.isNaN(cord_y)){
        return res.status(404).json({ error: "cord_y inválida"});
    }

    // validaciones.usuario_creador
    if (typeof usuario_creador !== "string" || usuario_creador.trim() === "") {
        return res.status(404).json({ error: "usuario inválido"});
    }

    const nuevaEstrella : CrearEstrellaDTO = { nombre, color, masa, cord_x, cord_y, usuario_creador };
    // insertar a la base de datos
    try {
        const resultado = await conexionBD.query(
            `INSERT INTO estrellas (nombre, color, masa, cord_x, cord_y, usuario_creador)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [nuevaEstrella.nombre,nuevaEstrella.color, nuevaEstrella.masa, 
            nuevaEstrella.cord_x, nuevaEstrella.cord_y, nuevaEstrella.usuario_creador ]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (error: any) {
        if (error.code === "23505") {
        return res.status(400).json({ error: "ya existe una estrella con ese nombre para este usuario" });
        }
        console.error("Error en POST /star:", error);
        res.status(500).json({ error: "Error interno" });
    }
});


//===============================
//DELETE：
//DELETE /star/:id  
//===============================
starRouter.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string" || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: "id inválido" });
  }

  try {
    const resultado = await conexionBD.query(
      `DELETE FROM estrellas WHERE id = $1`,
      [id]
    );
    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: "id no encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error en DELETE /star:", error);
    res.status(500).json({ error: "Error interno" });
  }
});



export default starRouter;



//body 404 not found
//body  400 incompleto 
// post conflict 