#!/bin/bash
# Render deployment script for StockWatch frontend

echo "🎨 Starting StockWatch Frontend Build..."

cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --silent

# Build the React application
echo "🔨 Building React application..."
npm run build

echo "✅ Frontend build completed successfully!"

# Check if build directory was created
if [ -d "build" ]; then
    echo "📁 Build directory created successfully"
    echo "📊 Build size: $(du -sh build | cut -f1)"
    echo "📄 Files in build: $(find build -type f | wc -l) files"
else
    echo "❌ Build directory not found!"
    exit 1
fi
