// index.js inside src folder to create React

// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Linklist from './components/Linklist';


export const App = () => {

  // use state to check for login status
  const [login, setLogin] = useState(true);

  return(
    <>
      <Header login={login} setLogin={setLogin} />

      <Linklist login={login}/> 
    </>
  )
}
