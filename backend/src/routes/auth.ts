import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${BACKEND_URL}/api/auth/verify?token=${token}`;
  // If SMTP env provided, attempt to send email, otherwise log link
  const host = process.env.SMTP_HOST;
  if (host) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: (process.env.SMTP_SECURE === 'true'),
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@sasamum.local',
        to: email,
        subject: 'Confirm your SasaMum account',
        text: `Please verify your account by visiting: ${verifyUrl}`,
        html: `<p>Please verify your account by clicking <a href="${verifyUrl}">this link</a>.</p>`,
      });
      console.log(`Verification email sent to ${email}`);
      return;
    } catch (err) {
      console.warn('Failed to send email via SMTP, falling back to console log', err);
    }
  }

  // Fallback: log the verification URL so developer can use it
  console.log(`VERIFY LINK for ${email}: ${verifyUrl}`);
}

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { name, email, password, role, facilityName, licenseNumber, dueDate } = req.body as {
        name?: string;
        email: string;
        password: string;
        role?: string;
        facilityName?: string;
        licenseNumber?: string;
        dueDate?: string;
      };
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(409).json({ error: 'user exists' });
      const hashed = await bcrypt.hash(password, 10);
      // create verification token
      const verificationToken = crypto.randomBytes(24).toString('hex');
      const user = await prisma.user.create({
        data: {
          email,
          name: name || null,
          password: hashed,
          role: role || 'mother',
          facilityName: facilityName || null,
          licenseNumber: licenseNumber || null,
          dueDate: dueDate ? new Date(dueDate) : null,
          isVerified: false,
          verificationToken,
        },
      });

      // send verification email (or log link)
      await sendVerificationEmail(email, verificationToken);

      // don't auto-login until user verifies their email - return a simple message
      res.json({ message: 'registered', info: 'verification_sent' });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { email, password } = req.body as { email: string; password: string };
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: 'invalid credentials' });
      // if not verified, reject with specific error
      if (!user.isVerified) return res.status(403).json({ error: 'email_not_verified', message: 'Please verify your email before logging in' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: 'invalid credentials' });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = String(req.query.token || req.body.token || '');
    if (!token) return res.status(400).json({ error: 'missing_token' });
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) return res.status(404).json({ error: 'invalid_token' });
    await prisma.user.update({ where: { id: user.id }, data: { isVerified: true, verificationToken: null } });
    res.json({ message: 'verified' });
  } catch (err) {
    next(err);
  }
});

router.post('/resend', body('email').isEmail(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email } = req.body as { email: string };
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'not_found' });
    const verificationToken = crypto.randomBytes(24).toString('hex');
    await prisma.user.update({ where: { id: user.id }, data: { verificationToken } });
    await sendVerificationEmail(email, verificationToken);
    res.json({ message: 'resent' });
  } catch (err) {
    next(err);
  }
});

export default router;
