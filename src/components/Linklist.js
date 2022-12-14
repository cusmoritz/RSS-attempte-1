// import everything
import React, { useEffect, useState, useHistory } from 'react';
import ReactDOM from 'react-dom/client';
import EachLink from './EachLink';
import { createNewLink } from '../api';

const FEED_LINKS = [
    {name: 'Ars Technica', link: 'https://feeds.arstechnica.com/arstechnica/staff-blogs'}, // works with parseURL
    {name: 'StoneMountain64', link: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCN-v-Xn9S7oYk0X2v1jx1Qg'}, // works with parseURL
    {name: 'The Verge', link: 'https://www.theverge.com/rss/index.xml'}, // works with parseURL
    {name: 'Corey Doctrow', link: 'https://pluralistic.net/feed/'}, // works with parseURL
    {name: 'WIRED Latest Ideas', link: 'https://www.wired.com/feed/category/ideas/latest/rss'}, // works with parseURL
    {name: 'Vail Daily', link: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCZy67OUMYggYSGDyYAviFUg'},
    {name: 'SpiffingBrit', link: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCRHXUZ0BxbkU2MYZgsuFgkQ'},
    {name: 'ed zitron', link: 'https://ez.substack.com/feed'},
    {name: 'Garbage Day', link: 'https://www.garbageday.email/feed'},
    {name: 'everything is amazing', link: 'https://everythingisamazing.substack.com/feed'},
    {name: 'JackFrags', link: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCw7FkXsC00lH2v2yB5LQoYA'},
    {name: 'xkcd', link: 'https://xkcd.com/rss.xml'},    
    {name: 'New Means', link: 'https://newmeans.substack.com/feed'},
    // {name: 'The Intercept', link: 'https://theintercept.com/feed/?lang=en'}
];

const Linklist = ({links, setLinks}) => {
    // console.log('links in link list', links)

    const [newURL, setNewUrl] = useState("");
    const [newName, setNewName] = useState("");

    const handleSubmitNewLink = async (url, name) => {
        // console.log(`you are adding ${url} to the list of links`);
        const newLink = await createNewLink(url, name);
        setLinks((previousList) => [...previousList, newLink]);
        return newLink;
    };

    return (
        <>
            <form  className="container" onSubmit={(event) => {
                event.preventDefault();
                handleSubmitNewLink(newURL, newName);
                setNewName("");
                setNewUrl("");
            }}>
                <label htmlFor='add-rss-link'>Add an RSS link:</label>
                <input className="add-rss-link" type="text" placeholder="link" value={newURL} onChange={(event) => setNewUrl(event.target.value)}/>
                <input type="text" placeholder="website name" value={newName} onChange={(event) => setNewName(event.target.value)}/>
                <button type="submit">Add RSS link</button>
            </form>
            <div className="container">
                {links ? links.map((link) => {
                    return (<EachLink link={link} key={link.link_id}/>)
                }) : (<p>There are no posts to show</p>) }
            </div>
        </>
    )

}


export default Linklist;