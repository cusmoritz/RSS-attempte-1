// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const Footer = () => {
    return (
        <footer className="container">
            <div className='footer-item'>
                <p>Github</p>
                <p>LinkedIn</p>
                <p>Email?</p>
            </div>
            <div className='footer-item'>
                <p>Copyright 2022, Marcus Moritz</p>
            </div>
        </footer>
    )
}

export default Footer;