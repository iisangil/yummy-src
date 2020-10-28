// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import Messages from './Messages'
import { nanoid } from 'nanoid';


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      groupID: '',
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

  createGroup() {
    let groupID = nanoid(6);

    alert("Share this group code with your friends: " + groupID);

    this.setState({
      groupID,
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

    let groupID = this.state.code;
    console.log(groupID);

    this.setState({
      groupID,
      inGroup: true,
      joining: false,
      code: '',
    });
  }

  leaveGroup() {
    this.setState({
      inGroup: false,
      joining: false,
    })
  }

  render() {
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
          {/* messages */}
          </div>
        }
      </div>
    )
  }
}

export default App;
