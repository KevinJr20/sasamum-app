import type { AxiosInstance } from 'axios';

const headers = {
  common: {} as Record<string, string>
};

import { vi } from 'vitest';

const api = {
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  defaults: {
    headers
  }
} as unknown as AxiosInstance;

export const setAuthToken = vi.fn((token: string | null) => {
  if (token) {
    headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete headers.common['Authorization'];
  }
});

export default api;