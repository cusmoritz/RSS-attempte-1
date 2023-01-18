// import everything
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

const EachLink = ({link}) => {

    const handleDelete = (id) => {
        console.log(`are you sure you want to delete feed ${id}?`)
    }
    // posts have an id, a link_id, a url (links away from site), a title, a date, and a SAVED boolean
    // they might also have 'content' at some point
    return (

        <div className='link-container'>
            <h4 className='link-title'>
                {link.link_id}: {link.link_title}
            </h4>
            <button><Link to={`/${link.link_id}/posts`}>See all posts</Link></button>
            <button onClick={((event) => {
                handleDelete(link.link_id)
            })}>Delete feed</button>
            <p className='link-url'>
                <a href={link.url} target="_blank">{link.url}</a>
            </p>
            {/* <p className='post-content'>{link.content}</p> */}
        </div>
    )

}

export default EachLink;