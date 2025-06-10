import { Consumer } from "./Consumer";
import { Parcel } from "./Parcel";

// Business entity definition
export interface Business {
  id: string;
  business_name: string;
  owner_first_name: string;
  owner_last_name: string;
  phone_number: string;
  email: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    postal_code: string;
    city: string;
  };
}

export interface Order {
  id: string;
  consumer: Consumer;
  business?: Business;
  bill_id?: string;
  // API might return bill object instead of bill_id
  bill?: {
    id: string;
    amount_in_birr: number;
    bill_status: string;
    due_date: string;
  };
  latest_time_of_arrival: Date;
  // API might use latest_time_of_delivery instead
  latest_time_of_delivery?: string;
  parcel: Parcel;
  status: "PENDING" | "PICKED_UP" | "DELIVERED" | "CANCELLED";
  // API might use order_status instead
  order_status?: string;
  delivery_job_id: string;
}

export interface TrackOrderDto {
  order: Order;
  driver?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image?: string;
    phone_number: string;
    email: string;
    car: {
      make: string;
      model: string;
      year: number;
      color: string;
      seats: number;
      license_plate_number: string;
      registration_number: string;
    };
    location: {
      address: string;
      latitude: number;
      longitude: number;
      postal_code: string;
      city: string;
    };
  };
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