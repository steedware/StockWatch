# Multi-stage build for better optimization
FROM maven:3.9.4-openjdk-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:21-jdk-slim

WORKDIR /app

# Create logs directory
RUN mkdir -p /app/logs

# Copy built jar from build stage
COPY --from=build /app/target/StockWatch-1.0-SNAPSHOT.jar app.jar

EXPOSE $PORT

ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Use shell form to properly handle environment variables
CMD java $JAVA_OPTS -Dspring.profiles.active=prod -Dserver.port=$PORT -jar app.jar
