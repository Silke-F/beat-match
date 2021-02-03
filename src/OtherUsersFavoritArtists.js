import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import { Link } from 'react-router-dom';

export default function OtherUsersFavoritArtistsFunction(props) {

    const [artists, setArtists] = useState([]);
    const {otherUsersId} = props;

    console.log("otherusersid", otherUsersId);

    useEffect(() => { 
        async function showArtists() {
            const res = await axios
            .get("/api/users-favorit-artists/" + otherUsersId);
                console.log("res from axios get request showartists", res.data);
                setArtists(res.data.artists);           
        }
        if(otherUsersId) {
        showArtists();
        }
    },[otherUsersId]); 




    return (
        <div id="favorit-artists">
            <div className="center"><img src="/static/pics/favorites.png"/></div> 
            <div id="favorites">
            {artists && artists.map((artist) => {
                    return (
                            <div key={artist.id} className="box-favs">
                                <div>
                                <div><h2>{artist.artist_name}</h2> </div>
                                <div className="center"><img src={artist.artist_pic}/></div>
                                {artist.genres.length > 0 && (
                                <div><strong>Genres:</strong> {artist.genres.map((genre) => {
                                    return (
                                        <ul key={genre}><li>{genre}</li></ul>
                                    );
                                })}</div>)}
                                </div>
                            </div>
                    );
                })}
            </div> 
        </div> 
    );
}

