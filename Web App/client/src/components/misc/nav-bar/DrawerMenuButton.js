import React from "react"
import MenuIcon from "@material-ui/icons/Menu";
import { IconButton } from "@material-ui/core";

function DrawerMenuButton(props){
  const {mobileView} = props;
  const {handleDrawerOpen} = props;
  const {handleDrawerToggle} = props;
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

export default DrawerMenuButton;
