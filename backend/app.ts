import express, { type Express, type Request, type Response } from 'express';
import healthRouter from './routes/health.js';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/health', healthRouter);

app.listen(3000);
