import {describe,it,expect, vi} from 'vitest';
import request from 'supertest';
import conexionBD from '../db.ts';
import app from '../app.ts';

//Reemplazo la conexion real por una mockeada
vi.mock('../db.ts', () => ({
    default: { query: vi.fn(), 
    },
}));

const queryMock = vi.mocked(conexionBD.query);


describe('/ready', () => {
    
    it('Respone 200 y READY cuando la base de datos funciona', async () =>{

        //Configura el mock para que devuelva un resul exitoso (rows: [])
        queryMock.mockResolvedValueOnce({rows: []} as any);

        const respuesta = await request(app).get('/ready');
        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toEqual({ status: 'READY' });

    });
});
