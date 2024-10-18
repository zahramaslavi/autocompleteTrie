import request from 'supertest';
import { startServer, closeServer} from '../server';

let server: any;

beforeAll(async () => {
  // Start the server for tests
  server = await startServer();
});

afterAll(async () => {
  closeServer();
});

describe('GET /greet', () => {
  it('should return a greeting message', async () => {
    const res = await request(server).get('/greet');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Hello, world!');
  });
});