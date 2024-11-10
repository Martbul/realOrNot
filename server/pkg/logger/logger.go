package logger

import (
	"github.com/hashicorp/go-hclog"
)

// Logger is a globally accessible logger instance.
var Logger hclog.Logger

// Init initializes the logger with standard settings.
func Init() {
	Logger = hclog.New(&hclog.LoggerOptions{
		Name:       "logger",                       // Logger name
		Output:     hclog.DefaultOutput,            // Standard output (can also log to a file, etc.)
		Level:      hclog.LevelFromString("DEBUG"), // Log level (DEBUG, INFO, WARN, ERROR, etc.)
		JSONFormat: true,                           // Enable JSON output for structured logging
	})
}

// GetLogger returns the global logger instance
func GetLogger() hclog.Logger {
	return Logger
}
