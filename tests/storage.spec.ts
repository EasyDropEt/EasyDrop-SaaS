import { test, expect } from '@playwright/test';
import { storage, OTP_STORAGE_KEY } from '../utils/storage';

// Provide a very small localStorage mock suitable for Node
class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

// Attach the mock to the global scope before all tests run
const localStorageMock = new LocalStorageMock();
global.localStorage = localStorageMock as unknown as Storage;

test.beforeEach(() => {
  // Ensure we start each test with a clean slate
  localStorageMock.clear();
});

test('getOtpUserId returns null when nothing is stored', () => {
  expect(storage.getOtpUserId()).toBeNull();
});

// Generate a set of ids for broader coverage
const ids = Array.from({ length: 9 }).map((_, i) => `user-${i + 1}`);

ids.forEach((id) => {
  test(`saveOtpUserId stores the id (${id})`, () => {
    storage.saveOtpUserId(id);
    expect(localStorageMock.getItem(OTP_STORAGE_KEY)).toBe(id);
  });

  test(`getOtpUserId retrieves the id (${id})`, () => {
    localStorageMock.setItem(OTP_STORAGE_KEY, id);
    expect(storage.getOtpUserId()).toBe(id);
  });

  test(`removeOtpUserId deletes the id (${id})`, () => {
    localStorageMock.setItem(OTP_STORAGE_KEY, id);
    storage.removeOtpUserId();
    expect(localStorageMock.getItem(OTP_STORAGE_KEY)).toBeNull();
  });
}); 