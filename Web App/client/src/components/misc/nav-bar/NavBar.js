import React, { Component } from 'react'
import DrawerToggleButton from '../side-drawer/DrawerToggleButton.js';
import '../side-drawer/DrawerToggleButton';
import './NavBar.css'
import logo from '../../../logos/Schooly Logo.png';
import PropTypes from "prop-types";
import {AppBar, Toolbar, Typography, CssBaseline, Box, Container } from "@material-ui/core";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";

function ElevationScroll(props) {
      const { children } = props;
      const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
      });

      return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
      });
}

ElevationScroll.propTypes = {
      children: PropTypes.element.isRequired,
};

function NavBar(props){
  return(
      <React.Fragment>
        <CssBaseline />
          <ElevationScroll {...props}>
            <AppBar>
              <Toolbar>
                <nav className="navbar-light NavBar__navigation">
                <div>
                    <DrawerToggleButton click={props.drawerClickHandler} />
                </div>
                <div className="NavBar__logo">
                  <a href="/"><img src={logo} className="logo"/></a>
                </div>
                <div className="spacer" />
                <div className="NavBar_navigation-items">
                     <ul>
                      <li>
                        <a href="/profile"> Profile </a>
                       </li>
                      <li>
                      <a href="/about-schooly">About </a>
                      </li>
                    </ul>
                </div>
                </nav>
              </Toolbar>
            </AppBar>
          </ElevationScroll>
          <Toolbar />
      </React.Fragment>
  );
}

export default NavBar;
