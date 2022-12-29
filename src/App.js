// index.js inside src folder to create React

// import everything
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Linklist from './components/Linklist';
import Footer from './components/Footer'
import { callAPIForLinks } from './api';
import { BrowserRouter } from 'react-router-dom';

export const App = () => {

  // use state to check for login status
  const [login, setLogin] = useState(true);
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
      <Header setLogin={setLogin} login={login}/>
      
        <BrowserRouter>
        
        <Linklist login={login} links={links}/> 
        
        </BrowserRouter>

      <Footer />
    </>
  )
}
