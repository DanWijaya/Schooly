import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../../actions/UserActions";
import { getFileAvatar } from "../../../actions/files/FileAvatarActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  useMediaQuery
} from "@material-ui/core";
import {
  ExitToApp as ExitToAppIcon,
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  Menu as MenuIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: "0 1px 6px 0px rgba(32,33,36,0.28), 0px 1px 10px 0px rgb(0,0,0,0.12)",
  },
  startButtonContainer: {
    flex: "1",
  },
  endButtonContainer: {
    flex: "1",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  schoolyLogo: {
    width: "100px",
    height: "50px",
  },
  signupButton: {
    width: "75px",
    height: "30px",
    marginRight: "15px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  loginButton: {
    width: "75px",
    height: "30px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  menuProfilePicture: {
    width: "25px",
    height: "25px",
  },
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
}));

function NavBar(props) {
  const classes = useStyles();
  const { handleDrawerDesktop, handleDrawerMobile, sideDrawerExist, mobileView, logoutUser, getFileAvatar } = props;
  const { user } = props.auth;

  const mobileMenu = useMediaQuery("(max-width:600px)");

  const [avatar, setAvatar] = React.useState(null);
  React.useEffect(() => {
    getFileAvatar(user._id)
      .then((result) => {
        setAvatar(result);
      })
  }, [user._id]);

  const onLogoutClick = (e) => {
    e.preventDefault();
    handleProfileMenuClose();
    logoutUser();
  };

  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
  const handleProfileMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const NavbarDesktopMenu = (
    <div className={classes.endButtonContainer}>
      <LightTooltip title={user.name}>
        <IconButton onClick={handleProfileMenu}>
          <Avatar src={avatar} className={classes.menuProfilePicture} />
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
              <Avatar src={avatar} className={classes.menuProfilePicture} />
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
    </div>
  );

  const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null);
  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const NavbarMobileMenu = (
    <div className={classes.endButtonContainer}>
      <IconButton edge="end" color="inherit" onClick={handleMobileMenuOpen}>
        <ExpandMoreIcon />
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
              <Avatar src={avatar} className={classes.menuProfilePicture} />
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
    </div>
  );

  return (
    <AppBar position="fixed" className={classes.root}>
      {props.assessmentState !== "ujian" ? (
          user._id ? (
            <Toolbar>
              <div
                className={classes.startButtonContainer}
                style={{ display: !sideDrawerExist ? "none" : "block" }}
              >
                {mobileView ? (
                  <IconButton edge="start" color="inherit" onClick={handleDrawerMobile}>
                    <MenuIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleDrawerDesktop}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </div>
              <Link to="/beranda">
                <img
                  alt="Schooly Logo"
                  src={schoolyLogo}
                  className={classes.schoolyLogo}
                />
              </Link>
              {mobileMenu ? NavbarMobileMenu : NavbarDesktopMenu}
            </Toolbar>
          ) : (
            <Toolbar>
              <div className={classes.startButtonContainer}>
                <Link to="/">
                  <img
                    alt="Schooly Logo"
                    src={schoolyLogo}
                    className={classes.schoolyLogo}
                  />
                </Link>
              </div>
              <div>
                <Link to="/daftar">
                  <Button
                    variant="contained"
                    size="small"
                    className={classes.signupButton}
                  >
                    Daftar
                  </Button>
                </Link>
                <Link to="/masuk">
                  <Button
                    variant="contained"
                    size="small"
                    className={classes.loginButton}
                  >
                    Masuk
                  </Button>
                </Link>
              </div>
            </Toolbar>
          )
      ) : (
        <Toolbar>
          <img
            alt="SchoolyLogoNavBar"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </Toolbar>
      )}
    </AppBar>
  );
}

NavBar.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser, getFileAvatar })(React.memo(NavBar));
