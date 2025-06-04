import { Order } from '@/domain/entities/Order';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';

export class CreateBatchOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(ordersData: Omit<Order, 'id'>[]): Promise<Order[]> {
    return this.orderRepository.createBatch(ordersData);
  }
} 