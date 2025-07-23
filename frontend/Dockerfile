# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Production stage - serve with Vite preview
FROM node:18-alpine

WORKDIR /app

# Copy built files and package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Expose port for Vite preview server
EXPOSE 4173

# Use Vite preview server to serve built files
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]