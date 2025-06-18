import { ApiClient } from '../api/ApiClient';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';
import { Business, BusinessAccountDto, BusinessDto, CreateBusinessAccountDto, LoginBusinessDto, LoginUserVerifyDto, UnverifiedUserDto } from '@/domain/entities/Business';
import { Notification } from '@/domain/entities/Notification';
import { ValidationError } from '@/domain/errors/AppError';

export class BusinessAccountRepository implements IBusinessAccountRepository {
  constructor(private apiClient: ApiClient) {}

  async create(businessData: CreateBusinessAccountDto): Promise<BusinessDto> {
    if (!businessData.business_name || !businessData.phone_number || !businessData.password) {
      throw new ValidationError('Business name, phone number, and password are required');
    }

    const response = await this.apiClient.post<{
      is_success: boolean;
      message: string;
      data: BusinessDto;
      errors: any[];
    }>('/business/register', businessData);
    
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

  async getOtp(phoneNumber: string, password: string): Promise<UnverifiedUserDto> {
    if (!phoneNumber || !password) {
      throw new ValidationError('Phone number and password are required');
    }

    const response = await this.apiClient.post<{
      is_success: boolean;
      message: string;
      data: UnverifiedUserDto;
      errors: any[];
    }>('/business/login/get-otp', { phone_number: phoneNumber, password });
    
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Failed to send OTP');
    }
    
    return response.data;
  }

  async verifyOtp(userId: string, otp: string): Promise<{ token: string; business: BusinessDto }> {
    if (!userId || !otp) {
      throw new ValidationError('User ID and OTP are required');
    }

    const response = await this.apiClient.post<{
      is_success: boolean;
      message: string;
      data: BusinessAccountDto;
      errors: any[];
    }>('/business/login/verify', { user_id: userId, otp });
    
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Invalid OTP');
    }
    
    // The API now returns BusinessAccountDto which includes the token
    return {
      token: response.data.token,
      business: {
        id: response.data.id,
        business_name: response.data.business_name,
        owner_first_name: response.data.owner_first_name,
        owner_last_name: response.data.owner_last_name,
        phone_number: response.data.phone_number,
        email: response.data.email,
        location: response.data.location
      }
    };
  }

  async getMyBusiness(): Promise<BusinessDto> {
    const response = await this.apiClient.get<{
      is_success: boolean;
      message: string;
      data: BusinessDto;
      errors: any[];
    }>('/business/me/profile');
    
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Failed to get business data');
    }
    
    return response.data;
  }

  async getNotifications(): Promise<Notification[]> {
    const response = await this.apiClient.get<{
      is_success: boolean;
      message: string;
      data: Notification[];
      errors: any[];
    }>('/business/me/notifications');
    
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Failed to get notifications');
    }
    
    return response.data;
  }
}
