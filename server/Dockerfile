
# Step 1: Build stage - Start with the Golang base image
FROM golang:1.23 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum from the server directory in the build context
COPY server/go.mod server/go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the source code from the server directory
COPY server/ ./

# Step 2: Build the Go application
RUN go build -o realornot-server ./cmd/server

# Step 3: Create a minimal runtime image from Alpine
FROM alpine:latest

# Install necessary dependencies (e.g., CA certificates)
RUN apk --no-cache add ca-certificates

# Set working directory inside the container
WORKDIR /root/

# Copy the compiled binary from the builder stage
COPY --from=builder /app/realornot-server .

# Expose port 8080
EXPOSE 8080

# Command to run the Go application
CMD ["./realornot-server"]
