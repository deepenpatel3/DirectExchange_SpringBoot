  
import React from 'react';
import './App.less';
import { BrowserRouter } from 'react-router-dom';
 import Routes from '../src/Components/Routes';
import {config} from './keys';
import firebase from 'firebase';

firebase.initializeApp(config);
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