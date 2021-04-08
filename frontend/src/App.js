import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState(false);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("global")
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);

      setMessages(messages.concat(message));

      console.log("e", message);
    };
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const roomName = e.target.roomName.value;

    if (username !== "") {
      setUsername(username);
      if (roomName !== "") {
        setRoom(roomName);
      }
      setStatus(prevStatus => !prevStatus);

      ws.current = new WebSocket("ws://localhost:8000/ws/"+room);
    }
  }

  const handleMessages = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    if (message !== "") {
      const toSend = {"username": username, "type": "get", "parameters": {}, "message": message};
      ws.current.send(JSON.stringify(toSend));
    }
    setText("");
  }

  const handleText = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setText(value);
  }

  const leaveRoom = (e) => {
    e.preventDefault();

    ws.current.close();
    ws.current = null;
    
    setStatus(prevStatus => !prevStatus);
    setUsername("");
    setRoom("global");
    setMessages([]);
  }

  return (
    <body>
      <header>
        <nav>
          <div>
            <p>Simple Chat</p>
          </div>
        </nav>
      </header>
      <main>
        <div>
          {status &&
          <div>
            <p>
              Room: {room}
            </p>
            <p>
              Username: {username}
            </p>
            <div >
            {messages.map((message) => {
              return (
              <ul>
                  <p id="username">{message.username}</p>
                  <li id="message">{message.message}</li>
              </ul>
              )
            })
            }
            </div>
            <form onSubmit={handleMessages}>
              <input type='text' name='message' placeholder='enter message' value={text} onChange={handleText} autoComplete="off" />
              <input type='submit' value='enter' />
            </form>
            <form onSubmit={leaveRoom}>
              <input type='submit' value='Leave room' />
            </form>
          </div>
          }
          {!status &&
          <form onSubmit={handleLogin}>
            <input type='text' name='username' placeholder='enter username' autoComplete='off' />
            <input type='text' name='roomName' placeholder='enter room name' autoComplete='off' />
            <input type='submit' value='enter' />
          </form>
          }
        </div>
      </main>
    </body>
  )
}

export default App;