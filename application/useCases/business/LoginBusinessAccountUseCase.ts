import { Business } from '@/domain/entities/Business';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';

export class LoginBusinessAccountUseCase {
  constructor(private businessAccountRepository: IBusinessAccountRepository) {}

  async execute(email: string, password: string): Promise<{ token: string; business: Business }> {
    return this.businessAccountRepository.login(email, password);
  }
} 