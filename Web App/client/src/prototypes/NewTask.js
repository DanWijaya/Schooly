import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { Avatar, Button, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListItemIcon,
   Menu, MenuItem, Paper, Snackbar, TextField, Typography } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import AddIcon from "@material-ui/icons/Add";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from "@material-ui/icons/Publish";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1075px",
  },
  profilePicture: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  paperBox: {
    padding: "20px",
  },
  workBox: {
    margin: "auto",
    marginTop: "30px",
    justifyContent: "center",
    flexDirection: "row"
  },
  workButton: {
    width: "200px",
  },
  workResultSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function WorkFile(props) {
  const classes = useStyles();

  return(
    <ListItem>
      <ListItemAvatar>
        <Avatar src={props.file_type_icon} className={classes.profilePicture} />
      </ListItemAvatar>
      <ListItemText
        primary={props.file_name}
        secondary={props.file_type}
      />
    </ListItem>
  )
}

function CheckedWorkFilesButton() {
  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));

  const StyledMenuItem = withStyles((theme) => ({
    root: {
      '&:focus': {
        backgroundColor: "#2196f3",
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClick}
        startIcon={<AssignmentTurnedInIcon />}
        style={{color: "white", backgroundColor: "#2196f3"}}
      >
        Lihat Hasil Pengecekkan
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem>
          <ListItemAvatar>
            <Avatar src={0} />
          </ListItemAvatar>
          <ListItemText
            primary="File Name"
            secondary="File Type"
          />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <GetAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Download Semua File" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}

function NewTask(props) {
  const { user } = props.auth;
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return(
    <div className={classes.root}>
      <Grid container
        spacing={2}
        justify="space-between"
        alignItems="flex-start"
        style={{marginBottom: "30px"}}
      >
        <Paper className={classes.paperBox}>
          <Grid item
            container
            spacing={2}
            style={{width: "750px"}}
          >
            <Grid item xs={6}>
              <Typography variant="h4" >
                Task Title
              </Typography>
              <Typography variant="caption" color="textSecondary">
                <h6>Subject Name</h6>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Penanggung Jawab:
              </Typography>
            </Grid>
            <Grid item xs={6}
              container
              direction="column"
              alignItems="flex-end"
            >
              <Typography variant="overline" color="textSecondary">
                Tanggal Kumpul:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Nilai Maksimum: 100
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Deskripsi Tugas:
              </Typography>
              <Typography variant="paragraph" gutterBottom>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
                dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Berkas yang Terlampir:
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paperBox}>
          <Grid item
            container
            direction="column"
            justify="space-evenly"
            style={{width: "250px"}}
          >
            <Grid item>
              <div className={classes.workResultSection}>
                <AssignmentIcon style={{marginRight: "10px"}}/>
                <Typography variant="h5">
                  Hasil Pekerjaan
                </Typography>
              </div>
            </Grid>
            <Divider />
            <Grid item>
              <List>
                <WorkFile
                  file_type_icon={0}
                  file_name="Tugas1Kimia"
                  file_type="PDF Document"
                />
                <WorkFile
                  file_type_icon={0}
                  file_name="Tugas1Kimia"
                  file_type="PDF Document"
                />
                <WorkFile
                  file_type_icon={0}
                  file_name="Tugas1Kimia"
                  file_type="PDF Document"
                />
              </List>
            </Grid>
            <Divider />
            <Grid item container direction="column" spacing={2} className={classes.workBox}>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  className={classes.workButton}
                  style={{color: "#2196f3", backgroundColor: "white"}}
                >
                  Unggah Tugas
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<PublishIcon />}
                  onClick={handleClick}
                  className={classes.workButton}
                  style={{color: "white", backgroundColor: "#2196f3"}}
                >
                  Kumpul Tugas
                </Button>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="success">
                    File Berhasil Dikumpulkan!
                  </Alert>
                </Snackbar>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid container direction="column" alignItems="center">
        <Typography variant="subtitle1">
          Status: Sudah Diperiksa/Belum Diperiksa
        </Typography>
        <Typography variant="h4" gutterBottom>
          Hasil Penilaian: {100}
        </Typography>
        <CheckedWorkFilesButton />
      </Grid>
    </div>
  )
}

NewTask.propTypes = {
   auth: PropTypes.object.isRequired,
 }

const mapStateToProps = (state) => ({
   auth: state.auth
 });

export default connect(
   mapStateToProps
 ) (NewTask);
