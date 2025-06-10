import { BusinessDto, CreateBusinessAccountDto } from '@/domain/entities/Business';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';

export class CreateBusinessAccountUseCase {
  constructor(private businessAccountRepository: IBusinessAccountRepository) {}

  async execute(businessData: CreateBusinessAccountDto): Promise<BusinessDto> {
    return this.businessAccountRepository.create(businessData);
  }
} 