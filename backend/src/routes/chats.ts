import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../prismaClient';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chats = await prisma.chat.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(chats);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  body('text').notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { userId, text } = req.body as { userId?: number; text: string };
      const chat = await prisma.chat.create({
        data: { userId: userId || null, text },
      });
      res.status(201).json(chat);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
