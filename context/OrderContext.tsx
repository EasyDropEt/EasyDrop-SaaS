import React, { createContext, useContext, ReactNode } from 'react';
import { Order } from '@/domain/entities/Order';
import { useOrders } from '@/hooks/useOrders';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  fetchOrders: (businessId: string) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<Order | null>;
  createOrder: (orderData: Omit<Order, 'id'>) => Promise<Order | null>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const orderHook = useOrders();
  
  return (
    <OrderContext.Provider value={orderHook}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
}; 