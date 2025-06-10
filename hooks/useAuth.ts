'use client';

import { useState, useEffect } from 'react';
import { getAuthToken, removeAuthToken } from '@/utils/auth';
import { useRouter } from 'next/navigation';

/**
 * Hook for handling authentication state
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  // Function to handle logout
  const logout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    router.push('/business/login');
  };

  // Function to redirect to login if not authenticated
  const requireAuth = (redirectTo: string = '/business/login') => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
    return isAuthenticated;
  };

  return {
    isAuthenticated,
    loading,
    logout,
    requireAuth
  };
}; 