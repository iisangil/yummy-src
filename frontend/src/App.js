import React, { useState, useEffect, useRef } from 'react';
import { useCurrentPosition } from 'react-use-geolocation';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import TinderCard from 'react-tinder-card'
import './App.css';

var rand = require("random-key");

function App() {
  const [login, setLogin] = useState(false);
  const [start, setStart] = useState(false);
  const [show, setShow] = useState(false);

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("")

  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [likes, setLikes] = useState([]);
  const [matches, setMatches] = useState([]);

  const ws = useRef(null);

  const [radius, setRadius] = useState(10);
  const [price, setPrice] = useState(2);

  const [position, error] = useCurrentPosition();

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log("e", message);

      switch (message.type) {
        case "users":
          setUsers(message.users);
          break;
        case "get":
          setRestaurants(restaurants => [...restaurants, ...message.restaurants]);
          break;
        case "start":
          setStart(true);
          break;
        case "like":
          setLikes(likes => [...likes, message.message]);
          break;
        case "match":
          setMatches(matches => [...matches, message.message]);
          const index = parseInt(message.message);
          const alertMessage = "Your room has matched a restaurant! " + restaurants[index].name;
          alert(alertMessage);
          break;
        default:
          console.log("huh?");
          break;
      }
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

  const createModal = (e) => {
    e.preventDefault()

    setShow(true);
  }

  const handleClose = () => {
    setShow(false);
  }

  const createRoom = (e) => {
    e.preventDefault();

    setShow(false);

    const roomName = rand.generate(8);
    setRoom(roomName);
    ws.current = new WebSocket("ws:/localhost:8000/ws/"+username+"/"+roomName);

    const toSend = {
      "username": username,
      "type": "get",
      parameters: { 
        "radius": radius.toString(),
        "price": price.toString(),
        "latitude": position.coords.latitude.toString(),
        "longitude": position.coords.longitude.toString(),
      }
    };
    console.log("s", toSend);
    ws.current.onopen = () => ws.current.send(JSON.stringify(toSend));
  }

  const joinRoom = (e) => {
    e.preventDefault();
    const roomName = e.target.roomName.value;

    if (roomName !== "") {
      setRoom(roomName);

      ws.current = new WebSocket("ws://localhost:8000/ws/"+username+"/"+roomName);

      const toSend = {
        "username": username,
        "type": "get",
      };
      console.log("s", toSend);

      ws.current.onopen = () => ws.current.send(JSON.stringify(toSend));
    }
  }

  const leaveRoom = (e) => {
    e.preventDefault();

    ws.current.close();
    ws.current = null;
    
    setRoom("");
    setRadius(10);
    setPrice(2);
  }

  const startRoom = (e) => {
    e.preventDefault();

    const toSend = {"username": username, "type": "start"}
    console.log("s", toSend);

    ws.current.send(JSON.stringify(toSend));
  }

  const handleRadius = (e) => {
    e.preventDefault();

    setRadius(e.target.value);
  }

  const handlePrice = (e) => {
    e.preventDefault();

    setPrice(e.target.value);
  }

  const onSwipe = (direction, index) => {
    console.log("you swiped", direction, "on", restaurants[parseInt(index)].name);
    if (direction === "right") {
      const toSend = {
        "username": username,
        "type": "like",
        "parameters": {
          "index": index.toString(),
        },
      };
      console.log("s", toSend);

      ws.current.send(JSON.stringify(toSend));
    }
  }

  if (!position && !error) {
    return <p>Waiting for location...</p>;
  }
  if (error) {
    return <p>Yummy needs your location to be used. Please allow location services.</p>;
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
          {login && room === "" && !start &&
          <div>
            <p>
              Username: {username}
            </p>
            <form onSubmit={createModal}>
              <input type='submit' value='create new room' />
            </form>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <form>
                  <input type='range' name='radius' min='1' max='20' step='1' value={radius} onChange={handleRadius} />
                  <label for='radius'>search radius (in miles): {radius}</label>
                </form>
                <form>
                  <input type='range' name='price' min='1' max='4' step='1' value={price} onChange={handlePrice} />
                  <label for='price'>price range (1-4): {price}</label>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={createRoom}>
                  Create Room
                </Button>
              </Modal.Footer>
            </Modal>
            
            <form onSubmit={joinRoom}>
              <input type='text' name='roomName' placeholder='enter room name' autoComplete='off' />
              <input type='submit' value='enter' />
            </form>
          </div>
          }
          {login && room !== "" && !start &&
            <div>
              <p>
                Username: {username}
              </p>
              <p>
                Room: {room}
              </p>
              <p>
                Users:
              </p>
              {users.map((user) => 
              <ul key={user}>
                  <li>{user}</li>
              </ul>
              )}
              <form onSubmit={startRoom}>
                <input type='submit' value='start' />
              </form>
              <form onSubmit={leaveRoom}>
                <input type='submit' value='leave room' />
              </form>
            </div>
          }
          {start &&
            <div className='cardContainer'>
              {restaurants.map((restaurant, index) => 
                <TinderCard key={restaurant.id} className='swipe' onSwipe={(dir) => onSwipe(dir, index)} preventSwipe={['up', 'down']}>
                  <div className='card' style={{ backgroundImage: `url('${restaurant.image_url}')`}}></div>
                  <h3 className='cardName'>{restaurant.name}</h3>
                </TinderCard>
              ).reverse()}
            </div>
          }
        </div>
      </main>
    </body>
  )
}

export default App;