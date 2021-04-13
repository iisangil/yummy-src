package socket

import (
	"log"

	"github.com/gorilla/websocket"
)

// Client sends and receives messages
type Client struct {
	id       int
	username string
	ws       *websocket.Conn
	channel  chan MessageSent
}

func makeClient(id int, ws *websocket.Conn, username string) *Client {
	client := new(Client)
	client.id = id
	client.username = username
	client.ws = ws
	client.channel = make(chan MessageSent)
	return client
}

func (c *Client) sendMessage(msg MessageSent) {
	log.Println("sending")
	c.channel <- msg
	log.Println("sent")
}
