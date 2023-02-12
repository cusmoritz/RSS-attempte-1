// index.js inside src folder to create React

// import everything
import React, { useEffect, useState } from 'react';
import Linklist from './components/Linklist';
import Footer from './components/Footer'
import Register from './components/Register';
import { getLinksByUserId } from './api';
import { BrowserRouter, Route, Router, Routes, Link } from 'react-router-dom';
import LinkPosts from './components/LinkPosts';
import TodaysPosts from './components/TodaysPost';
import NavBar from './components/NavBar';
import LinkManager from './components/LinkManager';
import LoginForm from './components/LoginForm';
import Explainer from './components/Explainer';

export const App = () => {

  // use state to check for login status
  // const [login, setLogin] = useState(true);
  const [links, setLinks] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  console.log('user app level', user);

  useEffect(() => {

      async function getLinks(){
        setLinks(await getLinksByUserId(user, token));
      }
      getLinks();
    
    // also get all the posts on first load? <- no, do that on link click
    // update posts from each link on first load?
    // updatePosts();

  },[])

  return(
    <>
      <h1><Link to="/">STREAMER</Link></h1>
        <NavBar token={token} setToken={setToken} userId={user} setUserId={setUser} setLinks={setLinks}/>

          <Routes>

            <Route path="/today" element={<TodaysPosts />} />
            <Route exact path="/" element={<Linklist links={links} setLinks={setLinks}/>}/>
            <Route path="/:linkSwitch/posts" element={<LinkPosts links={links} />} />
            <Route path="/register" element={<Register token={token} setToken={setToken} setUserId={setUser}/>} />
            <Route path="/manage/:idSwitch" element={<LinkManager setLinks={setLinks} links={links}/>} />
            <Route path="/login" element={<LoginForm setToken={setToken} setUser={setUser} setLinks={setLinks}/>} />
            {/* we need a user route */}
            {/* <Route path="/:user/manage"></Route> */}
          </Routes>

      {!user 
      ? <Explainer />
      : null}

      <Footer />
    </>
  )
}


<rss version="2.0">
<channel>
<title>xkcd.com</title>
<link>https://xkcd.com/</link>
<description>xkcd.com: A webcomic of romance and math humor.</description>
<language>en</language>
<item>
<title>Only Serifs</title>
<link>https://xkcd.com/2736/</link>
<description><img src="https://imgs.xkcd.com/comics/only_serifs.png" title="If you ever want to get beaten up by a bunch of graphic designers, try removing the serifs from Times New Roman and adding them to Comic Sans." alt="If you ever want to get beaten up by a bunch of graphic designers, try removing the serifs from Times New Roman and adding them to Comic Sans." /></description>
<pubDate>Fri, 10 Feb 2023 05:00:00 -0000</pubDate>
<guid>https://xkcd.com/2736/</guid>
</item>
<item>
<title>Coordinate Plane Closure</title>
<link>https://xkcd.com/2735/</link>
<description><img src="https://imgs.xkcd.com/comics/coordinate_plane_closure.png" title="3D graphs that don't contact the plane in the closure area may proceed as scheduled, but be alert for possible collisions with 2D graph lines that reach the hole and unexpectedly enter 3D space." alt="3D graphs that don't contact the plane in the closure area may proceed as scheduled, but be alert for possible collisions with 2D graph lines that reach the hole and unexpectedly enter 3D space." /></description>
<pubDate>Wed, 08 Feb 2023 05:00:00 -0000</pubDate>
<guid>https://xkcd.com/2735/</guid>
</item>
<item>
<title>Electron Color</title>
<link>https://xkcd.com/2734/</link>
<description><img src="https://imgs.xkcd.com/comics/electron_color.png" title="There's quark color, but that's not really color--it's just an admission by 20th century physicists that numbers are boring." alt="There's quark color, but that's not really color--it's just an admission by 20th century physicists that numbers are boring." /></description>
<pubDate>Mon, 06 Feb 2023 05:00:00 -0000</pubDate>
<guid>https://xkcd.com/2734/</guid>
</item>
<item>
<title>Size Comparisons</title>
<link>https://xkcd.com/2733/</link>
<description><img src="https://imgs.xkcd.com/comics/size_comparisons.png" title="If you shrank the Solar System to the size of Texas, the Houston metro area would be smaller than a grasshopper in Dallas." alt="If you shrank the Solar System to the size of Texas, the Houston metro area would be smaller than a grasshopper in Dallas." /></description>
<pubDate>Fri, 03 Feb 2023 05:00:00 -0000</pubDate>
<guid>https://xkcd.com/2733/</guid>
</item>
</channel>
</rss>