// index.js inside src folder to create React

// import everything
import React, { useEffect, useState } from 'react';
import Linklist from './components/Linklist';
import Footer from './components/Footer'
import Register from './components/Register';
import { getActiveLinksByUserId  } from './api';
import { Route, Routes, Link } from 'react-router-dom';
import LinkPosts from './components/LinkPosts';
import TodaysPosts from './components/TodaysPost';
import NavBar from './components/NavBar';
import LinkManager from './components/LinkManager';
import LoginForm from './components/LoginForm';
import Explainer from './components/Explainer';
import SavedPosts from './components/SavedPosts';
import { userCheck } from './api';
import construction from './components/images/betaversion.gif';
import { updatePosts } from './api';

export const App = () => {

  // TODO => 
    // error handling on user login / register
    // handle error for submitting the same link as a user
    // finish README
    // deactivate account?
    // put link / post options inside sandwich bar?

  const [activeLinks, setActiveLinks] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem('token') || null);
  const [user, setUser] = useState();

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
      const fetchAllLinks = async(user) => {
        setActiveLinks( await getActiveLinksByUserId(user))
      };
      if (user) {
        fetchAllLinks(user);
      }
    }, [])

  useEffect(() => {
    // updates the database twice a day
    const updateDaily = async () => {
      await updatePosts()
    }
    updateDaily();
  }, [43200000])
  
  return(
    <>
    {user ? (<div><img src={construction} className="construction" alt="under construction"/><h1><Link to="/links">STREAMER</Link></h1></div>) : <div><img src={construction} className="construction" alt="under construction"/><h1><Link to="/">STREAMER</Link></h1></div>}
        <NavBar token={token} setToken={setToken} userId={user} setUserId={setUser} setActiveLinks={setActiveLinks}/>

          <Routes>

            <Route path="/today" element={<TodaysPosts user={user}/>} />
            <Route path="/links" element={<Linklist user={user}/>}/>
            <Route path="/:linkSwitch/posts" element={<LinkPosts activeLinks={activeLinks} user={user}/>} />
            <Route path="/register" element={<Register token={token} setToken={setToken} setUserId={setUser}/>} />
            <Route path="/manage/:idSwitch" element={<LinkManager setActiveLinks={setActiveLinks} />} />
            <Route path="/login" element={<LoginForm setToken={setToken} setUser={setUser} setActiveLinks={setActiveLinks}/>} />
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

