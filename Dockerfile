# Use an official Node.js runtime as a parent image
FROM node:18.20.2

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install
RUN npm install bcrypt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the app
CMD ["npm", "start", "room.ts"]
