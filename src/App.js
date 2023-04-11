// index.js inside src folder to create React

// import everything
import React, { useEffect, useState } from 'react';
import Linklist from './components/Linklist';
import Footer from './components/Footer'
import Register from './components/Register';
import { getActiveLinksByUserId } from './api';
import { Route, Routes, Link } from 'react-router-dom';
import LinkPosts from './components/LinkPosts';
import TodaysPosts from './components/TodaysPost';
import NavBar from './components/NavBar';
import LinkManager from './components/LinkManager';
import LoginForm from './components/LoginForm';
import Explainer from './components/Explainer';
import SavedPosts from './components/SavedPosts';
import { userCheck } from './api';
import construction from './components/images/construction.gif';

export const App = () => {

  // TODO => 
    // add search by date feature
    // error handling on user login / register

  const [links, setLinks] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const checkingUser = async() => {
        const checking = await userCheck(token);
        setUser(checking.user_id);
      }
      checkingUser();
    }

  }, [token]);

  useEffect(() => {
    if(user != null){
      async function getLinks(){
        setLinks(await getActiveLinksByUserId(user, token));
      }
      getLinks();
    }
  }, [user])
  
  return(
    <>
    {user ? (<div><img src={construction} className="construction" alt="under construction"/><h1><Link to="/links">STREAMER</Link></h1></div>) : <div><img src={construction} className="construction" alt="under construction"/><h1><Link to="/">STREAMER</Link></h1></div>}
        <NavBar token={token} setToken={setToken} userId={user} setUserId={setUser} setLinks={setLinks}/>

          <Routes>

            <Route path="/today" element={<TodaysPosts user={user}/>} />
            <Route path="/links" element={<Linklist setLinks={setLinks} links={links} user={user}/>}/>
            <Route path="/:linkSwitch/posts" element={<LinkPosts links={links} user={user}/>} />
            <Route path="/register" element={<Register token={token} setToken={setToken} setUserId={setUser}/>} />
            <Route path="/manage/:idSwitch" element={<LinkManager setLinks={setLinks} />} />
            <Route path="/login" element={<LoginForm setToken={setToken} setUser={setUser} setLinks={setLinks}/>} />
            <Route path="/:userId/saved" element={<SavedPosts />}/>
            <Route exact path="/" element={<Explainer />} />
          </Routes>
{/* 
      {!user 
      ? <Explainer />
      : null} */}

      <Footer />
    </>
  )
}

