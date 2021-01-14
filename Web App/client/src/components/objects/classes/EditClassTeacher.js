import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAllClass } from "../../../actions/ClassActions";
import { getTeachers } from "../../../actions/UserActions";
// import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { 
  Button, 
  Divider, 
  FormControl,
  FormHelperText, 
  MenuItem, 
  Grid, 
  Select, 
  Paper, 
  TextField, 
  Typography,
  Hidden,
  InputLabel,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  content: {
    padding: "20px",
  },
  divider: {
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "1px",
    },
  },
  editClassButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  select: {
    minWidth: "150px",
    maxWidth: "150px"
  },

}));

function EditClassTeacher(props) {
  const classes = useStyles();

  const [statusWali, setStatusWali] = React.useState(null);
  // const [selectedClass, setSelectedClass] = React.useState(null);

  const { all_teachers } = props.auth;
  const { all_classes } = props.classesCollection;
  const { getTeachers, getAllClass } = props;

  React.useEffect(() => {
    getTeachers();
    getAllClass();
  }, [])

  const selectedClasses = React.useRef({});
  const all_class_name = React.useRef({});
  // const duplicateClasses = React.useRef([]);
  React.useEffect(() => {
    if (Array.isArray(all_teachers) && (all_teachers.length !== 0) && (all_classes.length !== 0)) {
      let tempstatusWali = {};
      for (let teacher of all_teachers) {
        tempstatusWali[teacher._id] = {
          name: teacher.name,
          email: teacher.email,
          // className: null,
          classId: null
        };
      }
      for (let classInfo of all_classes) {
        tempstatusWali[classInfo.walikelas].classId = classInfo._id;
        all_class_name.current[classInfo._id] = classInfo.name;
        // tempstatusWali[classInfo.walikelas].className = classInfo.name;
        if (classInfo.walikelas) {
          selectedClasses.current[classInfo._id] = classInfo.name;
        }
      }

      setStatusWali(tempstatusWali);
    }
  }, [all_teachers, all_classes])

  function generateAllClassMenuItems() {
    let menuItems = [
      <MenuItem key="null" value={null}>(Kosong)</MenuItem>
    ];
    for (let classInfo of all_classes) {
      menuItems.push(
        <MenuItem key={classInfo._id} value={classInfo._id}>{classInfo.name}</MenuItem>
      )
    }
    return menuItems;
  }
  
  const duplicateClasses = React.useRef([]);

  function handleKelasWaliChange(event, teacherId) {
    // statusWali sudah dipastikan ada
    let oldClassId = statusWali[teacherId].classId;
    let newClassId = event.target.value;

    let wasduplicate = duplicateClasses.current.includes(oldClassId);
    let willduplicate = selectedClasses.current[newClassId];
    if (!wasduplicate && willduplicate) {
      duplicateClasses.current.push(newClassId);
      handleOpenSnackbar("error", `Kelas ${selectedClasses.current[newClassId].name} sudah memiliki kelas wali. Tiap kelas hanya boleh memiliki 1 wali kelas.`)
    } else if (wasduplicate && !willduplicate) {
      duplicateClasses.current.splice(duplicateClasses.current.indexOf(oldClassId), 1);
    } else if (wasduplicate && willduplicate) {
      handleOpenSnackbar("error", `Kelas ${selectedClasses.current[newClassId].name} sudah memiliki kelas wali. Tiap kelas hanya boleh memiliki 1 wali kelas.`)
    } else {
      if (oldClassId !== null) {
        delete selectedClasses.current[oldClassId];
        selectedClasses.current[newClassId] = all_class_name[newClassId];
      }
    }
    console.log(duplicateClasses.current);
    setStatusWali({ ...statusWali, [teacherId]: { ...statusWali[teacherId], classId: newClassId}});
  }

  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  function handleOpenSnackbar(severity, content) {
    setOpenSnackbar(true);
    setSeverity(severity);
    setSnackbarContent(content);
  }

  function handleCloseSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  }


  return (
    <div className={classes.root}>
      <Paper>
        <div className={classes.content}>
          <Typography variant="h5" gutterBottom>
            <b>Sunting Wali Kelas</b>
          </Typography>
        </div>
        <Divider />
        {/* <form noValidate onSubmit={this.onSubmit}> */}
        <div>
          {
            statusWali ? (
              Object.entries(statusWali).map((entry) => {
                let teacherId = entry[0];
                let teacherInfo = entry[1];
                let showError = duplicateClasses.current.includes(statusWali[teacherId].classId);
                return (
                  <Grid item>
                    {/* <Paper variant="outlined"> */}
                      <ListItem className={classes.listItem}>
                        <Hidden xsDown>
                          <ListItemAvatar>
                            <Avatar className={classes.assignmentLate}>
                              {/* <AssignmentIcon /> */}
                            </Avatar>
                          </ListItemAvatar>
                        </Hidden>
                        <ListItemText
                          primary={
                            <Typography variant="h6" color="textPrimary">
                              {teacherInfo.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="textSecondary">
                              {teacherInfo.email}
                            </Typography>
                          }
                        />
                        <ListItemText
                          align="right"
                          primary={
                            <TextField
                              key={teacherId}
                              select
                              label="Kelas"
                              value={statusWali[teacherId].classId}
                              onChange={(event) => { handleKelasWaliChange(event, teacherId) }}
                              error={showError}
                              helperText={showError ? "Periksa Kembali!" : null}
                              className={classes.select}
                              variant="outlined"
                            >
                              {(all_classes.length !== 0) ? (generateAllClassMenuItems()) : (null)}
                            </TextField>

                            // <FormControl variant="outlined">
                            //   <InputLabel id="kelas-label">Kelas</InputLabel>

                            //   <Select
                            //     labelId="kelas-label"
                            //     label="Kelas"
                            //     id="kelas"
                            //     value={statusWali[teacherId].classId}
                            //     onChange={(event) => { handleKelasWaliChange(event, teacherId) }}
                            //     className={classes.select}
                            //   >
                            //     {(all_classes.length !== 0) ? (generateAllClassMenuItems()) : (null)}
                            //   </Select>
                            // </FormControl>
                          }
                        />
                      </ListItem>
                    {/* </Paper> */}

                      {/* <ListItem>
                <Hidden smUp>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" color="textPrimary">
                        {row.notification_title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {row.author_name}
                      </Typography>
                    }
                  />
                </Hidden>
                <Hidden xsDown>
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <ListItemAvatar>
                      <Avatar className={classes.assignmentLate}>
                        <AnnouncementIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6" color="textPrimary">
                          {row.notification_title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="textSecondary">
                          {row.author_name}
                        </Typography>
                      }
                    />
                  </div>
                </Hidden>
                <ListItemText
                  align="right"
                  primary={
                    <Typography variant="body2" color="textSecondary">
                      {moment(row.createdAt).locale("id").format("DD MMM YYYY")}
                    </Typography>
                  }
                  secondary={
                    moment(row.createdAt).locale("id").format("HH.mm")}
                />
              </ListItem> */}

                  </Grid>
                );
              })
            ) :
              null 
          }
         

          <Divider />
          <div style={{ display: "flex", justifyContent: "flex-end" }} className={classes.content}>
            <div>
              <Button
                variant="contained"
                // type="submit"
                className={classes.editClassButton}
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>
        {/* </form> */}
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={(event, reason) => { handleCloseSnackbar(event, reason) }}>
        <MuiAlert variant="filled" severity={severity} onClose={(event, reason) => { handleCloseSnackbar(event, reason) }}>
          {snackbarContent}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

EditClassTeacher.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,

  getTeachers: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection
})

export default connect(
  mapStateToProps, { getTeachers, getAllClass }
)(EditClassTeacher);
