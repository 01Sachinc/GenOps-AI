# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/genops-ai-backend-0.0.1-SNAPSHOT.jar app.jar

# Environment variable defaults
ENV OLLAMA_BASE_URL=http://localhost:11434
ENV OLLAMA_MODEL=llama3
ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
