import React, { useState } from "react";
import NavBar from "./nav-bar/NavBar";
import SideDrawer from "./side-drawer/SideDrawer";

function Navigation(props) {
  const { showNavBar, sideDrawerExist } = props;
  // const [showNavBar, setShowNavBar] = useState(true);
  // const [sideDrawerExist, setSideDrawerExist] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);

  const handleDrawerDesktop = () => {
    setDesktopOpen(!desktopOpen);
  };

  const handleDrawerMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {showNavBar ? (
        <NavBar
          handleDrawerDesktop={handleDrawerDesktop}
          handleDrawerMobile={handleDrawerMobile}
          sideDrawerExist={sideDrawerExist}
          assessmentState={localStorage.getItem(`status`)}
        />
      ) : null}

      {sideDrawerExist && localStorage.getItem(`status`) !== "ujian" ? (
        <SideDrawer
          mobileOpen={mobileOpen}
          desktopOpen={desktopOpen}
          handleDrawerMobile={handleDrawerMobile}
        />
      ) : null}
    </>
  );
}

export default Navigation;
