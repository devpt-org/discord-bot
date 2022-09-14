# Specify the parent image from which we build
FROM node:latest

# Set the working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

COPY . .

# Run the application
CMD [ "node", "index.js" ]