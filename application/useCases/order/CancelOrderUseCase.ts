import { Order } from '@/domain/entities/Order';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';

export class CancelOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}
 
  async execute(orderId: string): Promise<Order> {
    return this.orderRepository.cancelOrder(orderId);
  }
} 