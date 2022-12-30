// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import LoginForm from './LoginForm'
import { updatePosts } from '../api';

const Header = ({login, setLogin}) => {
    // we need to import the login status later

    const handleUpdate = async () => {
        console.log('updating...')
        const weGotNewPosts = await updatePosts();
        console.log('done updating');
        return weGotNewPosts;
    }

    return (
        <div id="header-container">

            <h1>Welcome to Not Reader</h1>

            <LoginForm login={login} setLogin={setLogin}/>

            <button onClick={() => handleUpdate()}>Update posts</button>
            
        </div>
    )
}

export default Header;