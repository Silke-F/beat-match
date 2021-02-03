import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import {loadFriends, acceptFriendRequest, unfriendUser, cancelFriendRequest} from "./actions.js";
import {useDispatch, useSelector} from "react-redux";
import { Link } from 'react-router-dom';


export default function Friends() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadFriends())
    }, []); 

    const pendingRequests = useSelector(state => {
        if(state.friends) {
            return state.friends.filter(friend => {
                return friend.accepted == false && friend.from_id == friend.id;
            });
        } else {
            return [];
        }
    });

    console.log("pendingRequests", pendingRequests)


    const acceptedFriends = useSelector(state => {
        if(state.friends) {
            return state.friends.filter(friend => {
                return friend.accepted == true;
            })
        } else {
            return [];
        }
    })

    console.log("acceptedFriends", acceptedFriends)


    const requestsMadeByMe = useSelector(state => {
        if(state.friends) {
            return state.friends.filter(friend => {
                return friend.accepted == false && friend.from_id !== friend.id;
            });
        } else {
            return [];
        }
    });

    console.log("requestsMadeByMe", requestsMadeByMe)


    return (
        <div>
        <div className="center"><img src="/static/pics/friends-logo.png"/></div> 

            <div><h2>FRIEND REQUESTS:</h2></div>
            <div id="friends-box">
              
            {pendingRequests.length > 0 && pendingRequests.map(pendingRequest => {
                return (
                    <Pending key={pendingRequest.id} {...pendingRequest}/>
                )
            })}</div>


            <div><h2>MY FRIENDS:</h2></div>
            <div id="friends-box">
            {acceptedFriends.length > 0 && acceptedFriends.map(acceptedFriend => {
                return (
                    <MyFriends key={acceptedFriend.id} {...acceptedFriend}/>
                )
            })}</div>


            <div><h2>REQUESTS MADE BY ME:</h2></div>
            <div id="friends-box">
            {requestsMadeByMe.length > 0 && requestsMadeByMe.map(requestMadeByMe => {
                return (
                    <MyRequests key={requestMadeByMe.id} {...requestMadeByMe}/>
                )
            })}</div>

        
        </div>
    );
     
}

function Pending(props) {

    const dispatch = useDispatch();

    return (
        <div className="box-friends">
            <div className="center"><strong>{props.firstname} {props.lastname}</strong></div>
            <div className="center">wants to be your friend 🤘</div>
            <div className="center-margin"><Link to={`/user/${props.id}`}><img src={props.profile_pic}/></Link></div>
            <div className="center"><button onClick={event => dispatch(acceptFriendRequest(props.id))}>Accept</button></div>
        </div>
    )
}

function MyFriends(props) {

    const dispatch = useDispatch();

    return (
        <div className="box-friends">
            <div className="center"><strong>{props.firstname} {props.lastname}</strong></div>
            <div className="center">is your friend 🥳</div>
            <div className="center-margin"><Link to={`/user/${props.id}`}><img src={props.profile_pic}/></Link></div>
            <div className="center"><button onClick={event => dispatch(unfriendUser(props.id))}>Unfriend</button></div>
        </div>
    )
}

function MyRequests(props) {

    const dispatch = useDispatch();

    return (
        <div className="box-friends">
                <div className="center">You want to be friends with</div>
                <div className="center"><strong>{props.firstname} {props.lastname}</strong></div>
                <div className="center-margin"><Link to={`/user/${props.id}`}><img src={props.profile_pic}/></Link></div>
                <div className="center"><button onClick={event => dispatch(cancelFriendRequest(props.id))}>Cancel</button></div>
        </div>
    )
}