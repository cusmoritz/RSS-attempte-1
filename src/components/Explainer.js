import React from "react";
import xmlExample from './images/xmlExample.png'
import { Link } from "react-router-dom";

const Explainer = () => {
    return (
        <div className="container">
            <h4>What is this website?</h4>
            <p>RSS is short for Really Simple Syndication, you can read more about it <a href="https://rss.com/blog/how-do-rss-feeds-work/" target="_blank">here</a>.</p>
            <p>In short, they are links that are automatically populated and updated with information that a computer can read. These files are in the format called XML.</p>
            <p>RSS feeds, when they are populated from website masters, are automatically rendered in chronological order. Meaning the newest posts, blogs, or whatever else is in the RSS feed are always the first things you see.</p>
            <p>The RSS feed for xkcd, an online comic, looks like this:</p>
            <img src={xmlExample}></img>
            <p>... and on and on.</p>
            <p>The links for these XML files look like this: <a href="https://xkcd.com/rss.xml">https://xkcd.com/rss.xml</a></p>
            <p>This website is an RSS reader, meaning you can find links that look like the one above, and create your own news feed of sorts. </p>
            <p>RSS feeds have to be supported from the website, so a lot of websites as of 2023 do not support RSS!</p>
            <p>Which is sad, but sort of makes sense. It's old tech! </p>
            <p>However don't let that deter you from googling something!</p>
            <p><Link to="/register">Register</Link> to try it out!</p>
        </div>
    )
}
export default Explainer;