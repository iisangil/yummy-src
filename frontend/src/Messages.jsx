import React from 'react';
import PropTypes from 'prop-types';

class Messages extends React.Component {
    constructor() {
        super();

        this.state = {
            messages: [],
            message: '',
        }
        this.inputMessage = this.inputMessage.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
    }


    inputMessage(e) {
        this.setState({
            message: e.target.value,
        });
    }

    submitMessage(e) {
        e.preventDefault();

        let { message } = this.state;
        // do stuff

        this.setState({
            message: '',
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.submitMessage}>
                <input type="text" value={this.state.message} onChange={this.inputMessage}></input>
                <input type="submit" value="Submit"></input>
                </form>
                {this.state.messages.map((item, index) => (
                    <p key={index}>{item}</p>
                ))}
            </div>
        )
    }
}

export default Messages;
