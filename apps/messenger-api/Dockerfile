FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

COPY prisma.config.ts ./prisma.config.ts

RUN npm ci

RUN DATABASE_URL=test npx prisma generate

COPY . .
COPY templates ./templates

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/templates ./templates

COPY entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["entrypoint.sh"]

CMD ["node", "dist/main"]
