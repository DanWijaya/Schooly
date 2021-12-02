import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getAllClass,
  setHomeroomTeachers,
} from "../../../actions/ClassActions";
import { getTeachers } from "../../../actions/UserActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import {
  AppBar,
  Avatar,
  Button,
  Divider,
  Grid,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { Close as CloseIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "85%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  background: {
    backgroundColor: "#F9F9F9",
    minHeight: "100%",
  },
  menuBar: {
    zIndex: theme.zIndex.drawer + 1,
    padding: "15px 20px",
    boxShadow: "0 1px 6px 0px rgba(32,33,36,0.28)",
    backgroundColor: "white",
    color: "black",
  },
  editButton: {
    width: "90px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      boxShadow: "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
  },
  closeButton: {
    width: "32px",
    height: "32px",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
  contentDetails: {
    padding: "20px 20px 25px 20px",
  },
  classSelect: {
    width: "150px",
    [theme.breakpoints.down("xs")]: {
      width: "100px",
    },
  },
}));

function EditHomeroomTeacher(props) {
  const classes = useStyles();
  const { all_teachers, user } = props.auth;
  const { all_classes } = props.classesCollection;
  const { getTeachers, getAllClass } = props;

  React.useEffect(() => {
    getTeachers(user.unit);
    getAllClass(user.unit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [statusWali, setStatusWali] = React.useState(null);
  const [statusKelas, setStatusKelas] = React.useState(null);

  const all_classes_wali = React.useRef({});

  React.useEffect(() => {
    if (
      Array.isArray(all_teachers) &&
      all_teachers.length !== 0 &&
      all_classes.length !== 0
    ) {
      let tempstatusWali = {};
      for (let teacher of all_teachers) {
        tempstatusWali[teacher._id] = {
          name: teacher.name,
          email: teacher.email,
          avatar: teacher.avatar,
          classId: null,
        };
      }
      console.log(tempstatusWali);
      let tempstatusKelas = {};
      for (let classInfo of all_classes) {
        if (classInfo.walikelas) {
          tempstatusWali[classInfo.walikelas].classId = classInfo._id;
          tempstatusKelas[classInfo._id] = [classInfo.walikelas];
        } else {
          tempstatusKelas[classInfo._id] = [];
        }
        all_classes_wali.current[classInfo._id] = classInfo.walikelas;
      }
      console.log(tempstatusKelas);
      setStatusKelas(tempstatusKelas);
      setStatusWali(tempstatusWali);
    }
  }, [all_teachers, all_classes]);

  function generateAllClassMenuItems() {
    let menuItems = [
      <MenuItem key="null" value={null}>
        <em>Kosong</em>
      </MenuItem>,
    ];
    for (let classInfo of all_classes) {
      menuItems.push(
        <MenuItem key={classInfo._id} value={classInfo._id}>
          {classInfo.name}
        </MenuItem>
      );
    }
    return menuItems;
  }

  function handleKelasWaliChange(event, teacherId) {
    // Homeroom status of a teacher is being made sure exist.
    let oldClassId = statusWali[teacherId].classId;
    let newClassId = event.target.value;

    let tempStatusKelas = { ...statusKelas };

    if (newClassId) {
      let targetArray = [...tempStatusKelas[newClassId]];
      targetArray.push(teacherId);
      tempStatusKelas[newClassId] = targetArray;
    }

    if (oldClassId) {
      let prevArray = [...tempStatusKelas[oldClassId]];
      prevArray.splice(prevArray.indexOf(teacherId), 1);
      tempStatusKelas[oldClassId] = prevArray;
    }

    setStatusKelas(tempStatusKelas);
    setStatusWali({
      ...statusWali,
      [teacherId]: { ...statusWali[teacherId], classId: newClassId },
    });
  }

  function handleSubmit() {
    let classToUpdate = {};

    for (let entry of Object.entries(statusKelas)) {
      let classId = entry[0];
      let teacherIdArray = entry[1];

      if (teacherIdArray.length > 1) {
        // If there is two class or more that is assigned with the same homeroom teacher, submission will be canceled.
        handleOpenSnackbar(
          "error",
          "Tidak boleh ada kelas yang memiliki lebih dari 1 wali kelas"
        );
        return;
      } else {
        let waliSebelum = all_classes_wali.current[classId];
        let waliSesudah =
          teacherIdArray.length === 0 ? null : teacherIdArray[0];
        if (waliSebelum !== waliSesudah) {
          classToUpdate[classId] = waliSesudah;
          // The value can be null.
          // If it is null, homeroom teacher field of this class will be deleted.
        }
      }
    }

    if (Object.keys(classToUpdate).length !== 0) {
      setOpenUploadDialog(true);
      setHomeroomTeachers(classToUpdate)
        .then(() => {
          setSuccess(true);
          // handleOpenSnackbar("success", "Pengubahan wali kelas berhasil dilakukan");
        })
        .catch((err) => {
          setOpenUploadDialog(false);
          handleOpenSnackbar("error", "Pengubahan wali kelas gagal dilakukan");
        });
    } else {
      setOpenUploadDialog(true);
      setSuccess(true);
      // handleOpenSnackbar("info", "Tidak ada wali kelas yang diubah");
    }
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

  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const [success, setSuccess] = React.useState(false);

  // handleOpenUploadDialog = () => {
  //   setOpenUploadDialog(true);
  // }

  // handleCloseUploadDialog = () => {
  //   setOpenUploadDialog(false);
  // }

  function handleOpenDeleteDialog() {
    setOpenDeleteDialog(true);
  }

  function handleCloseDeleteDialog() {
    setOpenDeleteDialog(false);
  }

  document.title = "Schooly | Sunting Data Wali Kelas";

  return (
    <div className={classes.background}>
        <div className={classes.root}>
        <AppBar position="fixed" className={classes.menuBar}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item xs>
              <Typography variant="h6" color="textSecondary">
                Wali Kelas
              </Typography>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Button onClick={handleSubmit} className={classes.editButton}>
                    Sunting
                  </Button>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={handleOpenDeleteDialog}
                    className={classes.closeButton}
                  >
                    <CloseIcon style={{ fontSize: "24px" }} />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AppBar>
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Paper>
            <div className={classes.contentDetails}>
              <Typography variant="h5" gutterBottom>
                Sunting Data Wali Kelas
              </Typography>
              <Typography color="textSecondary">
                Atur wali kelas yang ada secara sekaligus.
              </Typography>
            </div>
            <Divider />
            <List>
              {statusKelas && statusWali
                ? Object.entries(statusWali).map((entry) => {
                    let teacherId = entry[0];
                    let teacherInfo = entry[1];
                    let showError = false;
                    if (teacherInfo["classId"]) {
                      showError = statusKelas[teacherInfo["classId"]].length > 1;
                    }

                    return (
                      <ListItem>
                        <Hidden xsDown>
                          <ListItemAvatar>
                            {!teacherInfo.avatar ? (
                              <Avatar />
                            ) : (
                              <Avatar
                                src={`/api/upload/avatar/${teacherInfo.avatar}`}
                              />
                            )}
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
                        <TextField
                          select
                          label="Kelas"
                          key={teacherId}
                          value={statusWali[teacherId].classId}
                          onChange={(event) => handleKelasWaliChange(event, teacherId)}
                          error={showError}
                          helperText={showError ? "Periksa Kembali!" : null}
                          className={classes.classSelect}
                          variant="outlined"
                        >
                          {all_classes.length !== 0
                            ? generateAllClassMenuItems()
                            : null}
                        </TextField>
                      </ListItem>
                    );
                  })
                : null}
            </List>
          </Paper>
        </div>
        <UploadDialog
          openUploadDialog={openUploadDialog}
          success={success}
          messageUploading="Pengaturan Wali Kelas sedang disimpan"
          messageSuccess="Pengaturan Wali Kelas berhasil disimpan"
          redirectLink="/daftar-kelas"
        />
        <DeleteDialog
          openDeleteDialog={openDeleteDialog}
          handleCloseDeleteDialog={handleCloseDeleteDialog}
          itemType="perubahan Pengaturan Wali Kelas"
          redirectLink="/daftar-kelas"
        />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={(event, reason) => handleCloseSnackbar(event, reason)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity={severity}
            onClose={(event, reason) => handleCloseSnackbar(event, reason)}
          >
            {snackbarContent}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

EditHomeroomTeacher.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
});

export default connect(mapStateToProps, { getTeachers, getAllClass })(
  EditHomeroomTeacher
);
