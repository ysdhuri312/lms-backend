import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { verifyToken } from '../../src/utils/token';

describe('Test user longin functionality', () => {
  // Arrange
  const endpoint = '/api/v1/auth/login';
  const userPayload = {
    email: 'test@test.com',
    password: '123456',
  };

  it('should login a user', async () => {
    // First registered with email
    await request(app).post('/api/v1/auth/register').send({
      name: 'Yogesh Dhuri',
      email: 'test@test.com',
      password: '123456',
    });

    const res = await request(app).post(endpoint).send(userPayload);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
    });
  });

  it('should received cookies in header', async () => {
    const email = 'test@test.com';

    // First registered with email
    await request(app).post('/api/v1/auth/register').send({
      name: 'Yogesh Dhuri',
      email,
      password: '123456',
    });

    const res = await request(app).post(endpoint).send(userPayload);
    const cookies = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie']
      : [];

    const tokenCookie = cookies.find((cookie: string) =>
      cookie.startsWith('token=Bearer'),
    ) as string | undefined;
    expect(tokenCookie).toBeDefined();
    if (!tokenCookie) return;

    const tokenValue = tokenCookie.split(';')[0];
    expect(tokenValue).toBeDefined();
    if (!tokenValue) return;

    const token = tokenValue.split('=')[1]?.split('%20')[1];
    expect(token).toBeDefined();
    if (!token) return;

    const decode = verifyToken(token);
    expect(decode.email).toMatch(email);
  });
});
