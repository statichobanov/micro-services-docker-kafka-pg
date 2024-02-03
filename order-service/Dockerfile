# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Compile TypeScript code
RUN npm run build

# Expose the port
EXPOSE 3004

# Define the command to run your app
CMD ["npm", "start"]
