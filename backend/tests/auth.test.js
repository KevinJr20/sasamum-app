const request = require('supertest');
const app = require('../index');
const prisma = require('../prismaClient');

beforeAll(async () => {
  // clean users table
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth', () => {
  test('register and login flow', async () => {
    const email = `test+${Date.now()}@example.com`;
    const registerRes = await request(app).post('/api/auth/register').send({ email, password: 'password123', name: 'Tester' });
    expect(registerRes.statusCode).toBe(200);
    expect(registerRes.body.user).toBeDefined();
    const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'password123' });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });
});
