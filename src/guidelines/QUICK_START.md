# 🚀 Quick Start: From Development to Production

## Overview

This guide walks you through the complete journey from your current development state to a production-ready, fully deployed application.

---

## Phase 1: Backend Setup (Week 1)

### Step 1.1: Initialize Backend Project

```bash
# Create backend directory
mkdir sasamum-backend && cd sasamum-backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors dotenv pg bcryptjs jsonwebtoken axios winston
npm install -D typescript @types/node @types/express ts-node nodemon ts-jest

# Create TypeScript config
npx tsc --init
```

### Step 1.2: Create Project Structure

```bash
mkdir -p src/{routes,middleware,utils,models,services,database}
mkdir -p src/__tests__/{unit,integration}

# Create initial files
touch src/index.ts src/database/connection.ts src/utils/jwt.ts
touch .env .env.example
```

### Step 1.3: Set Up Environment Variables

**`.env`:**
```env
NODE_ENV=development
PORT=4000
LOG_LEVEL=debug

DATABASE_URL=postgresql://localhost:5432/sasamum
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your-super-secret-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

CORS_ORIGIN=http://localhost:3000
```

### Step 1.4: Create Database

**PostgreSQL Setup:**
```bash
# Install PostgreSQL (if needed)
# macOS: brew install postgresql
# Linux: apt-get install postgresql
# Windows: Download from postgresql.org

# Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux

# Create database
createdb sasamum
psql sasamum < database/schema.sql
```

### Step 1.5: Implement Backend Skeleton

**`src/index.ts`:**
```typescript
import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/pregnancy', require('./routes/pregnancy'));

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
```

**`src/database/connection.ts`:**
```typescript
import { Pool } from 'pg';
import logger from '../utils/logger';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Query executed in ${duration}ms`, { text, params });
    return result;
  } catch (error) {
    logger.error('Query error', { text, params, error });
    throw error;
  }
}
```

---

## Phase 2: Frontend Environment Setup (Week 1)

### Step 2.1: Configure API Client

**`src/lib/api.ts`** (Update with correct base URL):
```typescript
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        apiClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### Step 2.2: Create Environment Files

**`src/.env.development`:**
```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_NAME=SasaMum (Dev)
VITE_LOG_LEVEL=debug
```

**`src/.env.production`:**
```env
VITE_API_BASE_URL=https://api.sasamum.app/api
VITE_APP_NAME=SasaMum
VITE_LOG_LEVEL=warn
```

---

## Phase 3: Integration Testing (Week 2)

### Step 3.1: Test Authentication Flow

```bash
# Start backend
cd sasamum-backend
npm run dev

# In another terminal, test registration
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Test login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'

# Save the accessToken from response and test authenticated request
curl -X GET http://localhost:4000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 3.2: Start Frontend Development Server

```bash
# In another terminal
cd sasamum-frontend
npm run dev

# Frontend runs on http://localhost:3000
```

### Step 3.3: Test Full Login Flow in Browser

1. Open http://localhost:3000
2. Navigate to login/signup
3. Create account with test@example.com
4. Verify data is stored in PostgreSQL:
   ```bash
   psql sasamum
   SELECT * FROM users;
   ```

---

## Phase 4: Containerization (Week 2)

### Step 4.1: Create Dockerfiles

**`sasamum-backend/Dockerfile`:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY dist ./dist
COPY .env .env

# Expose port
EXPOSE 4000

# Start application
CMD ["node", "dist/index.js"]
```

**`sasamum-frontend/Dockerfile`:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Step 4.2: Create Docker Compose

**`docker-compose.yml`:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: sasamum
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./sasamum-backend
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/sasamum
      JWT_SECRET: dev-secret-key
      NODE_ENV: development
    ports:
      - "4000:4000"
    depends_on:
      - postgres

  frontend:
    build: ./sasamum-frontend
    environment:
      VITE_API_BASE_URL: http://localhost:4000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Step 4.3: Run with Docker

```bash
# Build and start services
docker-compose up --build

# Services are now available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000/api
# PostgreSQL: localhost:5432
```

---

## Phase 5: Testing (Week 2-3)

### Step 5.1: Set Up Unit Tests

```bash
npm install -D jest ts-jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### Step 5.2: Set Up E2E Tests

```bash
npm install -D cypress

# Open Cypress
npx cypress open

# Run headless
npm run cypress:run
```

---

## Phase 6: Security Hardening (Week 3)

### Step 6.1: Implement Key Security Measures

```typescript
// 1. Enable HTTPS
// Generate self-signed cert locally, use Let's Encrypt in production

// 2. Add security headers
npm install helmet

// 3. Implement rate limiting
npm install express-rate-limit

// 4. Add input validation
npm install zod

// 5. Enable CORS
npm install cors

// 6. Implement MFA
npm install speakeasy qrcode
```

### Step 6.2: Review Security Checklist

- [ ] All dependencies scanned (npm audit)
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation implemented
- [ ] Secrets not in code
- [ ] Logging configured
- [ ] Monitoring set up

---

## Phase 7: Deployment Preparation (Week 3-4)

### Step 7.1: Choose Deployment Platform

**Option A: Google Cloud (Recommended)**
```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Initialize
gcloud init
gcloud auth login
```

**Option B: AWS**
```bash
# Install AWS CLI
pip install awscli

# Configure
aws configure
```

**Option C: Vercel (Frontend only)**
```bash
npm install -g vercel
vercel login
```

### Step 7.2: Prepare Production Configuration

```env
# .env.production
NODE_ENV=production
DATABASE_URL=YOUR_PROD_DB_CONNECTION
JWT_SECRET=GENERATE_WITH_openssl_rand_-base64_32
JWT_REFRESH_SECRET=GENERATE_WITH_openssl_rand_-base64_32
CORS_ORIGIN=https://sasamum.app
```

### Step 7.3: Set Up CI/CD Pipeline

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install & Test
        run: npm ci && npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          # Your deployment command here
```

---

## Phase 8: Launch to Production (Week 4)

### Step 8.1: Final Pre-Launch Checklist

- [ ] All tests passing (100% coverage on critical paths)
- [ ] Security audit completed
- [ ] Performance testing done (< 200ms API response)
- [ ] Database backups configured
- [ ] Monitoring and alerts set up
- [ ] Incident response plan documented
- [ ] Team trained
- [ ] Terms of service & privacy policy published
- [ ] Compliance requirements met

### Step 8.2: Deploy Backend

**Google Cloud:**
```bash
gcloud run deploy sasamum-backend \
  --source ./sasamum-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL=$DB_URL,JWT_SECRET=$JWT_SECRET
```

**AWS:**
```bash
# Push to ECR and deploy to ECS
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker tag sasamum-backend 123456789.dkr.ecr.us-east-1.amazonaws.com/sasamum-backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/sasamum-backend:latest
```

### Step 8.3: Deploy Frontend

**Vercel:**
```bash
cd sasamum-frontend
vercel --prod
```

**Google Cloud:**
```bash
gcloud run deploy sasamum-frontend \
  --source ./sasamum-frontend \
  --platform managed \
  --region us-central1
```

### Step 8.4: Set Up Custom Domain

**Google Cloud:**
```bash
gcloud run services update sasamum-backend \
  --custom-domain sasamum.app
```

### Step 8.5: Enable SSL/TLS

```bash
# Let's Encrypt (recommended)
sudo apt-get install certbot
sudo certbot certonly --standalone -d sasamum.app -d api.sasamum.app

# Or use managed certificate with cloud provider
```

---

## Phase 9: Post-Launch Monitoring (Ongoing)

### Step 9.1: Set Up Monitoring

```bash
# Enable error tracking
npm install @sentry/node
export SENTRY_DSN=your_sentry_dsn

# Enable performance monitoring
npm install new-relic
```

### Step 9.2: Health Checks

```bash
# Test endpoints
curl https://api.sasamum.app/api/health
curl https://sasamum.app
```

### Step 9.3: Monitor Logs

```bash
# View logs in production
gcloud run logs read sasamum-backend --limit 50
```

---

## Phase 10: Ongoing Maintenance (Weekly/Monthly)

### Weekly
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Verify backups completed

### Monthly
- [ ] Update dependencies (npm update)
- [ ] Review security vulnerabilities (npm audit)
- [ ] Analyze user feedback
- [ ] Optimize slow queries

### Quarterly
- [ ] Security audit
- [ ] Load testing
- [ ] Database optimization

---

## Success Metrics

After launch, monitor these key metrics:

| Metric | Target | How to Check |
|--------|--------|---|
| API Uptime | > 99.9% | Monitoring dashboard |
| API Response Time | < 200ms | Application Performance Monitor |
| Error Rate | < 0.1% | Error tracking dashboard |
| Page Load Time | < 2s | Lighthouse |
| User Satisfaction | > 4.0/5 | In-app feedback |

---

## Troubleshooting Common Issues

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -d sasamum

# Check connection string
echo $DATABASE_URL
```

### API Not Responding
```bash
# Check if backend is running
curl http://localhost:4000/api/health

# Check logs
docker logs sasamum-backend
```

### Frontend Can't Connect to Backend
```bash
# Check CORS configuration
# Verify VITE_API_BASE_URL is correct
# Check browser console for errors
```

### SSL Certificate Issues
```bash
# Test SSL
curl -I https://api.sasamum.app

# Check certificate expiration
curl https://api.sasamum.app --verbose
```

---

## Next Steps

1. **Start with Phase 1-2** this week to get backend and frontend talking
2. **Move to Phase 3** to verify integration
3. **Complete Phases 4-6** by end of week 2
4. **Launch with Phases 7-8** by end of week 4

**Need help?** Check the detailed guides:
- 📖 BACKEND_INTEGRATION_GUIDE.md - API specs & database schema
- 🔒 SECURITY_COMPLIANCE.md - Security implementation details
- 🚀 DEPLOYMENT_GUIDE.md - Detailed deployment instructions
- 🧪 TESTING_STRATEGY.md - Testing approach
- ⚙️ DEVOPS_INFRASTRUCTURE.md - Infrastructure setup

Good luck! 🎉

