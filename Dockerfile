# Use the official Node.js 18 image as the base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package*.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install Chrome-AWS-Lambda runtime
RUN npm install -g chrome-aws-lambda

# Command to run the Lambda function
CMD ["node", "./api/index.ts"]
