FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/StockWatch-1.0-SNAPSHOT.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
