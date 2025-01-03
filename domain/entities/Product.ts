export interface Product {
  id: string;
  name: string;
  sku: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  price: number;
  createdAt: Date;
  updatedAt: Date;
} 