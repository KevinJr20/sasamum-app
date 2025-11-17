import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthForms } from '../AuthForms';
import { AuthProvider } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock API
vi.mock('../../lib/api', () => ({
  default: {
    post: vi.fn(),
    create: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
  setAuthToken: vi.fn(),
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Helper to render component inside provider
const renderComponent = (props = {}) => {
  const defaultProps = {
    onBack: vi.fn(),
    onLoginSuccess: vi.fn(),
    onForgotPassword: vi.fn(),
    onProviderLogin: vi.fn(),
  };

  return render(
    <AuthProvider>
      <AuthForms {...defaultProps} {...props} />
    </AuthProvider>
  );
};

describe('AuthForms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders login form by default', () => {
    renderComponent();
    expect(screen.getByText('Welcome, Mama')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('mama@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Welcome Home, Mama' })).toBeInTheDocument();
  });

  it('toggles between login and registration', async () => {
    renderComponent();
    expect(screen.getByText('Welcome Home, Mama')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Join us here'));
    expect(screen.getByRole('button', { name: 'Begin My Journey' })).toBeInTheDocument();

    await userEvent.click(screen.getByText('Sign in here'));
    expect(screen.getByRole('button', { name: 'Welcome Home, Mama' })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const onLoginSuccess = vi.fn();
    const mockResponse = {
      data: { token: 'test-token', user: { id: '1', email: 'test@example.com' } },
    };
    (api.post as any).mockResolvedValueOnce(mockResponse);

    renderComponent({ onLoginSuccess });

    await userEvent.type(screen.getByPlaceholderText('mama@example.com'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Welcome Home, Mama' }));

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalled();
    });
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('handles failed login without crashing', async () => {
    const onLoginSuccess = vi.fn();
    (api.post as any).mockRejectedValueOnce(new Error('Network error'));

    renderComponent({ onLoginSuccess });

    await userEvent.type(screen.getByPlaceholderText('mama@example.com'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: 'Welcome Home, Mama' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    });
  });

  // Accessibility and edge-case tests
  it('email and password inputs are accessible and in tab order', async () => {
    renderComponent();

    const email = screen.getByPlaceholderText('mama@example.com');
    const password = screen.getByPlaceholderText('Enter your password');
    const submit = screen.getByRole('button', { name: 'Welcome Home, Mama' });

    // Basic accessibility: inputs have placeholders (used as accessible hints)
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();

    // Focus the email input explicitly, then tab to password and submit.
    // This makes the test resilient to other focusable elements (header buttons,
    // role selectors) that may appear earlier in the DOM.
    email.focus();
    expect(document.activeElement).toBe(email);
    await userEvent.tab();
    expect(document.activeElement).toBe(password);
    // There may be additional focusable controls (like the password visibility
    // toggle) between password and submit. Advance tabs until we reach submit
    // (bounded) so the test is robust to small DOM changes.
    let attempts = 0;
    while (document.activeElement !== submit && attempts < 6) {
      await userEvent.tab();
      attempts += 1;
    }
    expect(document.activeElement).toBe(submit);
  });

  it('submits form when pressing Enter in password field', async () => {
    const onLoginSuccess = vi.fn();
    const mockResponse = { data: { token: 't', user: { id: '1' } } };
    (api.post as any).mockResolvedValueOnce(mockResponse);

    renderComponent({ onLoginSuccess });

    const email = screen.getByPlaceholderText('mama@example.com');
    const password = screen.getByPlaceholderText('Enter your password');

    await userEvent.type(email, 'keyboard@example.com');
    await userEvent.type(password, 'keyboardpass');

    // Press Enter while focused on password input
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });

  it('does not call API with empty fields (basic validation)', async () => {
    const onLoginSuccess = vi.fn();
    (api.post as any).mockClear();

    renderComponent({ onLoginSuccess });

    const submit = screen.getByRole('button', { name: 'Welcome Home, Mama' });
    await userEvent.click(submit);

    // If component performs client-side validation, api.post should not be called
    expect(api.post).not.toHaveBeenCalled();
  });
});
