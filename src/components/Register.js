import React from "react";

const Register = () => {

    return (
        <div className="register-container">
            <form>
                <label htmlFor="first-name"> First name:</label>
                    <input type="text" required className="first-name"/>
                <label htmlFor="last-name"> Last name:</label>
                    <input type="text" required className="last-name"/>
                <label htmlFor="username-input"> Username:</label>
                    <input type="text" required className="username"/>
                <label htmlFor="email-input"> Email:</label>
                    <input type="text" required className="email-input"/>
                <label htmlFor="password-input"> Password:</label>
                    <input type="text" required className="password-input"/>
                <label htmlFor="password-confirm"> Password confirm:</label>
                    <input type="text" required className="password-confirm"/>
            </form>
        </div>
    )
}

export default Register;