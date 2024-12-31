FROM python:3.9-slim

WORKDIR /app

# Install any needed packages
RUN pip install --no-cache-dir numpy pandas

# Create a non-root user
RUN useradd -m -r runner
USER runner

# Command to run code
CMD ["python", "-c", "print('Ready to run code')"] 