# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate && \
    npm run build && \
    cp -r .next/static .next/standalone/.next/static && \
    cp -r public .next/standalone/public

# Pre-compile seed.ts to seed.js so tsx is not needed at runtime
RUN npx esbuild prisma/seed.ts \
    --bundle \
    --platform=node \
    --external:@prisma/client \
    --outfile=prisma/seed.js

# Stage 2: Runtime (minimal)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
ENV PATH="/app/node_modules/.bin:$PATH"

# Standalone Next.js server + its traced minimal node_modules
COPY --from=builder /app/.next/standalone ./

# Prisma schema (needed by prisma db push at startup)
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

# Pre-compiled seed script
COPY --from=builder /app/prisma/seed.js ./prisma/seed.js

# Prisma CLI (for prisma db push)
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

# Prisma engines: schema-engine for db push, query engine for app
COPY --from=builder /app/node_modules/@prisma/engines ./node_modules/@prisma/engines

# Generated Prisma client with linux-musl native binary
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 8080

CMD ["node", "server.js"]
