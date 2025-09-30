# Use Node.js LTS
FROM node:18-alpine

# Set working dir
WORKDIR /app

# Copy package files first (better cache)
COPY package*.json tsconfig.json ./

# Install deps
RUN npm install

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Expose app port
EXPOSE 3000

# Run app
CMD ["npm", "start"]
