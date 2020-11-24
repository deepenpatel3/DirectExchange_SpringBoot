  
import React from 'react';
import './App.less';
import { BrowserRouter } from 'react-router-dom';
 import Routes from '../src/Components/Routes';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes />
      </div>
    </BrowserRouter>
  );
}

export default App;