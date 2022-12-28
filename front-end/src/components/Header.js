// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const Header = ({login, setLogin}) => {
    // we need to import the login status later

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (username, password) => {

        console.log(`${username} is logged in with ${password}`);

    }

    return (
        <div id="header-container">

            <h1>Welcome</h1>

            <div id="login-container">
                <form onSubmit={(event) => {
                    event.preventDefault();
                    handleLogin(username, password);
                }}>
                    <label htmlFor='username-input'>Username:</label>
                    <input 
                        id='username-input'
                        type="text"
                        autoFocus
                        value={username}
                        onChange={(event) => {
                            setUsername(event.target.value)
                        }}
                    />
                    <label htmlFor='password-input'>Password:</label>
                    <input 
                        id='password-input'
                        type="text"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <button type="submit">
                        {!login ? (
                            "Sign up"
                        ) : (
                            "Log in"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Header;