import { Delivery } from '../entities/Delivery';

export interface IDeliveryRepository {
  findById(id: string): Promise<Delivery | null>;
  findByTrackingNumber(trackingNumber: string): Promise<Delivery | null>;
  findAll(customerId: string): Promise<Delivery[]>;
  create(delivery: Omit<Delivery, 'id'>): Promise<Delivery>;
  update(id: string, delivery: Partial<Delivery>): Promise<Delivery>;
} 