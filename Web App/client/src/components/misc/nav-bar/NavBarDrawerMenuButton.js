import React from "react"
import { IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

function NavBarDrawerMenuButton(props){
  const { mobileView } = props;
  const { handleDrawerOpen } = props;
  const { handleDrawerToggle } = props;
  const { iconButtonClass } = props;

  if(mobileView){
    return(
      <IconButton
        color="inherit"
        edge="start"
        className={iconButtonClass}
        onClick={handleDrawerToggle}
      >
        <MenuIcon />
      </IconButton>
    )
  }
  else{
    return(
      <IconButton
        color="inherit"
        edge="start"
        className={iconButtonClass}
        onClick={handleDrawerOpen}
      >
        <MenuIcon />
      </IconButton>
    )
  }
};

export default NavBarDrawerMenuButton;
