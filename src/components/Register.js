import React from "react";
import { useState } from "react";
import { userRegister } from "../api";
import { useNavigate } from "react-router-dom";

const Register = ({token, setToken, setUserId}) => {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")

    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== confirm) {
            alert('You must confirm your password!');
            setPassword("");
            setConfirm("");
        } else if (!firstName || !lastName || !username) {
            alert('Please fill in all fields to register.');
            setFirstName("");
            setLastName("");
            setUsername("");
            // setEmail("");
        } else {
            const newUser = await userRegister(username, password, email, firstName, lastName);
            if (newUser.error) {
                alert(newUser.message);
                setFirstName("");
                setLastName("");
                setUsername("");
                setEmail("");
            } else {
                alert(newUser.message);
                setToken(newUser.token);
                setUserId(newUser.newUser.id)
                navigate('/links');
                return newUser;
            }
            // alert(newUser.message);
            // setToken(newUser.token);
            // setUserId(newUser.newUser.id)
            // navigate('/');
            // return newUser;
        }
    }

    return (
        <div className="register-container">
            <h5>Register a new user with the following form:</h5>
            {/* <p>(Your email address is only used to keep track of links you have saved! Nothing else.)</p> */}
            <form className="register-form" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="first-name"> First name: </label>
                    <input type="text" required className="first-name" 
                    value={firstName} onChange={(event) => {setFirstName(event.target.value)}}/>
                <label htmlFor="last-name"> Last name:</label>
                    <input type="text" required className="last-name" 
                    value={lastName} onChange={(event) => {setLastName(event.target.value)}}/>
                <label htmlFor="username-input"> Username:</label>
                    <input type="text" required className="username" 
                    value={username} onChange={(event) => {setUsername(event.target.value)}}/>
                {/* <label htmlFor="email-input"> Email:</label>
                    <input type="text" required className="email-input" 
                    value={email} onChange={(event) => {setEmail(event.target.value)}}/> */}
                <label htmlFor="password-input"> Password:</label>
                    <input type="password" required className="password-input" 
                    value={password} onChange={(event) => {setPassword(event.target.value)}}/>
                <label htmlFor="password-confirm"> Password confirm:</label>
                    <input type="password" required className="password-confirm" 
                    value={confirm} onChange={(event) => {setConfirm(event.target.value)}}/>
                <label htmlFor="register-submit">Register: </label>
                <button type="submit" className="register-submit" onClick={handleRegister}>Submit</button>
            </form>
        </div>
    )
}

export default Register;