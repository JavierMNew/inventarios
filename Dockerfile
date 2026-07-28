# Dockerfile para la aplicación web Astro SSR
FROM node:22-alpine AS base
WORKDIR /app

# Habilitar pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# 1. Instalación de dependencias
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 2. Compilación del proyecto
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm build

# 3. Imagen de ejecución ligera
FROM base AS runner
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

WORKDIR /app

# Copiar archivos compilados y dependencias necesarias
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
