package socket

import "github.com/gorilla/websocket"

// Client sends and receives messages
type Client struct {
	id      int
	ws      *websocket.Conn
	channel chan MessageSent
}

func makeClient(id int, ws *websocket.Conn) *Client {
	client := new(Client)
	client.id = id
	client.ws = ws
	client.channel = make(chan MessageSent)
	return client
}

func (c *Client) sendMessage(msg MessageSent) {
	c.channel <- msg
}
