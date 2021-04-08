package main

import (
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

// Room for messaging
type Room struct {
	name    string
	clients map[int]*Client
	index   int
	lock    sync.Mutex
}

// constructor for channels
func makeRoom(name string) *Room {
	room := new(Room)
	room.name = name
	room.clients = make(map[int]*Client)
	room.index = 0

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
				log.Println(err)
			}
		}
		r.lock.Unlock()
	}
}
