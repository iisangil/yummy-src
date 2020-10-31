// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import firebaseConfig from './firebaseConfig';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import NumberFormat from 'react-number-format';


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      loggedIn: false,
      messageSent: false,
      phone: '',
      code: '',
      user: '',
    };
    this.submitPhone = this.submitPhone.bind(this);
    this.inputCode = this.inputCode.bind(this);
    this.submitCode = this.submitCode.bind(this);
    this.signOut = this.signOut.bind(this);
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
            phone: profile.uid,
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
        user: result.user,
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


  render() {
    return (
      <div>
      { !this.state.loggedIn && !this.state.messageSent &&
        <div>
          <form onSubmit={this.submitPhone}>
            <label>
              Enter Phone Number:
              <NumberFormat format="+1 (###) ###-####" allowEmptyFormatting mask="_" value={this.state.phone} onValueChange={(values) => {
                const { formattedValue } = values;
                this.setState({
                  phone: formattedValue,
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
        this.state.loggedIn &&
        <div>
          <form onSubmit={this.signOut}>
            <input type="submit" value="Log out"></input>
          </form>
        </div>
      }
      </div>
    )
  }
}

export default App;
