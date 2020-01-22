import React from "react";
import "./Home.css";
import logo from "./images/Schooly_logo.png";

function Home() {
  return (
    <div className="Home">
      {/* <div className="lander"> */}
        <img src={logo} alt="logo" className="schooly"/>
      {/* </div> */}
    </div>
  );
}

export default Home;