import { Order } from '@/domain/entities/Order';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import { ApiClient } from '../api/ApiClient';

export class OrderRepository implements IOrderRepository {
  constructor(private apiClient: ApiClient) {}

  async findById(id: string): Promise<Order | null> {
    try {
      const response = await this.apiClient.get<{
        is_success: boolean;
        message: string;
        data: Order;
        errors: any[];
      }>(`/business/orders/order/${id}`);
      
      return response.is_success ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async findAll(businessId: string): Promise<Order[]> {
    const response = await this.apiClient.get<{
      is_success: boolean;
      message: string;
      data: Order[];
      errors: any[];
    }>(`/business/orders/${businessId}`);
    
    return response.is_success ? response.data : [];
  }

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    const response = await this.apiClient.post<{
      is_success: boolean;
      message: string;
      data: Order;
      errors: any[];
    }>('/business/orders', order);
    
    return response.data;
  }
} 