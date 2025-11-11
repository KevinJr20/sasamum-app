# Backend Setup Instructions

## Quick Start: Node.js + Express Backend

### 1. Initialize Backend Project

```bash
# Create backend directory
mkdir sasamum-backend
cd sasamum-backend

# Initialize npm
npm init -y

# Install dependencies
npm install express cors dotenv axios pg bcryptjs jsonwebtoken
npm install --save-dev nodemon typescript @types/express @types/node

# Initialize TypeScript
npx tsc --init
```

### 2. Create Project Structure

```
sasamum-backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── pregnancy.ts
│   │   ├── appointments.ts
│   │   └── chat.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── pregnancyController.ts
│   │   └── appointmentController.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Pregnancy.ts
│   │   └── Appointment.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   └── validators.ts
│   └── index.ts
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

### 3. Environment File (.env)

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sasamum
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 4. Core Files

#### `src/index.ts`
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import pregnancyRoutes from './routes/pregnancy';
import appointmentRoutes from './routes/appointments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Database connection
connectDatabase().then(() => {
  console.log('Database connected');
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pregnancy', pregnancyRoutes);
app.use('/api/appointments', appointmentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### `src/config/database.ts`
```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function connectDatabase() {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

export async function query(text: string, params?: any[]) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default pool;
```

#### `src/utils/jwt.ts`
```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export function generateTokens(userId: string, email: string) {
  const token = jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId, email },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRY }
  );

  return { token, refreshToken };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}

export function decodeToken(token: string) {
  return jwt.decode(token);
}
```

#### `src/middleware/auth.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = (decoded as any).userId;
  req.email = (decoded as any).email;
  next();
}
```

#### `src/routes/auth.ts`
```typescript
import express, { Router } from 'express';
import { query } from '../config/database';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import bcrypt from 'bcryptjs';

const router: Router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, userType, facilityName } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, name, phone, user_type, facility_name)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name, user_type`,
      [email, hashedPassword, name, phone, userType || 'patient', facilityName]
    );

    const user = result.rows[0];
    const { token, refreshToken } = generateTokens(user.id, user.email);

    res.json({
      success: true,
      token,
      refreshToken,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await query(
      'SELECT id, email, password_hash, name, user_type FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { token, refreshToken } = generateTokens(user.id, user.email);

    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/refresh', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const { token: newToken, refreshToken: newRefreshToken } = generateTokens(
      (decoded as any).userId,
      (decoded as any).email
    );

    res.json({
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

router.post('/logout', (req, res) => {
  // Token blacklisting would go here (requires Redis)
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
```

### 5. Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  }
}
```

### 6. Running the Backend

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

### 7. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sasamum;

# Connect to database
\c sasamum

# Run the schema SQL from BACKEND_INTEGRATION_GUIDE.md
```

### 8. Testing with Frontend

Once backend is running on http://localhost:4000:

1. Frontend `.env` should have:
   ```
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

2. Build frontend:
   ```bash
   npm run build
   ```

3. Start frontend:
   ```bash
   npm run dev
   ```

4. The app will now communicate with your backend!

### 9. Next Steps for Backend Development

- [ ] Implement all routes (users, pregnancy, appointments, chat)
- [ ] Add input validation (use `joi` or `zod`)
- [ ] Implement proper error handling
- [ ] Add rate limiting (use `express-rate-limit`)
- [ ] Add request logging (use `morgan`)
- [ ] Set up JWT token blacklisting (use Redis)
- [ ] Add file upload handling (use `multer`)
- [ ] Implement database migrations (use `db-migrate`)
- [ ] Add comprehensive tests
- [ ] Set up CI/CD pipeline

