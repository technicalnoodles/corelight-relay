# Use the official Node.js runtime as base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Set environment variable for production
ENV NODE_ENV=production

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Expose port 443 for production
EXPOSE 443

# Start the application
CMD ["node", "index.js"]
