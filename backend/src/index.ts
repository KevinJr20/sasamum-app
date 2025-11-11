import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import articlesRoutes from './routes/articles';
import chatsRoutes from './routes/chats';

// Load environment
dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';
app.use(cors({ origin: FRONTEND_ORIGIN }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/chats', chatsRoutes);

app.get('/', (_req: Request, res: Response) =>
  res.json({ ok: true, message: 'SasaMum backend (TS)' })
);
app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));

// Centralized error handler
app.use((err: Error | any, _req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const status = (err as any)?.status || 500;
  res.status(status).json({ error: (err as Error)?.message || 'Internal server error' });
});

// If run directly, start the server. After build, `dist/index.js` will have same behavior.
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`SasaMum backend (TS) listening on port ${PORT}`);
  });
}

export default app;
