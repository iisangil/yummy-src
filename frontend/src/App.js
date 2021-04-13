import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("")
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

    if (username !== "") {
      setUsername(username);
      setLogin(prevLogin => !prevLogin);
    }
  }

  const handleRoom = (e) => {
    e.preventDefault();
    const roomName = e.target.roomName.value;

    if (roomName !== "") {
      setRoom(roomName);

      ws.current = new WebSocket("ws://localhost:8000/ws/"+username+"/"+room);
    }
  }

  const handleMessages = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    if (message !== "") {
      const toSend = {"username": username, "type": "start", "parameters": {}};
      console.log(toSend);
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
    
    setRoom("");
  }

  return (
    <body>
      <header>
        <nav>
          <div>
            <p>Yummy</p>
          </div>
        </nav>
      </header>
      <main>
        <div>
          {!login &&
          <form onSubmit={handleLogin}>
            <input type='text' name='username' placeholder='enter username' autoComplete='off' />
            <input type='submit' value='enter' />
          </form>
          }
          {login && room == "" &&
          <div>
            <p>
              Username: {username}
            </p>
            <form onSubmit={handleRoom}>
              <input type='text' name='roomName' placeholder='enter room name' autoComplete='off' />
              <input type='submit' value='enter' />
            </form>
          </div>
          }


{/* 
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
                  <li id="message">{message.type}</li>
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
          } */}
        </div>
      </main>
    </body>
  )
}

export default App;