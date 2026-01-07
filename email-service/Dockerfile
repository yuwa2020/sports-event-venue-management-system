# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose port (change if needed)
EXPOSE 3000

# Run the service
CMD ["npm", "start"]
