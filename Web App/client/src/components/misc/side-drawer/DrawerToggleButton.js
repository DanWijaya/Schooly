import React from "react";
import "./DrawerToggleButton.css";
import { FaBars } from "react-icons/fa";

const drawerToggleButton = props => (
  <button className="toggle-button" onClick={props.click}>
    <FaBars className="menu-icon"/>
  </button>
)

export default drawerToggleButton;
