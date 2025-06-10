export interface Parcel {
  id?: string;
  size: 'small' | 'medium' | 'large';
  weight: number;
  fragile: boolean;
  
  // API may return dimensions as separate properties
  length?: number;
  width?: number;
  height?: number;
  
  // API may return dimensions as an object
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
} 