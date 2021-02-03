import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import { Link } from 'react-router-dom';

export default function FindUsersFunction() {
   
    const [query, setQuery] = useState(""); // useState has a default value "" -> it returns query as the current value of the state and setQuery as the function 
    const [users, setUsers] = useState([]);

        // always runs when component mounts first and then again when provided value changes
        useEffect(() => { 
            let ignore = false;
            async function findUsers() {
                const res = await axios
                .get("/api/find-user/" + query);
                if(!ignore) {
                    console.log("res from axios get request query", res);
                    setUsers(res.data.user);
                } else {
                    console.log("No user found or some other error")
                }
            }
            if(query) {
            findUsers();
            }

            return () => {
                // "cleanup function" is for ignoring the previous ajax call  
                    // -> always runs before next ajax request is made 
                    // -> prevents from showing wrong results when typing too fast
                ignore = true;
            };
    
        }, [query]); 

        console.log("users", users);


    return (
        <div>
            <div className="center"><img src="/static/pics/find-users.png"/></div> 
        <div id="find-users">
            <div className="center">
            <input id="user-input" type="text" onChange={ event => setQuery(event.target.value) } />
            </div>
            <div id="users">
                {users && users.map((user) => {
                    console.log("user", user);
                    return (
                            <div key={user.id} className="box-users">
                                <div><strong>Firstname:</strong> {user.firstname}</div>
                                <div><strong>Lastname:</strong> {user.lastname}</div>
                                <div><strong>About me:</strong> {user.bio}</div>
                                <div className="center"><Link to={`/user/${user.id}`}><img src={user.profile_pic}/></Link></div>
                            </div>
                    );
                })}
            </div> 
        </div>
        </div> 
    );
} 