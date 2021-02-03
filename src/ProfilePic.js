import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { Link } from 'react-router-dom';

export default class ProfilePic extends React.Component {

    constructor() {
        super();
    }

    render() {

            const {profilePicSmall, profilePicLarge, openPopup} = this.props;
            // console.log("profile pic props in profile pic component", this.props);

            if(profilePicSmall) { 
                return (
                    <div>
                    <div id="login-logo"><img src="/static/pics/logo-6.png"/></div>
                    <div id="profile-pic-small">
                        <img src={profilePicSmall} onClick={openPopup} />
                    </div>
                    </div>
                );
            } if(profilePicLarge) { 
                return (
                    <div className="profile-pic-wrapper" id="profile-pic-big">
                        <img src={profilePicLarge} onClick={openPopup} />
                    </div>
                );
            } else { 
                return (
                    <div id="profile-pic">
                        <img src="/user-pics/placeholder.jpg" width="200px" height="150px" onClick={openPopup} />
                    </div>
                );
            }   
        }
    }

