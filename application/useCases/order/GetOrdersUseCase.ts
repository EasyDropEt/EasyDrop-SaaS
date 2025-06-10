import { Order } from '@/domain/entities/Order';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';

export class GetBusinessOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
} 