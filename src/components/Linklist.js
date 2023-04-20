// import everything
import React, { useEffect, useState, useHistory } from 'react';
import EachLink from './EachLink';
import SearchBar from './SearchBar';
import { getAllLinksByUserId } from '../api';

const Linklist = ({links, setLinks, user}) => {

    // const [allLinks, setAllLinks] = useState([]);

    // useEffect(() => {
    //     const fetchAllLinks = async(user) => {
    //         setAllLinks( await getAllLinksByUserId(user))
    //     };
    //     fetchAllLinks(user);
    // }, [allLinks])

    console.log('links in LinkList', links)
    console.log('user in LinkList', user)

    return (
        <>
        <SearchBar links={links} user={user}/>
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
                {links.map((link) => {
                    return (<EachLink link={link} key={link.link_id}/>)
                })}
            </div>)}
            
        </>
    )

}


export default Linklist;