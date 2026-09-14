import {Router, type Request, type Response} from 'express';
import conexionBD from '../db.ts';

const readyRouter = Router();

readyRouter.get ('/', async (req: Request, res: Response) => {

    try{
        await conexionBD.query('SELECT 1');
        {res.status(200).json({status: 'READY'});}
    
    } catch (error) {
        console.error('Error en /ready:', error); //Para ver si encuentro xq no arranca la bd
        res.status(503).json({status: 'NO READY'});

    }});

export default readyRouter;