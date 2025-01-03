import { Business } from '@/domain/entities/Business';
import { NotFoundError, ValidationError } from '@/domain/errors/AppError';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';
import { ApiClient } from '../api/ApiClient';

export class BusinessAccountRepository implements IBusinessAccountRepository {
  constructor(private apiClient: ApiClient) {}

  async findById(id: string): Promise<Business | null> {
    try {
      return await this.apiClient.get<Business>(`/businesses/${id}`);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Business | null> {
    if (!email) {
      throw new ValidationError('Email is required');
    }

    try {
      return await this.apiClient.get<Business>(`/businesses/email/${email}`);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  async create(business: Omit<Business, 'id'>): Promise<Business> {
    if (!business.business_name || !business.email) {
      throw new ValidationError('Business name and email are required');
    }

    return await this.apiClient.post<Business>('/businesses', business);
  }

  async update(id: string, businessData: Partial<Business>): Promise<Business> {
    if (!id) {
      throw new ValidationError('Business ID is required');
    }

    return await this.apiClient.put<Business>(`/businesses/${id}`, businessData);
  }

  async delete(id: string): Promise<void> {
    if (!id) {
      throw new ValidationError('Business ID is required');
    }

    await this.apiClient.delete(`/businesses/${id}`);
  }

  async verifyBusinessAccount(id: string): Promise<Business> {
    if (!id) {
      throw new ValidationError('Business ID is required');
    }

    return await this.apiClient.post<Business>(`/businesses/${id}/verify`, {});
  }

  async updateContactInfo(
    id: string,
    data: Pick<Business, 'email' | 'phone_number'>
  ): Promise<Business> {
    if (!id) {
      throw new ValidationError('Business ID is required');
    }
    if (!data.email && !data.phone_number) {
      throw new ValidationError('Either email or phone number must be provided');
    }

    return await this.apiClient.patch<Business>(
      `/businesses/${id}/contact`,
      data
    );
  }

  async updateBusinessProfile(
    id: string,
    data: {
      business_name: string;
      owner_first_name: string;
      owner_last_name: string;
      location: Business['location'];
    }
  ): Promise<Business> {
    if (!id) {
      throw new ValidationError('Business ID is required');
    }
    if (!data.business_name) {
      throw new ValidationError('Business name is required');
    }
    return await this.apiClient.patch<Business>(
      `/businesses/${id}/profile`,
      data
    );
  }

  async getUsageMetrics(id: string): Promise<{
    activeDeliveries: number;
    monthlyDeliveries: number;
  }> {
    if (!id) {
      throw new ValidationError('Business ID is required');
    }
    return await this.apiClient.get<{
      activeDeliveries: number;
      monthlyDeliveries: number;
    }>(`/businesses/${id}/metrics`);
  }
}
