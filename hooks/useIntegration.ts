import { useEffect, useState } from 'react';
import { ApiKeyDto, CreateApiKeyDto, CreateWebhookDto, WebhookDto } from '@/domain/entities/Integration';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { IntegrationRepository } from '@/infrastructure/repositories/IntegrationRepository';
import { GetWebhookUseCase } from '@/application/useCases/integration/GetWebhookUseCase';
import { CreateWebhookUseCase } from '@/application/useCases/integration/CreateWebhookUseCase';
import { GetApiKeysUseCase } from '@/application/useCases/integration/GetApiKeysUseCase';
import { CreateApiKeyUseCase } from '@/application/useCases/integration/CreateApiKeyUseCase';
import { DeleteApiKeyUseCase } from '@/application/useCases/integration/DeleteApiKeyUseCase';
import { useBusinessContext } from '@/context/BusinessContext';

export const useIntegration = () => {
  const { token, isAuthenticated } = useBusinessContext();

  const [webhook, setWebhook] = useState<WebhookDto | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeyDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newlyCreatedApiKey, setNewlyCreatedApiKey] = useState<ApiKeyDto | null>(null);

  const createRepository = (): IntegrationRepository => {
    const apiClient = new ApiClient();
    if (token) apiClient.setAuthToken(token);
    return new IntegrationRepository(apiClient);
  };

  const fetchWebhook = async () => {
    try {
      const repo = createRepository();
      const getWebhookUseCase = new GetWebhookUseCase(repo);
      const data = await getWebhookUseCase.execute();
      setWebhook(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch webhook');
    }
  };

  const fetchApiKeys = async () => {
    try {
      const repo = createRepository();
      const getApiKeysUseCase = new GetApiKeysUseCase(repo);
      const keys = await getApiKeysUseCase.execute();
      setApiKeys(keys);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch API keys');
    }
  };

  const refresh = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchWebhook(), fetchApiKeys()]);
    } finally {
      setLoading(false);
    }
  };

  const createWebhook = async (data: CreateWebhookDto) => {
    const repo = createRepository();
    const createWebhookUseCase = new CreateWebhookUseCase(repo);
    await createWebhookUseCase.execute(data);
    await fetchWebhook();
  };

  const createApiKey = async (data: CreateApiKeyDto) => {
    const repo = createRepository();
    const createApiKeyUseCase = new CreateApiKeyUseCase(repo);
    const key = await createApiKeyUseCase.execute(data);
    setNewlyCreatedApiKey(key);
    await fetchApiKeys();
  };

  const deleteApiKey = async (prefix: string) => {
    const repo = createRepository();
    const deleteApiKeyUseCase = new DeleteApiKeyUseCase(repo);
    await deleteApiKeyUseCase.execute(prefix);
    await fetchApiKeys();
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return {
    webhook,
    apiKeys,
    loading,
    error,
    newlyCreatedApiKey,
    refresh,
    createWebhook,
    createApiKey,
    deleteApiKey,
    clearNewApiKey: () => setNewlyCreatedApiKey(null)
  };
}; 