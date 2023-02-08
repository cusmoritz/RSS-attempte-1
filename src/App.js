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

export const App = () => {

  // use state to check for login status
  // const [login, setLogin] = useState(true);
  const [links, setLinks] = useState([]);
  const [token, setToken] = useState(window.localStorage.token || null);
  const [user, setUser] = useState(null);
  console.log('token app level', token)
  console.log('user app level', user);

  useEffect(() => {
    async function getLinks(){
      setLinks(await getLinksByUserId(user));
    }
    getLinks();
    // also get all the posts on first load? <- no, do that on link click
    // update posts from each link on first load?
    // updatePosts();

  },[token])

  return(
    <>
      <h1><Link to="/">STREAMER</Link></h1>
        <NavBar token={token} setToken={setToken} userId={user} setUserId={setUser}/>

          <Routes>

            <Route path="/today" element={<TodaysPosts />} />
            <Route exact path="/" element={<Linklist links={links} setLinks={setLinks}/>}/>
            <Route path="/:linkSwitch/posts" element={<LinkPosts links={links} />} />
            <Route path="/register" element={<Register token={token} setToken={setToken} setUserId={setUser}/>} />
            <Route path="/manage/:idSwitch" element={<LinkManager setLinks={setLinks} links={links}/>} />
            <Route path="/login" element={<LoginForm />} />
            {/* we need a user route */}
            {/* <Route path="/:user/manage"></Route> */}
          </Routes>


      <Footer />
    </>
  )
}
