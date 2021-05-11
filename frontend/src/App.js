import React, { useState, useEffect, useRef } from 'react';
import { useCurrentPosition } from 'react-use-geolocation';

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Header from './components/Header';
import TinderCards from './components/TinderCards';
import SwipeButtons from './components/SwipeButtons';
import Room from './components/Room';
import Matches from './components/Matches';
import SignIn from './components/SignIn';
import fire from './fire';

import './App.css';

var rand = require("random-key");

const App = () => {
  const [start, setStart] = useState(false);
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setPassErr] = useState('');
  const [hasAccount, setHas] = useState(true);

  const [name, setName] = useState('');

  const [user, setUser] = useState(null);
  const [room, setRoom] = useState("")

  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [begin, setBegin] = useState(-1);

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
        case "match":
          const index = parseInt(message.message);
          setMatches(matches => [...matches, index]);
          const alertMessage = "Your room has matched a restaurant! " + restaurants[index].name;
          alert(alertMessage);
          break;
        default:
          console.log("huh?");
          break;
      }
    };
  });

  const clearInputs = () => {
    setEmail('');
    setPassword('');
    setName('');
  }

  const clearErrors = () => {
    setEmailErr('');
    setPassErr('');
  }

  const handleSignIn = () => {
    clearErrors();
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('credential', userCredential);
        setUser(userCredential.user);
      })
      .catch((err) => {
        switch(err.code) {
          case 'auth/invalid-email':
          case 'auth/user-disabled':
          case 'auth/user-not-found':
            setEmailErr(err.message);
            break;
          case 'auth/wrong-password':
            setPassErr(err.message);
            break;
          default:
            console.log("tf");
            break;
        }
      });
  }

  const handleSignup = () => {
    clearErrors();
    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        userCredential.user.updateProfile({
          displayName: name,
        })
        .then(() => {
          console.log('current', fire.auth().currentUser);
          console.log('current name', fire.auth().currentUser.displayNamef);
          setUser(fire.auth().currentUser);
        })
        .catch((err) => {
          console.log('error updating profile', err);
        })
      })
      .catch((err) => {
        console.log('error signing up', err);
        switch(err.code) {
          case 'auth/email-already-in-use':
          case 'auth/invalid-email':
            setEmailErr(err.message);
            break;
          case 'auth/weak-password':
            setPassErr(err.message);
            break;
          default:
            console.log("tf");
            break;
        }
      });
  }

  const handleLogout = () => {
    fire.auth().signOut().then(() => {
      clearInputs();
      setUser(null);
      setRoom('');
      setStart(false);
      console.log('signed out');
    }).catch((err) => {
      console.log('error signing out', err);
    })

  }

  const authListener = () => {
    fire.auth().onAuthStateChanged((thing) => {
      console.log('auth state changed', thing);
      if (thing) {
        console.log('display', thing.displayName);
        setUser(thing);
      }
    });
  }

  useEffect(() => {
    authListener();
  }, []);

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
    ws.current = new WebSocket('ws:/localhost:8000/ws/'+roomName+'/'+user.displayName);

    const toSend = {
      "username": user.displayName,
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

      ws.current = new WebSocket('ws://localhost:8000/ws/'+roomName+'/'+user.displayName);

      const toSend = {
        "username": user.displayName,
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
    setRestaurants([]);
    setRadius(10);
    setPrice(2);
  }

  const startRoom = (e) => {
    e.preventDefault();

    const toSend = {"username": user.uid, "type": "start"}
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

  const onLeave = (direction, index) => {
    console.log('you swiped', direction, 'on', restaurants[parseInt(index)].name);
    if (direction === "right") {
      setBegin(index);

      const toSend = {
        'username': user.uid,
        'type': 'like',
        "parameters": {
          "index": index.toString(),
        },
      };
      console.log("s", toSend);
      
      ws.current.send(JSON.stringify(toSend));
    } else if (direction === 'left') {
      setBegin(index);
    }
  }

  // if (!position && !error) {
  //   return <p>Waiting for location...</p>;
  // }
  // if (error) {
  //   return <p>Yummy needs your location to be used. Please allow location services.</p>;
  // }

  return (
    <div>
      {!user &&
      <SignIn
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSignIn={handleSignIn}
        handleSignup={handleSignup}
        hasAccount={hasAccount}
        setHas={setHas}
        emailErr={emailErr}
        passErr={passErr}
        name={name}
        setName={setName}
      />}
      {user && room === '' && !start &&
      <div>
        <button onClick={handleLogout} >Log Out</button>
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
      </div>}
      {user && room !== '' && !start &&
      <div>
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
      </div>}
      {start &&
      <div className="App">
        <Router>
          <Switch>
            <Route path="/room">
              <Header current='room' />
              <Room users={users} />
            </Route>
            <Route path="/matches">
              <Header current='matches' />
              <Matches
                matches={matches}
                restaurants={restaurants} 
              />
            </Route>
            <Route path="/">
              <Header current='main' />
              <TinderCards
                restaurants={restaurants}
                onLeave={onLeave}
                begin={begin}
              />
              <SwipeButtons />
            </Route>
          </Switch>
        </Router>
      </div>}
    </div>
  )
}

export default App;