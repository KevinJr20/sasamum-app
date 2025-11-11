import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../prismaClient';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  body('title').notEmpty(),
  body('body').notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const {
        title,
        body: content,
        author,
      } = req.body as {
        title: string;
        body: string;
        author?: string;
      };
      const article = await prisma.article.create({
        data: { title, body: content, author: author || null },
      });
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
