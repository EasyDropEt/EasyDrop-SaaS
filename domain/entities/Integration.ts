export interface WebhookDto {
  id?: string;
  url: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface CreateWebhookDto {
  url: string;
}

export interface ApiKeyDto {
  api_key_prefix: string;
  name?: string;
  description?: string;
  status?: string;
  created_at?: string;
  last_used_at?: string;
  // Some APIs return the full key only on creation – keep optional
  api_key?: string;
  key?: string;
}

export interface CreateApiKeyDto {
  name: string;
  description: string;
} 