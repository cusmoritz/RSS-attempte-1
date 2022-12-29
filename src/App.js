// index.js inside src folder to create React

// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Linklist from './components/Linklist';
import Footer from './components/Footer'

export const App = () => {

  // use state to check for login status
  const [login, setLogin] = useState(false);

  return(
    <>
      <Header setLogin={setLogin} login={login}/>

      <Linklist login={login}/> 

      <Footer />
    </>
  )
}
