import { Order } from '@/domain/entities/Order';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';

export class GetBusinessOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(businessId: string): Promise<Order[]> {
    return this.orderRepository.findAll(businessId);
  }
} 