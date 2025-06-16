import { IntegrationRepository } from '@/infrastructure/repositories/IntegrationRepository';

export class DeleteApiKeyUseCase {
  constructor(private integrationRepository: IntegrationRepository) {}

  async execute(apiKeyPrefix: string): Promise<void> {
    return this.integrationRepository.deleteApiKey(apiKeyPrefix);
  }
} 