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
        <img src={schoolyLogo} className="SchoolyLogo"/>
          <br/><br/>
        <h4>Schooly makes school work easy!</h4>
          <br/><br/>
        <Button
          href="/register"
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
          Register
        </Button>
          <br/><br/>
        <Button
          href="/login"
          variant="contained"
          size="large"
          style={{
            backgroundColor: "black",
            color: "white",
            width: "120px",
            height: "40px",
          }}
        >
          Log In
        </Button>
        </center>
      </div>
    );
  }
}

export default Landing;
