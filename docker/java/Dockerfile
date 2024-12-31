FROM openjdk:17-slim

WORKDIR /app

# Create a non-root user
RUN useradd -m -r runner
USER runner

# Command to run code
CMD ["java", "--version"] 