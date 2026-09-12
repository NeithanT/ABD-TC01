import {Router, type Request, type Response} from 'express';

const healthRouter = Router();
healthRouter.get('/', (req: Request, res: Response) => {res.status(200).json({status: 'OK'})});

export default healthRouter;