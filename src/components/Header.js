// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import LoginForm from './LoginForm'

const Header = ({login, setLogin}) => {
    // we need to import the login status later

    return (
        <div id="header-container">

            <h1>Welcome to Not Reader</h1>

            <LoginForm login={login} setLogin={setLogin}/>
            
        </div>
    )
}

export default Header;