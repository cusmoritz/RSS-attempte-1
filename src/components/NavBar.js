import React from "react";
import { NavLink } from "react-router-dom";
import { updatePosts } from "../api";

const NavBar = ({token}) => {

    // updates post on button press
    const handleUpdate = async () => {
        console.log('updating...');
        await updatePosts();
        console.log('done updating');
    };

    return (
        <div className="container">
            <div className="header-container">

                <button onClick={() => handleUpdate()}>Update posts</button>

                <NavLink to="/today"><button>Today's Posts</button></NavLink>

                <button>Manage links</button>

                {!token ?
                <NavLink to="/register"><button>Register</button></NavLink>
                : 
                <button>Login</button>
                }
                
            </div>
        </div>
    )
}

export default NavBar;