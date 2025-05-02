import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';

export class GetBusinessOtpUseCase {
  constructor(private businessAccountRepository: IBusinessAccountRepository) {}

  async execute(email: string): Promise<{ message: string }> {
    return this.businessAccountRepository.getOtp(email);
  }
} 