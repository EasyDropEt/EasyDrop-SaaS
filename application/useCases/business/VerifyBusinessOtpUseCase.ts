import { BusinessDto } from '@/domain/entities/Business';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';

export class VerifyBusinessOtpUseCase {
  constructor(private businessAccountRepository: IBusinessAccountRepository) {}

  async execute(userId: string, otp: string): Promise<{ token: string; business: BusinessDto }> {
    return this.businessAccountRepository.verifyOtp(userId, otp);
  }
} 