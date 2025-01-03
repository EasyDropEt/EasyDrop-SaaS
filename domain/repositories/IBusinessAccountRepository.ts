import { Business } from '../entities/Business';

export interface IBusinessAccountRepository {
  // Core Business Account operations
  findById(id: string): Promise<Business | null>;
  findByEmail(email: string): Promise<Business | null>;
  create(business: Omit<Business, 'id'>): Promise<Business>;
  update(id: string, businessData: Partial<Business>): Promise<Business>;
  delete(id: string): Promise<void>;

  // Account Status and Verification
  verifyBusinessAccount(id: string): Promise<Business>;

  // Profile management
  updateContactInfo(
    id: string,
    data: Pick<Business, 'email' | 'phone_number'>
  ): Promise<Business>;

  updateBusinessProfile(
    id: string,
    data: {
      business_name: string;
      owner_first_name: string;
      owner_last_name: string;
      location: Business['location'];
    }
  ): Promise<Business>;

  // Usage
  getUsageMetrics(id: string): Promise<{
    activeDeliveries: number;
    monthlyDeliveries: number;
  }>;
}