import React, { Component } from "react";
import {Link} from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from './Routes';

import "./App.css";

function App() {
    return (
      <div className="App container">
        <Routes /> 
      </div>
      );
}

export default App;