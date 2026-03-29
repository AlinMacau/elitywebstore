FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the JAR file
COPY target/elitywebstore-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the application (default profile, secrets from environment variables)
ENTRYPOINT ["java", "-jar", "app.jar"]