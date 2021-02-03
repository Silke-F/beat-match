import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import { Link } from 'react-router-dom';

export default function FavoritArtistsFunction() {

    const [artists, setArtists] = useState([]);

    async function deleteArtist(artist) {
        const res = await axios.post("/api/delete-artist-profile", { artist: artist });
        console.log("res from delete artist axios request", res.data.updatedFavorites);
        setArtists(res.data.updatedFavorites);
    }
    
    
    useEffect(() => { 
        async function showArtists() {
            const res = await axios
            .get("/api/my-favorit-artists");
            console.log("res from axios get request showartists", res.data);
            setArtists(res.data.artists);           
        }
        showArtists();
    },[]); 
    

    if(!artists) {
        return (
            <div>No favorite artists yet.</div>
        )
    } 
    
    if (artists) {
    return (
        <div id="favorit-artists">
            <div className="center"><img src="/static/pics/favorites.png"/></div> 
            <div id="favorites">
                {artists && artists.map((artist) => {
                    return (
                            <div key={artist.id} className="box-favs">
                                <div>
                                    <div height="100px"><h2>{artist.artist_name}</h2></div>
                                    <div className="center"><img src={artist.artist_pic}/></div>
                                    {artist.genres.length > 0 && (
                                    <div><strong>Genres:</strong> {artist.genres.map((genre) => {
                                        return (
                                            <ul key={genre}><li>{genre}</li></ul>
                                        );

                                    })}
                                    </div>)}
                                </div>
                                <div className="center">
                                            <button
                                                onClick={(event) => deleteArtist(artist)}
                                            >
                                                Delete from favorites
                                            </button>
                                </div>
                            </div>
                    );
                })}
            </div> 
        </div> 
    );
}}

