require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const chatRoutes = require('./routes/chats');

const app = express();
const port = process.env.PORT || 3001;

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_ORIGIN
  })
);

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120
  })
);

app.get('/', (req, res) => res.json({ status: 'SasaMum backend running' }));
app.get('/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/chats', chatRoutes);

// centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'server error' });
});

if (require.main === module) {
  app.listen(port, () => console.log(`SasaMum backend listening on ${port}`));
}

module.exports = app;
