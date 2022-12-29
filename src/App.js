// index.js inside src folder to create React

// import everything
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Linklist from './components/Linklist';
import Footer from './components/Footer'
import { callAPIForLinks } from './api';

export const App = () => {

  // use state to check for login status
  const [login, setLogin] = useState(true);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    //get all the links on first load
    async function getLinks() {
      setLinks(await callAPIForLinks());
    } 
    console.log('we have gotten all the links');

    // also get all the posts on first load
  },[links])

  return(
    <>
      <Header setLogin={setLogin} login={login}/>

      <Linklist login={login}/> 

      <Footer />
    </>
  )
}
