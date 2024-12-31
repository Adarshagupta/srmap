FROM gcc:latest

WORKDIR /app

# Install any needed packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -r runner
USER runner

# Command to run code
CMD ["g++", "--version"] 