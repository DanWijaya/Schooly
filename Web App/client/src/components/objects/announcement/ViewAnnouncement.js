import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LightToolTip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Fab, Grid, IconButton, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  paper: {
    padding: "30px",
  },
  listItemPaper: {
    marginBottom: "10px"
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  editAnnouncementButton: {
    marginBottom: "10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteAnnouncementButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
}));

function LampiranFile(props) {
  const classes = useStyles();
  return (
    <Grid item xs={6}>
      <Paper variant="outlined" className={classes.listItemPaper}>
        <ListItem button disableRipple className={classes.listItem}
        >
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText
            primary="Nama File"
            secondary="Jenis File"
          />
          <ListItemIcon>
            <IconButton>
              <CloudDownloadIcon />
            </IconButton>
          </ListItemIcon>
        </ListItem>
      </Paper>
    </Grid>
  )
}

function ViewAnnouncement(props) {
  document.title = "Schooly | Lihat Pengumuman"

  const classes = useStyles();
  const { user } = props.auth;

  return(
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={3}>
          <Grid item container direction="row">
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText
              primary="Title"
              secondary="sender name"
            />
            <ListItemText
              align="right"
              primary="Date Announced"
            />
          </Grid>
          <Grid item>
            <Typography variant="h6" color="primary" gutterBottom>
              Deskripsi:
            </Typography>
            <Typography variant="body1">
              Isi pengumuman bla bla bla bla bla bla
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="primary" gutterBottom>
              Lampiran Berkas:
            </Typography>
            <Grid item container spacing={1}>
              <LampiranFile />
              <LampiranFile />
              <LampiranFile />
              <LampiranFile />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      { user.role === "Teacher" ?
          <div style={{marginLeft: "20px"}}>
            <Link to="/sunting-pengumuman">
              <LightToolTip title="Sunting Pengumuman" placement="right">
                <Fab className={classes.editAnnouncementButton}>
                  <EditIcon />
                </Fab>
              </LightToolTip>
            </Link>
            <LightToolTip title="Hapus Pengumuman" placement="right">
              <Fab className={classes.deleteAnnouncementButton}>
                <DeleteIcon />
              </Fab>
            </LightToolTip>
          </div>
      : null
    }
    </div>
  )
}

ViewAnnouncement.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps
) (ViewAnnouncement);
