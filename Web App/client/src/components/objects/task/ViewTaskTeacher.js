import React from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { clearSuccess } from "../../../actions/SuccessActions";
import { clearErrors } from "../../../actions/ErrorActions";
import {
  getOneTask,
  deleteTask,
  createTaskComment,
  editTaskComment,
  deleteTaskComment,
} from "../../../actions/TaskActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import {
  getOneUser,
  getTeachers,
  getStudents,
} from "../../../actions/UserActions";
import { getAllClass } from "../../../actions/ClassActions";
import {
  getFileTasks,
  viewFileTasks,
  downloadFileTasks,
} from "../../../actions/files/FileTaskActions";
import { getMultipleFileAvatar } from "../../../actions/files/FileAvatarActions";
import { getFileSubmitTasks_T } from "../../../actions/files/FileSubmitTaskActions";
import CustomLinkify from "../../utils/linkify/Linkify";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import {
  Button,
  Divider,
  Fab,
  Grid,
  Hidden,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
} from "@material-ui/icons";
import FileAttachment from "../file/FileAttachment";
import Comment from "../comment/Comment";

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
  taskPaper: {
    padding: "20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px",
    },
  },
  taskDivider: {
    margin: "22.5px 0px",
    backgroundColor: theme.palette.primary.light,
  },
  gradeButton: {
    boxShadow:
      "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  editButton: {
    width: "110px",
    textTransform: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  deleteButton: {
    width: "110px",
    textTransform: "none",
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.fade,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  cancelButton: {
    width: "100px",
    color: theme.palette.text.secondary,
  },
  saveButton: {
    width: "100px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));

function ViewTaskTeacher(props) {
  const classes = useStyles();
  const history = useHistory();
  const { user } = props.auth;
  const {
    deleteTask,
    tasksCollection,
    getOneTask,
    getAllClass,
    getAllSubjects,
    getFileTasks,
    viewFileTasks,
    clearErrors,
    clearSuccess,
    getTeachers,
    getStudents,
    getFileSubmitTasks_T,
  } = props;
  const { selectedTasks } = tasksCollection;
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const task_id = props.match.params.id;

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [fileLampiran, setFileLampiran] = React.useState([]);

  // To disable button that redirect teacher to SubmittedTaskList when there is still no submitted task.
  const [disableButton, setDisableButton] = React.useState(true);

  React.useEffect(() => {
    getOneTask(task_id);
    getAllClass(user.unit, "map");
    getAllSubjects(user.unit, "map");
    getFileTasks(task_id).then((res) => {
      setFileLampiran(res);
    });
    getStudents(user.unit);
    getTeachers(user.unit);
    clearErrors();
    clearSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getFileSubmitTasks_T(task_id).then((res) => {
      if (res.length) {
        setDisableButton(false);
      }
    });
  });

  React.useEffect(() => {
    return () => {
      clearErrors();
      clearSuccess();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteTask = (id) => {
    deleteTask(id, history).then((res) => {
      console.log(res);
    });
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const commentMethod = {
    createComment: createTaskComment,
    editComment: editTaskComment,
    deleteComment: deleteTaskComment,
  };

  const dataMethod = {
    getData: getOneTask,
  };

  document.title = `Schooly | ${selectedTasks.name}`;

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Paper className={classes.taskPaper}>
            <Typography variant="h4" style={{ marginBottom: "5px" }}>
              {selectedTasks.name}
            </Typography>
            <Typography color="primary" paragraph>
              Tugas {all_subjects_map.get(selectedTasks.subject)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Oleh: {user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Waktu Dibuat:{" "}
              {moment(selectedTasks.createdAt)
                .locale("id")
                .format("DD MMM YYYY, HH.mm")}
            </Typography>
            <Divider className={classes.taskDivider} />
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                  Diberikan kepada:
                </Typography>
                <Typography>
                  {!selectedTasks.class_assigned || !all_classes_map.size
                    ? null
                    : selectedTasks.class_assigned.map((kelas, i) => {
                      if (all_classes_map.get(kelas)) {
                        if (i === selectedTasks.class_assigned.length - 1)
                          return `${all_classes_map.get(kelas).name}`;
                        return `${all_classes_map.get(kelas).name}, `;
                      }
                      return null;
                    })}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                  Tenggat:
                </Typography>
                <Typography>
                  {moment(selectedTasks.deadline)
                    .locale("id")
                    .format("DD MMM YYYY, HH.mm")}
                </Typography>
              </Grid>
              {!selectedTasks.description ? null : (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Deskripsi Tugas:
                  </Typography>
                  <Typography
                    align="justify"
                    style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                  >
                    <CustomLinkify text={selectedTasks.description} />
                  </Typography>
                </Grid>
              )}
              {fileLampiran.length === 0 ? null : (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Lampiran:
                  </Typography>
                  <Grid container spacing={1}>
                    <FileAttachment
                      data={fileLampiran}
                      onPreviewFile={viewFileTasks}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        <Grid
          item
          container
          justify="space-between"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Link
              to={`/daftar-tugas-terkumpul/${task_id}`}
              style={{ pointerEvents: disableButton ? "none" : null }}
            >
              <Hidden smDown>
                <Fab
                  size="large"
                  variant="extended"
                  className={classes.gradeButton}
                  disabled={disableButton}
                >
                  <PlaylistAddCheckIcon style={{ marginRight: "8px" }} />
                  Periksa
                </Fab>
              </Hidden>
              <Hidden mdUp>
                <Tooltip title="Periksa">
                  <Fab
                    size="medium"
                    className={classes.gradeButton}
                    disabled={disableButton}
                  >
                    <PlaylistAddCheckIcon />
                  </Fab>
                </Tooltip>
              </Hidden>
            </Link>
          </Grid>
          <Grid
            item
            xs
            container
            justify="flex-end"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <Link to={`/sunting-tugas/${task_id}`}>
                <Hidden xsDown>
                  <Button
                    variant="outlined"
                    className={classes.editButton}
                    startIcon={<EditIcon style={{ color: "grey" }} />}
                  >
                    <Typography>Sunting</Typography>
                  </Button>
                </Hidden>
                <Hidden smUp>
                  <Tooltip title="Sunting">
                    <Button variant="outlined" className={classes.editButton}>
                      <EditIcon />
                    </Button>
                  </Tooltip>
                </Hidden>
              </Link>
            </Grid>
            <Grid item>
              <Hidden xsDown>
                <Button
                  variant="outlined"
                  className={classes.deleteButton}
                  startIcon={<DeleteIcon style={{ color: "grey" }} />}
                  onClick={(e) => handleOpenDeleteDialog(e, task_id)}
                >
                  <Typography>Hapus</Typography>
                </Button>
              </Hidden>
              <Hidden smUp>
                <Tooltip title="Hapus">
                  <Button
                    variant="outlined"
                    className={classes.deleteButton}
                    onClick={(e) => handleOpenDeleteDialog(e, task_id)}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Comment
            data={selectedTasks}
            commentMethod={commentMethod}
            dataMethod={dataMethod}
          />
        </Grid>
      </Grid>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Tugas"
        itemName={selectedTasks.name}
        warningText="Lampiran, komentar, dan nilai yang ada juga akan dihapus."
        deleteItem={() => onDeleteTask(task_id)}
      />
    </div>
  );
}

ViewTaskTeacher.propTypes = {
  auth: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  deleteTask: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  updateUserData: PropTypes.func.isRequired,
  getOneUser: PropTypes.func.isRequired, // For the person in charge task.
  getOneTask: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  success: state.success,
  errors: state.errors,
  tasksCollection: state.tasksCollection,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
});

export default connect(mapStateToProps, {
  deleteTask,
  getOneTask,
  getOneUser,
  getAllClass,
  getAllSubjects,
  getFileTasks,
  downloadFileTasks,
  viewFileTasks,
  clearSuccess,
  clearErrors,
  getTeachers,
  getStudents,
  getMultipleFileAvatar,
  getFileSubmitTasks_T,
})(ViewTaskTeacher);
