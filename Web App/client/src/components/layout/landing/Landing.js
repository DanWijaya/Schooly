import React, { Component } from "react";
import { Link } from "react-router-dom";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import "./Landing.css";
import { Button } from "@material-ui/core";

class Landing extends Component {
  render() {
    document.title="Schooly"
    return (
      <div>
        <center>
        <img
          alt="SchoolyLogoLanding"
          src={schoolyLogo}
          className="SchoolyLogo"
        />
          <br/><br/>
        <h4>Schooly makes school work easy!</h4>
          <br/><br/>

        <Link to="/daftar">
          <Button
            variant="contained"
            size="large"
            style={{
              backgroundColor: "#2196f3",
              fontSize: "12",
              color: "white",
              width: "120px",
              height: "40px",
            }}
          >
            Daftar
          </Button>
        </Link>
          <br/><br/>
        <Link to="/masuk">
          <Button
            variant="contained"
            size="large"
            style={{
              backgroundColor: "black",
              color: "white",
              width: "120px",
              height: "40px",
            }}
          >
            Masuk
          </Button>
        </Link>

        </center>
      </div>
    );
  }
}

export default Landing;
