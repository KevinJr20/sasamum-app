const request = require('supertest');
const app = require('../index');
const prisma = require('../prismaClient');

describe('Articles Endpoints', () => {
  beforeEach(async () => {
    await prisma.article.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new article', async () => {
    const res = await request(app)
      .post('/api/articles')
      .send({
        title: 'Test Article',
        body: 'This is a test article body',
        author: 'Test Author'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Article');
  });

  it('should list all articles', async () => {
    // Create test article
    await prisma.article.create({
      data: {
        title: 'Test Article',
        body: 'Test Body',
        author: 'Test Author'
      }
    });

    const res = await request(app)
      .get('/api/articles');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});