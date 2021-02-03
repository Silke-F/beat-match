import React, { useState, useEffect } from "react";
import axios from "./axios.js";
import { Link } from "react-router-dom";

export default function FindArtistsFunction() {
    const [query, setQuery] = useState("");
    const [artists, setArtists] = useState([]);
    const [favorites, setFavorites] = useState([]);



    function checkArtists(artists, artist_id) {
        for (var i = 0; i < artists.length; ++i) {
            if (artists[i].artist_id == artist_id) {
                return false
            }
        }
        return true;
    }

    async function addArtist(artist) {
        const res = await axios.post("/api/add-artist", { artist: artist });
        console.log("res from add artist axios request", res.data.updatedFavorites);
        setFavorites(res.data.updatedFavorites);
    }

    async function deleteArtist(artist) {
        const res = await axios.post("/api/delete-artist", { artist: artist });
        console.log("res from delete artist axios request", res.data.updatedFavorites);
        setFavorites(res.data.updatedFavorites);
    }




    useEffect(() => {
        async function getFavoriteArtists() {
            const res = await axios.get("/api/favorit-artists");
            console.log(
                "res from axios get request favorites",
                res.data.favorites
            );
            setFavorites(res.data.favorites);
        }
        getFavoriteArtists();
    }, []);

    useEffect(() => {
        let ignore = false;
        async function findArtists() {
            const res = await axios.get(
                "https://elegant-croissant.glitch.me/spotify",
                {
                    params: {
                        type: "artist",
                        q: query,
                    },
                }
            );
            if (!ignore) {
                console.log(
                    "res from axios get request artists query",
                    res.data.artists.items
                );
                setArtists(res.data.artists.items);
            } else {
                console.log("No artist found or some other error");
            }
        }
        if (query) {
            findArtists();
        }

        return () => {
            ignore = true;
        };
    }, [query]);



    
    return (
        <div>
            <div className="center"><img src="/static/pics/find-artists.png"/></div> 
        <div id="find-artists">

            <div className="center">
            <input id="artists-input"
                type="text"
                onChange={(event) => setQuery(event.target.value)}
            /></div>
            <div id="artists">
                {artists &&
                    artists.map((artist) => {
                        if (artist.images.length > 0) {
                            return (
                                <div key={artist.id} className="box-artists">
                                    <div className="center"><strong>{artist.name}</strong> </div>
                                    <div className="center">
                                        <img src={artist.images[0].url} />
                                    </div>

                                    {checkArtists(favorites, artist.id) && 
                                    <button
                                        onClick={(event) => addArtist(artist)}
                                    >
                                        Add to favorites
                                    </button>}

                                    {!checkArtists(favorites, artist.id) && 
                                    <button className="delete-button"
                                        onClick={(event) => deleteArtist(artist)}
                                    >
                                        Delete from favorites
                                    </button>}

                                </div>
                            );
                        } else {
                            return (
                                <div key={artist.id} className="box-artists">
                                    <div className="center"><strong>{artist.name}</strong> </div>
                                    <div className="center">
                                        <img src="/user-pics/placeholder.jpg" />
                                    </div>

                                    {checkArtists(favorites, artist.id) &&
                                    <button
                                        onClick={(event) => addArtist(artist)}
                                    >
                                        Add to favorites
                                    </button>}

                                    {!checkArtists(favorites, artist.id) && 
                                    <button
                                        onClick={(event) => deleteArtist(artist)}
                                    >
                                        Delete from favorites
                                    </button>}                                    

                                </div>
                            );
                        }
                    })}
            </div>
        </div>
        </div>
    );
}
