#!/bin/bash
# Render deployment script for StockWatch backend

echo "🚀 Starting StockWatch Backend Build..."

# Clean and package the application
./mvnw clean package -DskipTests -q

echo "✅ Backend build completed successfully!"

# Check if jar file was created
if [ -f "target/StockWatch-1.0-SNAPSHOT.jar" ]; then
    echo "📦 JAR file created: target/StockWatch-1.0-SNAPSHOT.jar"
    echo "📊 JAR size: $(du -h target/StockWatch-1.0-SNAPSHOT.jar | cut -f1)"
else
    echo "❌ JAR file not found!"
    exit 1
fi
