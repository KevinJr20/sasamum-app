const request = require('supertest');
const app = require('../index');
const prisma = require('../prismaClient');

describe('Chats Endpoints', () => {
  beforeEach(async () => {
    await prisma.chat.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new chat message', async () => {
    const res = await request(app)
      .post('/api/chats')
      .send({
        text: 'Test message',
        userId: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Test message');
  });

  it('should list all chat messages', async () => {
    // Create test message
    await prisma.chat.create({
      data: {
        text: 'Test message',
        userId: 1
      }
    });

    const res = await request(app)
      .get('/api/chats');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});