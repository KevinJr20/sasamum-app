# Security & Compliance Guide

## 1. Authentication & Authorization

### JWT Implementation

**Backend JWT Utilities** (`src/utils/jwt.ts`):
```typescript
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'patient' | 'provider' | 'admin';
  iat?: number;
  exp?: number;
}

export const JWT_EXPIRY = '1h';
export const JWT_REFRESH_EXPIRY = '7d';

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: JWT_EXPIRY,
  });
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: JWT_REFRESH_EXPIRY,
  });
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}
```

### Password Security

```typescript
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hash password securely
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify password
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

### Multi-Factor Authentication (MFA)

```typescript
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

/**
 * Generate MFA secret
 */
export async function generateMFASecret(userEmail: string) {
  const secret = speakeasy.generateSecret({
    name: `SasaMum (${userEmail})`,
    issuer: 'SasaMum',
    length: 32,
  });

  // Generate QR code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

  return {
    secret: secret.base32,
    qrCode,
  };
}

/**
 * Verify MFA token
 */
export function verifyMFAToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow ±2 time steps
  });
}
```

---

## 2. Data Protection

### Encryption at Rest

```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt sensitive data
 */
export function encryptData(data: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Return: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encryptedData: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### PII Data Handling

```typescript
/**
 * Mask sensitive personal data for logging
 */
export function maskPII(data: any): any {
  const masked = { ...data };

  if (masked.email) {
    const [name, domain] = masked.email.split('@');
    masked.email = `${name.substring(0, 2)}***@${domain}`;
  }

  if (masked.phone) {
    masked.phone = `***-***-${masked.phone.slice(-4)}`;
  }

  if (masked.id_number) {
    masked.id_number = `***-***-${masked.id_number.slice(-4)}`;
  }

  if (masked.password) {
    masked.password = '***REDACTED***';
  }

  return masked;
}

/**
 * Log without PII
 */
export function logSafely(message: string, data?: any): void {
  const maskedData = data ? maskPII(data) : undefined;
  logger.info(message, maskedData);
}
```

### Data Retention Policy

```typescript
/**
 * Delete old user data per retention policy
 */
export async function enforceDataRetentionPolicy() {
  const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

  // Delete messages older than 2 years
  await db.query(
    'DELETE FROM messages WHERE created_at < NOW() - INTERVAL \'2 years\''
  );

  // Archive inactive users (no login in 2 years)
  await db.query(
    'UPDATE users SET status = \'inactive\' WHERE last_login < NOW() - INTERVAL \'2 years\''
  );

  // Delete symbols/tracking data older than 90 days for patients who consent
  await db.query(
    'DELETE FROM symptoms WHERE created_at < NOW() - INTERVAL \'90 days\' AND user_id IN (SELECT id FROM users WHERE data_retention = \'minimal\')'
  );
}
```

---

## 3. API Security

### Input Validation & Sanitization

```typescript
import { z } from 'zod';
import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

// Define validation schemas
export const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string()
    .min(12)
    .refine(validatePasswordStrength, 'Password too weak'),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone'),
});

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  // Remove potential XSS
  let sanitized = DOMPurify.sanitize(input);
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  return sanitized;
}

/**
 * Validate and sanitize API request
 */
export async function validateAndSanitize<T>(
  data: unknown,
  schema: z.ZodSchema
): Promise<T> {
  try {
    const validated = await schema.parseAsync(data);
    
    // Sanitize string fields
    Object.keys(validated).forEach(key => {
      if (typeof validated[key] === 'string') {
        validated[key] = sanitizeInput(validated[key]);
      }
    });
    
    return validated as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors);
    }
    throw error;
  }
}
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from 'redis';

const redisClient = redis.createClient();

// General API rate limit
export const generalLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:general:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Login attempt rate limit (stricter)
export const loginLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:login:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again after 15 minutes',
});

// API endpoint rate limit
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:api:',
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  keyGenerator: (req) => req.user?.id || req.ip,
});

// Apply middleware
app.use(generalLimiter);
app.post('/api/auth/login', loginLimiter, loginHandler);
app.use('/api/v1/', apiLimiter);
```

### CORS Configuration

```typescript
import cors from 'cors';

const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'https://sasamum.app',
    'https://www.sasamum.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
```

### CSRF Protection

```typescript
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

app.use(cookieParser());

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

// Generate CSRF token for forms
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ token: req.csrfToken() });
});

// Protect POST/PUT/DELETE endpoints
app.post('/api/users', csrfProtection, (req, res) => {
  // Handle request
});
```

---

## 4. Compliance Requirements

### HIPAA Compliance (if medical data)

**Checklist:**
- [ ] Encrypt all data in transit (TLS 1.2+)
- [ ] Encrypt all data at rest (AES-256)
- [ ] Access logging for all PHI (Protected Health Information)
- [ ] Regular security audits
- [ ] Incident response plan
- [ ] Business Associate Agreements (BAA) with vendors
- [ ] Workforce training on HIPAA

### GDPR Compliance

**User Rights Implementation:**

```typescript
/**
 * Right to be forgotten (data deletion)
 */
export async function deleteUserData(userId: string) {
  // Delete personal data
  await db.query('DELETE FROM users WHERE id = $1', [userId]);
  
  // Delete pregnancy data
  await db.query('DELETE FROM pregnancy_data WHERE user_id = $1', [userId]);
  
  // Delete vital signs
  await db.query('DELETE FROM vital_signs WHERE user_id = $1', [userId]);
  
  // Delete symptoms
  await db.query('DELETE FROM symptoms WHERE user_id = $1', [userId]);
  
  // Delete appointments
  await db.query('DELETE FROM appointments WHERE user_id = $1', [userId]);
  
  // Delete messages
  await db.query('DELETE FROM messages WHERE sender_id = $1', [userId]);
  
  // Log deletion for audit trail
  logger.info(`User ${userId} data deleted per GDPR request`);
}

/**
 * Right to data portability
 */
export async function exportUserData(userId: string) {
  const data = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  
  const pregnancyData = await db.query(
    'SELECT * FROM pregnancy_data WHERE user_id = $1',
    [userId]
  );
  
  // Export as JSON
  return {
    user: data.rows[0],
    pregnancyData: pregnancyData.rows,
  };
}

/**
 * Privacy settings
 */
export async function updatePrivacySettings(
  userId: string,
  settings: {
    dataRetention: 'full' | 'minimal';
    dataSharing: boolean;
    analyticsTracking: boolean;
  }
) {
  await db.query(
    'UPDATE users SET privacy_settings = $1 WHERE id = $2',
    [JSON.stringify(settings), userId]
  );
}
```

**Privacy Policy Checklist:**
- [ ] Data collection purposes
- [ ] Legal basis for processing
- [ ] Data sharing practices
- [ ] Retention periods
- [ ] User rights
- [ ] Contact information
- [ ] Cookie usage
- [ ] Third-party services

### CCPA Compliance (California)

```typescript
/**
 * Right to know what personal data is collected
 */
export async function getCollectedData(userId: string) {
  const data = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  return data.rows[0];
}

/**
 * Right to delete personal data
 */
export async function deletePersonalData(userId: string) {
  // Same as GDPR deletion
  await deleteUserData(userId);
}

/**
 * Right to opt-out of data sales
 */
export async function optOutOfSales(userId: string) {
  await db.query(
    'UPDATE users SET opt_out_sales = true WHERE id = $1',
    [userId]
  );
}
```

---

## 5. Security Testing

### OWASP Top 10 Checks

**1. SQL Injection Prevention**
```typescript
// ✅ GOOD - Parameterized query
const result = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// ❌ BAD - String concatenation
const result = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
```

**2. Cross-Site Scripting (XSS) Prevention**
```typescript
// ✅ GOOD - React escapes by default
<div>{userInput}</div>

// ❌ BAD - Using dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

**3. Cross-Site Request Forgery (CSRF) Prevention**
- ✅ Use CSRF tokens
- ✅ Use SameSite cookies
- ✅ Validate Referer header

**4. Broken Authentication**
- ✅ Use strong password hashing (bcrypt)
- ✅ Implement MFA
- ✅ Secure session management

**5. Sensitive Data Exposure**
- ✅ Encrypt data at rest
- ✅ Use HTTPS everywhere
- ✅ Disable caching for sensitive data

### Security Testing Script

```bash
#!/bin/bash
# security-scan.sh

echo "Running security tests..."

# SAST - Static Application Security Testing
echo "Running SonarQube analysis..."
sonar-scanner

# Dependency scanning
echo "Scanning dependencies for vulnerabilities..."
npm audit
pip check

# Container scanning
echo "Scanning Docker image..."
trivy image gcr.io/sasamum-prod/sasamum-backend:latest

# DAST - Dynamic Application Security Testing
echo "Running OWASP ZAP scan..."
zaproxy -cmd -quickurl http://localhost:3000 -quickout results.html

echo "Security scan complete!"
```

---

## 6. Security Headers

```typescript
import helmet from 'helmet';

// Apply security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.example.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.sasamum.app"],
      fontSrc: ["'self'", "https://fonts.googleapis.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-site' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
}));
```

---

## 7. Incident Response Plan

### Incident Classification

| Severity | Impact | Response Time |
|----------|--------|---|
| Critical | Data breach, service down | < 1 hour |
| High | Major service degradation | < 4 hours |
| Medium | Minor functionality issue | < 1 day |
| Low | No user impact | < 1 week |

### Response Procedure

```
1. DETECT: Automated monitoring alerts
2. ASSESS: Determine severity and scope
3. CONTAIN: Stop further damage
4. ERADICATE: Remove root cause
5. RECOVER: Restore systems
6. REVIEW: Post-mortem analysis
7. PREVENT: Implement safeguards
```

### Breach Notification

```typescript
/**
 * Handle security incident
 */
export async function handleSecurityIncident(
  severity: 'critical' | 'high' | 'medium' | 'low',
  description: string,
  affectedUsers?: string[]
) {
  // Log incident
  logger.error(`SECURITY INCIDENT [${severity.toUpperCase()}]: ${description}`);

  // Notify security team
  await sendSecurityAlert({
    severity,
    description,
    timestamp: new Date(),
  });

  // For data breaches, notify users within 72 hours
  if (severity === 'critical' && affectedUsers?.length) {
    for (const userId of affectedUsers) {
      await sendBreachNotification(userId);
    }
  }

  // Create incident ticket
  await createIncidentTicket({
    severity,
    description,
    affectedUsers,
  });
}
```

---

## 8. Security Checklist

### Pre-Production
- [ ] All dependencies scanned for vulnerabilities
- [ ] OWASP Top 10 checks completed
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation implemented
- [ ] Encryption configured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Security testing completed

### Production
- [ ] Monitoring alerts configured
- [ ] Incident response plan documented
- [ ] Backup and recovery tested
- [ ] Access logs enabled
- [ ] Secrets properly managed
- [ ] Security policies documented
- [ ] Team trained on security procedures
- [ ] Regular security audits scheduled

### Ongoing
- [ ] Daily vulnerability scans
- [ ] Weekly log reviews
- [ ] Monthly security updates
- [ ] Quarterly penetration testing
- [ ] Annual compliance audits

