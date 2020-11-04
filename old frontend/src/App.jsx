// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import firebaseConfig from './firebaseConfig';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import NumberFormat from 'react-number-format';
import { nanoid } from 'nanoid';

const axios = require('axios').default;

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      loggedIn: false,
      messageSent: false,
      inGroup: false,
      phone: '',
      code: '',
      user: '',
      group: '',
    };
    this.submitPhone = this.submitPhone.bind(this);
    this.inputCode = this.inputCode.bind(this);
    this.submitCode = this.submitCode.bind(this);
    this.signOut = this.signOut.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.inputGroup = this.inputGroup.bind(this);
    this.joinGroup = this.joinGroup.bind(this);
  }

  componentDidMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
   }
    firebase.auth().useDeviceLanguage();

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log("Captcha solved!");
      }
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.setState({
          loggedIn: true,
        });
        user.providerData.forEach((profile) => {
          this.setState({
            user: profile.uid.substring(2,),
          });
        });
      }
    });
  }

  submitPhone(e) {
    e.preventDefault();

    const { phone } = this.state;
    const appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phone, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      this.setState({
        messageSent: true,
      });
      console.log("SMS sent!");
    }).catch(function (error) {
      // Error; SMS not sent
      // ...
      alert("Error: SMS not sent.");
      console.log(error);
    });
  }

  inputCode(e) {
    this.setState({
      code: e.target.value,
    });
  }

  submitCode(e) {
    e.preventDefault();

    const { code } = this.state;
    window.confirmationResult.confirm(code).then((result) => {
      // User signed in successfully.
      this.setState({
        loggedIn: true,
        messageSent: false,
      });

      const { user } = this.state;
      axios({
        method: 'POST',
        url: 'http://localhost:8080/login',
        data: {
          userid: user,
          groupid: '',
        }
      }).then((result) => {
        console.log(result);
      }).catch((err) => {
        console.log(err);
      });

      console.log("Successfully logged in!");
      // ...
    }).catch(function (error) {
      // User couldn't sign in (bad verification code?)
      // ...
      alert("User couldn't sign in (bad verification code?");
      console.log(error);
    });
  }

  createGroup(e) {
    e.preventDefault();

    var groupid = nanoid(6);
    const { user } = this.state;

    var userArray = [
      { "userid": user, groupid, }
    ];

    axios({
      method: 'POST',
      url: 'http://localhost:8080/create',
      data: {
        groupid,
        users: userArray,
        self: user,
      }
    }).then((result) => {
      console.log(result);
      console.log("Successfully created group!");
      this.setState({
        group: groupid,
        inGroup: true,
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  inputGroup(e) {
    this.setState({
      group: e.target.value,
    });
  }

  joinGroup(e) {
    e.preventDefault();

    const { user, group } = this.state;
    
    axios({
      method: 'POST',
      url: 'http://localhost:8080/join',
      data: {
        groupid: group,
        self: user,
      }
    }).then((result) => {
      console.log(result);
      console.log("Successfully joined group!");
      this.setState({
        inGroup: true,
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  signOut(e) {
    e.preventDefault();

    firebase.auth().signOut().then(() => {
      this.setState({
        loggedIn: false,
      });
    }).catch((error) => {
      console.log(error);
      alert("There was an error when signing out.");
    })
  }

  leaveGroup(e) {
    e.preventDefault();

    // make call to api to leave group in database
  }


  render() {
    const { group } = this.state;
    return (
      <div>
      { !this.state.loggedIn && !this.state.messageSent &&
        <div>
          <form onSubmit={this.submitPhone}>
            <label>
              Enter Phone Number:
              <NumberFormat format="+1 (###) ###-####" allowEmptyFormatting mask="_" value={this.state.phone} onValueChange={(values) => {
                const { value, formattedValue } = values;
                this.setState({
                  phone: formattedValue,
                  user: value,
                });
              }}/>
            </label>
            <input id="sign-in-button" type="submit" value="Submit"></input>
          </form>
        </div>
      }
      {
        !this.state.loggedIn && this.state.messageSent &&
        <div>
          <form onSubmit={this.submitCode}>
            <label>
              Input Code:
              <input type="text" value={this.state.code} onChange={this.inputCode}></input>
            </label>
            <input type="submit" value="Submit"></input>
          </form>
        </div>
      }
      {
        this.state.loggedIn && !this.state.inGroup &&
        <div>
          <form onSubmit={this.createGroup}>
            <input type="submit" value="Create Group"></input>
          </form>
          <form onSubmit={this.joinGroup}>
            <label>
              Input Code:
              <input type="text" value={this.state.group} onChange={this.inputGroup}></input>
            </label>
            <input type="submit" value="Join group"></input>
          </form>
          <form onSubmit={this.signOut}>
            <input type="submit" value="Log out"></input>
          </form>
        </div>
      }
      {
        this.state.loggedIn && this.state.inGroup &&
        <div>
          <h>Share this code with your friends: {group}</h>
          <form onSubmit={this.signOut}>
            <input type="submit" value="Log Out"></input>
          </form>
          <form onSubmit={this.leaveGroup}>
            <input type="submit" value="Leave Group"></input>
          </form>
        </div>
      }
      </div>
    )
  }
}

export default App;
