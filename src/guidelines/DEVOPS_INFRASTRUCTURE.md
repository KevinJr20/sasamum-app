# DevOps & Infrastructure Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CDN (Cloudflare)                        │
│                  Cache Static Assets                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   ┌────▼────┐          ┌────▼────┐
   │ Frontend │          │  Backend │
   │  (React) │          │(Node.js) │
   │Vercel/   │          │Cloud Run │
   │Cloud Run │          │  (4000)  │
   │ (3000)   │          └────┬─────┘
   └──────────┘               │
                    ┌─────────┴─────────┐
                    │                   │
              ┌─────▼────┐       ┌─────▼────┐
              │ PostgreSQL│       │  Redis   │
              │ Database  │       │  Cache   │
              │Cloud SQL/ │       │(Optional)│
              │RDS        │       └──────────┘
              └───────────┘
                    │
              ┌─────▼──────┐
              │   Backups   │
              │(Daily/GCS)  │
              └─────────────┘
```

---

## 1. Cloud Provider Setup

### Option A: Google Cloud Platform (Recommended)

#### Step 1: Initial Setup

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Initialize
gcloud init

# Set project
gcloud config set project sasamum-prod

# Enable APIs
gcloud services enable \
  cloudrun.googleapis.com \
  sql.googleapis.com \
  compute.googleapis.com \
  container.googleapis.com \
  artifactregistry.googleapis.com
```

#### Step 2: Create PostgreSQL Database

```bash
# Create Cloud SQL instance
gcloud sql instances create sasamum-db \
  --database-version=POSTGRES_15 \
  --tier=db-g1-small \
  --region=us-central1 \
  --backup-start-time=02:00 \
  --retained-backups-count=7 \
  --database-flags=cloudsql_iam_authentication=on

# Create database
gcloud sql databases create sasamum \
  --instance=sasamum-db

# Create database user
gcloud sql users create sasamum-app \
  --instance=sasamum-db \
  --password=$(openssl rand -base64 32)

# Get connection string
gcloud sql instances describe sasamum-db \
  --format='value(connectionName)'
```

#### Step 3: Deploy Backend to Cloud Run

```bash
# Build and push image
gcloud builds submit \
  --tag gcr.io/sasamum-prod/sasamum-backend \
  ./sasamum-backend

# Deploy
gcloud run deploy sasamum-backend \
  --image gcr.io/sasamum-prod/sasamum-backend:latest \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --allow-unauthenticated \
  --set-env-vars \
    DATABASE_URL="postgresql://sasamum-app:PASSWORD@INSTANCE_CONNECTION_NAME/sasamum",\
    JWT_SECRET=$(openssl rand -base64 32),\
    JWT_REFRESH_SECRET=$(openssl rand -base64 32),\
    NODE_ENV=production \
  --add-cloudsql-instances=PROJECT:REGION:INSTANCE_NAME
```

#### Step 4: Deploy Frontend

```bash
# Build
npm run build

# Deploy to Cloud Run or use Vercel
gcloud run deploy sasamum-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars \
    VITE_API_BASE_URL="https://sasamum-backend-xxx.a.run.app/api"
```

### Option B: AWS Setup

#### Step 1: Set up with Terraform

**main.tf:**
```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# RDS PostgreSQL
resource "aws_rds_cluster" "sasamum" {
  cluster_identifier      = "sasamum-cluster"
  engine                  = "aurora-postgresql"
  engine_version          = "15.2"
  database_name           = "sasamum"
  master_username         = "postgres"
  master_password         = random_password.db_password.result
  backup_retention_period = 7
  preferred_backup_window = "02:00-03:00"
  skip_final_snapshot     = false
}

resource "aws_rds_cluster_instance" "sasamum" {
  count              = 2
  cluster_identifier = aws_rds_cluster.sasamum.id
  instance_class     = "db.t4g.medium"
  engine              = aws_rds_cluster.sasamum.engine
  engine_version      = aws_rds_cluster.sasamum.engine_version
}

# ECS Cluster for Backend
resource "aws_ecs_cluster" "sasamum" {
  name = "sasamum-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Backend Service
resource "aws_ecs_service" "backend" {
  name            = "sasamum-backend"
  cluster         = aws_ecs_cluster.sasamum.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.backend.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 4000
  }
}

# Frontend on S3 + CloudFront
resource "aws_s3_bucket" "frontend" {
  bucket = "sasamum-frontend"
}

resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3"
  }

  enabled = true
  default_root_object = "index.html"

  default_cache_behavior {
    cache_policy_id  = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]
    target_origin_id = "S3"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

**Deploy with Terraform:**
```bash
terraform init
terraform plan
terraform apply
```

---

## 2. Database Management

### PostgreSQL Schema with Migrations

**Database Initialization:**
```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  profile_image_url TEXT,
  role ENUM ('patient', 'provider', 'admin') DEFAULT 'patient',
  status ENUM ('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT email_lowercase CHECK (email = LOWER(email))
);

-- Pregnancy data
CREATE TABLE pregnancy_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_menstrual_period DATE NOT NULL,
  due_date DATE NOT NULL,
  delivery_date DATE,
  complications TEXT[],
  current_week INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vital signs tracking
CREATE TABLE vital_signs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pregnancy_id UUID REFERENCES pregnancy_data(id) ON DELETE SET NULL,
  blood_pressure_sys INTEGER,
  blood_pressure_dia INTEGER,
  heart_rate INTEGER,
  temperature DECIMAL(5,2),
  weight DECIMAL(5,2),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Symptoms tracking
CREATE TABLE symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pregnancy_id UUID REFERENCES pregnancy_data(id) ON DELETE SET NULL,
  symptom_type VARCHAR(100),
  description TEXT,
  severity ENUM ('mild', 'moderate', 'severe') DEFAULT 'mild',
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
  pregnancy_id UUID REFERENCES pregnancy_data(id) ON DELETE SET NULL,
  appointment_date TIMESTAMP NOT NULL,
  status ENUM ('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat/Messaging
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_pregnancy_data_user_id ON pregnancy_data(user_id);
CREATE INDEX idx_vital_signs_user_id ON vital_signs(user_id);
CREATE INDEX idx_vital_signs_recorded_at ON vital_signs(recorded_at);
CREATE INDEX idx_symptoms_user_id ON symptoms(user_id);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Enable row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancy_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own pregnancy data" ON pregnancy_data
  FOR SELECT USING (auth.uid() = user_id);
```

### Database Migrations

**Migration Tool: db-migrate**

```bash
npm install -g db-migrate db-migrate-pg

# Create migration
db-migrate create create_users_table

# Run migrations
db-migrate up

# Rollback
db-migrate down
```

**migration/sqls/20240101120000-up.sql:**
```sql
-- Your migration SQL
```

### Backup Strategy

**Automated Daily Backups:**

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/sasamum"
DB_NAME="sasamum"
DB_USER="postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/sasamum_$TIMESTAMP.sql.gz

# Upload to GCS
gsutil cp $BACKUP_DIR/sasamum_$TIMESTAMP.sql.gz gs://sasamum-backups/

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: sasamum_$TIMESTAMP.sql.gz"
```

**Add to crontab:**
```bash
0 2 * * * /scripts/backup.sh
```

---

## 3. Monitoring & Logging

### Cloud Monitoring Setup (GCP)

```bash
# Create uptime check
gcloud monitoring uptime-checks create "sasamum-api" \
  --display-name="SasaMum API Health" \
  --resource-type="uptime-url" \
  --http-check-request-method="GET" \
  --http-check-path="/api/health" \
  --monitored-resource-type="uptime_url" \
  --selected-regions="USA,EUROPE,ASIA_PACIFIC"
```

### CloudLogging with Structured Logs

**Backend logging setup (Winston):**

```typescript
import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const loggingWinston = new LoggingWinston({
  projectId: process.env.GCP_PROJECT_ID,
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
    }),
    loggingWinston,
  ],
});

export default logger;
```

### Alert Configuration

**Alerts setup:**

```bash
# Create notification channel
gcloud alpha monitoring channels create \
  --display-name="SasaMum Team" \
  --type=email \
  --channel-labels=email_address=team@sasamum.app

# Create alert policy
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Error Rate" \
  --condition-display-name="Error rate > 1%" \
  --condition-threshold-value=0.01 \
  --condition-threshold-duration=300s
```

---

## 4. CI/CD Pipeline with Cloud Build

**cloudbuild.yaml:**
```yaml
steps:
  # Build backend image
  - name: 'gcr.io/cloud-builders/docker'
    id: 'build-backend'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/sasamum-backend:$SHORT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/sasamum-backend:latest'
      - '-f'
      - 'Dockerfile.backend'
      - './sasamum-backend'

  # Push backend image
  - name: 'gcr.io/cloud-builders/docker'
    id: 'push-backend'
    args:
      - 'push'
      - 'gcr.io/$PROJECT_ID/sasamum-backend:$SHORT_SHA'

  # Deploy backend to Cloud Run
  - name: 'gcr.io/cloud-builders/run'
    id: 'deploy-backend'
    args:
      - 'deploy'
      - 'sasamum-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/sasamum-backend:$SHORT_SHA'
      - '--platform'
      - 'managed'
      - '--region'
      - 'us-central1'
      - '--set-env-vars'
      - 'DATABASE_URL=$_DATABASE_URL,JWT_SECRET=$_JWT_SECRET'
      - '--allow-unauthenticated'

  # Build frontend
  - name: 'gcr.io/cloud-builders/docker'
    id: 'build-frontend'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/sasamum-frontend:$SHORT_SHA'
      - '-f'
      - 'Dockerfile.frontend'
      - './sasamum-frontend'

  # Deploy frontend
  - name: 'gcr.io/cloud-builders/run'
    id: 'deploy-frontend'
    args:
      - 'deploy'
      - 'sasamum-frontend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/sasamum-frontend:$SHORT_SHA'
      - '--platform'
      - 'managed'
      - '--region'
      - 'us-central1'

images:
  - 'gcr.io/$PROJECT_ID/sasamum-backend:$SHORT_SHA'
  - 'gcr.io/$PROJECT_ID/sasamum-frontend:$SHORT_SHA'

substitutions:
  _DATABASE_URL: 'postgresql://...'
  _JWT_SECRET: 'your-secret'

options:
  machineType: 'N1_HIGHCPU_8'
```

---

## 5. Security Hardening

### Network Security

```bash
# Create VPC
gcloud compute networks create sasamum-vpc \
  --subnet-mode=custom

# Create subnet
gcloud compute networks subnets create sasamum-subnet \
  --network=sasamum-vpc \
  --range=10.0.0.0/24

# Create firewall rules
gcloud compute firewall-rules create allow-https \
  --network=sasamum-vpc \
  --allow=tcp:443,tcp:80 \
  --source-ranges=0.0.0.0/0

gcloud compute firewall-rules create allow-db \
  --network=sasamum-vpc \
  --allow=tcp:5432 \
  --source-ranges=10.0.0.0/24
```

### Secrets Management

```bash
# Store secrets in Secret Manager
echo -n "your-jwt-secret" | gcloud secrets create JWT_SECRET --data-file=-

# Use in Cloud Run
gcloud run deploy sasamum-backend \
  --set-secrets JWT_SECRET=JWT_SECRET:latest \
  --update
```

### SSL/TLS Certificate

```bash
# Use Google-managed certificate
gcloud compute ssl-certificates create sasamum-cert \
  --domains sasamum.app,api.sasamum.app

# Or use Let's Encrypt with Certbot
certbot certonly --standalone \
  -d sasamum.app \
  -d api.sasamum.app
```

---

## 6. Auto-Scaling Configuration

### Horizontal Pod Autoscaling

**For Cloud Run:**
```bash
gcloud run deploy sasamum-backend \
  --min-instances 1 \
  --max-instances 100 \
  --cpu-throttling=false
```

**For Kubernetes (GKE):**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sasamum-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sasamum-backend
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

---

## 7. Disaster Recovery

### Backup & Restore Procedure

```bash
#!/bin/bash
# restore.sh

BACKUP_FILE="sasamum_20240115_020000.sql.gz"

# Download from backup storage
gsutil cp gs://sasamum-backups/$BACKUP_FILE .

# Restore database
gunzip < $BACKUP_FILE | psql -U postgres -d sasamum

echo "Database restored from $BACKUP_FILE"
```

### RTO & RPO Goals

- **RTO (Recovery Time Objective):** 1 hour
- **RPO (Recovery Point Objective):** 1 day (daily backups)

### Multi-Region Setup (Advanced)

```bash
# Create secondary database in another region
gcloud sql instances create sasamum-db-backup \
  --database-version=POSTGRES_15 \
  --tier=db-g1-small \
  --region=europe-west1 \
  --master-instance-name=sasamum-db
```

---

## 8. Performance Tuning

### Database Query Optimization

```sql
-- Analyze slow queries
EXPLAIN ANALYZE
SELECT * FROM appointments
WHERE appointment_date > NOW() - INTERVAL '30 days'
AND user_id = $1;

-- Create indexes for common queries
CREATE INDEX idx_appointments_date_user 
ON appointments(appointment_date, user_id);

-- Vacuum and analyze
VACUUM ANALYZE;
```

### Caching Strategy

**Redis Setup:**
```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

// Cache user data
async function getUserWithCache(userId: string) {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  return user;
}
```

---

## 9. Disaster Recovery Checklist

- [ ] Daily backups automated and tested
- [ ] RTO < 1 hour
- [ ] RPO < 1 day
- [ ] Failover procedures documented
- [ ] Team trained on recovery procedures
- [ ] Multi-region failover tested
- [ ] Monitoring alerts configured
- [ ] Runbooks created for common issues

