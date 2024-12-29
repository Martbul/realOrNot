
# Stage 1: Build the Go application
FROM golang:1.23 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum from the current directory
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the source code
COPY . ./

# Build the Go application for linux amd64
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o realornot-server ./cmd/server

# Stage 2: Create a minimal image with the compiled binary
FROM alpine:latest

# Install ca-certificates (needed for HTTPS requests)
RUN apk --no-cache add ca-certificates

# Set working directory inside the container to /root/
WORKDIR /root/

# Copy the compiled binary from the builder stage
COPY --from=builder /app/realornot-server .

# Copy .env file to the final image
COPY .env /root/

# Make the binary executable
RUN chmod +x /root/realornot-server

# Expose port 8080
EXPOSE 8080

# Command to run the Go application
CMD ["/root/realornot-server"]
