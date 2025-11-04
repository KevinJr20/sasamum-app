const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../prismaClient');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  body('title').notEmpty(),
  body('body').notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { title, body: content, author } = req.body;
      const article = await prisma.article.create({ data: { title, body: content, author: author || null } });
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
