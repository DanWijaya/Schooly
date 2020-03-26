import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../../logos/Schooly Logo.png";
import './Landing.css';
import Grid from '@material-ui/core/Grid';

class Landing extends Component {
  render() {
    document.title="Schooly - Home"
    return (
      <div>
        <center>
        <div>
          <img src={logo} className="schooly-logo"/>
          <br/>
          <h4>Logonya nda rusak itu diganti jadi warna putih</h4>
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
        </div>

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
        </center>
      </div>
    );
  }
}

export default Landing;
