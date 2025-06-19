import { test, expect } from '@playwright/test';

import { CreateBusinessAccountUseCase } from '../application/useCases/business/CreateBusinessAccountUseCase';
import { GetBusinessOtpUseCase } from '../application/useCases/business/GetBusinessOtpUseCase';

import type { IBusinessAccountRepository } from '../domain/repositories/IBusinessAccountRepository';
import type {
  BusinessDto,
  CreateBusinessAccountDto,
  UnverifiedUserDto,
} from '../domain/entities/Business';

// --- Mock repository -------------------------------------------------------
class MockBusinessAccountRepository implements IBusinessAccountRepository {
  public recordedCreateCalls: CreateBusinessAccountDto[] = [];
  public recordedOtpCalls: Array<{ phone: string; password: string }> = [];

  constructor(private seedId = 0) {}

  async create(businessData: CreateBusinessAccountDto): Promise<BusinessDto> {
    this.recordedCreateCalls.push(businessData);
    return {
      id: `biz-${++this.seedId}`,
      business_name: businessData.business_name,
      owner_first_name: businessData.owner_first_name,
      owner_last_name: businessData.owner_last_name,
      phone_number: businessData.phone_number,
      email: businessData.email,
      location: {
        address: businessData.location.address,
        city: businessData.location.city,
        latitude: businessData.location.latitude,
        longitude: businessData.location.longitude,
        postal_code: businessData.location.postal_code,
      },
    };
  }

  async login(): Promise<any> {
    throw new Error('not implemented');
  }
  async getOtp(phoneNumber: string, password: string): Promise<UnverifiedUserDto> {
    this.recordedOtpCalls.push({ phone: phoneNumber, password });
    return {
      id: `otp-${++this.seedId}`,
      message: 'OTP sent',
    };
  }
  async verifyOtp(): Promise<any> {
    throw new Error('not implemented');
  }
  async getMyBusiness(): Promise<any> {
    throw new Error('not implemented');
  }
  async getNotifications(): Promise<any> {
    throw new Error('not implemented');
  }
}

// --- Fixtures --------------------------------------------------------------
const sampleLocation = {
  address: '123 Street',
  postal_code: '1000',
  city: 'Addis Ababa',
  country: 'ET',
  latitude: 9.03,
  longitude: 38.74,
};

const createBusinessSamples: CreateBusinessAccountDto[] = Array.from({ length: 5 }).map((_, i) => ({
  business_name: `Business ${i + 1}`,
  owner_first_name: 'Owner',
  owner_last_name: `${i + 1}`,
  email: `owner${i + 1}@example.com`,
  phone_number: `0911${(100000 + i).toString().slice(1)}`,
  location: { ...sampleLocation },
  password: `Passw0rd!${i}`,
}));

// --- Tests -----------------------------------------------------------------

test.describe('CreateBusinessAccountUseCase', () => {
  createBusinessSamples.forEach((sample) => {
    test(`creates business "${sample.business_name}" successfully`, async () => {
      const repo = new MockBusinessAccountRepository();
      const useCase = new CreateBusinessAccountUseCase(repo);

      const result = await useCase.execute(sample);

      // It should have returned the same business_name & recorded the call
      expect(result.business_name).toBe(sample.business_name);
      expect(repo.recordedCreateCalls.length).toBe(1);
      expect(repo.recordedCreateCalls[0]).toEqual(sample);
    });
  });
});

test.describe('GetBusinessOtpUseCase', () => {
  const credentials = [
    { phone: '0911123456', pass: 'Password1!' },
    { phone: '0911654321', pass: 'Password2!' },
    { phone: '0911098765', pass: 'Password3!' },
    { phone: '0911234567', pass: 'Password4!' },
    { phone: '0911765432', pass: 'Password5!' },
  ];

  credentials.forEach(({ phone, pass }) => {
    test(`requests OTP for phone ${phone}`, async () => {
      const repo = new MockBusinessAccountRepository();
      const useCase = new GetBusinessOtpUseCase(repo);

      const result = await useCase.execute(phone, pass);

      expect(result.message).toBe('OTP sent');
      expect(repo.recordedOtpCalls).toEqual([{ phone, password: pass }]);
    });
  });
}); 