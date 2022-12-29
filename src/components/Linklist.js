// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// import { getAllLinks } from '../../db/create';
import { getAPILinks} from '../api';
import EachPost from './EachPost';

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


const Linklist = ({login}) => {

    // // get all our links from the api
    // const allLinks = async(token) => {
    //     const links = getAPILinks(token);
    // }

    const allLinks = [];
    const everyLink = async () => {
        const allLinks = await getAPILinks();
    }

    return (
        <>
        {!login ? 
            <div>
                <p>You must NOT be logged in to see this. Must be you. You must not be logged in.</p>
            </div>
            : 
            <div>
                {allLinks ? allLinks.forEach((link) => {
                    <EachPost post={post}/>
                }) : (<p>There are no posts to show</p>) }

            </div>
        }
        </>
    )

}


export default Linklist;