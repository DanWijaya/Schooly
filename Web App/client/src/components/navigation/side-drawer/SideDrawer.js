import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import DrawerContent from "./DrawerContent";
import { Drawer, Toolbar } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: "250px",
  },
  drawerDesktop: {
    width: "250px",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerDesktopOpen: {
    width: "250px",
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerDesktopClose: {
    width: "70px",
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

function SideDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { desktopOpen, mobileOpen, mobileView, handleDrawerMobile } = props;
  const { user } = props.auth;

  if (user._id !== undefined) {
    return (
      mobileView ? (
        <Drawer
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={handleDrawerMobile}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <DrawerContent
            user={user}
            handleDrawerMobile={handleDrawerMobile}
          />
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          className={clsx(classes.drawerDesktop, {
            [classes.drawerDesktopOpen]: desktopOpen,
            [classes.drawerDesktopClose]: !desktopOpen,
          })}
          classes={{
            paper: clsx({
              [classes.drawerDesktopOpen]: desktopOpen,
              [classes.drawerDesktopClose]: !desktopOpen,
            }),
          }}
        >
          <Toolbar />
          <DrawerContent user={user} />
        </Drawer>
      )
    );
  } else {
    return null;
  }
}

SideDrawer.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(React.memo(SideDrawer));
