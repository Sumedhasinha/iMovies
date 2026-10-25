// server/tests/auth.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';

describe('Authentication & Authorization APIs', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user successfully with safe user details and token', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'Password123!'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.name).toBe('Jane Doe');
    expect(res.body.data.user.email).toBe('jane.doe@example.com');
    expect(res.body.data.user.role).toBe('user');
    expect(res.body.data.user.password).toBeUndefined(); // Never expose password hash
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject signup with duplicate email address with 409 Conflict', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'Password123!'
      });

    const duplicateRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Jane Clone',
        email: 'jane.doe@example.com',
        password: 'Password456!'
      });

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.success).toBe(false);
    expect(duplicateRes.body.message).toMatch(/already exists/i);
  });

  it('should reject signup with invalid email or short password', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'J',
        email: 'not-an-email',
        password: '123'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('should login an existing user with correct credentials', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'John Smith',
        email: 'john.smith@example.com',
        password: 'SecretPass2026!'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john.smith@example.com',
        password: 'SecretPass2026!'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('john.smith@example.com');
  });

  it('should reject login with wrong password using generic message', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'John Smith',
        email: 'john.smith@example.com',
        password: 'SecretPass2026!'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john.smith@example.com',
        password: 'WrongPassword!'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('should access protected /api/auth/me when authenticated with Bearer token', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Alex Morgan',
        email: 'alex.morgan@imovies.vip',
        password: 'CinemaPass2026!'
      });

    const token = signupRes.body.data.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.data.user.email).toBe('alex.morgan@imovies.vip');
  });

  it('should reject /api/auth/me without token with 401 Unauthorized', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should forbid non-admin users from accessing /api/admin endpoints', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Normal User',
        email: 'user@example.com',
        password: 'UserPass2026!'
      });

    const token = signupRes.body.data.token;

    const adminRes = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(adminRes.status).toBe(403);
    expect(adminRes.body.success).toBe(false);
    expect(adminRes.body.message).toMatch(/privileges are required/i);
  });
});
