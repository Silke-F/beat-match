import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Profile from './Profile.js';
import ProfilePic from "./ProfilePic.js";
import Uploader from './Uploader.js';
import OtherUsersProfile from './OtherUsersProfile.js';
import FindUsers from './FindUsers.js';
import Friends from './Friends.js';
import Chat from './Chat.js';
import FindArtists from  './FindArtists.js'
import MusicMatches from './MusicMatches.js'


export default class App extends React.Component {

    constructor() {
        super();
        this.state = {
            user: null,
            uploadPopup: false,
        } 
    }

    componentDidMount() {
        axios
        .get("/api/user")
        .then((res) => {
            console.log("response axios get request user", res);
            this.setState({ user: res.data });
        })
        .catch((err) => {
            console.log("Error getting user data", err);
        })
    }

    render() {

        if(!this.state.user) {
            return (<div>Not ready yet</div>);
        } else { 

            return (

                <div id="app">
                    

                    <ProfilePic 
                        profilePicSmall={this.state.user.profile_pic} 
                        openPopup={(event) => this.setState({ uploadPopup: true })}
                    />

                    {this.state.uploadPopup && (
                        <div id="uploader">
                            <div id="close-popup" onClick={event => {this.setState({uploadPopup: false})}}>X</div>
                        <Uploader 
                            uploadDone={newPic => {this.setState({ 
                                user: {
                                    ...this.state.user,
                                    profile_pic: newPic,
                                },
                                uploadPopup: false,
                            });}} 
                        />
                        </div>
                    )}

                    <BrowserRouter>

                        <div id="nav">
                            <div><Link to="/">MY PROFILE</Link></div>
                            <div><Link to="/friends">FRIENDS</Link></div>
                            <div><Link to="/find-artists">FIND ARTISTS</Link></div>
                            <div><Link to="/music-matches">BEAT MATCHES</Link></div>
                            <div><Link to="/find-user">FIND USERS</Link></div>
                            <div><Link to="/chat">CHAT</Link></div>

                        </div>

                        <div id="route-wrapper">

                            <Route
                                exact path="/" render={() => (
                                <div>
                                    <Profile 
                                        user={this.state.user} 
                                        openPopup={(event) => this.setState({ uploadPopup: true })} 
                                        bioEditDone={newBio => {this.setState({
                                            user: {
                                                ...this.state.user,
                                                bio: newBio,
                                            }
                                        });}}
                                    />
                                </div>)}
                            />

                            <Route
                                path="/user/:id" render={(props) => (

                                    <div>
                                        <OtherUsersProfile key={props.match.params.id} match={props.match} history={props.history}
                                        />
                                    </div>
                                )}
                            />

                            <Route path="/find-user" component={FindUsers}/>

                            <Route path="/friends" component={Friends}/>

                            <Route path="/chat" component={Chat}/>

                            <Route path="/find-artists" component={FindArtists} />

                            <Route path="/music-matches" component={MusicMatches} />
 
                        </div>

                    </BrowserRouter>

                  

                </div>
            );
        }
    }
}
