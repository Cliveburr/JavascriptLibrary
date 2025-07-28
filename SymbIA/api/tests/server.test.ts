import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createTestApp } from './test-app.js';

const app = createTestApp();

describe('API Health Check', () => {
  it('should return 200 for health endpoint', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'ok'
    });
    expect(response.body.timestamp).toBeDefined();
  });
});

describe('Auth Endpoints', () => {
  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@symbia.com',
          password: 'admin123'
        })
        .expect(200);

      expect(response.body).toMatchObject({
        token: expect.any(String),
        refreshToken: expect.any(String),
        user: {
          id: expect.any(String),
          email: 'admin@symbia.com',
          defaultMemoryId: expect.any(String)
        }
      });
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@symbia.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toMatchObject({
        error: 'Invalid credentials'
      });
    });

    it('should reject missing email', async () => {
      await request(app)
        .post('/auth/login')
        .send({
          password: 'admin123'
        })
        .expect(400);
    });

    it('should reject missing password', async () => {
      await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@symbia.com'
        })
        .expect(400);
    });

    it('should reject invalid email format', async () => {
      await request(app)
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'admin123'
        })
        .expect(400);
    });
  });
});

describe('Memories Endpoints', () => {
  describe('GET /memories', () => {
    it('should require authentication', async () => {
      await request(app)
        .get('/memories')
        .expect(401);
    });

    it('should return list of memories with valid token', async () => {
      const response = await request(app)
        .get('/memories')
        .set('Authorization', 'Bearer mock-jwt-token')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /memories', () => {
    it('should require authentication', async () => {
      await request(app)
        .post('/memories')
        .send({ name: 'Test Memory' })
        .expect(401);
    });

    it('should create a new memory with valid token', async () => {
      const memoryData = {
        name: 'Test Memory'
      };

      const response = await request(app)
        .post('/memories')
        .set('Authorization', 'Bearer mock-jwt-token')
        .send(memoryData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId: expect.any(String),
        name: 'Test Memory',
        createdAt: expect.any(String)
      });
    });

    it('should reject empty name even with valid token', async () => {
      await request(app)
        .post('/memories')
        .set('Authorization', 'Bearer mock-jwt-token')
        .send({ name: '' })
        .expect(400);
    });

    it('should reject missing name even with valid token', async () => {
      await request(app)
        .post('/memories')
        .set('Authorization', 'Bearer mock-jwt-token')
        .send({})
        .expect(400);
    });
  });
});