import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { updatePosts } from "../api";

const NavBar = ({token, setToken, userId, setLinks, setUserId}) => {

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
        setLinks([]);
        setUserId(null)
    }

    return (
        <div className="container">
            <div className="header-container">

                <button onClick={() => handleUpdate()}>Update posts</button>

                {!token ?
                <div>
                    <NavLink to="/register"><button>Register</button></NavLink>
                    <NavLink to="/login"><button>Login</button></NavLink>
                </div>
                : 
                <div>
                    <NavLink to={`/manage/${userId}`} ><button>Link manager</button></NavLink>
                    <button onClick={handleLogout} >Logout</button>
                    <NavLink to="/today"><button>Today's Posts</button></NavLink>
                    {/* <NavLink to="/links"><button>Your Links</button></NavLink> */}
                    <NavLink to={`/${userId}/saved`}><button>Saved Posts</button></NavLink>
                </div>
                }
                
            </div>
        </div>
    )
}

export default NavBar;