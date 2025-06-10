import { useState, useCallback } from 'react';
import { Order } from '@/domain/entities/Order';
import { GetBusinessOrdersUseCase } from '@/application/useCases/order/GetOrdersUseCase';
import { GetBusinessOrderByIdUseCase } from '@/application/useCases/order/GetOrderByIdUseCase';
import { CreateBusinessOrderUseCase } from '@/application/useCases/order/CreateOrderUseCase';
import { CreateBatchOrdersUseCase } from '@/application/useCases/order/CreateBatchOrdersUseCase';
import { OrderRepository } from '@/infrastructure/repositories/OrderRepository';
import { ApiClient } from '@/infrastructure/api/ApiClient';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to create an authenticated ApiClient
  const getAuthenticatedApiClient = (): ApiClient => {
    const apiClient = new ApiClient();
    const token = localStorage.getItem('business_token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    apiClient.setAuthToken(token);
    return apiClient;
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiClient = getAuthenticatedApiClient();
      const orderRepository = new OrderRepository(apiClient);
      const getOrdersUseCase = new GetBusinessOrdersUseCase(orderRepository);
      
      const fetchedOrders = await getOrdersUseCase.execute();
      setOrders(fetchedOrders);
      return fetchedOrders;
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiClient = getAuthenticatedApiClient();
      const orderRepository = new OrderRepository(apiClient);
      const getOrderByIdUseCase = new GetBusinessOrderByIdUseCase(orderRepository);
      
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
      const apiClient = getAuthenticatedApiClient();
      const orderRepository = new OrderRepository(apiClient);
      const createOrderUseCase = new CreateBusinessOrderUseCase(orderRepository);
      
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

  const createBatchOrders = useCallback(async (ordersData: Omit<Order, 'id'>[]) => {
    setLoading(true);
    setError(null);
    try {
      const apiClient = getAuthenticatedApiClient();
      const orderRepository = new OrderRepository(apiClient);
      const createBatchOrdersUseCase = new CreateBatchOrdersUseCase(orderRepository);
      
      const newOrders = await createBatchOrdersUseCase.execute(ordersData);
      setOrders(prev => [...prev, ...newOrders]);
      return newOrders;
    } catch (err) {
      setError('Failed to create orders');
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
    createOrder,
    createBatchOrders
  };
}; 