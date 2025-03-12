import { Order } from '@/domain/entities/Order';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';

export class CreateBusinessOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderData: Omit<Order, 'id'>): Promise<Order> {
    return this.orderRepository.create(orderData);
  }
} 