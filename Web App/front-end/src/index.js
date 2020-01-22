import { BrowserRouter as Router } from 'react-router-dom';
// Browser router as the browser's history API to create real URLs.
// Use the router to render our App component. This will allow us to create the routes we need inside our App Component
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';

ReactDOM.render(
    <Router>
      <App />
    </Router>,
    document.getElementById('root')
  );


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
