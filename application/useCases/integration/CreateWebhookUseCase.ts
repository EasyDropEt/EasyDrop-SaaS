import { IntegrationRepository } from '@/infrastructure/repositories/IntegrationRepository';
import { WebhookDto, CreateWebhookDto } from '@/domain/entities/Integration';

export class CreateWebhookUseCase {
  constructor(private integrationRepository: IntegrationRepository) {}

  async execute(data: CreateWebhookDto): Promise<WebhookDto> {
    return this.integrationRepository.createWebhook(data);
  }
} 