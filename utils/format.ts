/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currencyCode The currency code (e.g., 'USD', 'ETB')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  try {
    // Use Intl.NumberFormat for proper currency formatting when available
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback to basic formatting if Intl is not available or currency is not supported
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}; 