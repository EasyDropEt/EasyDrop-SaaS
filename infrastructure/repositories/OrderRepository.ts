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
        data: any; // Use any for API response, then transform
        errors: any[];
      }>(`/business/me/orders/${id}`);
      
      if (!response.is_success || !response.data) {
        return null;
      }

      // Transform API response to domain entity
      return this.transformApiOrderToEntity(response.data);
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<Order[]> {
    const response = await this.apiClient.get<{
      is_success: boolean;
      message: string;
      data: any[]; // Use any for API response, then transform
      errors: any[];
    }>('/business/me/orders');
    
    if (!response.is_success || !response.data) {
      return [];
    }

    // Transform API response to domain entities
    return response.data.map(order => this.transformApiOrderToEntity(order));
  }

  private transformApiOrderToEntity(apiOrder: any): Order {
    return {
      id: apiOrder.id,
      consumer: apiOrder.consumer,
      bill_id: apiOrder.bill_id,
      latest_time_of_arrival: new Date(apiOrder.latest_time_of_arrival),
      parcel: apiOrder.parcel,
      status: apiOrder.status,
      delivery_job_id: apiOrder.delivery_job_id
    };
  }

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    // For single order creation, we'll use the batch endpoint with a single order
    const response = await this.createBatch([order]);
    return response[0]; // Return the first (and only) order
  }

  async createBatch(orders: Omit<Order, 'id'>[]): Promise<Order[]> {
    // Transform internal Order entities to API CreateOrdersDto format
    const orderRequests = orders.map(order => ({
      recipient: {
        name: order.consumer.name,
        email: order.consumer.email,
        phone: order.consumer.phone_number
      },
      delivery_location: (order as any).delivery_location || {
        address: "Default Address",
        postal_code: "00000", 
        city: "Default City",
        country: "Default Country"
      },
      parcel: {
        size: order.parcel.size,
        weight: order.parcel.weight,
        fragile: order.parcel.fragile,
        dimensions: order.parcel.dimensions
      },
      notes: (order as any).notes || "Order created via business portal",
      latest_time_of_delivery: order.latest_time_of_arrival instanceof Date 
        ? order.latest_time_of_arrival.toISOString()
        : new Date(order.latest_time_of_arrival).toISOString()
    }));

    const response = await this.apiClient.post<{
      is_success: boolean;
      message: string;
      data: any[]; // Use any for API response, then transform
      errors: any[];
    }>('/business/me/orders', { orders: orderRequests });
    
    if (!response.is_success) {
      throw new Error(response.message || 'Failed to create orders');
    }
    
    // Transform API response to domain entities
    return response.data.map(order => this.transformApiOrderToEntity(order));
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const response = await this.apiClient.post<{
      is_success: boolean;
      message: string;
      data: any; // Use any for API response, then transform
      errors: any[];
    }>(`/business/me/orders/${orderId}/cancel`, {});
    
    if (!response.is_success) {
      throw new Error(response.message || 'Failed to cancel order');
    }
    
    // Transform API response to domain entity
    return this.transformApiOrderToEntity(response.data);
  }
} 