import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "./Schooly_logo.png";
import './landing.css';
import Grid from '@material-ui/core/Grid';
import SideDrawer from '../../misc/sideDrawer/sideDrawer';

class Landing extends Component {
  render() {
    document.title="Schooly - Home"
    return (
      <center>
        <div>
        <br/><br/><br/><br/>
        <img src={logo} className="schooly_logo"/>
        <br/>
        <br/>
          <h4>Schooly makes school work easy!</h4>
          <br className="spacing"/>
            <div className="col s6">
              <Link
                to="/register"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Register
              </Link>
            </div>
            <br/>
            <div className="col s6">
              <Link
                to="/login"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect black white-text"
              >
                Log In
              </Link>
        </div>

      </div>
      </center>
    );
  }
}

export default Landing;
