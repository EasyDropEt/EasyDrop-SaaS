import { Business } from '../entities/Business';

export interface IBusinessAccountRepository {
  // Core Business Account operations
  create(business: Omit<Business, 'id'>): Promise<Business>;
  login(email: string, password: string): Promise<{ token: string; business: Business }>;
}