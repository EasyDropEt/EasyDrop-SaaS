import { Order, TrackOrderDto } from '@/domain/entities/Order';
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
      business: apiOrder.business,
      consumer: apiOrder.consumer,
      bill_id: apiOrder.bill?.id || apiOrder.bill_id,
      latest_time_of_arrival: new Date(apiOrder.latest_time_of_delivery || apiOrder.latest_time_of_arrival),
      parcel: apiOrder.parcel,
      status: apiOrder.order_status || apiOrder.status,
      delivery_job_id: apiOrder.delivery_job_id
    };
  }

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    // For single order creation, we'll use the batch endpoint with a single order
    const response = await this.createOne(order);
    return response; // Return the first (and only) order
  }

  async createOne(order: Omit<Order, 'id'>): Promise<Order> {
    // Map to new single-order DTO expected by backend
    const firstName = order.consumer.first_name || order.consumer.name?.split(' ')[0] || 'First';
    const lastName = order.consumer.last_name || order.consumer.name?.split(' ').slice(1).join(' ') || 'Last';

    const location = order.consumer.location || (order as any).delivery_location || {
      address: 'Default Address',
      postal_code: '00000',
      city: 'Default City',
      country: 'Default Country',
      latitude: 0,
      longitude: 0,
    };

    const requestBody = {
      first_name: firstName,
      last_name: lastName,
      phone_number: order.consumer.phone_number,
      email: order.consumer.email,
      location,
      latest_time_of_delivery:
        order.latest_time_of_arrival instanceof Date
          ? order.latest_time_of_arrival.toISOString()
          : new Date(order.latest_time_of_arrival).toISOString(),
      parcel: {
        size: order.parcel.size,
        weight: order.parcel.weight,
        fragile: order.parcel.fragile,
        length: (order.parcel.dimensions as any)?.length ?? 0,
        width: (order.parcel.dimensions as any)?.width ?? 0,
        height: (order.parcel.dimensions as any)?.height ?? 0,
      },
      notes: (order as any).notes || undefined,
    };

    const response = await this.apiClient.post<{
      is_success: boolean;
      message: string;
      data: any;
      errors: any[];
    }>('/business/me/orders', requestBody);

    if (!response.is_success) {
      throw new Error(response.message || 'Failed to create order');
    }

    return this.transformApiOrderToEntity(response.data);
  }

  async createBatch(orders: Omit<Order, 'id'>[]): Promise<Order[]> {
    // Transform internal Order entities to API CreateOrdersDto format
    const orderRequests = orders.map(order => {
      // Extract consumer name parts if first/last not provided
      const firstName = order.consumer.first_name || order.consumer.name?.split(' ')[0] || 'First';
      const lastName = order.consumer.last_name || order.consumer.name?.split(' ').slice(1).join(' ') || 'Last';

      const location = order.consumer.location || (order as any).delivery_location || {
        address: "Default Address",
        postal_code: "00000",
        city: "Default City",
        country: "Default Country",
        latitude: 0,
        longitude: 0,
      };

      return {
        consumer: {
          first_name: firstName,
          last_name: lastName,
          phone_number: order.consumer.phone_number,
          email: order.consumer.email,
          location,
        },
        latest_time_of_delivery:
          order.latest_time_of_arrival instanceof Date
            ? order.latest_time_of_arrival.toISOString()
            : new Date(order.latest_time_of_arrival).toISOString(),
        parcel: {
          size: order.parcel.size,
          weight: order.parcel.weight,
          fragile: order.parcel.fragile,
          dimensions: order.parcel.dimensions,
        },
      };
    });

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

  async trackOrder(orderId: string): Promise<TrackOrderDto> {
    const response = await this.apiClient.get<{
      is_success: boolean;
      message: string;
      data: {
        order: any;
        driver?: any;
      };
      errors: any[];
    }>(`/orders/${orderId}/track`);
    
    if (!response.is_success || !response.data) {
      throw new Error(response.message || 'Failed to track order');
    }

    // Transform API response to domain entity
    return {
      order: this.transformApiOrderToEntity(response.data.order),
      driver: response.data.driver
    };
  }
} 