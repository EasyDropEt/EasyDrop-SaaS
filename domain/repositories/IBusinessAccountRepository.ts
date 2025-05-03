import { Business } from '../entities/Business';

export interface IBusinessAccountRepository {
  // Core Business Account operations
  create(business: Omit<Business, 'id'>): Promise<Business>;
  
  // Legacy login method - will be deprecated
  login(email: string, password: string): Promise<{ token: string; business: Business }>;
  
  // New OTP-based authentication
  getOtp(phoneNumber: string, password: string): Promise<{ message: string; user_id: string }>;
  verifyOtp(userId: string, otp: string): Promise<{ token: string; business: Business }>;
  
  // Get business details
  getBusinessById(): Promise<Business>;
}