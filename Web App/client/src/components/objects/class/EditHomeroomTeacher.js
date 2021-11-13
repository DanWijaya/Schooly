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
  Avatar,
  Button,
  Divider,
  Grid,
  Hidden,
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

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
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
  select: {
    minWidth: "150px",
    maxWidth: "150px",
    [theme.breakpoints.down("xs")]: {
      minWidth: "100px",
      maxWidth: "100px",
    },
  },
  editClassButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      color: theme.palette.primary.main,
      backgroundColor: "white",
    },
  },
  cancelButton: {
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.main,
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

  return (
    <div className={classes.root}>
      <Paper>
        <div className={classes.content}>
          <Typography variant="h5" gutterBottom>
            <b>Sunting Wali Kelas</b>
          </Typography>
        </div>
        <Divider />
        <div>
          {statusKelas && statusWali
            ? Object.entries(statusWali).map((entry) => {
                let teacherId = entry[0];
                let teacherInfo = entry[1];
                let showError = false;
                if (teacherInfo["classId"]) {
                  showError = statusKelas[teacherInfo["classId"]].length > 1;
                }

                return (
                  <Grid item>
                    <ListItem className={classes.listItem}>
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
                      <ListItemText
                        align="right"
                        primary={
                          <TextField
                            key={teacherId}
                            select
                            label="Kelas"
                            value={statusWali[teacherId].classId}
                            onChange={(event) => {
                              handleKelasWaliChange(event, teacherId);
                            }}
                            error={showError}
                            helperText={showError ? "Periksa Kembali!" : null}
                            className={classes.select}
                            variant="outlined"
                          >
                            {all_classes.length !== 0
                              ? generateAllClassMenuItems()
                              : null}
                          </TextField>
                        }
                      />
                    </ListItem>
                  </Grid>
                );
              })
            : null}
          <Divider />
          <div
            style={{ display: "flex", justifyContent: "flex-end" }}
            className={classes.content}
          >
            <div
              style={{ display: "flex", alignItems: "center", padding: "4px" }}
            >
              <Button
                variant="contained"
                onClick={handleOpenDeleteDialog}
                className={classes.cancelButton}
              >
                Batal
              </Button>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", padding: "4px" }}
            >
              <Button
                variant="contained"
                onClick={handleSubmit}
                className={classes.editClassButton}
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </Paper>
      <UploadDialog
        openUploadDialog={openUploadDialog}
        success={success}
        messageUploading={`Pengaturan wali kelas sedang disimpan`}
        messageSuccess={`Pengaturan wali kelas berhasil disimpan`}
        redirectLink="/daftar-kelas"
      />
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="pengaturan wali kelas"
        deleteItem={null}
        itemName={null}
        isLink={true}
        redirectLink="/daftar-kelas"
        isWarning={false}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={(event, reason) => {
          handleCloseSnackbar(event, reason);
        }}
      >
        <Alert
          variant="filled"
          severity={severity}
          onClose={(event, reason) => {
            handleCloseSnackbar(event, reason);
          }}
        >
          {snackbarContent}
        </Alert>
      </Snackbar>
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
