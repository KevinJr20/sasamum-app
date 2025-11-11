# Deployment & Production Readiness Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] ✅ TypeScript compilation passes (0 errors)
- [ ] Run linting: `npm run lint`
- [ ] Run type check: `npm run type-check`
- [ ] All tests passing: `npm test`
- [ ] Code coverage >80% for critical paths

### Security
- [ ] No hardcoded secrets in code
- [ ] Environment variables properly configured
- [ ] CORS properly restricted
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] HTTPS enforced
- [ ] JWT secrets are strong (min 32 characters)
- [ ] Refresh tokens are stored securely
- [ ] Passwords hashed with bcrypt (salt rounds ≥ 10)

### Performance
- [ ] Database indexes created on frequently queried fields
- [ ] API response times <200ms (95th percentile)
- [ ] Frontend bundle size <500KB (gzipped)
- [ ] Implement pagination for large datasets
- [ ] Database query optimization complete
- [ ] Caching strategy implemented (Redis optional)

### Database
- [ ] Backup strategy implemented
- [ ] Connection pooling configured
- [ ] Replication/failover configured
- [ ] Data retention policies set
- [ ] Migrations tested in staging

### Monitoring & Logging
- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring configured (New Relic/DataDog)
- [ ] Structured logging implemented
- [ ] Alert thresholds set
- [ ] Dashboards created

### Documentation
- [ ] API documentation complete
- [ ] Architecture documentation complete
- [ ] Deployment procedures documented
- [ ] Runbooks for common issues
- [ ] Emergency procedures documented

---

## Deployment Platforms

### Option 1: Docker + Cloud Run (Recommended for Quick Start)

#### Step 1: Containerize Application

**Frontend Dockerfile** (`Dockerfile.frontend`):
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
ENV VITE_API_BASE_URL=https://api.sasamum.app/api
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Backend Dockerfile** (`Dockerfile.backend`):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

**Docker Compose** (`docker-compose.prod.yml`):
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: sasamum
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./sasamum-backend
      dockerfile: Dockerfile.backend
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/sasamum
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      NODE_ENV: production
    ports:
      - "4000:4000"
    depends_on:
      - postgres

  frontend:
    build:
      context: ./sasamum-frontend
      dockerfile: Dockerfile.frontend
    environment:
      VITE_API_BASE_URL: http://backend:4000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### Step 2: Push to Google Cloud Run

```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud config set project your-project-id

# Build and push backend
cd sasamum-backend
docker build -t gcr.io/your-project/sasamum-backend:latest .
docker push gcr.io/your-project/sasamum-backend:latest

# Deploy to Cloud Run
gcloud run deploy sasamum-backend \
  --image gcr.io/your-project/sasamum-backend:latest \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL=${DATABASE_URL} \
  --allow-unauthenticated

# Build and push frontend
cd ../sasamum-frontend
docker build -t gcr.io/your-project/sasamum-frontend:latest .
docker push gcr.io/your-project/sasamum-frontend:latest

# Deploy to Cloud Run
gcloud run deploy sasamum-frontend \
  --image gcr.io/your-project/sasamum-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Option 2: AWS (ECS + RDS + CloudFront)

**CloudFormation Template** (simplified):
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  # RDS PostgreSQL Database
  SasaMumDB:
    Type: AWS::RDS::DBInstance
    Properties:
      DBName: sasamum
      Engine: postgres
      EngineVersion: '15.1'
      DBInstanceClass: db.t3.micro
      AllocatedStorage: '20'
      StorageType: gp2
      MasterUsername: postgres
      MasterUserPassword: !Ref DBPassword
      MultiAZ: true
      BackupRetentionPeriod: 30

  # ECS Cluster
  SasaMumCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: sasamum-cluster

  # Backend Task Definition
  BackendTaskDef:
    Type: AWS::ECS::TaskDefinition
    Properties:
      Family: sasamum-backend
      NetworkMode: awsvpc
      RequiresCompatibilities:
        - FARGATE
      Cpu: '256'
      Memory: '512'
      ContainerDefinitions:
        - Name: backend
          Image: !Sub '${AWS::AccountId}.dkr.ecr.${AWS::Region}.amazonaws.com/sasamum-backend:latest'
          Essential: true
          PortMappings:
            - ContainerPort: 4000

  # S3 for static assets
  SasaMumBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: sasamum-assets
      VersioningConfiguration:
        Status: Enabled

Parameters:
  DBPassword:
    Type: String
    NoEcho: true
    Description: Database password
```

Deploy with:
```bash
aws cloudformation create-stack \
  --stack-name sasamum-prod \
  --template-body file://template.yaml \
  --parameters ParameterKey=DBPassword,ParameterValue=YourSecurePassword
```

### Option 3: Vercel + AWS RDS (Recommended for Frontend)

**Vercel Deployment** (Frontend only):
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd sasamum-frontend
vercel --prod

# Set environment variables in Vercel dashboard:
# VITE_API_BASE_URL=https://api.sasamum.app
```

---

## Environment Setup

### Production Environment Variables

**Backend `.env`:**
```env
# Environment
NODE_ENV=production
LOG_LEVEL=info

# Server
PORT=4000
CORS_ORIGIN=https://sasamum.app,https://www.sasamum.app

# Database (use managed DB connection string)
DATABASE_URL=postgresql://user:pass@db.example.com:5432/sasamum

# JWT Security
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# Email (Sendgrid recommended)
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@sasamum.app

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
S3_BUCKET=sasamum-prod

# Monitoring
SENTRY_DSN=your_sentry_dsn
NEW_RELIC_KEY=your_newrelic_key

# Redis (for caching)
REDIS_URL=redis://redis.example.com:6379
```

**Frontend `.env.production`:**
```env
VITE_API_BASE_URL=https://api.sasamum.app/api
VITE_APP_NAME=SasaMum
VITE_LOG_LEVEL=warn
```

---

## Continuous Integration/Deployment

### GitHub Actions Pipeline

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

env:
  REGISTRY: gcr.io
  IMAGE_NAME: sasamum

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Run tests
        run: npm test --coverage
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Build frontend
        run: npm run build
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
      
      - name: Build and push Docker image
        run: |
          gcloud builds submit \
            --config=cloudbuild.yaml \
            --substitutions=_SERVICE_NAME=sasamum-app
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy sasamum-app \
            --image gcr.io/${{ env.REGISTRY }}/sasamum-app:latest \
            --platform managed \
            --region us-central1 \
            --set-env-vars DATABASE_URL=${{ secrets.DATABASE_URL }}
```

---

## Post-Deployment Verification

### Health Checks

```bash
# Test API health
curl https://api.sasamum.app/api/health

# Test frontend
curl https://sasamum.app

# Test database connection
# From backend logs or admin panel
```

### Monitoring Setup

1. **Set up Sentry for error tracking**
   - Create account at sentry.io
   - Create new project
   - Add DSN to backend environment

2. **Set up New Relic or DataDog for APM**
   - Monitor API response times
   - Track error rates
   - Monitor database performance

3. **Set up CloudWatch/Stackdriver**
   - Monitor logs
   - Set up alarms
   - Create dashboards

### Smoke Tests

Run automated tests after deployment:

```bash
#!/bin/bash
echo "Testing authentication..."
curl -X POST https://api.sasamum.app/api/auth/login \
  -d '{"email":"test@test.com","password":"test"}'

echo "Testing API health..."
curl https://api.sasamum.app/api/health

echo "Testing frontend..."
curl -I https://sasamum.app
```

---

## Rollback Procedure

If deployment fails:

```bash
# Google Cloud Run
gcloud run deploy sasamum-app \
  --image gcr.io/your-project/sasamum-app:previous-version

# Or use blue-green deployment
# Keep two versions running and switch traffic
```

---

## Scaling Strategy

### For Increased Traffic

1. **Frontend:**
   - Enable CDN caching (CloudFront/Cloudflare)
   - Increase Cloud Run memory/CPU
   - Enable auto-scaling

2. **Backend:**
   - Increase Cloud Run instance count
   - Add Redis cache layer
   - Database read replicas

3. **Database:**
   - Upgrade RDS instance
   - Enable connection pooling
   - Add read replicas

---

## Cost Optimization

- Use spot instances where possible
- Enable auto-scaling (scale down during off-hours)
- Use CDN for static assets
- Compress database backups
- Monitor and optimize queries
- Use connection pooling

---

## Security Hardening for Production

1. **Network Security**
   ```bash
   # Enable VPC
   # Restrict database access to app only
   # Use security groups/IAM roles
   ```

2. **SSL/TLS**
   ```bash
   # Use Let's Encrypt with auto-renewal
   # Update certificates before expiry
   ```

3. **Secrets Management**
   ```bash
   # Use AWS Secrets Manager or Google Secret Manager
   # Never commit secrets to git
   # Rotate secrets regularly
   ```

4. **Database Security**
   ```bash
   # Enable encryption at rest
   # Enable SSL for connections
   # Regular backups and testing recovery
   ```

---

## Maintenance & Updates

- Weekly: Review error logs and metrics
- Monthly: Run security updates
- Quarterly: Review and optimize queries
- Annually: Conduct security audit

