import { Business } from '@/domain/entities/Business';
import { NotFoundError, ValidationError } from '@/domain/errors/AppError';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';
import { ApiClient } from '../api/ApiClient';

export class BusinessAccountRepository implements IBusinessAccountRepository {
  constructor(private apiClient: ApiClient) {}

  async create(business: Omit<Business, 'id'>): Promise<Business> {
    if (!business) {
      throw new ValidationError('Business data is required');
    }

    const response = await this.apiClient.post<{
      is_success: boolean;
      message: string;
      data: Business;
      errors: any[];
    }>('/business/register', business);
    
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Failed to create business account');
    }
    
    return response.data;
  }

  /**
   * @deprecated This method is being deprecated in favor of the OTP-based authentication flow.
   * Use getOtp() and verifyOtp() instead.
   */
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

  async getOtp(phoneNumber: string, password: string): Promise<{ message: string; user_id: string }> {
    if (!phoneNumber || !password) {
      throw new ValidationError('Phone number and password are required');
    }

    const response = await this.apiClient.post<{
      is_success: boolean;
      message: string;
      data: { message: string; user_id: string };
      errors: any[];
    }>('/business/login/get-otp', { phone_number: phoneNumber, password });
    
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Failed to send OTP');
    }
    
    return response.data;
  }

  async verifyOtp(userId: string, otp: string): Promise<{ token: string; business: Business }> {
    if (!userId || !otp) {
      throw new ValidationError('User ID and OTP are required');
    }

    const response = await this.apiClient.post<{
      is_success: boolean;
      message: string;
      data: { token: string; business: Business };
      errors: any[];
    }>('/business/login/verify', { user_id: userId, otp });
    
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Invalid OTP');
    }
    
    return response.data;
  }

  async getBusinessById(): Promise<Business> {
    const response = await this.apiClient.get<{
      is_success: boolean;
      message: string;
      data: Business;
      errors: any[];
    }>('/business/me');
    
    if (!response.is_success) {
      throw new NotFoundError('Business');
    }
    
    return response.data;
  }
}
