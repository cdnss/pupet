# Use the official Node.js 18 image as the base
FROM node:18-alpine
RUN apk add --no-cache \
    chromium \
    libx11-xcb1 \
    libxext \
    freetype \
    fontconfig \
    nss \
    libpango-1.0-0 \
    libatk-1.0-0 \
    atk \
    libcairo2 \
    libgtk-3-0
# Set the working directory
WORKDIR /app

# Copy package*.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
RUN npm install express
# Install Chrome-AWS-Lambda runtime
EXPOSE 8080

# Command to run the Lambda function
CMD ["node", "./api/index.ts"]
