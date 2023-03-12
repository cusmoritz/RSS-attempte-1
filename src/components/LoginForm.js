// import everything
import React, { useState } from 'react';
import { userLogin } from '../api';
import { useNavigate } from 'react-router-dom';
import { getActiveLinksByUserId } from '../api';

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
            console.log('user in login', result);
            setUser(result.id)
            navigate('/links');
            setLinks(await getActiveLinksByUserId(result.id, result.token));
        }
    }

    return (
        <div className="login-container">
                <form onSubmit={(event) => {
                    event.preventDefault();
                    handleLogin(username, password);
                }}>
                    <label htmlFor='username-input'>Username:</label>
                    <input 
                        id='username-input'
                        type="text"
                        autoFocus
                        required
                        value={username}
                        onChange={(event) => {
                            setUsername(event.target.value)
                        }}
                    />
                    <label htmlFor='password-input'>Password:</label>
                    <input 
                        id='password-input'
                        type="password"
                        required
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <label htmlFor="login-submit"></label>
                    <button type="login-submit">Log in</button>
                </form> 
        </div>
    )
};

export default LoginForm;