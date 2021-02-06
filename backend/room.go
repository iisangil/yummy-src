package main

import (
	"github.com/gorilla/websocket"
)

// Room for messaging
type Room struct {
	name    string
	clients map[int]*Client
	index   int
}

// constructor for channels
func makeRoom(name string) *Room {
	room := new(Room)
	room.name = name
	room.clients = make(map[int]*Client)
	room.index = 0

	return room
}

func (c *Room) joinRoom(ws *websocket.Conn) int {
	c.index++
	client := makeClient(c.index, ws)
	c.clients[c.index] = client
	return c.index
}

func (c *Room) leaveRoom(id int) {
	c.clients[id].ws.Close()
	delete(c.clients, id)
}

func (c *Room) getClient(id int) *Client {
	return c.clients[id]
}

func (c *Room) handleMessages(id int) {
	if _, ok := c.clients[id]; ok {
		for {
			msg := <-c.clients[id].channel

			for key, client := range c.clients {
				err := client.ws.WriteJSON(msg)
				if err != nil {
					c.leaveRoom(key)
				}
			}
		}
	}
}
