import { test, expect } from '@playwright/test';
import { ApiClient } from '../infrastructure/api/ApiClient';
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  AppError,
} from '../domain/errors/AppError';

// Helper to patch fetch with a mock implementation
const patchFetch = (impl: typeof fetch) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.fetch = impl;
};

// Restore after each test
const originalFetch = global.fetch;

test.afterEach(() => {
  patchFetch(originalFetch as any);
});

test.describe('ApiClient error mapping', () => {
  const scenarios = [
    { status: 401, errorClass: AuthenticationError, name: 'AuthenticationError' },
    { status: 403, errorClass: AuthorizationError, name: 'AuthorizationError' },
    { status: 404, errorClass: NotFoundError, name: 'NotFoundError' },
    { status: 500, errorClass: AppError, name: 'AppError' },
  ];

  scenarios.forEach(({ status, errorClass, name }) => {
    test(`maps status ${status} -> ${name}`, async () => {
      // Mock fetch to return a failing response
      patchFetch((async () => ({
        ok: false,
        status,
        json: async () => ({ message: 'fail', resource: 'Entity', code: 'ERR' }),
      })) as any);

      const client = new ApiClient();
      await expect(client.get('/whatever')).rejects.toBeInstanceOf(errorClass);
    });
  });

  test('network error translates to AppError', async () => {
    patchFetch((async () => {
      throw new Error('offline');
    }) as any);

    const client = new ApiClient();
    await expect(client.get('/whatever')).rejects.toBeInstanceOf(AppError);
  });
}); 