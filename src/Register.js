import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { Link } from 'react-router-dom';

export default class Register extends React.Component {

    constructor() {
        super();
        this.state = {
            error: false
        }
    }


    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    submit(event) {

        console.log("Submit the form data", this.state);

        if (
            !this.state.firstname ||
            !this.state.lastname ||
            !this.state.email ||
            !this.state.password
        ) {
            return this.setState({ error: true });
        }


        axios
            .post("/api/register", {
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                email: this.state.email,
                password: this.state.password,
            })
            .then((res) => {
                console.log("IT WORKED!");
                console.log("response came in", res);

                if (
                    res.data.success = true) 
                    {
                        location.replace("/");
                    }

            })
            .catch((err) => {
                console.log("Error registering user", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div id="registration-wrapper">
                <div id="wave-left"><img src="/static/pics/sound-left.png"/></div>
                <div id="registration-input">

                    <img id="logo" src="/static/pics/logo-6.png"></img>
                    
                    {this.state.error && (<div className="error">Something went wrong.</div>)}

                    <div>
                        <input onChange={(event) => this.handleChange(event)} name="firstname" type="text" placeholder="Firstname"></input>
                    </div>
                    <div>
                        <input onChange={(event) => this.handleChange(event)} name="lastname" type="text" placeholder="Lastname"></input>
                    </div>
                    <div>
                        <input onChange={(event) => this.handleChange(event)} name="email" type="email" placeholder="Email"></input>
                    </div>
                    <div>
                        <input onChange={(event) => this.handleChange(event)} name="password" type="password" placeholder="Password"></input>
                    </div>
                    <button id="register-button" onClick={(event) => this.submit(event)}>Submit</button> 
                    <div>
                        Already signed up? <Link to="/login"><strong>Login here.</strong></Link>
                    </div>
                </div>
                    <div id="wave-right"><img src="/static/pics/sound-right.png"/></div>
            </div>
        ); 
    }

}