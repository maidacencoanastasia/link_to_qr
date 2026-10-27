# ==========================================
# Stage 1: Build Frontend Assets
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci

# Copy project source files
COPY index.html ./
COPY style.css ./
COPY src/ ./src/

# Build production bundle (outputs to /app/dist)
RUN npm run build

# ==========================================
# Stage 2: Serve with Lightweight Nginx
# ==========================================
FROM nginx:alpine AS runner

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Health check to ensure service readiness
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
