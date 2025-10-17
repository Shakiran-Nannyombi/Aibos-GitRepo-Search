#!/bin/bash

# Build script for Vercel deployment
echo "Building frontend..."

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the project
npm run build

echo "Build completed!"
