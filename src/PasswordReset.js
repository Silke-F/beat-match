import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { Link } from 'react-router-dom';
import { EventListeners } from "aws-sdk";

export default class ResetPassword extends React.Component {

    constructor() {
        super();
        this.state = {
            error: false,
            step: 1
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    sendCode() {
        console.log("sendCode function was called", this.state);

        if (
            !this.state.email
        ) {
            return this.setState({ error: true });
        }

        axios
        .post("/api/send-code", {
            email: this.state.email
        })
        .then((res) => {
            console.log("response axios post request send code", res.data.success);
            if (
                res.data.success = true) 
                {
                    this.setState({ step: 2 });
                }
        })
        .catch((err) => {
            console.log("Error with sendCode function", err);
            this.setState({ error: true });
        });
    }
    

    resetPassword() {
        console.log("resetPassword function was called", this.state, this.state.email);

        if (
            !this.state.code ||
            !this.state.new_password
        ) {
            return this.setState({ error: true });
        }

        axios
        .post("/api/reset-password", {
            email: this.state.email,
            code: this.state.code,
            new_password: this.state.new_password
        })
        .then((res) => {
            console.log("response axios post request reset password", res);
            if (
                res.data.success = true) 
                {
                    this.setState({ step: 3 });
                }
        })
        .catch((err) => {
            console.log("Error with resetPassword function", err);
            this.setState({ error: true });
        });
    }


    render() {
        return (
            <div id="reset-password">
                <div><img src="/static/pics/password-reset-logo.png"/></div>

                {this.state.error && (<div className="error">Please fill out all fields.</div>)}

                {this.state.step == 1 && (
                    <div>
                        <p>Enter your email for password reset.</p>
                        <input onChange={(event) => this.handleChange(event)} type="email" name="email" placeholder="Email" />
                        <button onClick={(event) => this.sendCode()}>
                            Send validation code
                        </button>
                        <p>Go back to <Link to="/login"><strong>login page.</strong></Link></p>
                    </div>
                )}

                {this.state.step == 2 && (
                    <div>
                        <p>You received a validation code. Please enter it here and set new password.</p>
                        <input onChange={(event) => this.handleChange(event)} type="text" name="code" placeholder="Validation code" />
                        <input onChange={(event) => this.handleChange(event)} type="password" name="new_password" placeholder="New password" />
                        <button onClick={(event) => this.resetPassword()}>
                            Reset password
                        </button>
                    </div>
                )}

                {this.state.step == 3 && (
                    <div>
                        <p>Well done! Password reset!</p>
                        <p>Go back to <Link to="/login">login page.</Link></p>
                    </div>
                )}
            </div>
        );
    }
}