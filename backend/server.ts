import app from './app.ts';

app.listen(process.env.BACKEND_INTERNAL_PORT, () => {
  console.log(`Servidor corrinedo en el puerto ${process.env.BACKEND_INTERNAL_PORT}`);
});