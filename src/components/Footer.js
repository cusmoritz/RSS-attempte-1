// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import github from './images/github-mark.png';

const Footer = () => {
    return (
        <footer className="container">
            <div className='footer-container'>
                <ul>
                    <li className="footer-li"><a href="https://github.com/cusmoritz/RSS-attempte-1"><img src={github}></img></a></li>
                    <li className="footer-li"><a href="https://www.linkedin.com/in/marcusmoritz/"><p>Hire me.</p></a></li>
                    <li className="footer-li"><p>Copyright 2023, Marcus Moritz</p></li>
                    <li><p>Many thanks to Hanna Royals, <a href="https://www.linkedin.com/in/jaron-chretien/">Jaron Chretien</a>, and <a href="https://www.linkedin.com/in/justin-syrett/">Justin Syrett</a> for their motivation.</p></li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer;