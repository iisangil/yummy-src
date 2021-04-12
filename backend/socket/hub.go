package socket

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/iisangil/yummy/tree/main/backend/restaurant"
)

// Hub to take care of all rooms and sockets
type Hub struct {
	rooms    map[string]*Room
	upgrader websocket.Upgrader
	lock     sync.Mutex
}

// MakeHub constructor for hub
func MakeHub() *Hub {
	hub := new(Hub)
	hub.rooms = make(map[string]*Room)
	hub.upgrader.CheckOrigin = func(*http.Request) bool { return true } // allow requests from wherever

	return hub
}

func (h *Hub) checkRoom(name string) *Room {
	h.lock.Lock()
	if _, ok := h.rooms[name]; !ok {
		h.rooms[name] = makeRoom(name)
	}
	h.lock.Unlock()
	return h.rooms[name]
}

// HandleWebSockets for hub
func (h *Hub) HandleWebSockets(w http.ResponseWriter, r *http.Request) {
	path := mux.Vars(r)
	roomName := path["room"]
	// log.Println(roomName)

	ws, err := h.upgrader.Upgrade(w, r, nil) // upgrade http request to web socket
	if err != nil {
		log.Panic("Error while upgrading request to socket:", err)
	}

	defer ws.Close()

	room := h.checkRoom(roomName)
	id := room.joinRoom(ws)
	client := room.getClient(id)

	go room.handleMessages(id)

	for {
		var msg MessageReceived
		msg.Parameters = make(map[string]string)

		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Println("error ReadJSON: %v", err)
			// log.Println(id)
			room.leaveRoom(id)
			break
		}
		log.Println(fmt.Sprintf("%+v", msg))

		if msg.Type == "get" {
			var restaurants []restaurant.Business
			if !room.checkBusinesses() {
				restaurants = restaurant.GetRestaurants(msg.Parameters)
				room.setBusinesses(restaurants)
			} else {
				restaurants = room.getBusinesses()
			}
			sendMsg := MessageSent{Username: msg.Username, Type: msg.Type, Restaurants: restaurants}
			client.sendMessage(sendMsg)
		} else if msg.Type == "like" {
			// add stuff
		}
	}
}
