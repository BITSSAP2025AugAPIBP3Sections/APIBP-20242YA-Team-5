# --- Build stage ---
FROM maven:3.9.4-eclipse-temurin-17 as builder
WORKDIR /workspace

# Copy pom and download dependencies (leverages Docker layer caching)
COPY pom.xml .
COPY src ./src
RUN mvn -B -e -ntp clean package -DskipTests

# --- Runtime stage ---
FROM eclipse-temurin:17-jre-jammy
ARG JAR_FILE=target/*.jar
WORKDIR /app

# Copy jar built in previous stage
COPY --from=builder /workspace/target/*.jar app.jar

# Create runtime user for security
RUN addgroup --system app && adduser --system --ingroup app app

# Expose port (same as application.yml default)
EXPOSE 3003

# Use non-root user
USER app

ENV JAVA_OPTS=" -Xms256m -Xmx512m "

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
