import { ApiClient } from '../api/ApiClient';
import { IIntegrationRepository } from '@/domain/repositories/IIntegrationRepository';
import { WebhookDto, CreateWebhookDto, ApiKeyDto, CreateApiKeyDto } from '@/domain/entities/Integration';
import { GenericResponse } from '@/domain/entities/Report';
import { ValidationError } from '@/domain/errors/AppError';

export class IntegrationRepository implements IIntegrationRepository {
  constructor(private apiClient: ApiClient) {}

  async getWebhook(): Promise<WebhookDto | null> {
    const response = await this.apiClient.get<GenericResponse<WebhookDto | null>>('/business/me/webhook');
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Failed to fetch webhook');
    }
    return response.data;
  }

  async createWebhook(data: CreateWebhookDto): Promise<WebhookDto> {
    if (!data.url) {
      throw new ValidationError('Webhook URL is required');
    }

    const response = await this.apiClient.post<GenericResponse<WebhookDto>>('/business/me/webhook', data);
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Failed to create webhook');
    }
    return response.data;
  }

  async getApiKeys(): Promise<ApiKeyDto[]> {
    const response = await this.apiClient.get<GenericResponse<ApiKeyDto[]>>('/business/me/api-keys');
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Failed to fetch API keys');
    }
    return response.data;
  }

  async createApiKey(data: CreateApiKeyDto): Promise<ApiKeyDto> {
    const response = await this.apiClient.post<GenericResponse<ApiKeyDto>>('/business/me/api-keys', data);
    if (!response.is_success) {
      throw new ValidationError(response.message || 'Failed to create API key');
    }
    return response.data;
  }

  async deleteApiKey(apiKeyPrefix: string): Promise<void> {
    if (!apiKeyPrefix) {
      throw new ValidationError('API key prefix is required');
    }

    await this.apiClient.delete(`/business/me/api-keys/${apiKeyPrefix}`);
  }
} 