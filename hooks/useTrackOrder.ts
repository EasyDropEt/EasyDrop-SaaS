'use client';

import { useState, useEffect, useRef } from 'react';
import { TrackOrderDto } from '@/domain/entities/Order';
import { TrackOrderUseCase } from '@/application/useCases/order/TrackOrderUseCase';
import { OrderRepository } from '@/infrastructure/repositories/OrderRepository';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { getAuthToken } from '@/utils/auth';

/**
 * Hook for tracking an order's delivery status
 * @param orderId The ID of the order to track
 * @param pollingInterval How often to check for updates (in ms)
 */
export const useTrackOrder = (
  orderId?: string, 
  pollingInterval: number = 30000
) => {
  const [trackData, setTrackData] = useState<TrackOrderDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to store the previous orderId for comparison
  const prevOrderIdRef = useRef<string | undefined>(orderId);

  useEffect(() => {
    // Reset state if orderId changes
    if (prevOrderIdRef.current !== orderId) {
      setTrackData(null);
      setError(null);
      prevOrderIdRef.current = orderId;
    }

    if (!orderId) return;

    const fetchTrackingData = async () => {
      if (!orderId) return;

      setLoading(true);
      
      try {
        // Get authentication token
        const token = getAuthToken();
        
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        // Create the repository and use case following clean architecture
        const apiClient = new ApiClient();
        // Set the auth token on the API client
        apiClient.setAuthToken(token);
        
        const orderRepository = new OrderRepository(apiClient);
        const trackOrderUseCase = new TrackOrderUseCase(orderRepository);
        
        const data = await trackOrderUseCase.execute(orderId);
        
        // Only update if data actually changed to prevent unnecessary re-renders
        setTrackData(prevData => {
          if (!prevData) return data;
          
          // Compare with previous data
          const isSame = 
            prevData.driver_location.latitude === data.driver_location.latitude &&
            prevData.driver_location.longitude === data.driver_location.longitude &&
            prevData.status === data.status;
            
          return isSame ? prevData : data;
        });
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchTrackingData();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchTrackingData, pollingInterval);
    
    // Clean up interval on unmount or when orderId changes
    return () => clearInterval(intervalId);
  }, [orderId, pollingInterval]);

  return { trackData, loading, error };
}; 