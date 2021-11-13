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
import CustomLinkify from "../../misc/linkify/Linkify";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Fab,
  Grid,
  Hidden,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Create as CreateIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  Send as SendIcon,
} from "@material-ui/icons";
import {
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";

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
  seeResultsButton: {
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
  wordFileTypeIcon: {
    backgroundColor: "#16B0DD",
  },
  excelFileTypeIcon: {
    backgroundColor: "#68C74F",
  },
  imageFileTypeIcon: {
    backgroundColor: "#974994",
  },
  pdfFileTypeIcon: {
    backgroundColor: "#E43B37",
  },
  textFileTypeIcon: {
    backgroundColor: "#F7BC24",
  },
  presentationFileTypeIcon: {
    backgroundColor: "#FD931D",
  },
  otherFileTypeIcon: {
    backgroundColor: "#808080",
  },
  commentPaper: {
    padding: "20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px",
    },
  },
  commentLittleIcon: {
    color: theme.palette.text.disabled,
    opacity: 0.5,
    "&:focus, &:hover": {
      opacity: 1,
      cursor: "pointer",
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

const path = require("path");

function LampiranFile(props) {
  const classes = useStyles();

  const { file_id, filename, filetype, onDownloadFile, onPreviewFile } = props;

  let displayedName = "";
  filename.length >= 31
    ? (displayedName = `${filename.slice(0, 30)}..${path.extname(filename)}`)
    : (displayedName = filename);

  return (
    <Grid item xs={12} md={6}>
      <Paper variant="outlined" className={classes.listItemPaper}>
        <ListItem
          button
          disableRipple
          className={classes.listItem}
          onClick={() => {
            onPreviewFile(file_id);
          }}
        >
          <ListItemAvatar>
            {filetype === "Word" ? (
              <Avatar className={classes.wordFileTypeIcon}>
                <FaFileWord />
              </Avatar>
            ) : filetype === "Excel" ? (
              <Avatar className={classes.excelFileTypeIcon}>
                <FaFileExcel />
              </Avatar>
            ) : filetype === "Gambar" ? (
              <Avatar className={classes.imageFileTypeIcon}>
                <FaFileImage />
              </Avatar>
            ) : filetype === "PDF" ? (
              <Avatar className={classes.pdfFileTypeIcon}>
                <FaFilePdf />
              </Avatar>
            ) : filetype === "Teks" ? (
              <Avatar className={classes.textFileTypeIcon}>
                <FaFileAlt />
              </Avatar>
            ) : filetype === "Presentasi" ? (
              <Avatar className={classes.presentationFileTypeIcon}>
                <FaFilePowerpoint />
              </Avatar>
            ) : filetype === "File Lainnya" ? (
              <Avatar className={classes.otherFileTypeIcon}>
                <FaFile />
              </Avatar>
            ) : null}
          </ListItemAvatar>
          <ListItemText
            primary={
              <LightTooltip title={filename} placement="top">
                <Typography>{displayedName}</Typography>
              </LightTooltip>
            }
            secondary={filetype}
          />
          {/* <IconButton
            size="small"
            className={classes.downloadIconButton}
            onClick={(e) => {
              e.stopPropagation();
              onDownloadFile(file_id);
            }}
          >
            <CloudDownloadIcon fontSize="small" />
          </IconButton> */}
        </ListItem>
      </Paper>
    </Grid>
  );
}

function ViewTaskTeacher(props) {
  const classes = useStyles();
  const history = useHistory();
  const { user, all_students, all_teachers } = props.auth;
  const {
    deleteTask,
    tasksCollection,
    getOneTask,
    getAllClass,
    getAllSubjects,
    getFileTasks,
    viewFileTasks,
    downloadFileTasks,
    errors,
    success,
    clearErrors,
    clearSuccess,
    getTeachers,
    getStudents,
    getMultipleFileAvatar,
    getFileSubmitTasks_T,
  } = props;
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const task_id = props.match.params.id;

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [fileLampiran, setFileLampiran] = React.useState([]);

  // To disable button that redirect teacher to SubmittedTaskList when there is still no submitted task.
  const [disableButton, setDisableButton] = React.useState(true);

  // Comment
  const [commentValue, setCommentValue] = React.useState("");
  const [commentEditorValue, setCommentEditorValue] = React.useState("");
  const [commentList, setCommentList] = React.useState([]);
  const [commentAvatar, setCommentAvatar] = React.useState({});
  const [selectedCommentIdx, setSelectedCommentIdx] = React.useState(null);
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = React.useState(
    null
  );
  const [deleteCommentIdx, setDeleteCommentIdx] = React.useState(null);
  const deleteDialogHandler = React.useRef(null);

  // Snackbar
  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openCommentSnackbar, setOpenCommentSnackbar] = React.useState(false);

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
  // [tasksCollection._id, all_classes_map.size, all_subjects_map.size]

  React.useEffect(() => {
    getFileSubmitTasks_T(task_id).then((res) => {
      if (res.length) {
        setDisableButton(false);
      }
    });
  });
  // React.useEffect(() => {
  // if (
  //   tasksCollection &&
  //   Object.keys(tasksCollection).length !== 0 &&
  //   all_students &&
  //   all_students.length !== 0
  // ) {
  //   // untuk setiap murid yang ada,
  //   for (let j = 0; j < all_students.length; j++) {
  //     console.log(all_students[j].kelas)
  //     // jika murid ini mendapatkan tugas ini
  //     if (
  //       tasksCollection.class_assigned &&
  //       tasksCollection.class_assigned.includes(all_students[j].kelas)
  //     ) {
  //       // untuk setiap file yang pernah dikumpulkan murid ini,
  //       for (const studentTask of all_students[j].tugas) {
  //         // jika file ditujukan untuk tugas ini,
  //         if (studentTask.for_task_object === task_id) {
  //           // setDisableButton(false);
  //           return;
  //         }
  //       }
  //     }
  //   }
  // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); //[tasksCollection, all_students]

  React.useEffect(() => {
    if (
      all_students &&
      Array.isArray(all_students) &&
      all_teachers &&
      Array.isArray(all_teachers) &&
      tasksCollection &&
      tasksCollection.comments
    ) {
      let usernames = {};
      for (let studentInfo of all_students) {
        usernames[studentInfo._id] = studentInfo.name;
      }
      for (let teacherInfo of all_teachers) {
        usernames[teacherInfo._id] = teacherInfo.name;
      }
      setCommentList(
        tasksCollection.comments.map((comment) => ({
          ...comment,
          name: usernames[comment.author_id],
        }))
      );

      if (
        selectedCommentIdx !== null &&
        deleteCommentIdx !== null &&
        deleteCommentIdx < selectedCommentIdx
      ) {
        // memindahkan textfield edit
        setSelectedCommentIdx(selectedCommentIdx - 1);
      }
      setDeleteCommentIdx(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksCollection, all_teachers, all_students]);

  React.useEffect(() => {
    let listId = [];
    commentList.map((comment) => {
      listId.push(comment.author_id);
    });
    listId.push(user._id);
    getMultipleFileAvatar(listId).then((results) => {
      setCommentAvatar(results);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentList]);

  React.useEffect(() => {
    return () => {
      clearErrors();
      clearSuccess();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCommentInputChange = (e) => {
    setCommentValue(e.target.value);
  };
  const handleCommentEditorChange = (e) => {
    setCommentEditorValue(e.target.value);
  };

  const closeEditMode = () => {
    setCommentEditorValue("");
    setSelectedCommentIdx(null);
  };
  const handleClickEdit = (idx) => {
    setCommentEditorValue(commentList[idx].content);
    setSelectedCommentIdx(idx);
  };
  const handleCreateComment = () => {
    if (commentValue.length === 0) {
      handleOpenCommentSnackbar("error", "Isi komentar tidak boleh kosong");
    } else {
      createTaskComment(task_id, {
        author_id: user._id,
        content: commentValue,
      })
        .then(() => {
          handleOpenCommentSnackbar("success", "Komentar berhasil dibuat");
          setCommentValue("");
          getOneTask(task_id);
        })
        .catch(() => {
          handleOpenCommentSnackbar("error", "Komentar gagal dibuat");
        });
    }
  };

  const handleEditComment = () => {
    if (commentEditorValue.length === 0) {
      handleOpenDeleteCommentDialog(selectedCommentIdx);
    } else {
      editTaskComment(
        task_id,
        commentEditorValue,
        commentList[selectedCommentIdx]._id
      )
        .then(() => {
          handleOpenCommentSnackbar("success", "Komentar berhasil disunting");
          getOneTask(task_id);
        })
        .catch(() => {
          handleOpenCommentSnackbar("error", "Komentar gagal disunting");
        });
      closeEditMode();
    }
  };

  const handleDeleteComment = (idx) => {
    deleteTaskComment(task_id, commentList[idx]._id)
      .then(() => {
        handleOpenCommentSnackbar("success", "Komentar berhasil dihapus");
        getOneTask(task_id);
      })
      .catch(() => {
        handleOpenCommentSnackbar("error", "Komentar gagal dihapus");
      });
    setDeleteCommentIdx(idx);
    handleCloseDeleteCommentDialog();
  };

  const handleOpenCommentSnackbar = (severity, content) => {
    setOpenCommentSnackbar(true);
    setSeverity(severity);
    setSnackbarContent(content);
  };

  const handleCloseCommentSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenCommentSnackbar(false);
  };

  const fileType = (filename) => {
    let ext_file = path.extname(filename);
    switch (ext_file) {
      case ".docx":
        return "Word";
      case ".xlsx":
      case ".csv":
        return "Excel";

      case ".png":
      case ".jpg":
      case ".jpeg":
        return "Gambar";

      case ".pdf":
        return "PDF";

      case ".txt":
      case ".rtf":
        return "Teks";

      case ".ppt":
      case ".pptx":
        return "Presentasi";

      default:
        return "File Lainnya";
    }
  };

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

  // Comment Dialog
  const handleOpenDeleteCommentDialog = (idx) => {
    setOpenDeleteCommentDialog(true);
    deleteDialogHandler.current =
      idx === selectedCommentIdx
        ? () => {
            handleDeleteComment(idx);
            closeEditMode();
          }
        : () => {
            handleDeleteComment(idx);
          };
  };
  const handleCloseDeleteCommentDialog = () => {
    // setDeleteCommentIdx(null) will be run after material is reloaded.
    setOpenDeleteCommentDialog(false);
  };

  // Comment
  const generateComments = (
    author_id,
    authorName,
    date,
    comment,
    isSelfMade,
    idx,
    edited
  ) => {
    return (
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <Avatar src={commentAvatar[author_id]} />
        </Grid>
        <Grid item xs zeroMinWidth container>
          <Grid item xs={12}>
            <Typography variant="body2" noWrap>
              {authorName}{" "}
              <span style={{ color: "grey" }}>
                {edited === true ? "(Disunting)" : null} •{" "}
                {moment(date).locale("id").format("DD MMM YYYY, HH.mm")}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {selectedCommentIdx !== null && selectedCommentIdx === idx ? (
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <TextField
                    fullWidth
                    multiline
                    variant="outlined"
                    onChange={handleCommentEditorChange}
                    value={commentEditorValue}
                  />
                </Grid>
                <Grid item container spacing={1}>
                  <Grid item>
                    <Button
                      className={classes.cancelButton}
                      startIcon={<CancelIcon />}
                      onClick={closeEditMode}
                    >
                      Batal
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      className={classes.saveButton}
                      startIcon={<CheckCircleIcon />}
                      onClick={handleEditComment}
                    >
                      Simpan
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Typography
                align="justify"
                style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
              >
                {comment}
              </Typography>
            )}
          </Grid>
        </Grid>
        {isSelfMade &&
        !(selectedCommentIdx !== null && selectedCommentIdx === idx) ? (
          <Grid item>
            <LightTooltip title="Sunting">
              <CreateIcon
                style={{ marginRight: "2px" }}
                className={classes.commentLittleIcon}
                fontSize="small"
                onClick={() => handleClickEdit(idx)}
              />
            </LightTooltip>
            <LightTooltip title="Hapus">
              <DeleteIcon
                className={classes.commentLittleIcon}
                fontSize="small"
                onClick={() => handleOpenDeleteCommentDialog(idx)}
              />
            </LightTooltip>
          </Grid>
        ) : null}
      </Grid>
    );
  };

  document.title = !tasksCollection.name
    ? "Schooly | Lihat Tugas"
    : `Schooly | ${tasksCollection.name}`;

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Paper className={classes.taskPaper}>
            <Typography variant="h4" style={{ marginBottom: "5px" }}>
              {tasksCollection.name}
            </Typography>
            <Typography color="primary" paragraph>
              Tugas {all_subjects_map.get(tasksCollection.subject)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Oleh: {user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Waktu Dibuat:{" "}
              {moment(tasksCollection.createdAt)
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
                  {!tasksCollection.class_assigned || !all_classes_map.size
                    ? null
                    : tasksCollection.class_assigned.map((kelas, i) => {
                        if (all_classes_map.get(kelas)) {
                          if (i === tasksCollection.class_assigned.length - 1)
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
                  {moment(tasksCollection.deadline)
                    .locale("id")
                    .format("DD MMM YYYY, HH.mm")}
                </Typography>
              </Grid>
              {!tasksCollection.description ? null : (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Deskripsi Tugas:
                  </Typography>
                  <Typography
                    align="justify"
                    style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                  >
                    <CustomLinkify text={tasksCollection.description} />
                  </Typography>
                </Grid>
              )}
              {fileLampiran.length === 0 ? null : (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Lampiran:
                  </Typography>
                  <Grid container spacing={1}>
                    {fileLampiran.map((lampiran) => (
                      <LampiranFile
                        file_id={lampiran._id}
                        onPreviewFile={viewFileTasks}
                        onDownloadFile={downloadFileTasks}
                        filename={lampiran.filename}
                        filetype={fileType(lampiran.filename)}
                      />
                    ))}
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
                  className={classes.seeResultsButton}
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
                    className={classes.seeResultsButton}
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
          <Paper className={classes.commentPaper}>
            <Typography variant="h6" gutterBottom>
              Komentar Kelas
            </Typography>
            <Divider style={{ marginBottom: "17.5px" }} />
            <Grid container spacing={2}>
              {commentList.length !== 0 ? (
                <>
                  {commentList.map((comment, idx) =>
                    generateComments(
                      comment.author_id,
                      comment.name,
                      comment.createdAt,
                      comment.content,
                      comment.author_id === user._id,
                      idx,
                      comment.edited
                    )
                  )}
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </>
              ) : null}
              {/* {
                (commentList.length === 0) ?
                  <Grid item xs={12}>
                    <Typography color="textSecondary" align="center">Belum ada komentar</Typography>
                  </Grid>
                : null
              } */}
              <Grid container item direction="row" alignItems="center">
                <div className={classes.smAvatar}>
                  <Avatar src={commentAvatar[user._id]} />
                </div>
                <Box flexGrow={1}>
                  <TextField
                    className={classes.textField}
                    variant="outlined"
                    multiline
                    style={{ display: "flex" }}
                    InputProps={{ style: { borderRadius: "15px" } }}
                    placeholder="Tambahkan komentar..."
                    onChange={handleCommentInputChange}
                    value={commentValue}
                  />
                </Box>
                <div>
                  <LightTooltip title="Kirim">
                    <SendIcon
                      className={classes.sendIcon}
                      onClick={handleCreateComment}
                    />
                  </LightTooltip>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Tugas"
        itemName={tasksCollection.name}
        deleteItem={() => {
          onDeleteTask(task_id);
        }}
      />
      <DeleteDialog
        openDeleteDialog={openDeleteCommentDialog}
        handleCloseDeleteDialog={handleCloseDeleteCommentDialog}
        itemType="Komentar"
        itemName=""
        deleteItem={deleteDialogHandler.current}
      />
      <Snackbar
        open={openCommentSnackbar}
        autoHideDuration={3000}
        onClose={(event, reason) => {
          handleCloseCommentSnackbar(event, reason);
        }}
      >
        <Alert
          variant="filled"
          severity={severity}
          onClose={(event, reason) => {
            handleCloseCommentSnackbar(event, reason);
          }}
        >
          {snackbarContent}
        </Alert>
      </Snackbar>
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
  getStudents,
  getFileSubmitTasks_T,
})(ViewTaskTeacher);
