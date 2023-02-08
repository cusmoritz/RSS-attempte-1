// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const LoginForm = ({login, setLogin}) => { 

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (username, password) => {
        console.log(`${username} is logged in with ${password}`);
    }
    return (
        <div id="login-container">
            {!login ? 
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
                        type="password"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <button type="submit">Log in</button>
                </form> 
                :         
                <>
                    <h4>Thanks for being logged in</h4>
                </>
            }
        </div>
    )
};

export default LoginForm;