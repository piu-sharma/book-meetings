# Use an official Node runtime as the parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for both backend and frontend
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies for both backend and frontend
RUN cd backend && npm install && \
    cd ../frontend && npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN cd frontend && npm run build

# Create public directory in backend and copy frontend build
RUN mkdir -p backend/public && \
    cp -r frontend/build/* backend/public/

# Set the working directory to the backend folder
WORKDIR /usr/src/app/backend

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]