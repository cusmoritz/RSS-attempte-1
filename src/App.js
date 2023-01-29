// index.js inside src folder to create React

// import everything
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Linklist from './components/Linklist';
import Footer from './components/Footer'
import { callAPIForLinks } from './api';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import LinkPosts from './components/LinkPosts';
import TodaysPosts from './components/TodaysPost';
import { updatePosts } from './api';

export const App = () => {

  // use state to check for login status
  // const [login, setLogin] = useState(true);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    async function getLinks(){
      setLinks(await callAPIForLinks());
    }
    getLinks();
    // also get all the posts on first load? <- no, do that on link click
    // update posts from each link on first load?
    // updatePosts();
  },[])

  return(
    <>
      <Header/>
      
        <BrowserRouter>

          <Routes>
            <Route path="/today" element={<TodaysPosts />} />
            <Route exact path="/" element={<Linklist links={links} setLinks={setLinks}/>}/>
            <Route path="/:linkSwitch/posts" element={<LinkPosts links={links} />}>
            {/* we need a user route */}
            {/* <Route path="/:user/manage"></Route> */}
            </Route>
          </Routes>
        </BrowserRouter>

      <Footer />
    </>
  )
}
