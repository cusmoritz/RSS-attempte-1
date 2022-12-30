// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import LoginForm from './LoginForm'
import { updatePosts } from '../api';
import { getTodaysPosts } from '../api';

const Header = ({login, setLogin}) => {
    // we need to import the login status later

    const handleUpdate = async () => {
        console.log('updating...')
        const weGotNewPosts = await updatePosts();
        console.log('weGotNewPosts', weGotNewPosts)
        console.log('done updating');
        return weGotNewPosts;
    }

    const handleToday = async() => {
        console.log('getting today posts');
        const todayPosts = await getTodaysPosts();
        console.log('today posts might be here: ', todayPosts);
        return todayPosts;
    }

    return (
        <div id="header-container">

            <h1>Welcome to Not Reader</h1>

            <LoginForm login={login} setLogin={setLogin}/>

            <button onClick={() => handleUpdate()}>Update posts</button>

            <button onClick={() => {handleToday()}}>Today's Posts</button>
            
        </div>
    )
}

export default Header;