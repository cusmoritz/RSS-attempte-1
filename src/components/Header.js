// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { updatePosts } from '../api';

const Header = () => {
    // we need to import the login status later

    const handleUpdate = async () => {
        console.log('updating...')
        const weGotNewPosts = await updatePosts();
        console.log('weGotNewPosts', weGotNewPosts)
        console.log('done updating');
        return weGotNewPosts;
    }

    const handleToday = () => {
        // console.log('getting today posts');
        // const todayPosts = await getTodaysPosts();
        // console.log('today posts might be here: ', todayPosts);
        // return todayPosts;
        console.log('going to today!')
    }

    return (
        <div id="header-container">
            <h1><a href="/">Welcome to your RSS</a></h1>

            <button onClick={() => handleUpdate()}>Update posts</button>

            <button><a href="/today">Today's Posts</a></button>
            
        </div>
    )
}

export default Header;