// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const Header = () => {
    // we need to import the login status later


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div id="header-container">
            <h1>Welcome</h1>
            <div id="login-container">
            <form>
                <input type="text"
                autoFocus
                placeholder="Type username to login"
                value={username}
                onChange={(event) => {
                    setUsername(event.target.value)
                }}
                />
                <input type="text"
                placeholder="Type password to login"
                value={password}
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
                />
            </form>
            </div>
        </div>
    )
}

export default Header;