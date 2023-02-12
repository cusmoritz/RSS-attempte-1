// import everything
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EachLink = ({link}) => {

    // posts have an id, a link_id, a url (links away from site), content, a title, a userId, a date, and a SAVED boolean
    return (

        <div className='link-container'>
            <h4 className='link-title'>
                {link.link_title}
            </h4>
            <button><Link to={`/${link.link_id}/posts`}>See all posts</Link></button>
        </div>
    )
}

export default EachLink;