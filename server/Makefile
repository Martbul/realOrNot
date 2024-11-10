# Define variables
GO = go
APP_NAME = realOrNot
PORT = 8080

# Default target (run the server)
.PHONY: all
all: run

# Build the application
.PHONY: build
build:
	$(GO) build -o $(APP_NAME) ./cmd/server

# Run the application
.PHONY: run
run: build
	./$(APP_NAME)

# Clean the project (remove build artifacts)
.PHONY: clean
clean:
	rm -f $(APP_NAME)

# Run tests
.PHONY: test
test:
	$(GO) test ./...

# Run lint (using go lint, if installed)
.PHONY: lint
lint:
	golangci-lint run

# Run the server with `make start`
.PHONY: start
start:
	$(GO) run ./cmd/server/main.go

# Check project dependencies and tidy
.PHONY: tidy
tidy:
	$(GO) mod tidy
