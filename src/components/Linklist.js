// import everything
import React, { useEffect, useState, useHistory } from 'react';
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

    return (
        <>
            {(links.length < 1) 
            ? 
            (
                <div className="container">
                    <p>You don't have any links yet! Need some inspiration?</p>
                    <p>This is the link for xkcd, an internet comic: https://xkcd.com/rss.xml</p>
                    <p>This is the RSS feed for Baseball Doesn't Exist, a YouTube channel about how ... well it's about baseball: https://www.youtube.com/feeds/videos.xml?channel_id=UCXjvsikVclbNRGRlzr8jTEg</p>
                    <p>This is the RSS feed for WIRED Magazine's Ideas section: https://www.wired.com/feed/category/ideas/latest/rss</p>
                    <p>This is the RSS feed for Ed Zitron's Where's Your Ed At, a substack newsletter: https://ez.substack.com/feed</p>
                    <p>Copy and paste one of these into the links manager to get started!</p>
                </div>
            ) 
            : 
            (<div className="container">
                {links ? links.map((link) => {
                    return (<EachLink link={link} key={link.link_id}/>)
                }) : (<p>You haven't added any feeds yet!</p>) }
            </div>)}
            
        </>
    )

}


export default Linklist;