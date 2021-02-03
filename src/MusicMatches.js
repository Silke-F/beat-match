import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { Link } from 'react-router-dom';


export default function MusicMatchesFunction() {

    const [matchingUsers, setMatches] = useState([]);

    useEffect(() => { 
        async function myMatches() {
            const res = await axios
            .get("/api/music-matches");
                console.log("res from axios get request myMatches", res.data);
                setMatches(res.data.artists);           
        }
        myMatches();
    },[]); 


    if(matchingUsers) {

    return (
        <div>
            <div className="center" id="matches-logo"><img src="/static/pics/beat-matches-logo.png"/></div> 
            <div id="favorit-artists">
            {matchingUsers && matchingUsers.map((artist) => {
                    return (
                            <div key={artist.id} className="box-matches">
                                <div className="center">MY FAVORITE:</div>
                                <div className="center"><h2>{artist.artist_name}</h2></div>
                                {artist.artist_pic != null && 
                                (<div className="center"><img src={artist.artist_pic}/></div>)}
                                {artist.matchingUsers.length > 0 && (
                                    <div>
                                <div className="center"><img id="match" src="/static/pics/match-logo.png"/></div>
                                <div id="match-wrapper">{artist.matchingUsers.map((user) => {
                                    return (
                                        <div key={user.id}>
                                            <div>
                                            <div id="match-name" className="center"><Link to={`/user/${user.id}`}><strong>{user.firstname}</strong></Link></div>
                                            <div><Link to={`/user/${user.id}`}><img id="preview-match-pic" src={user.profile_pic}/></Link></div>
                                            </div>
                                        </div>
                                    );
                                })}</div></div>)}
                                 
                                {!artist.matchingUsers.length && (
                                    <div>
                                        <div className="center"><img id="match" src="/static/pics/no-match.png"/></div>
                                <div className="center"><strong>No matching users with {artist.artist_name}  yet.</strong></div></div>)}
                            </div>
                    );
                })}
            </div> 
        </div> 
    );
} else return (
    <div>No music matches found. :(</div>
)}