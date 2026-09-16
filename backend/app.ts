import express, { type Express, type Request, type Response } from 'express';
import healthRouter from './routes/health.ts';
import readyRouter from './routes/ready.ts';
import starRouter from './routes/star.ts';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/health', healthRouter);
app.use('/ready', readyRouter);
app.use('/star',starRouter);

app.listen(3000);
