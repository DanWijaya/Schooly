import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import {
  deleteFileSubmitTasks,
  uploadFileSubmitTasks,
  getFileSubmitTasks_AT,
  viewFileSubmitTasks,
  downloadFileSubmitTasks,
} from "../../../actions/files/FileSubmitTaskActions";
import {
  downloadFileTasks,
  getFileTasks,
  viewFileTasks,
} from "../../../actions/files/FileTaskActions";
import { getMultipleFileAvatar } from "../../../actions/files/FileAvatarActions";
import {
  getOneTask,
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
import { getSetting } from "../../../actions/SettingActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import { clearErrors } from "../../../actions/ErrorActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import UploadDialog from "../../misc/dialog/UploadDialog";
import CustomLinkify from "../../misc/linkify/Linkify";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Button,
  Box,
  Divider,
  Grid,
  Hidden,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  Add as AddIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Create as CreateIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
  Send as SendIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import FileAttachment from "../file/FileAttachment";
import FileSubmission from "../file/FileSubmission";

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
  workChosenFile: {
    width: "200px",
    color: theme.palette.primary.main,
  },
  selectFileButton: {
    width: "200px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  submitTaskButton: {
    width: "200px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

function ViewTaskStudent(props) {
  const classes = useStyles();
  const {
    uploadFileSubmitTasks,
    viewFileSubmitTasks,
    getFileSubmitTasks_AT,
    deleteFileSubmitTasks,
    success,
    clearSuccess,
    clearErrors,
    getOneTask,
    getOneUser,
    getAllSubjects,
    getFileTasks,
    viewFileTasks,
    getTeachers,
    getStudents,
    getMultipleFileAvatar,
    getSetting,
  } = props;
  const { user, selectedUser, all_students, all_teachers } = props.auth;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedTasks } = props.tasksCollection;
  const tugasUploader = React.useRef(null);
  const uploadedTugas = React.useRef(null);
  const [fileTugas, setFileTugas] = React.useState([]);
  const [fileToSubmit, setFileToSubmit] = React.useState([]);
  // const [tasksContents, setTaskContents] = React.useState([]);
  const [fileLampiran, setFileLampiran] = React.useState([]);
  const [over_limit, setOverLimit] = React.useState([]);
  // const [success, setSuccess] = React.useState(null);
  const [fileLimitSnackbar, setFileLimitSnackbar] = React.useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedFileName, setSelectedFileName] = React.useState(null);
  const [selectedFileId, setSelectedFileId] = React.useState(null);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = React.useState(false);

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

  let tugasId = props.match.params.id;

  useEffect(() => {
    getStudents(user.unit);
    getTeachers(user.unit);
    getSetting();
    clearErrors();
    clearSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This page is only for student later on, so for now put the user.role logic condition
  // This is like componentDidUpdate(). If the value inside the array changes, it will be rerun.
  useEffect(() => {
    getFileSubmitTasks_AT(tugasId, user._id).then((results) =>
      setFileTugas(results)
    );
    getOneTask(tugasId);
    getAllSubjects(user.unit, "map");
    // Will run getOneUser again once the selectedTasks is retrieved
    getFileTasks(tugasId).then((results) => setFileLampiran(results));
    if (selectedTasks.person_in_charge_id) {
      getOneUser(selectedTasks.person_in_charge_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, selectedTasks.person_in_charge_id]);

  useEffect(() => {
    if (
      all_students &&
      Array.isArray(all_students) &&
      all_teachers &&
      Array.isArray(all_teachers) &&
      selectedTasks &&
      selectedTasks.comments
    ) {
      let usernames = {};
      for (let userInfo of [...all_students, ...all_teachers]) {
        usernames[userInfo._id] = userInfo.name;
      }
      setCommentList(
        selectedTasks.comments.map((comment) => ({
          ...comment,
          name: usernames[comment.author_id],
        }))
      );

      if (
        selectedCommentIdx !== null &&
        deleteCommentIdx !== null &&
        deleteCommentIdx < selectedCommentIdx
      ) {
        // To move edit textfield.
        setSelectedCommentIdx(selectedCommentIdx - 1);
      }
      setDeleteCommentIdx(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTasks, all_teachers, all_students]);

  useEffect(() => {
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

  useEffect(() => {
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
      createTaskComment(tugasId, {
        author_id: user._id,
        content: commentValue,
      })
        .then(() => {
          handleOpenCommentSnackbar("success", "Komentar berhasil dibuat");
          setCommentValue("");
          getOneTask(tugasId);
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
        tugasId,
        commentEditorValue,
        commentList[selectedCommentIdx]._id
      )
        .then(() => {
          handleOpenCommentSnackbar("success", "Komentar berhasil disunting");
          getOneTask(tugasId);
        })
        .catch(() => {
          handleOpenCommentSnackbar("error", "Komentar gagal disunting");
        });
      closeEditMode();
    }
  };

  const handleDeleteComment = (idx) => {
    deleteTaskComment(tugasId, commentList[idx]._id)
      .then(() => {
        handleOpenCommentSnackbar("success", "Komentar berhasil dihapus");
        getOneTask(tugasId);
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

  const handleTugasUpload = (e) => {
    const files = Array.from(e.target.files);

    let over_limit = files.filter((file) => file.size / Math.pow(10, 6) > 10);
    let allowed_file = files.filter(
      (file) => file.size / Math.pow(10, 6) <= 10
    );

    let temp = [...fileToSubmit, ...allowed_file];
    setFileToSubmit(temp);
    setOverLimit(over_limit);
    setFileLimitSnackbar(over_limit.length > 0);

    document.getElementById("file_control").value = null;
  };

  const handleLampiranDelete = (e, i) => {
    e.preventDefault();
    let tempToAdd = [...fileToSubmit];
    tempToAdd.splice(i, 1);
    setFileToSubmit(tempToAdd);
  };

  const onSubmitTugas = (e) => {
    e.preventDefault();
    let formData = new FormData();
    // fileToSubmit is not a usual array, itu FileList object.
    for (var i = 0; i < fileToSubmit.length; i++) {
      formData.append("tugas", fileToSubmit[i]);
    }
    handleOpenUploadDialog();
    uploadFileSubmitTasks(formData, tugasId, user._id, selectedTasks.deadline);
    setFileToSubmit([]);
  };

  const handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFileLimitSnackbar(false);
  };

  const handleOpenDeleteSnackbar = () => {
    setOpenDeleteSnackbar(true);
  };

  const handleCloseDeleteSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDeleteSnackbar(false);
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true); // state openDeleteDialog akan berubah jadi true.
    setSelectedFileId(fileid);
    setSelectedFileName(filename);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

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
    // setDeleteCommentIdx(null) akan dijalankan setelah task dimuat ulang
    setOpenDeleteCommentDialog(false);
  };

  // Upload Dialog
  const [openUploadDialog, setOpenUploadDialog] = React.useState(null);
  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };
  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    clearSuccess();
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
      <Grid container item direction="row" style={{ flexWrap: "nowrap" }}>
        <div className={classes.smAvatar}>
          <Avatar src={commentAvatar[author_id]} />
        </div>
        <Box flexGrow={1}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Hidden smUp>
                <Typography className={classes.mobileName}>
                  <b>{authorName}</b>
                </Typography>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {edited === true ? (
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      style={{
                        marginRight: "5px",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Edited
                    </Typography>
                  ) : null}
                  <Typography
                    color="textSecondary"
                    variant="body2"
                    style={{
                      marginRight: "5px",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {moment(date).locale("id").format("DD MMM YYYY, HH.mm")}
                  </Typography>
                </div>
              </Hidden>
              <Hidden xsDown>
                <Typography style={{ marginRight: "10px" }}>
                  <b>{authorName}</b>
                </Typography>
                {edited === true ? (
                  <Typography
                    color="textSecondary"
                    variant="body2"
                    style={{ marginRight: "10px" }}
                  >
                    Edited
                  </Typography>
                ) : null}
                <Typography
                  color="textSecondary"
                  variant="body2"
                  style={{ marginRight: "10px" }}
                >
                  {moment(date).locale("id").format("DD MMM YYYY, HH.mm")}
                </Typography>
              </Hidden>
            </div>
            <div>
              {isSelfMade &&
              !(selectedCommentIdx !== null && selectedCommentIdx === idx) ? (
                <>
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
                </>
              ) : null}
            </div>
          </div>
          {selectedCommentIdx !== null && selectedCommentIdx === idx ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <TextField
                multiline
                variant="outlined"
                onChange={handleCommentEditorChange}
                value={commentEditorValue}
                style={{ marginTop: "5px" }}
              />
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="contained"
                  color="default"
                  className={classes.checkButton}
                  startIcon={<CheckCircleIcon />}
                  onClick={handleEditComment}
                >
                  Simpan
                </Button>
                <Button
                  variant="contained"
                  color="default"
                  className={classes.cancelButton}
                  startIcon={<CancelIcon />}
                  onClick={closeEditMode}
                >
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            <Typography
              style={{
                marginTop: "5px",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}
              align="justify"
            >
              {comment}
            </Typography>
          )}
        </Box>
      </Grid>
    );
  };

  const onDeleteFileSubmitTasks = (id) => {
    deleteFileSubmitTasks([id]).then((res) => {
      getFileSubmitTasks_AT(tugasId, user._id).then((results) => {
        setFileTugas(results);
        handleCloseDeleteDialog();
        handleOpenDeleteSnackbar();
      });
    });
  };

  document.title = `Schooly | ${selectedTasks.name}`;

  return (
    <div className={classes.root}>
      <Grid container justify="space-between" alignItems="stretch" spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper className={classes.taskPaper}>
            <Typography variant="h4" style={{ marginBottom: "5px" }}>
              {selectedTasks.name}
            </Typography>
            <Typography color="primary" paragraph>
              Tugas {all_subjects_map.get(selectedTasks.subject)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Oleh:{" "}
              {selectedUser._id !== selectedTasks.person_in_charge_id
                ? null
                : selectedUser.name}
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
          <Paper className={classes.taskPaper} style={{ marginTop: "20px" }}>
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
        <Grid item xs={12} md={4}>
          <Paper className={classes.taskPaper}>
            <Typography variant="h5" align="center" gutterBottom>
              Hasil Pekerjaan
            </Typography>
            <Divider style={{ margin: "10px 0px" }} />
            {fileTugas.length === 0 ? (
              <Grid container wrap="nowrap" direction="column" spacing={1}>
                <FileSubmission
                  data={fileToSubmit}
                  handleLampiranDelete={handleLampiranDelete}
                />
              </Grid>
            ) : (
              <Grid container wrap="nowrap" direction="column" spacing={1}>
                <FileSubmission
                  data={fileTugas}
                  handleOpenDeleteDialog={handleOpenDeleteDialog}
                  onPreviewFile={viewFileSubmitTasks}
                />
                <FileSubmission
                  data={fileToSubmit}
                  handleLampiranDelete={handleLampiranDelete}
                />
              </Grid>
            )}
            <Divider style={{ margin: "10px 0px" }} />
            <form
              onSubmit={onSubmitTugas}
              style={{ padding: "10px 0px 35px 0px" }}
            >
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <input
                    type="file"
                    multiple={true}
                    name="file"
                    id="file"
                    ref={uploadedTugas}
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    className={classes.selectFileButton}
                    onClick={() => {
                      tugasUploader.current.click();
                    }}
                  >
                    Pilih Berkas
                  </Button>
                </Grid>
                <Grid item>
                  <input
                    id="file_control"
                    type="file"
                    multiple={true}
                    name="tugas"
                    onChange={handleTugasUpload}
                    ref={tugasUploader}
                    accept="file/*"
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<PublishIcon />}
                    className={classes.submitTaskButton}
                    type="submit"
                    disabled={fileToSubmit.length === 0}
                  >
                    Kumpul Tugas
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Grid container direction="column" alignItems="center">
              <Typography>
                {!selectedTasks.grades
                  ? "Belum Diperiksa"
                  : !selectedTasks.grades[user._id]
                  ? "Belum Diperiksa"
                  : "Telah Diperiksa"}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Nilai:{" "}
                {!selectedTasks.grades
                  ? "N/A"
                  : !selectedTasks.grades[user._id]
                  ? "N/A"
                  : `${selectedTasks.grades[user._id]}/100`}
              </Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <UploadDialog
        openUploadDialog={openUploadDialog}
        success={success}
        messageUploading="Tugas sedang dikumpul"
        messageSuccess="Tugas telah dikumpul"
        handleCloseUploadDialog={handleCloseUploadDialog}
        redirectLink={false}
      />
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Berkas"
        itemName={selectedFileName}
        deleteItem={() => onDeleteFileSubmitTasks(selectedFileId)}
      />
      <DeleteDialog
        openDeleteDialog={openDeleteCommentDialog}
        handleCloseDeleteDialog={handleCloseDeleteCommentDialog}
        itemType="Komentar"
        deleteItem={deleteDialogHandler.current}
      />
      <Snackbar
        open={openCommentSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => handleCloseCommentSnackbar(event, reason)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={severity}
          onClose={(event, reason) => handleCloseCommentSnackbar(event, reason)}
        >
          {snackbarContent}
        </Alert>
      </Snackbar>
      {/* File Size Limit Snackbar */}
      <Snackbar
        open={fileLimitSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert elevation={6} variant="filled" severity="error">
          {over_limit.length} file melebihi batas 10MB
        </Alert>
      </Snackbar>
      {/* Delete Snackbar */}
      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={3000}
        onClose={(event, reason) => handleCloseDeleteSnackbar(event, reason)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={(event, reason) => handleCloseDeleteSnackbar(event, reason)}
        >
          Berkas Tugas Anda berhasil dihapus
        </Alert>
      </Snackbar>
    </div>
  );
}

ViewTaskStudent.propTypes = {
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  filesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  success: state.success,
  errors: state.errors,
  tasksCollection: state.tasksCollection,
  subjectsCollection: state.subjectsCollection,
  filesCollection: state.filesCollection,
});

export default connect(mapStateToProps, {
  clearSuccess,
  clearErrors,
  getFileTasks,
  downloadFileTasks,
  viewFileTasks,
  getOneUser,
  getOneTask,
  getAllSubjects,
  uploadFileSubmitTasks,
  getFileSubmitTasks_AT,
  viewFileSubmitTasks,
  downloadFileSubmitTasks,
  deleteFileSubmitTasks,
  getTeachers,
  getStudents,
  getMultipleFileAvatar,
  getSetting,
})(ViewTaskStudent);
