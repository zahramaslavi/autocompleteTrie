import request from 'supertest';
import app from '../src/index';

describe('GET /greet', () => {
  it('should return a greeting message', async () => {
    const res = await request(app).get('/greet');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Hello, world!');
  });
});