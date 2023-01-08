// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { updatePosts } from '../api';

const Header = () => {
    // we need to import the login status later

    const [newURL, setNewUrl] = useState("");
    const [newName, setNewName] = useState("");

    const handleUpdate = async () => {
        console.log('updating...')
        const weGotNewPosts = await updatePosts();
        console.log('weGotNewPosts', weGotNewPosts)
        console.log('done updating');
        return weGotNewPosts;
    };

    const handleSubmitNewLink = (url, name) => {
        console.log(`you are adding ${url} to the list of links`);
    }

    const handleToday = () => {
        // console.log('getting today posts');
        // const todayPosts = await getTodaysPosts();
        // console.log('today posts might be here: ', todayPosts);
        // return todayPosts;
        console.log('going to today!')
    }

    return (
        <div className="container">
            <h1><a href="/">Welcome to your RSS</a></h1>

            <button onClick={() => handleUpdate()}>Update posts</button>

            <button><a href="/today">Today's Posts</a></button>

            <form onSubmit={(event) => {
                event.preventDefault();
                handleSubmitNewLink(newURL, newName);
            }}>
                <label htmlFor='add-rss-link'>Add an RSS link:</label>
                <input className="add-rss-link" type="text" placeholder="link" value={newURL} onChange={(event) => setNewUrl(event.target.value)}/>
                <input type="text" placeholder="website name" value={newName} onChange={(event) => setNewName(event.target.value)}/>
                <button type="submit">Add RSS link</button>
            </form>
            
        </div>
    )
}

export default Header;