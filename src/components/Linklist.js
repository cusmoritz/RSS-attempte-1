// import everything
import React, { useEffect, useState, useHistory } from 'react';
import EachLink from './EachLink';
import SearchBar from './SearchBar';
import { getActiveLinksByUserId } from '../api';

const Linklist = ({user}) => {

    const [activeLinks, setActiveLinks] = useState([]);

    const fetchAllLinks = async(user) => {
         setActiveLinks( await getActiveLinksByUserId(user))
    };

    useEffect(() => {
        if (user) {
            fetchAllLinks(user);
        }
    }, [])

    return (
        <>
        {!user 
            ? <p>Log in or register to use this feature.</p>
            : 
            <div>
            <SearchBar user={user}/>
                {(activeLinks.length < 1) 
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
                    {activeLinks.map((link) => {
                        return (<EachLink link={link} key={link.link_id}/>)
                    })}
                </div>)}
            </div>
            
        }
            
        </>
    )

}


export default Linklist;