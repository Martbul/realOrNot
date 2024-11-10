package util

import (
	"encoding/json"
	"net/http"
)

// WriteJSONResponse writes a JSON response to the client
func WriteJSONResponse(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}
