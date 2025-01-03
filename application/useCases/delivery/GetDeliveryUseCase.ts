import { Delivery } from '@/domain/entities/Delivery';
import { IDeliveryRepository } from '@/domain/repositories/IDeliveryRepository';

export class GetDeliveryUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(trackingNumber: string): Promise<Delivery | null> {
    return this.deliveryRepository.findByTrackingNumber(trackingNumber);
  }
} 