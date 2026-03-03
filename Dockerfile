# Gratitude Marketing Website — Multi-stage Docker build
# Stage 1: Build Astro static site
# Stage 2: Serve with nginx (~15MB target)

# --- Stage 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install

# Copy source and build
COPY . .
RUN npm run build

# --- Stage 2: Serve ---
FROM nginx:1.25-alpine

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
