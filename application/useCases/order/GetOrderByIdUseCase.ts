import { Order } from '@/domain/entities/Order';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';

export class GetBusinessOrderByIdUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: string): Promise<Order | null> {
    return this.orderRepository.findById(orderId);
  }
} 