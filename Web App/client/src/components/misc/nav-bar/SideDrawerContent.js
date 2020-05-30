import React from "react"
import clsx from "clsx";

import PropTypes from "prop-types";
import { Divider, Drawer, Grid, Hidden, IconButton, Link,
   List, ListItem, ListItemIcon, ListItemText, Toolbar } from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import AboutIcon from "@material-ui/icons/Info";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssessmentIcon from "@material-ui/icons/AssessmentOutlined";
import ClassIcon from "@material-ui/icons/Class";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";

import { useStyles } from "./NavBar"

function DrawerItemList(props) {
    return <ListItem button component="a" {...props} />;
  }

function SideDrawerContent(props) {
    
    const classes = useStyles();
    const theme = useTheme();
    const { mobileOpen , handleDrawerToggle ,
      desktopOpen , window, userLoggedIn  } = props

    const container = window !== undefined ? () => window().document.body : undefined;

    if(userLoggedIn != undefined) {
        return (
        <div className={classes.drawerX}>
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
          <Toolbar />
          <List>
            <DrawerItemList href="/dashboard">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Beranda" />
            </DrawerItemList>
            <DrawerItemList href="/viewclass">
                <ListItemIcon>
                  <ClassIcon />
                </ListItemIcon>
                <ListItemText primary="Kelas" />
            </DrawerItemList>
            <DrawerItemList href="/announcements">
                <ListItemIcon>
                  <AnnouncementIcon />
                </ListItemIcon>
                <ListItemText primary="Pengumuman" />
            </DrawerItemList>
            <DrawerItemList href="/viewtask">
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Tugas" />
            </DrawerItemList>
            <DrawerItemList href="/assessments" disabled>
                <ListItemIcon>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText primary="Kuis dan Ujian" />
            </DrawerItemList>
          </List>
          <Divider />
          <List>
            <DrawerItemList href="/tentang-schooly">
                <ListItemIcon>
                  <AboutIcon />
                </ListItemIcon>
                <ListItemText primary="Tentang Schooly" />
            </DrawerItemList>
          </List>
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: desktopOpen,
              [classes.drawerClose]: !desktopOpen,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: desktopOpen,
                [classes.drawerClose]: !desktopOpen,
              }),
            }}
          >
            <Toolbar />
            <List>
              <DrawerItemList href="/dashboard">
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Beranda" />
              </DrawerItemList>
              <DrawerItemList href="/viewclass">
                  <ListItemIcon>
                    <ClassIcon />
                  </ListItemIcon>
                  <ListItemText primary="Kelas" />
              </DrawerItemList>
              <DrawerItemList href="/announcements">
                  <ListItemIcon>
                    <AnnouncementIcon />
                  </ListItemIcon>
                  <ListItemText primary="Pengumuman" />
              </DrawerItemList>
              <DrawerItemList href="/viewtask">
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tugas" />
              </DrawerItemList>
              <DrawerItemList href="/assessments" disabled>
                  <ListItemIcon>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Kuis dan Ujian" />
              </DrawerItemList>
            </List>
            <Divider />
            <List>
              <DrawerItemList href="/tentang-schooly">
                  <ListItemIcon>
                    <AboutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tentang Schooly" />
              </DrawerItemList>
            </List>
          </Drawer>
        </Hidden>
        </div>
        )
    }

    else {
        return (
            <div style={{display: 'none'}}></div>
        )
    }
}

export default SideDrawerContent;