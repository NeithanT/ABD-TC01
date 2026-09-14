import {Pool} from 'pg';

const conexionBD = new Pool({

    host: process.env.DB_HOST, //Todo en variables de entorno
    port: Number(process.env.POSTRGE_INTERNAL_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,});

export default conexionBD;



