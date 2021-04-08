package socket

// MessageReceived struct to hold message information that is received from client
type MessageReceived struct {
	Username   string            `json:"username"`
	Type       string            `json:"type"`
	Parameters map[string]string `json:"parameters"`
	Message    string            `json:"message"`
}

// MessageSent struct to hold message information to send back
type MessageSent struct {
	Username string `json:"username"`
	Message  string `json:"message"`
}
