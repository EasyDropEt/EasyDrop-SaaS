import { Order, TrackOrderDto } from '../entities/Order';

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  create(order: Omit<Order, 'id'>): Promise<Order>;
  createBatch(orders: Omit<Order, 'id'>[]): Promise<Order[]>;
  cancelOrder(orderId: string): Promise<Order>;
  trackOrder(orderId: string): Promise<TrackOrderDto>;
} 