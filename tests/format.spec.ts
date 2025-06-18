import { test, expect } from '@playwright/test';
import { formatCurrency } from '../utils/format';

// Basic unit tests for the currency formatting helper util

test.describe('formatCurrency helper', () => {
  test('formats USD amounts correctly', () => {
    const formatted = formatCurrency(1234.56, 'USD');

    // In an en-US locale the formatted string should be "$1,234.56"
    // Play it safe across Node versions/locales – the important bit is the
    // currency symbol and the value section.
    expect(formatted).toBe('$1,234.56');
  });

  test('formats ETB amounts correctly', () => {
    const formatted = formatCurrency(1234.56, 'ETB');

    // The exact output may vary (e.g., "ETB 1,234.56" with a non-breaking space)
    // so just assert that it starts with the ETB code and contains the number
    expect(formatted.startsWith('ETB')).toBeTruthy();
    expect(formatted.includes('1,234.56')).toBeTruthy();
  });
}); 