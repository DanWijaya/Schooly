import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { logoutUser } from "../../../actions/UserActions";
import { getFileAvatar } from "../../../actions/files/FileAvatarActions";

import LightTooltip from "../light-tooltip/LightTooltip";
import {
  Avatar,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HelpIcon from "@material-ui/icons/Help";
import MoreIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  menuItem: {
    "& .MuiListItemText-primary": {
      color: "black",
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
  navbarContents: {
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

  const { isMobileView, logoutUser, getFileAvatar } = props;
  const { user } = props.auth;
  const [avatar, setAvatar] = React.useState(avatar)

  console.log(user)
  React.useEffect(() => {
    let id = user._id ? user._id : user._id
    getFileAvatar(id)
      .then((result) => {
        console.log(result)
        setAvatar(result)
      })
      .catch((err) => console.log(err))
  },[user.avatar] )
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

  // Logout Click
  const onLogoutClick = (e) => {
    e.preventDefault();
    handleProfileMenuClose();
    logoutUser();
  };

  // Desktop Menu (will rendered when in desktop mode / width >= 600px)
  const renderDesktopMenu = (
    <Grid container className={classes.navbarContents}>
      <LightTooltip title={user.name}>
        <IconButton onClick={handleProfileMenu}>
          <Avatar src={avatar} className={classes.navbarProfilePicture} />
        </IconButton>
      </LightTooltip>
      <Menu
        keepMounted
        anchorEl={profileAnchorEl}
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
        <Link to="/profil" onClick={handleProfileMenuClose}>
          <MenuItem className={classes.menuItem}>
            <ListItemIcon>
              <Avatar src={avatar} className={classes.navbarProfilePicture} />
            </ListItemIcon>
            <ListItemText primary="Profil Saya" />
          </MenuItem>
        </Link>
        <MenuItem onClick={onLogoutClick} className={classes.menuItem}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText primary="Keluar" />
        </MenuItem>
      </Menu>
      <LightTooltip title="Bantuan">
        <Link to="/bantuan">
          <IconButton color="white" style={{ color: "white" }}>
            <HelpIcon />
          </IconButton>
        </Link>
      </LightTooltip>
    </Grid>
  );

  // Mobile menu (will rendered when in mobile mode / width < 600px)
  const renderMobileMenu = (
    <Grid container className={classes.navbarContents}>
      <IconButton edge="end" color="inherit" onClick={handleMobileMenuOpen}>
        <MoreIcon />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={mobileAnchorEl}
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Link to="/profil" onClick={handleMobileMenuClose}>
          <MenuItem className={classes.menuItem}>
            <ListItemIcon>
              <Avatar src={avatar} className={classes.navbarProfilePicture} />
            </ListItemIcon>
            <ListItemText primary="Profil Saya" />
          </MenuItem>
        </Link>
        <Link to="/bantuan">
          <MenuItem className={classes.menuItem}>
            <ListItemIcon>
              <HelpIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Bantuan" />
          </MenuItem>
        </Link>
        <MenuItem onClick={onLogoutClick} className={classes.menuItem}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText primary="Keluar" />
        </MenuItem>
      </Menu>
    </Grid>
  );

  if (isMobileView) {
    return renderMobileMenu;
  } else {
    return renderDesktopMenu;
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
  mapStateToProps, { logoutUser, getFileAvatar }
) (NavBarLoggedInContents);
