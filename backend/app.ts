import express, { type Express, type Request, type Response } from 'express';
import healthRouter from './routes/health.ts';
import cors from 'cors';
import readyRouter from './routes/ready.ts';
import starRouter from './routes/star.ts';

const app: Express = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use('/health', healthRouter);
app.use('/ready', readyRouter);
app.use('/star',starRouter);

export default app;

//app.listen(process.env.BACKEND_INTERNAL_PORT);
