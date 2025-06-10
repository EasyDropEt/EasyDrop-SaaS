import { BusinessDto } from '@/domain/entities/Business';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';

export class GetMyBusinessUseCase {
  constructor(private businessAccountRepository: IBusinessAccountRepository) {}

  async execute(): Promise<BusinessDto> {
    return this.businessAccountRepository.getMyBusiness();
  }
} 