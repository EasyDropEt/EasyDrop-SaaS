import { Business, BusinessDto, CreateBusinessAccountDto, UnverifiedUserDto } from '../entities/Business';
import { Notification } from '../entities/Notification';

export interface IBusinessAccountRepository {
  // Core Business Account operations
  create(businessData: CreateBusinessAccountDto): Promise<BusinessDto>;
  
  // Legacy login method - will be deprecated
  login(email: string, password: string): Promise<{ token: string; business: Business }>;
  
  // New OTP-based authentication
  getOtp(phoneNumber: string, password: string): Promise<UnverifiedUserDto>;
  verifyOtp(userId: string, otp: string): Promise<{ token: string; business: BusinessDto }>;
  
  // Get business details
  getMyBusiness(): Promise<BusinessDto>;

  // Get business notifications
  getNotifications(): Promise<Notification[]>;
}