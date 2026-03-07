FROM node:22-slim

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code and other necessary files
COPY src/ ./src/
COPY tsconfig.json .
COPY .env .env
COPY mcp.json mcp.json
# Pinecone and GHL might need credentials if stored in files, but usually they are in .env

# Set environment
ENV NODE_ENV=production

# Run the bot
CMD ["npx", "tsx", "src/index.ts"]
