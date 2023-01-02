// index.js inside src folder to create React

// import everything
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Linklist from './components/Linklist';
import Footer from './components/Footer'
import { callAPIForLinks } from './api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LinkPosts from './components/LinkPosts';

export const App = () => {

  // use state to check for login status
  // const [login, setLogin] = useState(true);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    //get all the links on first load
    async function getLinks(){
      setLinks(await callAPIForLinks());
      console.log('we got the links in useEffecT')
    }
    getLinks();
    // also get all the posts on first load
  },[])

  return(
    <>
      <Header/>
      
        <BrowserRouter>

          <Routes>
            <Route exact path="/" element={<Linklist links={links}/>}/>
            <Route path="/:linkSwitch/posts" element={<LinkPosts links={links} />}>
            </Route>
          </Routes>
        </BrowserRouter>

      <Footer />
    </>
  )
}
