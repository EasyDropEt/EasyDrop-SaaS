import { Product } from "./Product";

export interface DeliveryStatus {
  id: string;
  name: 'pending' | 'in_transit' | 'delivered' | 'failed';
  timestamp: Date;
}

export interface Delivery {
  id: string;
  trackingNumber: string;
  status: DeliveryStatus;
  origin: string;
  destination: string;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  products: Product[];
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
} 