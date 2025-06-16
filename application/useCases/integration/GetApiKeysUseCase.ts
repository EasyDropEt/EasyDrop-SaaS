import { IntegrationRepository } from '@/infrastructure/repositories/IntegrationRepository';
import { ApiKeyDto } from '@/domain/entities/Integration';

export class GetApiKeysUseCase {
  constructor(private integrationRepository: IntegrationRepository) {}

  async execute(): Promise<ApiKeyDto[]> {
    return this.integrationRepository.getApiKeys();
  }
} 