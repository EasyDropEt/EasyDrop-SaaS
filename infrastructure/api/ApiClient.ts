import { AppError, AuthenticationError, AuthorizationError, NotFoundError } from '@/domain/errors/AppError';

export class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    // Use mock server by default, allow override with environment variable
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gateway.service.easydrop-et.space';
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private handleError(error: any): never {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Response) {
      switch (error.status) {
        case 401:
          throw new AuthenticationError();
        case 403:
          throw new AuthorizationError();
        case 404:
          throw new NotFoundError('Resource');
        default:
          throw new AppError(
            'An unexpected error occurred',
            'UNEXPECTED_ERROR',
            500
          );
      }
    }

    throw new AppError(
      'An unexpected error occurred',
      'UNEXPECTED_ERROR',
      500
    );
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const headers = this.getHeaders();
      console.log('Request headers:', headers);
      
      // Determine if the provided endpoint is an absolute URL. If so, use it directly;
      // otherwise, prefix it with the configured baseUrl.
      const isAbsoluteUrl = /^https?:\/\//i.test(endpoint);
      const finalUrl = isAbsoluteUrl ? endpoint : `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(finalUrl, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        switch (response.status) {
          case 401:
            throw new AuthenticationError();
          case 403:
            throw new AuthorizationError();
          case 404:
            throw new NotFoundError(errorData.resource || 'Resource');
          default:
            throw new AppError(
              errorData.message || 'An unexpected error occurred',
              errorData.code || 'UNEXPECTED_ERROR',
              response.status
            );
        }
      }

      return response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string): Promise<void> {
    await this.request(endpoint, {
      method: 'DELETE',
    });
  }
} 