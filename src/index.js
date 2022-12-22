// index.js inside src folder to create React

// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header'


const App = () => {

  // use state to check for login status
  const [login, setLogin] = useState(false);

  return(
    <Header />
  )
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);