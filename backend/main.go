package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// Message struct to hold message information
type Message struct {
	Username string `json:"username"`
	Message  string `json:"message"`
	Channel  string `json:"channel"`
}

func main() {
	hub := makeHub()
	r := mux.NewRouter()
	r.HandleFunc("/ws/{room}", hub.handleWebSockets)

	srv := &http.Server{
		Handler: r,
		Addr:    "127.0.0.1:8000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
