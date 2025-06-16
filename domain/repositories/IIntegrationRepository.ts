import { WebhookDto, CreateWebhookDto, ApiKeyDto, CreateApiKeyDto } from '../entities/Integration';

export interface IIntegrationRepository {
  getWebhook(): Promise<WebhookDto | null>;
  createWebhook(data: CreateWebhookDto): Promise<WebhookDto>;

  getApiKeys(): Promise<ApiKeyDto[]>;
  createApiKey(data: CreateApiKeyDto): Promise<ApiKeyDto>;
  deleteApiKey(apiKeyPrefix: string): Promise<void>;
} 