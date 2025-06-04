import { Consumer } from "./Consumer";
import { Parcel } from "./Parcel";

export interface Order {
  id: string;
  consumer: Consumer;
  bill_id: string;
  latest_time_of_arrival: Date;
  parcel: Parcel;
  status: "PENDING" | "PICKED_UP" | "DELIVERED" | "CANCELLED";
  delivery_job_id: string;
}

export interface CreateOrdersDto {
  orders: {
    recipient: {
      name: string;
      email: string;
      phone: string;
    };
    delivery_location: {
      address: string;
      postal_code: string;
      city: string;
      country: string;
    };
    parcel: {
      size: 'small' | 'medium' | 'large';
      weight: number;
      fragile: boolean;
      dimensions: {
        length: number;
        width: number;
        height: number;
      };
    };
    notes?: string;
    latest_time_of_delivery: string; // ISO date string
  }[];
}