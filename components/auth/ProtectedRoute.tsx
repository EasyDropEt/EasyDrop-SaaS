'use client';

import { useBusinessContext } from '@/context/BusinessContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useBusinessContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect once loading is complete and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push(`/business/login?returnUrl=${encodeURIComponent(pathname || '/')}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
}; 