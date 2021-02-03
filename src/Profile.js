import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { Link } from 'react-router-dom';
import ProfilePic from './ProfilePic.js';
import BioEditor from './BioEditor.js';
import MyFavoritArtists from './MyFavoritArtists.js';

export default class Profile extends React.Component {

    constructor() {
        super();
    }


    render() {

        if(!this.props.user) {
            return (<div>Not ready yet</div>);
        }

        const {firstname, lastname, email, profile_pic, bio} = this.props.user;   
        const {openPopup, bioEditDone} = this.props;

        return (
            <div id="profile">
                        
                        <div className="center"><img src="/static/pics/profile-logo.png"/></div> 
                        <ProfilePic 
                            profilePicLarge={profile_pic} 
                            openPopup={openPopup}
                        />
                        
                        <div id="profile-wrapper" className="center">
                            <div>
                                <div><strong>Firstname: </strong>{firstname}</div>
                                <div><strong>Lastname: </strong>{lastname}</div>

                                <div>
                                <BioEditor 
                                    userBio={bio}
                                    bioEditDone={bioEditDone}
                                    />
                                </div>
                            </div>
                            </div>

                        <MyFavoritArtists />
                </div>
            );
    }   
}