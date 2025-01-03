import { Delivery } from '@/domain/entities/Delivery';
import { IDeliveryRepository } from '@/domain/repositories/IDeliveryRepository';
import { ApiClient } from '../api/ApiClient';

export class DeliveryRepository implements IDeliveryRepository {
  constructor(private apiClient: ApiClient) {}

  async findById(id: string): Promise<Delivery | null> {
    try {
      return await this.apiClient.get<Delivery>(`/orders/${id}`);
    } catch (error) {
      return null;
    }
  }

  async findByTrackingNumber(trackingNumber: string): Promise<Delivery | null> {
    try {
      return await this.apiClient.get<Delivery>(`/orders/tracking/${trackingNumber}`);
    } catch (error) {
      return null;
    }
  }

  async findAll(customerId: string): Promise<Delivery[]> {
    return await this.apiClient.get<Delivery[]>(`/${customerId}/orders`);
  }

  async create(delivery: Omit<Delivery, 'id'>): Promise<Delivery> {
    return await this.apiClient.post<Delivery>('/orders', delivery);
  }

  async update(id: string, delivery: Partial<Delivery>): Promise<Delivery> {
    return await this.apiClient.post<Delivery>(`/orders/${id}`, delivery);
  }
} 