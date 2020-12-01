import React from 'react';
import Router from 'next/router';
// import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebase from '../config/firebase';
import NumberFormat from 'react-number-format';

const axios = require('axios').default;

class SignIn extends React.Component {
    constructor() {
        super();

        this.state = {
            loggedIn: false,
            phone: '',
            user: '',
            messageSent: false,
            code: '',
        }
        // const router = withRouter();
        this.submitPhone = this.submitPhone.bind(this);
        this.inputCode = this.inputCode.bind(this);
        this.submitCode = this.submitCode.bind(this);
    }

    componentDidMount() {
        // check if logged in already
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                console.log("Captcha solved!");
            }
        });

        firebase.auth().onAuthStateChanged((user) => {
            console.log(user);
            if (user) {
                Router.push({
                    pathname: "/",
                });
            }
        })
    }

    submitPhone(e) {
        e.preventDefault();

        const { phone } = this.state;
        const appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phone, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            this.setState({
                messageSent: true,
            });
            console.log("SMS sent!");
        }).catch((err) => {
            console.log(err);
            alert("Error: SMS not sent.");
        })
    }

    inputCode(e) {
        this.setState({
            code: e.target.value,
        });
    }

    submitCode(e) {
        e.preventDefault();

        const { user, code } = this.state;
        window.confirmationResult.confirm(code).then((res) => {
            this.setState({
                loggedIn: true,
                messageSent: false,
            });
            console.log("Successfully logged in!");

            axios({
                method: 'post',
                url: 'http://localhost:8080/login',
                data: {
                    userid: user,
                    groupid: '',
                },
                params: {
                    self: user,
                }
            }).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            });

            Router.push("/");
        }).catch((err) => {
            alert("Couldn't sign in (bad verification  code?)");
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                {!this.state.loggedIn && !this.state.messageSent &&
                    <div>
                        <form onSubmit={this.submitPhone}>
                            <label>
                                Enter Phone Number:
                                <NumberFormat format="+1 (###) ###-####" allowEmptyFormatting mask="_" value={this.state.user} onValueChange={(values) => {
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
                {!this.state.loggedIn && this.state.messageSent &&
                    <div>
                        <form onSubmit={this.submitCode}>
                            <label>
                                Enter Code:
                                <input type="text" value={this.state.code} onChange={this.inputCode}></input>
                            </label>
                            <input type="submit" value="Submit"></input>
                        </form>
                    </div>
                }
            </div>
        )
    }
}

export default SignIn;
