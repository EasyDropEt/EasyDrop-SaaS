import { Business } from '@/domain/entities/Business';
import { NotFoundError, ValidationError } from '@/domain/errors/AppError';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';
import { ApiClient } from '../api/ApiClient';

export class BusinessAccountRepository implements IBusinessAccountRepository {
  constructor(private apiClient: ApiClient) {}

  async create(business: Omit<Business, 'id'>): Promise<Business> {
    const response = await this.apiClient.post<{
      is_success: boolean;
      message: string;
      data: Business;
      errors: any[];
    }>('/business/account/create', business);
    
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Failed to create business account');
    }
    
    return response.data;
  }

  async login(email: string, password: string): Promise<{ token: string; business: Business }> {
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const response = await this.apiClient.post<{
      is_success: boolean;
      message: string;
      data: { token: string; business: Business };
      errors: any[];
    }>('/business/account/login', { email, password });
    
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Login failed');
    }
    
    return response.data;
  }
}
