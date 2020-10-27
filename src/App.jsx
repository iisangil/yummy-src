// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import Messages from './Messages'
import { nanoid } from 'nanoid';
import PubNub from 'pubnub';

const pubNubConfig = require('./pubnub.config.json');

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      groupID: '',
      channel: '',
      inGroup: false,
      joining: false,
      code: '',
      message: '',
    }
    this.createGroup = this.createGroup.bind(this);
    this.joinGroup = this.joinGroup.bind(this);
    this.inputCode = this.inputCode.bind(this);
    this.submitCode = this.submitCode.bind(this);
    this.leaveGroup = this.leaveGroup.bind(this);
  }

  // componentDidUpdate() {
  //   this.pubNubClient.addListener({
  //     message: function(msg) {
  //       let info = {
  //         "sender": msg.publisher,
  //         "message": msg.message,
  //       };
  //       let { messages } = this.state;
  //       messages.concat(info);
  //       this.setState({
  //         messages,
  //       });
  //       console.log(msg);
  //     }
  //   })
  // }

  createGroup() {
    this.pubNubClient = new PubNub(pubNubConfig.keySet);

    let groupID = nanoid(6);
    let channel = 'yummy--' + groupID;

    this.pubNubClient.subscribe({
      channels: [channel],
      withPresence: true,
    });

    alert("Share this group code with your friends: " + groupID);

    this.setState({
      groupID,
      channel,
      inGroup: true,
    });
  }

  joinGroup() {
    this.setState({
      joining: true,
    });
  }

  inputCode(e) {
    this.setState({
      code: e.target.value,
    });
  }

  submitCode(e) {
    e.preventDefault();

    this.pubNubClient = new PubNub(pubNubConfig.keySet);

    let groupID = this.state.code;
    console.log(groupID);
    let channel = 'yummy--' + groupID;

    this.pubNubClient.subscribe({
      channels: [channel],
      withPresence: true,
    });

    this.setState({
      groupID,
      channel,
      inGroup: true,
      code: '',
    });
  }

  leaveGroup() {
    this.pubNubClient.unsubscribe({
      channels: [this.state.channel],
    });

    this.setState({
      inGroup: false,
      joining: false,
      channel: '',
    })
  }

  render() {
    let { channel } = this.state;
    return (
      <div>
        <header>
          <p>
            Yummy
          </p>
        </header>
        {
          !this.state.inGroup && !this.state.joining &&
          <div>
            <button onClick={this.createGroup}>
              Create a Group
            </button>
            <button onClick={this.joinGroup}>
              Join a Group
            </button>
          </div>
        }
        {
          !this.state.inGroup && this.state.joining &&
          <div>
            <form onSubmit={this.submitCode}>
              <label>
                Group Code:
                <input type="text" value={this.state.code} onChange={this.inputCode}></input>
              </label>
              <input type="submit" value="Submit"></input>
            </form>
          </div>
        }
        {
          this.state.inGroup &&
          <div>
            <button onClick={this.leaveGroup}>
              Leave Group
            </button>
            <Messages client={this.pubNubClient} channel={channel}></Messages>
          </div>
        }
      </div>
    )
  }
}

export default App;
