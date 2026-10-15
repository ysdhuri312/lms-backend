import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { db } from '../../src/configs/db';
import { usersTable } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

describe('Test user register functionality', () => {
  const email = 'test@test.com';

  beforeEach(async () => {
    // Remove test user before each test.
    await db.delete(usersTable).where(eq(usersTable.email, email));
  });

  afterAll(async () => {
    // Remove test data after all tests.
    await db.delete(usersTable).where(eq(usersTable.email, email));
  });

  // Arrange
  const endpoint = '/api/v1/auth/register';
  const userPayload = {
    name: 'Yogesh Dhuri',
    email: email,
    password: '123456',
  };

  it('should register a new user', async () => {
    // Act
    const res = await request(app).post(endpoint).send(userPayload);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      success: true,
      message: 'User register successfully',
    });

    // verify user registered in database
    const registeredUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    expect(registeredUser).toHaveLength(1);
    expect(registeredUser[0]?.email).toBe(email);

    // never return or stored password in plain text
    expect(registeredUser[0]?.password).not.toBe('123456');
  });

  it('should reject an already registered email', async () => {
    // First registered with email
    await request(app).post(endpoint).send(userPayload);

    // Then use same email and try it.
    const res = await request(app).post(endpoint).send(userPayload);

    expect(res.status).toBe(401);
  });
});
