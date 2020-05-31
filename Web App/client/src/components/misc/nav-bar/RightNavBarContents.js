import React from "react"
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { logoutUser } from "../../../actions/AuthActions";
import LightTooltip from "../light-tooltip/LightTooltip";
import { AppBar, Avatar, Badge, Button, CssBaseline, Grid, IconButton, Link,
   ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, useMediaQuery } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HelpIcon from "@material-ui/icons/Help";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
    iconButton: {
      "&:focus": {
        backgroundColor: "transparent",
      },
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    profileMenuItem: {
      "&:hover": {
        backgroundColor: "#2196f3",
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

function RightNavBarContents(props) {
    const classes = useStyles();
    const { isMobileView, logoutUser} = props;
    const {user } = props.auth;
    const history = useHistory()

    // Menu items in Mobile
    const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null);
    const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
    };
    const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
    }

    const handleMenuClose = () => {
    setProfileAnchorEl(null);
    handleMobileMenuClose();
    };
    const mobileMenuId = 'primary-search-account-menu-mobile';

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
    logoutUser(history);
    }

    const renderProfileMenu = (
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
        <MenuItem className={classes.profileMenuItem} button component="a" href="/profil">
            <ListItemIcon >
            <AccountCircleIcon fontSize="medium"/>
            </ListItemIcon>
            <ListItemText primary="Profil Saya" />
        </MenuItem>
        <MenuItem className={classes.profileMenuItem} onClick={onLogoutClick}>
            <ListItemIcon>
            <ExitToAppIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Keluar" />
        </MenuItem>
        </Menu>
    )

    // Desktop Menu (will rendered when in desktop mode / width >= 600px)
    const renderDesktopMenu = (
        <Grid container className={classes.navbarContainedRightItems}>
        <LightTooltip title={user.name}>
        <IconButton onClick={handleProfileMenu} className={classes.iconButton}>
            <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.navbarProfilePicture} />
        </IconButton>
        </LightTooltip>
    {renderProfileMenu}
        <LightTooltip title="Notifikasi">
        <IconButton color="inherit" href="/notifikasi" className={classes.iconButton}>
            <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
            </Badge>
        </IconButton>
        </LightTooltip>
        <LightTooltip title="Bantuan">
        <IconButton color="inherit" href="/support" className={classes.iconButton}>
            <HelpIcon />
        </IconButton>
        </LightTooltip>
    </Grid>
    )

    // Mobile menu (will rendered when in mobile mode / width < 600px)
    const renderMobileMenu = (
        <Grid container className={classes.navbarContainedRightItems}>
        <IconButton
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
            className={classes.iconButton}
        >
            <MoreIcon />
        </IconButton>
        <Menu
        anchorEl={mobileAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileMenuClose}
        >
        <MenuItem button  component="a" href="/notifikasi">
            <IconButton color="inherit">
            <Badge badgeContent={11} color="secondary">
                <NotificationsIcon />
            </Badge>
            </IconButton>
            <p>Notifikasi</p>
        </MenuItem>

        <MenuItem button  component="a" href="/support">
            <IconButton color="inherit">
            <HelpIcon />
            </IconButton>
            <p>Bantuan</p>
        </MenuItem>

        <MenuItem onClick={handleProfileMenu}>
            <IconButton className={classes.iconButton}>
            <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.navbarProfilePicture} />
            </IconButton>
            <p>Akun saya</p>
        </MenuItem>
        </Menu>
        {renderProfileMenu}
        </Grid>
    )

    if(isMobileView){
        return renderMobileMenu
    } else {
        return renderDesktopMenu
    }
}

RightNavBarContents.propTypes = {
    auth: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
  }
 
 const mapStateToProps = (state) => ({
    auth: state.auth,
  });
 
 export default connect(
    mapStateToProps, { logoutUser }
  ) (RightNavBarContents);

