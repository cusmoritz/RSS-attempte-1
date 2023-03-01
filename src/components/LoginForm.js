// import everything
import React, { useState } from 'react';
import { userLogin } from '../api';
import { useNavigate } from 'react-router-dom';
import { getLinksByUserId } from '../api';

const LoginForm = ({setToken, setUser, setLinks}) => { 

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (username, password) => {
        if (!username || !password) {
            alert('You must type a username and password!')
            setUsername("");
            setPassword("");
        } else {
            const result = await userLogin(username, password);
            // console.log('result front end', result);
            setToken(result.token)
            localStorage.setItem('token', result.token);
            setUser(result.id)
            navigate('/links');
            setLinks(await getLinksByUserId(result.id, result.token));
        }
    }

    return (
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
                        type="password"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <button type="submit">Log in</button>
                </form> 
        </div>
    )
};

export default LoginForm;