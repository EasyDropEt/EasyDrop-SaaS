import { Business } from '@/domain/entities/Business';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';

export class CreateBusinessAccountUseCase {
  constructor(private businessAccountRepository: IBusinessAccountRepository) {}

  async execute(businessData: Omit<Business, 'id'>): Promise<Business> {
    return this.businessAccountRepository.create(businessData);
  }
} 