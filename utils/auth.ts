// Constants for storage keys
export const AUTH_TOKEN_KEY = 'business_token';

/**
 * Save authentication token to local storage
 */
export const saveAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

/**
 * Get authentication token from local storage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiU2hhbWlsIiwibGFzdF9uYW1lIjoiQmVkcnUiLCJlbWFpbCI6InNoYW1pbGJlZHJ1NDdAZ21haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiMjUxOTQ4NjcxNTYzIiwidXNlcl90eXBlIjoiZHJpdmVyIn0.L3CyCw2YLoh5_lfYnmt2X-_hEzGujkF_1wyapMgn_Sg'
    // return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
};

/**
 * Remove authentication token from local storage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

/**
 * Check if user is authenticated (has a token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
}; 