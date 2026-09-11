import {Router, type Request, type Response} from 'express';

const router = Router();
router.get('/', (req: Request, res: Response) => {res.status(200).json({status: 'OK'})});

export default router;