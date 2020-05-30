import React from "react"

function DrawerMenuButton(props){
  return(
    <IconButton
      color="inherit"
      edge="start"
      className={classes.iconButton}
      onClick={handleDrawerOpen}
    >
      <MenuIcon />
    </IconButton>
  )
};

export default DrawerMenuButton;
