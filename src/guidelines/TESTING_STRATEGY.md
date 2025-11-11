# Comprehensive Testing Strategy

## Test Pyramid

```
        E2E Tests
      /           \
    Integration Tests
   /                 \
 Unit Tests       Component Tests
```

## 1. Unit Tests (60% of tests)

### Frontend Unit Tests

**Setup Jest + React Testing Library**

```json
// package.json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "ts-jest": "^29.0.0"
  }
}
```

**jest.config.js:**
```javascript
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
  ],
};
```

**src/setupTests.ts:**
```typescript
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### Example Unit Tests

**components/__tests__/AuthForms.test.tsx:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForms from '../AuthForms';

describe('AuthForms', () => {
  it('renders login form initially', () => {
    render(<AuthForms />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<AuthForms />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab();
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('submits login form with valid credentials', async () => {
    const mockOnLogin = jest.fn();
    render(<AuthForms onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'Password123!');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Password123!',
      });
    });
  });

  it('shows password toggle', async () => {
    render(<AuthForms />);
    const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /toggle.*password/i });
    
    expect(passwordInput.type).toBe('password');
    
    await userEvent.click(toggleButton);
    
    expect(passwordInput.type).toBe('text');
  });

  it('handles form submission error', async () => {
    const mockError = new Error('Login failed');
    const mockOnLogin = jest.fn().mockRejectedValue(mockError);
    
    render(<AuthForms onLogin={mockOnLogin} />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });
});
```

**lib/__tests__/api.test.ts:**
```typescript
import axios from 'axios';
import { apiClient } from '../api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('includes JWT token in request headers', async () => {
    const token = 'test-token-123';
    localStorage.setItem('accessToken', token);
    
    mockedAxios.create().get = jest.fn().mockResolvedValue({ data: {} });
    
    await apiClient.get('/users/me');
    
    expect(mockedAxios.create().get).toHaveBeenCalled();
    // Verify token was added to headers
  });

  it('refreshes token on 401 response', async () => {
    localStorage.setItem('accessToken', 'expired-token');
    localStorage.setItem('refreshToken', 'refresh-token');
    
    mockedAxios.create().get = jest.fn()
      .mockRejectedValueOnce({ response: { status: 401 } })
      .mockResolvedValueOnce({ data: { accessToken: 'new-token' } })
      .mockResolvedValueOnce({ data: { user: {} } });
    
    const response = await apiClient.get('/users/me');
    
    expect(localStorage.getItem('accessToken')).toBe('new-token');
  });

  it('handles network errors gracefully', async () => {
    mockedAxios.create().get = jest.fn()
      .mockRejectedValue(new Error('Network error'));
    
    await expect(apiClient.get('/users')).rejects.toThrow('Network error');
  });
});
```

### Backend Unit Tests

**jest.config.js (Backend):**
```javascript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
};
```

**src/__tests__/auth.test.ts:**
```typescript
import request from 'supertest';
import app from '../index';
import { pool } from '../database';

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    // Setup test database
    await pool.query('BEGIN');
  });

  afterAll(async () => {
    await pool.query('ROLLBACK');
    await pool.end();
  });

  describe('POST /api/auth/register', () => {
    it('creates new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.accessToken).toBeDefined();
    });

    it('rejects duplicate email', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        });

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123!',
          firstName: 'Jane',
          lastName: 'Doe',
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toContain('already exists');
    });

    it('validates password requirements', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'weak@example.com',
          password: '123', // Too weak
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('password');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@example.com',
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        });
    });

    it('returns tokens for valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it('rejects invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });
});
```

---

## 2. Component Tests (20% of tests)

**components/__tests__/Dashboard.test.tsx:**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

describe('Dashboard Component', () => {
  it('displays pregnancy data when loaded', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/weeks pregnant/i)).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error when data fetch fails', async () => {
    // Mock failed API call
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
    });
  });
});
```

---

## 3. Integration Tests (15% of tests)

**__tests__/integration/authFlow.test.ts:**
```typescript
import request from 'supertest';
import app from '../../index';

describe('Complete Authentication Flow', () => {
  const testUser = {
    email: 'integration@example.com',
    password: 'Password123!',
    firstName: 'Integration',
    lastName: 'Test',
  };

  it('completes full auth cycle: register → login → refresh → logout', async () => {
    // 1. Register
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(registerRes.status).toBe(201);
    const { accessToken: initialToken } = registerRes.body;

    // 2. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(loginRes.status).toBe(200);
    const { accessToken, refreshToken } = loginRes.body;

    // 3. Use token to access protected endpoint
    const protectedRes = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(protectedRes.status).toBe(200);
    expect(protectedRes.body.user.email).toBe(testUser.email);

    // 4. Refresh token
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.accessToken).toBeDefined();
    expect(refreshRes.body.accessToken).not.toBe(accessToken);

    // 5. Logout
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${refreshRes.body.accessToken}`);

    expect(logoutRes.status).toBe(200);
  });

  it('handles pregnancy data workflow', async () => {
    // Register and login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send(testUser);

    const { accessToken } = loginRes.body;

    // Create pregnancy data
    const pregnancyRes = await request(app)
      .post('/api/pregnancy')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        lastMenstrualPeriod: '2024-01-15',
        dueDate: '2024-10-22',
      });

    expect(pregnancyRes.status).toBe(201);
    const pregnancyId = pregnancyRes.body.id;

    // Retrieve pregnancy data
    const getRes = await request(app)
      .get(`/api/pregnancy/${pregnancyId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.dueDate).toBe('2024-10-22');
  });
});
```

---

## 4. End-to-End Tests (5% of tests)

**E2E tests using Cypress**

**cypress.config.ts:**
```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // plugins
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
```

**cypress/e2e/auth.cy.ts:**
```typescript
describe('E2E: User Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('completes signup, login, and pregnancy tracking', () => {
    // Signup
    cy.contains('Sign Up').click();
    cy.get('input[placeholder*="Email"]').type('e2e@test.com');
    cy.get('input[placeholder*="Password"]').type('TestPass123!');
    cy.get('input[placeholder*="First Name"]').type('Test');
    cy.get('input[placeholder*="Last Name"]').type('User');
    cy.contains('Create Account').click();

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains(/Welcome/i).should('be.visible');

    // Enter pregnancy data
    cy.contains('Add Pregnancy').click();
    cy.get('input[placeholder*="Last Menstrual"]').type('01/15/2024');
    cy.contains('Save').click();

    // Verify pregnancy data is saved
    cy.contains('40 weeks').should('be.visible');

    // Log out
    cy.get('[data-testid="user-menu"]').click();
    cy.contains('Logout').click();

    // Should redirect to login
    cy.url().should('include', '/login');
  });

  it('handles form validation errors', () => {
    cy.contains('Sign Up').click();
    cy.get('input[placeholder*="Email"]').type('invalid-email');
    cy.get('input[placeholder*="Email"]').blur();
    cy.contains('Invalid email').should('be.visible');
  });
});
```

---

## 5. Performance Testing

**lighthouse.json (Lighthouse config):**
```json
{
  "extends": "lighthouse:recommended",
  "settings": {
    "emulatedFormFactor": "mobile",
    "throttling": {
      "cpuSlowdownMultiplier": 4,
      "downloadThroughputKbps": 1600,
      "uploadThroughputKbps": 750,
      "rttMs": 150
    }
  }
}
```

**Run performance tests:**
```bash
npm install -D @lhci/cli@0.10.x @lhci/config-reader@0.10.x

# Run locally
lhci autorun

# CI integration
lhci assert
```

**lighthouserc.json:**
```json
{
  "ci": {
    "collect": {
      "url": ["https://localhost:3000"],
      "numberOfRuns": 3
    },
    "upload": {
      "target": "temporary-public-storage"
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

---

## 6. Test Coverage Goals

| Layer | Target | Min | Tools |
|-------|--------|-----|-------|
| Unit | 80% | 70% | Jest |
| Component | 70% | 60% | RTL + Jest |
| Integration | 60% | 50% | Jest + Supertest |
| E2E | 40% | 30% | Cypress |
| **Overall** | **70%** | **60%** | - |

---

## 7. Running Tests

```bash
# All tests
npm test

# With coverage
npm test -- --coverage

# Specific suite
npm test -- AuthForms.test

# Watch mode
npm test -- --watch

# E2E tests
npm run cypress:open
npm run cypress:run

# Performance tests
npm run lighthouse

# Integration tests
npm test -- --testPathPattern=integration
```

---

## 8. CI/CD Test Pipeline

**.github/workflows/test.yml:**
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install deps
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Unit tests
        run: npm test -- --coverage
      
      - name: Integration tests
        run: npm test -- --testPathPattern=integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/sasamum_test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
      
      - name: E2E tests
        run: npm run cypress:run
      
      - name: Performance audit
        run: npm run lighthouse
```

---

## Test Checklist

- [ ] Unit test coverage ≥70%
- [ ] Component test coverage ≥60%
- [ ] Integration tests for auth flow
- [ ] E2E tests for critical user journeys
- [ ] Performance tests passing
- [ ] Accessibility tests passing
- [ ] All tests passing in CI/CD
- [ ] Coverage reports reviewed
- [ ] Load testing completed (optional)

