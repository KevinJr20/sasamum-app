import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { vi, beforeAll } from 'vitest';

// Add missing globals
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

beforeAll(() => {
  Object.defineProperty(global, 'localStorage', { value: localStorageMock });
  Object.assign(global, {
    TextEncoder,
    TextDecoder,
    fetch: vi.fn(),
    setImmediate: (callback: Function) => setTimeout(callback, 0),
    clearImmediate: (id: number) => clearTimeout(id),
    import: {
      meta: {
        env: {
          VITE_API_BASE_URL: "http://localhost:4000/api",
          VITE_API_URL: "http://localhost:4000/api"
        }
      }
    },
    ResizeObserver: class ResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  });
});