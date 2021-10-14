import React, { useState } from "react";
import NavBar from "./nav-bar/NavBar";
import SideDrawer from "./side-drawer/SideDrawer";
import { useMediaQuery } from "@material-ui/core";


function Navigation(props) {
  const { showNavBar, sideDrawerExist } = props;

  const mobileView = useMediaQuery("(max-width:1280px)");

  const [desktopOpen, setDesktopOpen] = useState(false);
  const handleDrawerDesktop = () => {
    setDesktopOpen(!desktopOpen);
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <React.Fragment>
      {showNavBar ? (
        <NavBar
          handleDrawerDesktop={handleDrawerDesktop}
          handleDrawerMobile={handleDrawerMobile}
          sideDrawerExist={sideDrawerExist}
          mobileView={mobileView}
          assessmentState={localStorage.getItem(`status`)}
        />
      ) : null}
      {sideDrawerExist && localStorage.getItem(`status`) !== "ujian" ? (
        <SideDrawer
          desktopOpen={desktopOpen}
          mobileOpen={mobileOpen}
          mobileView={mobileView}
          handleDrawerMobile={handleDrawerMobile}
        />
      ) : null}
    </React.Fragment>
  );
}

export default Navigation;
