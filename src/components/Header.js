// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { updatePosts } from '../api';
import { Link } from 'react-router-dom';

const Header = ({token}) => {
    // we need to import the login status later

    const handleUpdate = async () => {
        console.log('updating...')
        const weGotNewPosts = await updatePosts();
        console.log('done updating');
        return weGotNewPosts;
    };

    return (
        <div className="container">
            <div className="header-container">
                <h1><a href="/">Welcome to your RSS</a></h1>

                <button onClick={() => handleUpdate()}>Update posts</button>

                <button><a href="/today">Today's Posts</a></button>

                <button>Manage links</button>

                {!token ?
                <button>Register</button>
                : 
                <button>Login</button>
                }
                
            </div>
        </div>
    )
}

export default Header;