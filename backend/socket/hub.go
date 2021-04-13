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

func (h *Hub) deleteRoom(name string) {
	h.lock.Lock()
	delete(h.rooms, name)
	h.lock.Unlock()
}

// HandleWebSockets for hub
func (h *Hub) HandleWebSockets(w http.ResponseWriter, r *http.Request) {
	path := mux.Vars(r)
	roomName := path["room"]
	username := path["username"]

	ws, err := h.upgrader.Upgrade(w, r, nil) // upgrade http request to web socket
	if err != nil {
		log.Panic("Error while upgrading request to socket:", err)
	}

	defer ws.Close()

	room := h.checkRoom(roomName)
	id := room.joinRoom(ws, username)
	if id == -1 {
		sendMsg := MessageSent{Username: username, Type: "err"}
		ws.WriteJSON(sendMsg)
		return
	}

	go room.handleMessages(id)

	client := room.getClient(id)
	users := room.getUsers()
	userMsg := MessageSent{Username: client.username, Type: "users", Users: users}
	client.sendMessage(userMsg)

	for {
		var msg MessageReceived
		msg.Parameters = make(map[string]string)

		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Println("error ReadJSON", err)
			numClients := room.leaveRoom(id)
			if numClients == 0 {
				h.deleteRoom(roomName)
			}
			break
		}
		log.Println(fmt.Sprintf("%+v", msg))

		if msg.Type == "start" {
			room.setStatus("started")

			restaurants := room.getBusinesses()
			sendMsg := MessageSent{Username: msg.Username, Type: msg.Type, Restaurants: restaurants}
			client.sendMessage(sendMsg)
		} else if msg.Type == "get" {
			restaurants := restaurant.GetRestaurants(msg.Parameters)
			room.setBusinesses(restaurants)
		} else if msg.Type == "like" {
			numLikes, likeClients := room.likeBusiness(id, msg.Parameters["businessID"])
			if numLikes == room.numClients() {
				sendMsg := MessageSent{Username: msg.Username, Type: "match", Message: msg.Parameters["businessID"]}
				client.sendMessage(sendMsg)
			} else if numLikes > 0 {
				sendMsg := MessageSent{Username: msg.Username, Type: "like", Message: msg.Parameters["businessID"]}
				room.sendMessages(likeClients, sendMsg)
			}
		}
	}
}
