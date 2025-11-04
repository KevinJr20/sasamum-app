const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../prismaClient');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const chats = await prisma.chat.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(chats);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  body('text').notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { userId, text } = req.body;
      const chat = await prisma.chat.create({ data: { userId: userId || null, text } });
      res.status(201).json(chat);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
