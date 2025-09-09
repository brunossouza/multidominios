# Frontend Dockerfile - build Angular app and serve with nginx
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --silent

# Copy source and build
COPY . .
RUN npm run build -- --configuration production

FROM nginx:stable-alpine AS runner

# Copy built files from the Angular build. The new Angular CLI outputs to dist/
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom nginx config to enable SPA fallback and proxy to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
