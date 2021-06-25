import React, { useState, useEffect, useRef } from 'react';
import { useCurrentPosition } from 'react-use-geolocation';
import LoadingOverlay from 'react-loading-overlay';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './components/Header';
import TinderCards from './components/TinderCards';
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
  const [loading, setLoading] = useState(false);

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

  const [position, error] = useCurrentPosition();

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log('e', message);

      switch (message.type) {
        case 'users':
          setUsers(message.users);
          setLoading(false);

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
    setLoading(true);

    ws.current = new WebSocket(
      'ws://localhost:8000/ws/' + roomName + '/' + user.displayName
    );

    var price = '';
    if (one) price += '1,';
    if (two) price += '2,';
    if (three) price += '3,';
    if (four) price += '4,';
    console.log('PRICE', price);

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
      setLoading(true);

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
  };

  const startRoom = (e) => {
    e.preventDefault();

    const toSend = { username: user.uid, type: 'start' };
    console.log('s', toSend);

    ws.current.send(JSON.stringify(toSend));
  };

  const onLeave = (direction, index) => {
    setBegin(index);
    console.log(
      'you swiped',
      direction,
      'on',
      restaurants[parseInt(index)].name
    );
    if (direction === 'right') {
      const toSend = {
        username: user.uid,
        type: 'like',
        parameters: {
          index: index.toString(),
        },
      };
      console.log('s', toSend);

      ws.current.send(JSON.stringify(toSend));
    }
  };

  return (
    <div>
      <link
       rel="stylesheet"
       href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
       integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
       crossorigin="anonymous"
      />
      {error &&
      <div>
        <LoadingOverlay
         active={true}
         spinner
         text='Yummy requires location services. Please enable location services and refresh this page.'
        >
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
           clearInputs={clearInputs}
           clearErrors={clearErrors}
          />
        </LoadingOverlay>
        <footer>
          <p>Check out the <a href='https://github.com/iisangil/yummy-src' >source code</a>!</p>
        </footer>
      </div>}
      {!user && !error &&
      <div>
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
         clearInputs={clearInputs}
         clearErrors={clearErrors}
        />
        <footer>
          <p>Check out the <a href='https://github.com/iisangil/yummy-src' >source code</a>!</p>
        </footer>
      </div>
      }
      {user && room === '' && !start && !error &&
      <LoadingOverlay
       active={!position}
       spinner
       text='Fetching your location...'
      >
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
        />
        <footer>
          <p>Check out the <a href='https://github.com/iisangil/yummy-src' >source code</a>!</p>
        </footer>
      </LoadingOverlay>}
      {user && room !== '' && !start && !error &&
      <LoadingOverlay
       active={loading}
       spinner
       text='Fetching data...'
      >
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
        </div>
      </LoadingOverlay>}
      {start && !error &&
        <div>
        <Router>
          <Switch>
            <Route path='/yummy/room'>
              <Header current='room' />
              <Room users={users} />
            </Route>
            <Route path='/yummy/matches'>
              <Header current='matches' />
              <Matches matches={matches} restaurants={restaurants} />
            </Route>
            <Route path='/yummy'>
              <Header current='main' />
              <TinderCards
                restaurants={restaurants}
                onLeave={onLeave}
                begin={begin}
              />
            </Route>
          </Switch>
        </Router>
      </div>}
    </div>
  );
};

export default App;
