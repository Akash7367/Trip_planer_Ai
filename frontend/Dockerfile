FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev"]
