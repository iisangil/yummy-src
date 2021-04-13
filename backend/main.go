package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/iisangil/yummy/tree/main/backend/socket"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env.test")
	if err != nil {
		log.Panic("Error loading .env file:", err)
	}

	hub := socket.MakeHub()
	r := mux.NewRouter()
	r.HandleFunc("/ws/{username}/{room}", hub.HandleWebSockets)

	srv := &http.Server{
		Handler: r,
		Addr:    "127.0.0.1:8000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
