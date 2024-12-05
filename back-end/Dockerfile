# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy .env file to the container
# COPY .env ./
COPY IBMSQL_Cert_Ca.crt /usr/src/app/IBMSQL_Cert_CA.crt

# Expose the port the app runs on
EXPOSE 4471

# Define environment variable
# ENV PORT 4471

# Command to run the application
CMD ["node", "server.js"]
