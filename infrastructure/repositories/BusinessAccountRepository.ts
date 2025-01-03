import { Business } from '@/domain/entities/Business';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';
import { ApiClient } from '../api/ApiClient';

export class BusinessAccountRepository implements IBusinessAccountRepository {
  constructor(private apiClient: ApiClient) {}

  async findById(id: string): Promise<Business | null> {
    try {
      return await this.apiClient.get<Business>(`/businesses/${id}`);
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<Business | null> {
    try {
      return await this.apiClient.get<Business>(`/businesses/email/${email}`);
    } catch (error) {
      return null;
    }
  }

  async create(business: Omit<Business, 'id'>): Promise<Business> {
    return await this.apiClient.post<Business>('/businesses', business);
  }

  async update(id: string, businessData: Partial<Business>): Promise<Business> {
    return await this.apiClient.put<Business>(`/businesses/${id}`, businessData);
  }

  async delete(id: string): Promise<void> {
    await this.apiClient.delete(`/businesses/${id}`);
  }

  async verifyBusinessAccount(id: string): Promise<Business> {
    return await this.apiClient.post<Business>(`/businesses/${id}/verify`, {});
  }

  async updateContactInfo(
    id: string,
    data: Pick<Business, 'email' | 'phone_number'>
  ): Promise<Business> {
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
    return await this.apiClient.patch<Business>(
      `/businesses/${id}/profile`,
      data
    );
  }

  async getUsageMetrics(id: string): Promise<{
    activeDeliveries: number;
    monthlyDeliveries: number;
  }> {
    return await this.apiClient.get<{
      activeDeliveries: number;
      monthlyDeliveries: number;
    }>(`/businesses/${id}/metrics`);
  }
}
