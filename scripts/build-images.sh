#!/bin/bash

# Build Python image
echo "Building Python code runner image..."
docker build -t code-runner-python ./docker/python

# Build C++ image
echo "Building C++ code runner image..."
docker build -t code-runner-cpp ./docker/cpp

# Build Java image
echo "Building Java code runner image..."
docker build -t code-runner-java ./docker/java

echo "All images built successfully!" 