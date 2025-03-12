import { Order } from '../entities/Order';

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findAll(customerId: string): Promise<Order[]>;
  create(order: Omit<Order, 'id'>): Promise<Order>;
} 