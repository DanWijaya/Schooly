import React, {useState} from "react"
import NavBar from "./nav-bar/NavBar"
import SideDrawer from "./side-drawer/SideDrawer"

function Navigation(props) {
  const {showNavBar, sideDrawerExist } = props;

  const [desktopOpen, setDesktopOpen] = useState(false);
  const handleDrawerDesktop = () => {
      setDesktopOpen(!desktopOpen);
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerMobile = () => {
      setMobileOpen(!mobileOpen);
  }

  return (
    <div>
      {showNavBar ?
        <NavBar
          handleDrawerDesktop={handleDrawerDesktop}
          handleDrawerMobile={handleDrawerMobile}
          sideDrawerExist={sideDrawerExist}
          assessmentState={localStorage.getItem(`status`)}
        />
      : null }
      {sideDrawerExist && localStorage.getItem(`status`) !== "ujian" ?
        <SideDrawer
          mobileOpen={mobileOpen}
          desktopOpen={desktopOpen}
          handleDrawerMobile={handleDrawerMobile}
        />
      : null}
    </div>
  )
}

export default Navigation;
