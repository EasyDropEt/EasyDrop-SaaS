import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';

export class GetBusinessOtpUseCase {
  constructor(private businessAccountRepository: IBusinessAccountRepository) {}

  async execute(phoneNumber: string, password: string): Promise<{ message: string; user_id: string }> {
    return this.businessAccountRepository.getOtp(phoneNumber, password);
  }
} 