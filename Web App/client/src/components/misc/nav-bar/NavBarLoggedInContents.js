import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { logoutUser } from "../../../actions/UserActions";
import LightTooltip from "../light-tooltip/LightTooltip";
import { Avatar, Badge, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  menuItem: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
  navbarContainedRightItems: {
    flex: "1",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  navbarProfilePicture: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

function NavBarLoggedInContents(props) {
  const classes = useStyles();

  const { isMobileView, logoutUser } = props;
  const { user } = props.auth;
  const history = useHistory()

  // Menu items in Mobile
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null);
  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  //Profile Menu
  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
  const handleProfileMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };
  const onLogoutClick = (e) => {
    e.preventDefault();
    handleProfileMenuClose()
    logoutUser();
  };

  // Desktop Menu (will rendered when in desktop mode / width >= 600px)
  const renderDesktopMenu = (
    <Grid container className={classes.navbarContainedRightItems}>
      <LightTooltip title={user.name}>
        <IconButton onClick={handleProfileMenu}>
            <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.navbarProfilePicture} />
        </IconButton>
      </LightTooltip>
      <Menu
        anchorEl={profileAnchorEl}
        keepMounted
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
      >
          <MenuItem className={classes.menuItem} button component="a" href="/profil">
            <ListItemIcon>
              <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.navbarProfilePicture} />
            </ListItemIcon>
            <ListItemText primary="Profil Saya" />
          </MenuItem>
          <MenuItem className={classes.menuItem} onClick={onLogoutClick}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Keluar" />
          </MenuItem>
      </Menu>
    </Grid>
  )

  // Mobile menu (will rendered when in mobile mode / width < 600px)
  const renderMobileMenu = (
    <Grid container className={classes.navbarContainedRightItems}>
      <IconButton
        edge="end"
        color="inherit"
        onClick={handleMobileMenuOpen}
      >
        <MoreIcon />
      </IconButton>
      <Menu
        anchorEl={mobileAnchorEl}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
        keepMounted
        transformOrigin={{vertical: "top", horizontal: "right"}}
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileMenuClose}
      >
          <MenuItem className={classes.menuItem} button component="a" href="/profil">
            <ListItemIcon>
              <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.navbarProfilePicture} />
            </ListItemIcon>
            <ListItemText primary="Profil Saya" />
          </MenuItem>
          <MenuItem className={classes.menuItem} onClick={onLogoutClick}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Keluar" />
          </MenuItem>
      </Menu>
    </Grid>
  )

  if(isMobileView){
      return renderMobileMenu
  }
  else {
      return renderDesktopMenu
  }
}

NavBarLoggedInContents.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps, { logoutUser }
) (NavBarLoggedInContents);
