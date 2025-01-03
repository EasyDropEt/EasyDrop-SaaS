export interface Parcel {
  id: string;
  size: "small" | "medium" | "large";
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  price: number;
  fragile: boolean;
  createdAt: Date;
  updatedAt: Date;
} 