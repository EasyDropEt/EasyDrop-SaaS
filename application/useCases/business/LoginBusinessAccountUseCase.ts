import { Business } from '@/domain/entities/Business';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';

/**
 * @deprecated This use case is being deprecated in favor of the OTP-based authentication flow.
 * Use GetBusinessOtpUseCase and VerifyBusinessOtpUseCase instead.
 */
export class LoginBusinessAccountUseCase {
  constructor(private businessAccountRepository: IBusinessAccountRepository) {}

  async execute(email: string, password: string): Promise<{ token: string; business: Business }> {
    return this.businessAccountRepository.login(email, password);
  }
} 