import {it, expect} from 'vitest';
import request from 'supertest';
import app from '../app.ts';

it ('/health responde 200 con status OK', async () => {

    const respuesta = await request(app).get('/health');
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({status: 'OK'});
})