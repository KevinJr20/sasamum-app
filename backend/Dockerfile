# Build stage
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Production stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 4000
CMD ["npm", "start"]