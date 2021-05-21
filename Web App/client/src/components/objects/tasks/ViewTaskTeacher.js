import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";

//Actions
import { clearSuccess } from "../../../actions/SuccessActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { 
  getOneTask, 
  deleteTask,
  createTaskComment,
  editTaskComment,
  deleteTaskComment
 } from "../../../actions/TaskActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import {
  uploadTugas,
  downloadLampiran,
  previewLampiran,
} from "../../../actions/UploadActions";
import { 
  getOneUser,
  getTeachers, 
  getStudents  
} from "../../../actions/UserActions";
import { getAllClass } from "../../../actions/ClassActions";
import {
  getFileTasks,
  viewFileTasks,
  downloadFileTasks,
} from "../../../actions/files/FileTaskActions";
import {
  getFileAvatar,
  getMultipleFileAvatar
} from "../../../actions/files/FileAvatarActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Fab,
  Grid,
  Hidden,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  Divider,
  TextField,
  Button,
  Snackbar
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import {
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";
import SendIcon from '@material-ui/icons/Send';
import CreateIcon from '@material-ui/icons/Create';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "10px",
  },
  paperBox: {
    padding: "20px",
    // marginBottom: "10px",
  },
  seeAllTaskButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
    },
  },
  editTaskButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteTaskButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  listItemPaper: {
    marginBottom: "10px",
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  downloadIconButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
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
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
  commentLittleIcon: {
    color: theme.palette.text.disabled,
    opacity: 0.5,
    "&:focus, &:hover": {
      opacity: 1,
      cursor: "pointer"
    },
  },
  sendIcon: {
    color: theme.palette.text.disabled,
    "&:focus, &:hover": {
      color: theme.palette.primary.main,
      // opacity: 0.5,
      cursor: "pointer"
    },
  },
  marginMobile: {
    [theme.breakpoints.down("sm")]: {
      marginRight: "14px",
      marginLeft: "7.6px"
    },
  },
  smAvatar: {
    [theme.breakpoints.down("xs")]: {
      minWidth: "50px"
    },
  },
  textField: {

  },
  checkButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    marginTop: "6px",
    marginRight: "3px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.dark
    },
  },
  cancelButton: {
    backgroundColor: theme.palette.error.main,
    color: "white",
    marginTop: "6px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark
    },
  }
}));

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

// component ini akan view task yang teacher dia sendiri buat.
function ViewTaskTeacher(props) {
  const classes = useStyles();

  const { 
    user, 
    all_students, 
    all_teachers
  } = props.auth;
  const {
    deleteTask,
    tasksCollection,
    downloadLampiran,
    previewLampiran,
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
    createTaskComment,
    editTaskComment,
    deleteTaskComment,
    getMultipleFileAvatar
  } = props;
  const { all_classes_map } = props.classesCollection;
  const task_id = props.match.params.id;
  const { all_subjects_map } = props.subjectsCollection;
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [fileLampiran, setFileLampiran] = React.useState([]);

  // untuk men-disable tombol yang mengarahkan pengguna ke SubmittedTaskList ketika belum ada satupun murid yang mengumpulkan tugas
  const [disableButton, setDisableButton] = React.useState(true);

  // USER COMMENT
  const [commentValue, setCommentValue] = React.useState("");
  const [commentEditorValue, setCommentEditorValue] = React.useState("");
  const [commentList, setCommentList] = React.useState([]);
  const [commentAvatar, setCommentAvatar] = React.useState({});
  const [selectedCommentIdx, setSelectedCommentIdx] = React.useState(null);
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = React.useState(null);
  const [deleteCommentIdx, setDeleteCommentIdx] = React.useState(null);
  const deleteDialogHandler = React.useRef(null);

  // SNACKBAR
  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openCommentSnackbar, setOpenCommentSnackbar] = React.useState(false);

  React.useEffect(() => {
    getOneTask(task_id);
    getAllClass("map");
    getAllSubjects("map");
    getFileTasks(task_id).then((res) => {
      setFileLampiran(res);
    });
    getStudents();
    getTeachers();
    clearErrors();
    clearSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // [tasksCollection._id, all_classes_map.size, all_subjects_map.size]

  React.useEffect(() => {
    if (
      tasksCollection &&
      Object.keys(tasksCollection).length !== 0 &&
      all_students &&
      all_students.length !== 0
    ) {
      // untuk setiap murid yang ada,
      for (let j = 0; j < all_students.length; j++) {
        // jika murid ini mendapatkan tugas ini
        if (
          tasksCollection.class_assigned &&
          tasksCollection.class_assigned.includes(all_students[j].kelas)
        ) {
          // untuk setiap file yang pernah dikumpulkan murid ini,
          for (const studentTask of all_students[j].tugas) {
            // jika file ditujukan untuk tugas ini,
            if (studentTask.for_task_object === task_id) {
              setDisableButton(false);
              return;
            }
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksCollection, all_students]);

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
      setCommentList(tasksCollection.comments.map((comment) => ({ ...comment, name: usernames[comment.author_id] })));
      
      // memindahkan textfield edit
      if (selectedCommentIdx !== null && deleteCommentIdx !== null && deleteCommentIdx < selectedCommentIdx) {
        setSelectedCommentIdx(selectedCommentIdx - 1);
      }
      setDeleteCommentIdx(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksCollection, all_teachers, all_students]);

  React.useEffect(() => {
    let listId = []
    commentList.map((comment) => {
      listId.push(comment.author_id)
    })
    listId.push(user._id)
    getMultipleFileAvatar(listId).then((results) => {
      setCommentAvatar(results);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentList]);

  React.useEffect(() => {
    if (
      errors &&
      errors.constructor === Object &&
      Object.keys(errors).length !== 0
    ) {
      let content = "Komentar gagal ";
      if (errors.action === "createTaskComment") {
        content += "dibuat";
      } else if (errors.action === "editTaskComment") {
        content += "disunting";
      } else if (errors.action === "deleteTaskComment") {
        content += "dihapus";
      } else {
        return;
      }
      handleOpenCommentSnackbar("error", content);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  React.useEffect(() => {
    if (
      success &&
      success.constructor === Object
    ) {
      let content = "Komentar berhasil ";
      if (success.action === "createTaskComment") {
        content += "dibuat";
        setCommentValue("");
      } else if (success.action === "editTaskComment") {
        content += "disunting";
      } else if (success.action === "deleteTaskComment") {
        content += "dihapus";
      } else {
        return;
      }
      handleOpenCommentSnackbar("success", content);
      getOneTask(task_id);
      clearSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

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
    setSelectedCommentIdx(idx)
  };

  const handleCreateComment = () => {
    if (commentValue.length === 0) {
      handleOpenCommentSnackbar("error", "Isi komentar tidak boleh kosong");
    } else {
      createTaskComment(task_id, {
        author_id: user._id,
        content: commentValue
      });
    }
  };

  const handleEditComment = () => {
    if (commentEditorValue.length === 0) {
      handleOpenDeleteCommentDialog(selectedCommentIdx);
    } else {
      editTaskComment(task_id, commentEditorValue, commentList[selectedCommentIdx]._id);
      closeEditMode();
    }
  };

  const handleDeleteComment = (idx) => {
    let newCommentList = [...commentList];
    newCommentList.splice(idx, 1);
    deleteTaskComment(task_id, commentList[idx]._id);
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
  /* UNTUK YANG BUKAN CDN
  // const onDownloadFile = (id, fileCategory = "none") => {
  //   if (fileCategory === "lampiran") downloadLampiran(id);
  //   else console.log("File Category is not specified");
  // };

  // const onPreviewFile = (id, fileCategory = "none") => {
  //   if (fileCategory === "lampiran") previewLampiran(id);
  //   else console.log("File Category is not specified");
  // };
  */

  const onDeleteTask = (id) => {
    deleteTask(id);
    // setFileTugas(null)
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenDeleteCommentDialog = (idx) => {
    setOpenDeleteCommentDialog(true);
    deleteDialogHandler.current =  (idx === selectedCommentIdx) 
    ? () => {
      handleDeleteComment(idx);
      closeEditMode();
    }
    : () => {
      handleDeleteComment(idx);
    }
  };

  const handleCloseDeleteCommentDialog = () => {
    // setDeleteCommentIdx(null) akan dijalankan setelah task dimuat ulang 
    setOpenDeleteCommentDialog(false);
  };

  // Komentar
  // Kalau avatar belum ada, pakai default
  
  const generateComments = (author_id, authorName, date, comment, isSelfMade, idx, edited) => {
    return (
      <Grid container item xs={12} direction="row" spacing={2}>
        <Hidden smUp>
          <Grid item xs={1} sm={0} className={classes.smAvatar}>
            <Avatar src={commentAvatar[author_id]}/>
          </Grid>
        </Hidden>
        <Hidden xsDown>
          <Grid item className={classes.smAvatar}>
            <Avatar src={commentAvatar[author_id]}/>
          </Grid>
        </Hidden>
        <Grid item xs={10} sm={10} md={11}>
          <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <Typography style={{marginRight: "10px", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "50px", overflow: "hidden"}}>
              <b>{authorName}</b>
            </Typography>
            {edited === true ? 
              <Typography color="textSecondary" variant="body2" style={{marginRight: "10px"}}>Edited</Typography> 
            : null}
            <Typography color="textSecondary" variant="body2" style={{marginRight: "10px"}}>
              {moment(date)
                    .locale("id")
                    .format("DD MMM YYYY, HH.mm")}
            </Typography>
            {(isSelfMade && !(selectedCommentIdx !== null && selectedCommentIdx === idx)) ?
              <>
                <LightTooltip title="Sunting">
                  <CreateIcon
                    style={{marginRight: "2px"}}
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
            : null}
          </div>
          {(selectedCommentIdx !== null && selectedCommentIdx === idx) ?
              <div style={{display: "flex", flexDirection: "column"}}>
                <TextField
                  variant="outlined"
                  onChange={handleCommentEditorChange}
                  value={commentEditorValue}
                  style={{marginTop: "5px"}}
                  multiline
                />
                <div style={{display: "flex", alignItems: "center"}}>
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
            :
              <Typography style={{marginTop: "5px"}}>{comment}</Typography>
          }
        </Grid>
      </Grid>
    )
  }

  document.title = !tasksCollection.name
    ? "Schooly | Lihat Tugas"
    : `Schooly | ${tasksCollection.name}`;

  return (
    <div className={classes.root}>
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
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Paper className={classes.paperBox}>
            <Grid container spacing={2}>
              <Grid item xs={12} style={{ paddingBottom: "0" }}>
                <Typography variant="h4">{tasksCollection.name}</Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  gutterBottom
                >
                  <h6>{all_subjects_map.get(tasksCollection.subject)}</h6>
                </Typography>
              </Grid>

              <Grid item xs={12} md={7} style={{ paddingTop: "0" }}>
                <Typography variant="body2" color="textSecondary">
                  Oleh: <b>{user.name}</b>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Waktu Dibuat:{" "}
                  {moment(tasksCollection.createdAt)
                    .locale("id")
                    .format("DD MMM YYYY, HH.mm")}
                </Typography>
                <Hidden mdUp>
                  <Typography variant="body2" color="textSecondary">
                    Tenggat:{" "}
                    {moment(tasksCollection.deadline)
                      .locale("id")
                      .format("DD MMM YYYY, HH.mm")}
                  </Typography>
                </Hidden>
              </Grid>
              <Hidden smDown style={{ display: "flex" }}>
                <Grid
                  item
                  xs={12}
                  md={5}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography
                    variant="body2"
                    align="right"
                    color="textSecondary"
                  >
                    Tenggat:{" "}
                    {moment(tasksCollection.deadline)
                      .locale("id")
                      .format("DD MMM YYYY, HH.mm")}
                  </Typography>
                </Grid>
              </Hidden>

              <Grid item xs={12}>
                <Divider className={classes.dividerColor} />
              </Grid>

              <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                  Kelas yang Diberikan:
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
              {!tasksCollection.description ? null : (
                <Grid item xs={12} style={{ marginTop: "15px" }}>
                  <Typography color="textSecondary" gutterBottom>
                    Deskripsi Tugas:
                  </Typography>
                  <Typography>{tasksCollection.description}</Typography>
                </Grid>
              )}
              {fileLampiran.length === 0 ? null : (
                <Grid item xs={12} style={{ marginTop: "15px" }}>
                  <Typography color="textSecondary" gutterBottom>
                    Lampiran Berkas:
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
        <Grid item>
          <Paper className={classes.paperBox} style={{marginTop: "20px"}}>
            <Grid container spacing={2}>
              <Grid item xs={12} style={{ paddingBottom: "0" }}>
                <Typography variant="h6">Komentar Kelas</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {
                (commentList.length !== 0) ?
                  <>
                    {
                      commentList.map((comment, idx) => (
                        generateComments(comment.author_id, comment.name, comment.createdAt, comment.content, comment.author_id === user._id, idx, comment.edited)
                      ))
                    }
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </>
                : null
              }
              {/* {
                (commentList.length === 0) ?
                  <Grid item xs={12}>
                    <Typography color="textSecondary" align="center">Belum ada komentar</Typography>
                  </Grid>
                : null
              } */}
              <Grid container item xs={12} direction="row" spacing={2} alignItems="center">
                <Hidden xsDown>
                  <Grid item className={classes.smAvatar}>
                    <Avatar src={commentAvatar[user._id]}/>
                  </Grid>
                  <Grid item sm={10} md={11}>
                    <TextField
                      className={classes.textField}
                      variant="outlined"
                      multiline
                      style={{display: "flex"}}
                      InputProps={{style: {borderRadius: "15px"}}}
                      placeholder="Tambahkan komentar..."
                      onChange={handleCommentInputChange}
                      value={commentValue}
                    />
                  </Grid>
                  <Grid item style={{maxWidth: "10px"}}>
                    <LightTooltip title="Kirim">
                      <SendIcon className={classes.sendIcon} onClick={handleCreateComment}/>
                    </LightTooltip>
                  </Grid>
                </Hidden>
                <Hidden smUp>
                  <Grid item style={{width: "52px"}}>
                    <Avatar src={commentAvatar[user._id]} />
                  </Grid>
                  <Grid container item xs={10} direction="row" alignItems="center">
                    <Grid item xs={11}>
                      <TextField
                        className={classes.textField}
                        variant="outlined"
                        multiline
                        style={{display: "flex"}}
                        InputProps={{style: {borderRadius: "15px"}}}
                        placeholder="Tambahkan komentar..."
                        onChange={handleCommentInputChange}
                        value={commentValue}
                      />
                    </Grid>
                    <Grid container item xs={1} justify="flex-end">
                      <Grid item xs={1}>
                        <LightTooltip title="Kirim">
                          <SendIcon className={classes.sendIcon} onClick={handleCreateComment}/>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                </Hidden>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item container justify="flex-end" alignItems="center">
          <Grid item style={{ paddingRight: "10px" }}>
            {disableButton ? (
              <Fab
                variant="extended"
                className={classes.seeAllTaskButton}
                disabled
              >
                <AssignmentIcon style={{ marginRight: "7.5px" }} />
                Lihat Hasil
              </Fab>
            ) : (
              <Link to={`/daftar-tugas-terkumpul/${task_id}`}>
                <Fab variant="extended" className={classes.seeAllTaskButton}>
                  <AssignmentIcon style={{ marginRight: "7.5px" }} />
                  Lihat Hasil
                </Fab>
              </Link>
            )}
          </Grid>
          <Grid item style={{ paddingRight: "10px" }}>
            <Link to={`/sunting-tugas/${task_id}`}>
              <LightTooltip title="Sunting Tugas" placement="bottom">
                <Fab className={classes.editTaskButton}>
                  <EditIcon />
                </Fab>
              </LightTooltip>
            </Link>
          </Grid>
          <Grid item>
            <LightTooltip title="Hapus" placement="bottom">
              <Fab
                className={classes.deleteTaskButton}
                onClick={(e) => handleOpenDeleteDialog(e, task_id)}
              >
                <DeleteIcon />
              </Fab>
            </LightTooltip>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={openCommentSnackbar}
        autoHideDuration={3000}
        onClose={(event, reason) => {
          handleCloseCommentSnackbar(event, reason);
        }}
      >
        <MuiAlert
          variant="filled"
          severity={severity}
          onClose={(event, reason) => {
            handleCloseCommentSnackbar(event, reason);
          }}
        >
          {snackbarContent}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

ViewTaskTeacher.propTypes = {
  auth: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  downloadLampiran: PropTypes.func.isRequired,
  previewLampiran: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  updateUserData: PropTypes.func.isRequired,
  getOneUser: PropTypes.func.isRequired, // For the person in charge task
  getTaskFilesByUser: PropTypes.func.isRequired, // Get the task files.
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
  uploadTugas,
  deleteTask,
  downloadLampiran,
  previewLampiran,
  getOneTask,
  getOneUser,
  getAllClass,
  getAllSubjects,
  getFileTasks,
  downloadFileTasks,
  viewFileTasks,
  clearSuccess,
  clearErrors,
  createTaskComment,
  editTaskComment,
  deleteTaskComment,
  getTeachers,
  getStudents,
  getMultipleFileAvatar
})(ViewTaskTeacher);
