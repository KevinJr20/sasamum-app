const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const articleSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  author: z.string().optional()
});

const chatSchema = z.object({
  text: z.string().min(1),
  userId: z.number().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  articleSchema,
  chatSchema
};