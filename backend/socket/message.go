package socket

import "github.com/iisangil/yummy/tree/main/backend/restaurant"

// MessageReceived struct to hold message information that is received from client
type MessageReceived struct {
	Username   string            `json:"username"`
	Type       string            `json:"type"`
	Parameters map[string]string `json:"parameters,omitempty"`
	Message    string            `json:"message,omitempty"`
}

// MessageSent struct to hold message information to send back
type MessageSent struct {
	Username    string                `json:"username"`
	Type        string                `json:"type"`
	Message     string                `json:"message,omitempty"`
	Restaurants []restaurant.Business `json:"restaurants,omitempty"`
}
