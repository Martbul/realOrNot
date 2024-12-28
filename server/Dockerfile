#FROM golang:1.23 AS builder
FROM golang:1.23

# Set working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum from the current directory (same directory as Dockerfile)
COPY go.* ./

# Download dependencies
RUN go mod download

# Copy the rest of the source code from the current directory
COPY . ./

RUN go build -o realornot-server ./cmd/server

FROM alpine:latest

RUN apk --no-cache add ca-certificates

# Set working directory inside the container
WORKDIR /root/

# Copy the compiled binary from the builder stage
COPY --from=builder /app/realornot-server .

# Expose port 8080
EXPOSE 8080

# Command to run the Go application
CMD ["./realornot-server"]
