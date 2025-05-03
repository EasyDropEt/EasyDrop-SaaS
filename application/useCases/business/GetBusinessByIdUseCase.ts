import { Business } from '@/domain/entities/Business';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';

export class GetBusinessByIdUseCase {
  constructor(private businessAccountRepository: IBusinessAccountRepository) {}

  async execute(): Promise<Business> {
    return this.businessAccountRepository.getBusinessById();
  }
} 