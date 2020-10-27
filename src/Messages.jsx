import React from 'react';
import PropTypes from 'prop-types';

class Messages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            message: '',
        }
        this.inputMessage = this.inputMessage.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
    }

    // componentDidUpdate() {
    //     this.props.client.addListener({
    //         message: function(msg) {
    //             let info = {
    //                 "sender": msg.publisher,
    //                 "message": msg.message,
    //             }
    //             let { messages } = this.state;
    //             messages.concat(info);
    //             this.setState({
    //                 messages,
    //             });
    //             console.log(msg);
    //         }
    //     })
    // }

    inputMessage(e) {
        this.setState({
            message: e.target.value,
        });
    }

    submitMessage(e) {
        e.preventDefault();

        let { message } = this.state;
        let { channel } = this.props;

        this.props.client.publish(
            {
                message: message,
                channel: channel,
            },
            function (status, response) {
                if (status.error) {
                    console.log(status);
                    alert("Could not send message. Please try again.");
                } else {
                    console.log("message published with timetoken", response.timetoken);
                }
            }
        );

        this.setState({
            message: '',
        });
    }

    render() {
        return (
            <form onSubmit={this.submitMessage}>
              <input type="text" value={this.state.message} onChange={this.inputMessage}></input>
              <input type="submit" value="Submit"></input>
            </form>
        )
    }
}

Messages.propTypes = {
    client: PropTypes.any.isRequired,
    channel: PropTypes.string.isRequired,
};

export default Messages;
