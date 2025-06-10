import { TrackOrderDto } from "@/domain/entities/Order";
import { IOrderRepository } from "@/domain/repositories/IOrderRepository";

export class TrackOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: string): Promise<TrackOrderDto> {
    return this.orderRepository.trackOrder(orderId);
  }
} 