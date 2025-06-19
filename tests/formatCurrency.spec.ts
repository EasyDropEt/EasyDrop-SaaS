import { test, expect } from '@playwright/test';
import { formatCurrency } from '../utils/format';

// Generate a rich matrix of amounts and currencies to thoroughly test the helper
const amounts = [
  0,
  1,
  12.34,
  50,
  123.45,
  999.99,
  1234.56,
  10000,
  1000000,
  -42.42,
];

const currencies = ['USD', 'ETB', 'EUR', 'GBP', 'JPY'];

amounts.forEach((amount) => {
  currencies.forEach((currency) => {
    test(`formatCurrency ${currency} ${amount}`, () => {
      const expected = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      expect(formatCurrency(amount, currency)).toBe(expected);
    });
  });
});

// Test the fallback path (when Intl is not available / throws)
test('formatCurrency falls back gracefully when Intl throws', () => {
  const originalNumberFormat = Intl.NumberFormat;
  // Force Intl.NumberFormat constructor to throw
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Intl.NumberFormat = () => {
    throw new Error('Intl not available');
  };

  // After the override, calling our util should take the fallback branch
  const result = formatCurrency(123.456, 'FAKE');
  expect(result).toBe('FAKE 123.46');

  // Restore original implementation to avoid side-effects
  Intl.NumberFormat = originalNumberFormat;
}); 