import { Consumer } from "./Consumer";
import { Parcel } from "./Parcel";

export interface Order {
  id: string;
  consumer: Consumer;
  bill_id: string;
  latest_time_of_arrival: Date;
  parcel: Parcel;
  status: "PENDING" | "PICKED_UP" | "DELIVERED";
  delivery_job_id: string;
}