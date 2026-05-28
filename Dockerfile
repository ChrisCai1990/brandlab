# Stage 1: Build (all deps including devDeps)
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Run prisma generate and next build directly (not npm run build) because
# the build script includes prisma db push which needs DB access unavailable
# during Docker build phase. prisma db push runs in startCommand at runtime.
RUN npx prisma generate && npx next build

# Pre-compile seed.ts → seed.js (no tsx needed at runtime)
RUN npx esbuild prisma/seed.ts \
    --bundle \
    --platform=node \
    --external:@prisma/client \
    --outfile=prisma/seed.js

# Stage 2: Runtime (production deps only — no devDeps, no build tools)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
ENV PATH="/app/node_modules/.bin:$PATH"

# Copy prisma schema before npm ci so postinstall can run prisma generate
COPY prisma/schema.prisma ./prisma/schema.prisma

# Install production deps only — triggers prisma generate via @prisma/client postinstall
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy Next.js build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy pre-compiled seed script
COPY --from=builder /app/prisma/seed.js ./prisma/seed.js

EXPOSE 8080

CMD ["node_modules/.bin/next", "start"]
