import { IntegrationRepository } from '@/infrastructure/repositories/IntegrationRepository';
import { ApiKeyDto, CreateApiKeyDto } from '@/domain/entities/Integration';

export class CreateApiKeyUseCase {
  constructor(private integrationRepository: IntegrationRepository) {}

  async execute(data: CreateApiKeyDto): Promise<ApiKeyDto> {
    return this.integrationRepository.createApiKey(data);
  }
} 