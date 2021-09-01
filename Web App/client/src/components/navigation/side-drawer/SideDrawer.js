import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import DrawerContent from "./DrawerContent";
import {
  Drawer,
  Hidden,
  Toolbar,
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: "240px",
  },
  drawerDesktop: {
    width: "240px",
    flexShrink: 0,
  },
  drawerDesktopOpen: {
    width: "240px",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerDesktopClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: "70px",
  },
  drawerListItemIcon: {
    width: "22.5px",
    height: "22.5px",
  },
}));

function SideDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { desktopOpen, mobileOpen, handleDrawerMobile } = props;
  const { user } = props.auth;

  const isMobileView = useMediaQuery("(max-width:960px)");

  if (user.name !== undefined) {
    return (
      <div>
        <Hidden mdUp implementation="css">
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
        </Hidden>
        <Hidden smDown implementation="css">
          {isMobileView ? null : 
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
          }
        </Hidden>
      </div>
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
