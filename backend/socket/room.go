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
}

// constructor for channels
func makeRoom(name string) *Room {
	room := new(Room)
	room.name = name
	room.clients = make(map[int]*Client)
	room.index = 0
	room.businesses = nil
	room.matches = make(map[string][]int)

	return room
}

func (r *Room) joinRoom(ws *websocket.Conn) int {
	r.lock.Lock()
	r.index++
	client := makeClient(r.index, ws)
	r.clients[r.index] = client
	r.lock.Unlock()
	return r.index
}

func (r *Room) leaveRoom(id int) {
	r.lock.Lock()
	delete(r.clients, id)
	if len(r.clients) == 0 {
		r.businesses = nil
	}
	r.lock.Unlock()
}

func (r *Room) getClient(id int) *Client {
	return r.clients[id]
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
				log.Println("Error while sending to websocket: %v", err)
			}
		}
		r.lock.Unlock()
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
