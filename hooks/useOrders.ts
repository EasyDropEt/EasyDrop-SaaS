import { useState, useCallback } from 'react';
import { Order } from '@/domain/entities/Order';
import { GetBusinessOrdersUseCase } from '@/application/useCases/order/GetOrdersUseCase';
import { GetBusinessOrderByIdUseCase } from '@/application/useCases/order/GetOrderByIdUseCase';
import { CreateBusinessOrderUseCase } from '@/application/useCases/order/CreateOrderUseCase';
import { OrderRepository } from '@/infrastructure/repositories/OrderRepository';
import { ApiClient } from '@/infrastructure/api/ApiClient';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize repository and use cases
  const apiClient = new ApiClient();
  const orderRepository = new OrderRepository(apiClient);
  const getOrdersUseCase = new GetBusinessOrdersUseCase(orderRepository);
  const getOrderByIdUseCase = new GetBusinessOrderByIdUseCase(orderRepository);
  const createOrderUseCase = new CreateBusinessOrderUseCase(orderRepository);

  const fetchOrders = useCallback(async (businessId: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedOrders = await getOrdersUseCase.execute(businessId);
      setOrders(fetchedOrders);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const order = await getOrderByIdUseCase.execute(orderId);
      setCurrentOrder(order);
      return order;
    } catch (err) {
      setError('Failed to fetch order details');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData: Omit<Order, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await createOrderUseCase.execute(orderData);
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    } catch (err) {
      setError('Failed to create order');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    currentOrder,
    loading,
    error,
    fetchOrders,
    fetchOrderById,
    createOrder
  };
}; 