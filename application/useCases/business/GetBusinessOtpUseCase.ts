import { UnverifiedUserDto } from '@/domain/entities/Business';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';

export class GetBusinessOtpUseCase {
  constructor(private businessAccountRepository: IBusinessAccountRepository) {}

  async execute(phoneNumber: string, password: string): Promise<UnverifiedUserDto> {
    return this.businessAccountRepository.getOtp(phoneNumber, password);
  }
} 