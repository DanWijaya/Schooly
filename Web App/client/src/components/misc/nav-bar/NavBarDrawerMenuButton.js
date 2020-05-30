import React from "react"
import { IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

function NavBarDrawerMenuButton(props){
  const { mobileView , handleDrawerDesktop, 
    handleDrawerMobile, iconButtonClass } = props;

  if(mobileView){
    return(
      <IconButton
        edge="start"
        color="inherit"
        className={iconButtonClass}
        onClick={handleDrawerMobile}
      >
        <MenuIcon />
      </IconButton>
    )
  }
  else{
    return(
      <IconButton
        edge="start"
        color="inherit"
        className={iconButtonClass}
        onClick={handleDrawerDesktop}
      >
        <MenuIcon />
      </IconButton>
    )
  }
};

export default NavBarDrawerMenuButton;
