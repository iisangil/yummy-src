package socket

import (
	"log"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/iisangil/yummy/tree/main/backend/restaurant"
)

// Room for messaging
type Room struct {
	name       string
	clients    map[int]*Client
	index      int
	lock       sync.Mutex
	businesses []restaurant.Business
	matches    map[string][]int
	status     string
}

// constructor for channels
func makeRoom(name string) *Room {
	room := new(Room)
	room.name = name
	room.clients = make(map[int]*Client)
	room.index = 0
	room.businesses = nil
	room.matches = make(map[string][]int)
	room.status = "waiting"

	return room
}

func (r *Room) joinRoom(ws *websocket.Conn, username string) int {
	r.lock.Lock()
	defer r.lock.Unlock()
	if r.status != "waiting" {
		return -1
	}
	r.index++
	client := makeClient(r.index, ws, username)
	r.clients[r.index] = client
	return r.index
}

func (r *Room) leaveRoom(id int) int {
	r.lock.Lock()
	defer r.lock.Unlock()
	delete(r.clients, id)
	return len(r.clients)
}

func (r *Room) setStatus(status string) {
	r.lock.Lock()
	r.status = status
	r.lock.Unlock()
}

func (r *Room) getClient(id int) *Client {
	return r.clients[id]
}

func (r *Room) getUsers() []string {
	r.lock.Lock()
	users := make([]string, 0)
	for _, v := range r.clients {
		users = append(users, v.username)
	}
	r.lock.Unlock()
	return users
}

func (r *Room) numClients() int {
	r.lock.Lock()
	defer r.lock.Unlock()
	return len(r.clients)
}

func (r *Room) handleMessages(id int) {
	r.lock.Lock()
	self := r.clients[id]
	r.lock.Unlock()

	for {
		msg := <-self.channel

		r.lock.Lock()
		for _, client := range r.clients {
			err := client.ws.WriteJSON(msg)
			if err != nil {
				log.Println("Error while sending to websocket", err)
			}
		}
		r.lock.Unlock()
	}
}

func (r *Room) sendMessages(ids []int, message MessageSent) {
	for _, v := range ids {
		r.lock.Lock()
		self := r.clients[v]
		r.lock.Unlock()

		err := self.ws.WriteJSON(message)
		if err != nil {
			log.Println("Error sending message", err)
		}
	}
}

func (r *Room) checkBusinesses() bool {
	r.lock.Lock()
	defer r.lock.Unlock()
	if r.businesses != nil {
		return true
	}
	return false
}

func (r *Room) setBusinesses(businesses []restaurant.Business) {
	r.lock.Lock()
	r.businesses = businesses
	r.lock.Unlock()
}

func (r *Room) getBusinesses() []restaurant.Business {
	r.lock.Lock()
	defer r.lock.Unlock()
	return r.businesses
}

func (r *Room) likeBusiness(clientID int, index string) int {
	r.lock.Lock()
	defer r.lock.Unlock()
	r.matches[index] = append(r.matches[index], clientID)
	return len(r.matches[index])
}
