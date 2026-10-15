import { test, expect } from 'vitest';

import { app } from '../src/app.js';
import request from 'supertest';

test('check weather server active or not', async () => {
  // ARRANGE - Initialize all necessary data or application state for the test.

  // ACT - Invoke the target function, method, or user action being tested.
  const res = await request(app).get('/');

  // ASSERT - Check whether the actual output or state change matches the expected result.
  expect(res.statusCode).toBe(200);
  expect(res.body).toMatchObject({
    success: true,
    message: 'Welcome to API v2.0.0',
  });
});
