import React, { useState, useEffect, useRef } from 'react';
import { useCurrentPosition } from 'react-use-geolocation';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './components/Header';
import TinderCards from './components/TinderCards';
import SwipeButtons from './components/SwipeButtons';
import Room from './components/Room';
import Matches from './components/Matches';
import SignIn from './components/SignIn';
import Home from './components/Home';

import fire from './fire';

import './App.css';

var rand = require('random-key');

const App = () => {
  const [start, setStart] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setPassErr] = useState('');
  const [hasAccount, setHas] = useState(true);

  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const [display, setDisplay] = useState('');

  const [room, setRoom] = useState('');
  const [code, setCode] = useState('');

  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);

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
      console.log('e', message);

      switch (message.type) {
        case 'users':
          setUsers(message.users);
          break;
        case 'get':
          setRestaurants((restaurants) => [
            ...restaurants,
            ...message.restaurants,
          ]);
          break;
        case 'start':
          setStart(true);
          break;
        case 'match':
          const index = parseInt(message.message);
          setMatches((matches) => [...matches, index]);
          const alertMessage =
            'Your room has matched a restaurant! ' + restaurants[index].name;
          alert(alertMessage);
          break;
        default:
          console.log('huh?');
          break;
      }
    };
  });

  const clearInputs = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  const clearErrors = () => {
    setEmailErr('');
    setPassErr('');
  };

  const handleSignIn = () => {
    clearErrors();
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('credential', userCredential);
        setUser(userCredential.user);
        setDisplay(userCredential.displayName);
      })
      .catch((err) => {
        console.log('error signing in', err);
        switch (err.code) {
          case 'auth/invalid-email':
          case 'auth/user-disabled':
          case 'auth/user-not-found':
            setEmailErr(err.message);
            break;
          case 'auth/wrong-password':
            setPassErr(err.message);
            break;
          default:
            console.log('tf');
            break;
        }
      });
  };

  const handleSignup = () => {
    clearErrors();
    setDisplay(name);
    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        userCredential.user
          .updateProfile({
            displayName: name,
          })
          .then(() => {
            setUser(userCredential.user);
          })
          .catch((err) => {
            console.log('error updating profile', err);
          });
      })
      .catch((err) => {
        console.log('error signing up', err);
        switch (err.code) {
          case 'auth/email-already-in-use':
          case 'auth/invalid-email':
            setEmailErr(err.message);
            break;
          case 'auth/weak-password':
            setPassErr(err.message);
            break;
          default:
            console.log('tf');
            break;
        }
      });
  };

  const handleLogout = () => {
    fire
      .auth()
      .signOut()
      .then(() => {
        clearInputs();
        setUser(null);
        setDisplay('');
        setRoom('');
        setStart(false);
        console.log('signed out');
      })
      .catch((err) => {
        console.log('error signing out', err);
      });
  };

  const authListener = () => {
    fire.auth().onAuthStateChanged((thing) => {
      if (thing) {
        setUser(thing);
        if (thing.displayName) {
          setDisplay(thing.displayName);
        }
      }
    });
  };

  useEffect(() => {
    authListener();
  }, []);

  const createRoom = () => {
    const roomName = rand.generate(8);
    setRoom(roomName);
    ws.current = new WebSocket(
      'ws://localhost:8000/ws/' + roomName + '/' + user.displayName
    );

    var price = '';
    if (one) price += '1,';
    if (two) price += '2,';
    if (three) price += '3,';
    if (four) price += '4,';

    const toSend = {
      username: display,
      type: 'get',
      parameters: {
        radius: radius.toString(),
        price: price,
        latitude: position.coords.latitude.toString(),
        longitude: position.coords.longitude.toString(),
      },
    };
    console.log('s', toSend);
    ws.current.onopen = () => ws.current.send(JSON.stringify(toSend));
  };

  const joinRoom = () => {
    if (code !== '') {
      setRoom(code);

      ws.current = new WebSocket(
        'ws://localhost:8000/ws/' + code + '/' + user.displayName
      );

      const toSend = {
        username: display,
        type: 'get',
      };
      console.log('s', toSend);

      ws.current.onopen = () => ws.current.send(JSON.stringify(toSend));
    }
  };

  const leaveRoom = (e) => {
    e.preventDefault();

    ws.current.close();
    ws.current = null;

    setRoom('');
    setRestaurants([]);
    setRadius(10);
    setPrice(2);
  };

  const startRoom = (e) => {
    e.preventDefault();

    const toSend = { username: user.uid, type: 'start' };
    console.log('s', toSend);

    ws.current.send(JSON.stringify(toSend));
  };

  const handleRadius = (e) => {
    e.preventDefault();

    setRadius(e.target.value);
  };

  const handlePrice = (e) => {
    e.preventDefault();

    setPrice(e.target.value);
  };

  const onLeave = (direction, index) => {
    console.log(
      'you swiped',
      direction,
      'on',
      restaurants[parseInt(index)].name
    );
    if (direction === 'right') {
      setBegin(index);

      const toSend = {
        username: user.uid,
        type: 'like',
        parameters: {
          index: index.toString(),
        },
      };
      console.log('s', toSend);

      ws.current.send(JSON.stringify(toSend));
    } else if (direction === 'left') {
      setBegin(index);
    }
  };

  // if (!position && !error) {
  //   return <p>Waiting for location...</p>;
  // }
  // if (error) {
  //   return <p>Yummy needs your location to be used. Please allow location services.</p>;
  // }

  return (
    <div>
      <link
       rel="stylesheet"
       href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
       integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
       crossorigin="anonymous"
      />
      {!user && (
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
        />
      )}
      {user && room === '' && !start &&
      <Home
       display={display}
       handleLogout={handleLogout}
       code={code}
       setCode={setCode}
       createRoom={createRoom}
       joinRoom={joinRoom}
       radius={radius}
       setRadius={setRadius}
       one={one}
       setOne={setOne}
       two={two}
       setTwo={setTwo}
       three={three}
       setThree={setThree}
       four={four}
       setFour={setFour}
      />}
      {user && room !== '' && !start && 
      <div>
        <p>Room: {room}</p>
        <p>Users:</p>
        {users.map((user) => (
          <ul key={user}>
            <li>{user}</li>
          </ul>
        ))}
        <form onSubmit={startRoom}>
          <input type='submit' value='start' />
        </form>
        <form onSubmit={leaveRoom}>
          <input type='submit' value='leave room' />
        </form>
      </div>}
      {start &&
        <div>
        <Router>
          <Switch>
            <Route path='/room'>
              <Header current='room' />
              <Room users={users} />
            </Route>
            <Route path='/matches'>
              <Header current='matches' />
              <Matches matches={matches} restaurants={restaurants} />
            </Route>
            <Route path='/'>
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
  );
};

export default App;
