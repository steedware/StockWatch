#!/bin/bash
set -e

echo "Building StockWatch Backend for Render..."

# Clean and build the application
./mvnw clean package -DskipTests

echo "Build completed successfully!"
