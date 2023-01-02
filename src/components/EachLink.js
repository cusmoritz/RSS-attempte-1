// import everything
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

const EachLink = ({link}) => {

    const handleClick = async (id) => {
        console.log(`are you sure you want to see the posts from feed ${id}?`)
        
    }

    const handleDelete = (id) => {
        console.log(`are you sure you want to delete feed ${id}?`)
    }
    // posts have an id, a link_id, a url (links away from site), a title, a date, and a SAVED boolean
    // they might also have 'content' at some point
    return (

        <div className='post-container'>
            <sup>{link.link_id}</sup>
            <h4 className='post-title'>
                <a href={link.url} target="_blank">{link.link_title}</a>
            </h4>
            <p className='post-url'>
                <a target="_blank">{link.url}</a>
            </p>
            <button><Link to={`/${link.link_id}/posts`}>See all posts</Link></button>

            <button onClick={((event) => {
                handleDelete(link.link_id)
            })}>Delete feed</button>
            {/* <p className='post-content'>{link.content}</p> */}
        </div>
    )

}

export default EachLink;