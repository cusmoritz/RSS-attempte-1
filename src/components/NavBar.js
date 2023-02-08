import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { updatePosts } from "../api";

const NavBar = ({token, setToken, userId}) => {

    const navigate = useNavigate();

    // updates post on button press
    const handleUpdate = async () => {
        console.log('updating...');
        await updatePosts();
        console.log('done updating');
    };

    // log us out and set tokens
    const handleLogout = () => {
        setToken("");
        window.localStorage.removeItem("token")
        navigate('/');
    }

    return (
        <div className="container">
            <div className="header-container">

                <button onClick={() => handleUpdate()}>Update posts</button>

                <NavLink to="/today"><button>Today's Posts</button></NavLink>

                <button><NavLink to={`/manage/${userId}`} >Manage links</NavLink></button>

                {!token ?
                <NavLink to="/register"><button>Register</button></NavLink>
                : 
                <button onClick={handleLogout} >Logout</button>
                }
                
            </div>
        </div>
    )
}

export default NavBar;