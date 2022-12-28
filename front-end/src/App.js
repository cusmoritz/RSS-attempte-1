// index.js inside src folder to create React

// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header';
import Linklist from './components/Linklist';


const App = () => {

  // use state to check for login status
  const [login, setLogin] = useState(true);

  return(
    <>
      <Header login={login} setLogin={setLogin} />

      <Linklist login={login}/> 
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);