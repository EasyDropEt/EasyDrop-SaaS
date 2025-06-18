import { test, expect } from '@playwright/test';
import { BusinessAccountRepository } from '../infrastructure/repositories/BusinessAccountRepository';
import { ValidationError } from '../domain/errors/AppError';
import { ApiClient } from '../infrastructure/api/ApiClient';

// We only test validation logic (inputs) so a real ApiClient is fine because
// requests will never be executed for invalid params.
const repoFactory = () => new BusinessAccountRepository(new ApiClient());

test.describe('BusinessAccountRepository validation', () => {
  test.describe('create()', () => {
    const baseData = {
      business_name: 'Biz',
      owner_first_name: 'First',
      owner_last_name: 'Last',
      email: 'biz@example.com',
      phone_number: '0911000000',
      password: 'Password1!',
      location: {
        address: 'addr',
        postal_code: '1000',
        city: 'Addis',
        country: 'ET',
        latitude: 9.03,
        longitude: 38.74,
      },
    } as const;

    test('throws when business_name missing', async () => {
      const repo = repoFactory();
      await expect(async () => {
        await repo.create({ ...baseData, business_name: '' } as any);
      }).rejects.toBeInstanceOf(ValidationError);
    });

    test('throws when phone_number missing', async () => {
      const repo = repoFactory();
      await expect(async () => {
        await repo.create({ ...baseData, phone_number: '' } as any);
      }).rejects.toBeInstanceOf(ValidationError);
    });

    test('throws when password missing', async () => {
      const repo = repoFactory();
      await expect(async () => {
        await repo.create({ ...baseData, password: '' } as any);
      }).rejects.toBeInstanceOf(ValidationError);
    });
  });

  test.describe('login()', () => {
    test('throws when email missing', async () => {
      const repo = repoFactory();
      await expect(repo.login('', 'pass')).rejects.toBeInstanceOf(ValidationError);
    });
    test('throws when password missing', async () => {
      const repo = repoFactory();
      await expect(repo.login('user@example.com', '')).rejects.toBeInstanceOf(ValidationError);
    });
  });

  test.describe('getOtp()', () => {
    test('throws when phone number missing', async () => {
      const repo = repoFactory();
      await expect(repo.getOtp('', 'Password')).rejects.toBeInstanceOf(ValidationError);
    });
    test('throws when password missing', async () => {
      const repo = repoFactory();
      await expect(repo.getOtp('0911222333', '')).rejects.toBeInstanceOf(ValidationError);
    });
  });

  test.describe('verifyOtp()', () => {
    test('throws when userId missing', async () => {
      const repo = repoFactory();
      await expect(repo.verifyOtp('', '123456')).rejects.toBeInstanceOf(ValidationError);
    });
    test('throws when otp missing', async () => {
      const repo = repoFactory();
      await expect(repo.verifyOtp('user-1', '')).rejects.toBeInstanceOf(ValidationError);
    });
  });
}); 