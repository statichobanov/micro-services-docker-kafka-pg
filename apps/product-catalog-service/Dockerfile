# Use an official Node runtime as a parent image
FROM node:20-alpine
# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json .
COPY package-lock.json .
COPY nx.json .
COPY tsconfig.base.json .

RUN npm install -g nx

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

CMD ["nx", "serve", "product-catalog-service"]
