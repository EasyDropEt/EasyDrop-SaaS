import { test, expect } from '@playwright/test';
import { BusinessAccountRepository } from '../infrastructure/repositories/BusinessAccountRepository';
import { ApiClient } from '../infrastructure/api/ApiClient';
import type {
  CreateBusinessAccountDto,
  BusinessDto,
  BusinessAccountDto,
  UnverifiedUserDto,
} from '../domain/entities/Business';

// Save original fetch to restore later
const originalFetch = global.fetch;

test.afterAll(() => {
  global.fetch = originalFetch;
});

function mockFetch(responseResolver: (url: string, init?: RequestInit) => any) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.fetch = (async (url: string, init?: RequestInit) => {
    const res = responseResolver(url as string, init);
    return {
      ok: res.status < 400,
      status: res.status,
      json: async () => res.body,
    } as any;
  }) as typeof fetch;
}

const sampleBusiness = (idx: number): CreateBusinessAccountDto => ({
  business_name: `Biz ${idx}`,
  owner_first_name: `Owner${idx}`,
  owner_last_name: `L${idx}`,
  email: `biz${idx}@example.com`,
  phone_number: `0911${(200000 + idx).toString().slice(1)}`,
  password: `Password_${idx}!`,
  location: {
    address: 'Address',
    postal_code: '1000',
    city: 'Addis',
    country: 'ET',
    latitude: 9.0,
    longitude: 38.7,
  },
});

test.describe('BusinessAccountRepository integration with ApiClient', () => {
  test('create() orchestrates auth & core service calls', async () => {
    const dto = sampleBusiness(1);

    mockFetch((url) => {
      if (url.includes('auth.service')) {
        return {
          status: 200,
          body: {
            is_success: true,
            message: 'OK',
            data: { user_id: 'user-123' },
            errors: [],
          },
        };
      }
      if (url.includes('core.service')) {
        const business: BusinessDto = {
          id: 'biz-123',
          business_name: dto.business_name,
          owner_first_name: dto.owner_first_name,
          owner_last_name: dto.owner_last_name,
          phone_number: dto.phone_number,
          email: dto.email,
          location: {
            address: dto.location.address,
            city: dto.location.city,
            latitude: dto.location.latitude,
            longitude: dto.location.longitude,
            postal_code: dto.location.postal_code,
          },
        };
        return {
          status: 200,
          body: {
            is_success: true,
            message: 'OK',
            data: business,
            errors: [],
          },
        };
      }
      throw new Error(`Unexpected URL ${url}`);
    });

    const repo = new BusinessAccountRepository(new ApiClient());
    const result = await repo.create(dto);

    expect(result.business_name).toBe(dto.business_name);
    expect(result.id).toBe('biz-123');
  });

  test('getOtp() returns unverified user dto', async () => {
    const phone = '0911000000';
    const password = 'Pass123!';

    mockFetch((url) => {
      expect(url).toContain('/business/login/get-otp');
      const unverified: UnverifiedUserDto = { id: 'unv-1', message: 'sent' };
      return { status: 200, body: { is_success: true, message: 'OK', data: unverified, errors: [] } };
    });

    const repo = new BusinessAccountRepository(new ApiClient());
    const result = await repo.getOtp(phone, password);
    expect(result.id).toBe('unv-1');
  });

  test('verifyOtp() returns token + business', async () => {
    const userId = 'user-1';
    const otp = '123456';

    mockFetch((url) => {
      expect(url).toContain('/business/login/verify');
      const dto: BusinessAccountDto = {
        id: 'biz-55',
        business_name: 'Biz',
        owner_first_name: 'Owner',
        owner_last_name: 'L',
        phone_number: '0911222333',
        email: 'biz@example.com',
        location: { address: 'A', city: 'C', latitude: 0, longitude: 0, postal_code: '1' },
        token: 'jwt-token',
      };
      return { status: 200, body: { is_success: true, message: 'OK', data: dto, errors: [] } };
    });

    const repo = new BusinessAccountRepository(new ApiClient());
    const { token, business } = await repo.verifyOtp(userId, otp);
    expect(token).toBe('jwt-token');
    expect(business.id).toBe('biz-55');
  });

  test('getMyBusiness() returns profile', async () => {
    mockFetch(() => {
      const business: BusinessDto = {
        id: 'biz-77',
        business_name: 'Biz77',
        owner_first_name: 'O',
        owner_last_name: 'L',
        phone_number: '0911000000',
        email: 'biz77@example.com',
        location: { address: 'A', city: 'C', latitude: 0, longitude: 0, postal_code: '1' },
      };
      return { status: 200, body: { is_success: true, message: 'OK', data: business, errors: [] } };
    });

    const repo = new BusinessAccountRepository(new ApiClient());
    const profile = await repo.getMyBusiness();
    expect(profile.id).toBe('biz-77');
  });

  test('getNotifications() returns list', async () => {
    mockFetch(() => {
      const notifications = [
        { id: 'n1', message: 'Hello', createdAt: 'now' },
        { id: 'n2', message: 'World', createdAt: 'now' },
      ];
      return { status: 200, body: { is_success: true, message: 'OK', data: notifications, errors: [] } };
    });

    const repo = new BusinessAccountRepository(new ApiClient());
    const list = await repo.getNotifications();
    expect(list.length).toBe(2);
  });
}); 