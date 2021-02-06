package main

import "github.com/gorilla/websocket"

// Client sends and receives messages
type Client struct {
	id      int
	ws      *websocket.Conn
	channel chan Message
}

func makeClient(id int, ws *websocket.Conn) *Client {
	client := new(Client)
	client.id = id
	client.ws = ws
	client.channel = make(chan Message)
	return client
}

func (c *Client) sendMessage(msg Message) {
	c.channel <- msg
}
