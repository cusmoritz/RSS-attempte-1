// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const EachPost = ({post}) => {
    // posts have an id, a link_id, a url (links away from site), a title, a date, and a SAVED boolean
    // they might also have 'content' at some point
    return (
        <div className='post-container'>
            <h4 className='post-title'>{post.title}</h4>
            <p className='post-date'>{post.date}</p>
            <p className='post-content'>{post.content}</p>
        </div>
    )

}

export default EachPost;