import { IntegrationRepository } from '@/infrastructure/repositories/IntegrationRepository';
import { WebhookDto } from '@/domain/entities/Integration';

export class GetWebhookUseCase {
  constructor(private integrationRepository: IntegrationRepository) {}

  async execute(): Promise<WebhookDto | null> {
    return this.integrationRepository.getWebhook();
  }
} 