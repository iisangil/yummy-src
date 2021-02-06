package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

// Hub to take care of all rooms and sockets
type Hub struct {
	rooms    map[string]*Room
	upgrader websocket.Upgrader
}

// constructor for hub
func makeHub() *Hub {
	hub := new(Hub)
	hub.rooms = make(map[string]*Room)
	hub.upgrader = websocket.Upgrader{}

	return hub
}

func (h *Hub) checkRoom(name string) *Room {
	if _, ok := h.rooms[name]; !ok {
		h.rooms[name] = makeRoom(name)
	}
	return h.rooms[name]
}

func (h *Hub) handleWebSockets(w http.ResponseWriter, r *http.Request) {
	path := mux.Vars(r)
	roomName := path["room"]
	// log.Println(roomName)

	h.upgrader.CheckOrigin = func(*http.Request) bool { return true } // allow requests from wherever
	ws, err := h.upgrader.Upgrade(w, r, nil)                          // upgrade http request to web socket
	if err != nil {
		log.Fatal("Upgrade: ", err)
	}

	defer ws.Close()

	room := h.checkRoom(roomName)
	id := room.joinRoom(ws)
	client := room.getClient(id)

	go room.handleMessages(id)

	for {
		var msg Message

		err := ws.ReadJSON(&msg)
		if err != nil {
			// log.Printf("error ReadJSON: %v", err)
			room.leaveRoom(id)
			break
		}
		// log.Println(msg)

		client.sendMessage(msg)
	}
}
