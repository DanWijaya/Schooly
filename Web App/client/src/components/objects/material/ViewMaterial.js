import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import {
  getFileMaterials,
  downloadFileMaterial,
  viewFileMaterial,
} from "../../../actions/files/FileMaterialActions";
import { getSelectedClasses, getAllClass } from "../../../actions/ClassActions";
import { 
  getOneUser, 
  getTeachers, 
  getStudents 
} from "../../../actions/UserActions";
import {
  getOneMaterial,
  deleteMaterial,
  updateMaterialComment
} from "../../../actions/MaterialActions";
import {
  getFileAvatar,
  getMultipleFileAvatar
} from "../../../actions/files/FileAvatarActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  CircularProgress,
  Fab,
  Grid,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  Divider,
  Hidden,
  TextField,
  Button,
  Snackbar
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
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
// REVIEW import

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
  deadlineWarningText: {
    color: theme.palette.warning.main,
  },
  seeAllTaskButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
    },
  },
  editButton: {
    marginRight: "10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteButton: {
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
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  downloadIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
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
      opacity: 0.5,
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
    // [theme.breakpoints.down("md")]: {
    //   minWidth: "110%"
    // },
    // [theme.breakpoints.down("sm")]: {
    //   maxWidth: "90%"
    // },
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

  var req = null;
  let displayedName = "";
  filename.length >= 31
    ? (displayedName = `${filename.slice(0, 30)}..${path.extname(filename)}`)
    : (displayedName = filename);
  return (
    <Grid item xs={6}>
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
            className={classes.downloadIconButton}
            onClick={(e) => {
              e.stopPropagation();
              onDownloadFile(file_id);
            }}
          >
            <CloudDownloadIcon className={classes.downloadIcon} />
          </IconButton> */}
        </ListItem>
        {/* <div id="myProgress" style="display:none;">
            sds
          </div>  */}
      </Paper>
    </Grid>
  );
}

function ViewMaterial(props) {
  const classes = useStyles();

  const { user, selectedUser, all_students, all_teachers } = props.auth;
  const {
    deleteMaterial,
    getOneUser,
    getAllSubjects,
    viewFileMaterial,
    downloadFileMaterial,
    getOneMaterial,
    getAllClass,
    getFileMaterials,
    getTeachers, 
    getStudents,
    updateMaterialComment,
    clearErrors,
    clearSuccess,
    getFileAvatar,
    getMultipleFileAvatar
  } = props;
  const { selectedMaterials, all_materials } = props.materialsCollection;
  const { all_classes_map } = props.classesCollection;
  const materi_id = props.match.params.id;
  const { all_subjects_map } = props.subjectsCollection;
  const errors = props.errors;
  const success = props.success;
  
  // REVIEW states
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [fileLampiran, setFileLampiran] = React.useState([]);

  // USER COMMENT
  const [commentValue, setCommentValue] = React.useState("");
  const [commentEditorValue, setCommentEditorValue] = React.useState("");
  const [commentList, setCommentList] = React.useState([]);
  const [commentAvatar, setCommentAvatar] = React.useState({});
  const [selectedCommentIdx, setSelectedCommentIdx] = React.useState(null);
  const commentActionType = React.useRef(null);

  // SNACKBAR
  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openCommentSnackbar, setOpenCommentSnackbar] = React.useState(false);

  console.log(props.materialsFiles);
  console.log(commentList);

  // REVIEW useeffects
  React.useEffect(() => {
    getAllSubjects("map"); // this will get the selectedMaterials.
    getOneMaterial(materi_id);
    getAllClass("map");
    // COba S3
    getFileMaterials(materi_id).then((result) => {
      setFileLampiran(result);
    });
    // bakal ngedapat collection of S3 files di
    
    getStudents();
    getTeachers();
    clearErrors();
    clearSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getOneUser(selectedMaterials.author_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMaterials.author_id]);

  React.useEffect(() => {
    if (
      all_students &&
      Array.isArray(all_students) &&
      all_teachers &&
      Array.isArray(all_teachers) &&
      selectedMaterials &&
      selectedMaterials.comments
    ) {
      let usernames = {};
      for (let studentInfo of all_students) {
        usernames[studentInfo._id] = studentInfo.name;
      }
      for (let teacherInfo of all_teachers) {
        usernames[teacherInfo._id] = teacherInfo.name;
      }
      
      setCommentList(selectedMaterials.comments.map((comment) => ({ ...comment, name: usernames[comment.author_id] })));
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMaterials, all_teachers, all_students]);

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
      errors.action === "updateMaterialComment"
    ) {
      let content = "Komentar gagal ";
      if (commentActionType.current === "create") {
        content += "dibuat";
      } else if (commentActionType.current === "edit") {
        content += "disunting";
      } else {
        content += "dihapus";
      }
      commentActionType.current = null;
      handleOpenCommentSnackbar("error", content);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  React.useEffect(() => {
    if (
      success &&
      success.constructor === Object &&
      success.action === "updateMaterialComment"
    ) {
      let content = "Komentar berhasil ";
      if (commentActionType.current === "create") {
        content += "dibuat";
      } else if (commentActionType.current === "edit") {
        content += "disunting";
      } else {
        content += "dihapus";
      }
      commentActionType.current = null;
      handleOpenCommentSnackbar("success", content);
      getOneMaterial(materi_id);
      setCommentValue("");
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


  // REVIEW handlers
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
      let newCommentList = commentList.map((comment) => {
        let filteredComment = { ...comment };
        delete filteredComment['name'];
        return filteredComment;
      });
      newCommentList.push({
        author_id: user._id,
        content: commentValue
      });
      updateMaterialComment(newCommentList, materi_id);
      commentActionType.current = "create";
    }
  };

  const handleEditComment = () => {
    if (commentEditorValue.length === 0) {
      handleDeleteComment(selectedCommentIdx);
    } else {
      let newCommentList = [...commentList];
      newCommentList[selectedCommentIdx].content = commentEditorValue;
      newCommentList[selectedCommentIdx].edited = true;
      updateMaterialComment(newCommentList, materi_id, selectedCommentIdx);
      commentActionType.current = "edit";
    }
    closeEditMode();
  };

  const handleDeleteComment = (idx) => {
    let newCommentList = [...commentList];
    newCommentList.splice(idx, 1);
    if (selectedCommentIdx !== null && idx < selectedCommentIdx) {
      setSelectedCommentIdx(selectedCommentIdx - 1);
    }
    updateMaterialComment(newCommentList, materi_id);
    commentActionType.current = "delete";
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
    deleteMaterial(id);
    // setFileMateri(null)
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
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
            <Typography style={{marginRight: "10px"}}><b>{authorName}</b></Typography>
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
                    onClick={() => handleDeleteComment(idx)}
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
        
        {/* <Hidden smUp>
          <div style={{display: "flex", flexDirection: "row", margin: "5px 0"}}>
            <div className={classes.marginMobile}>
              {(!avatar) ?
                <Avatar/>
              : 
                <Avatar src={avatar}/>
              }
            </div>
            <div>
              <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                <Typography style={{marginRight: "10px"}}><b>{stdName}</b></Typography>
                <Typography color="textSecondary" variant="body2" style={{marginRight: "10px"}}>{date}</Typography>
                {(isSelfMade) ?
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
                        onClick={() => handleDeleteComment(idx)}
                      />
                    </LightTooltip>
                  </>
                : null}
              </div>
              {(selectedCommentIdx !== null && selectedCommentIdx === idx) ?
                <>
                  <TextField
                    variant="outlined"
                    onChange={handleCommentEditorChange}
                    value={commentEditorValue}
                    style={{marginTop: "5px"}}
                    multiline
                    fullWidth
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
                </>
              :
                <Typography style={{marginTop: "5px"}}>{comment}</Typography>
              }
            </div>
          </div>
        </Hidden> */}
      </Grid>
    )
  }

  // Dummy Komentar
  // isSelfMade = true -> artinya komentar tersebut dibuat oleh user yang sedang login; false sebaliknya
  const dummyComments = [
    {
      avatar: false,
      name: "Nama Murid",
      date: "1 Jan 2021, 18:35",
      comment: "Jadi ceritanya pada interface tersebut dirancang sudah dipikirkan bahwa akan ada banyak sekali ragam Collections yang akan mengimplementasikan interface tersebut di class yang dibuat. Perancang interface menganggap bahwa bisa jadi ada collections jenis tertentu yang bisa jadi tidak membutuhkan methode tersebut, karenanya dia ditandai optional. Memang di Java bagaimanapun yang namanya methode di suatu interface tetap harus diimplementasikan di class yang menggunakannya namun bisa saja isinya \"kosong\" yaitu cuman mengirimkan UnsupportedOperationException.",
      isSelfMade: true
    },
    {
      avatar: false,
      name: "Gibran",
      date: "15 Feb 2021, 02:24",
      comment: "Jadi ceritanya pada interface tersebut dirancang sudah dipikirkan bahwa akan ada banyak sekali ragam Collections yang akan mengimplementasikan interface tersebut di class yang dibuat.",
      isSelfMade: false
    },
    {
      avatar: false,
      name: "Nama Murid",
      date: "29 Mar 2022, 20:08",
      comment: "Interface tersebut dapat dibuat dengan JavaFX",
      isSelfMade: true
    },
  ]

  document.title = !selectedMaterials.name
    ? "Schooly | Lihat Materi"
    : `Schooly | ${selectedMaterials.name}`;
  return (
    <div className={classes.root}>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Materi"
        itemName={selectedMaterials.name}
        deleteItem={() => {
          onDeleteTask(materi_id);
        }}
      />
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Paper className={classes.paperBox}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4">{selectedMaterials.name}</Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  gutterBottom
                >
                  <h6>{all_subjects_map.get(selectedMaterials.subject)}</h6>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Oleh: <b>{selectedUser.name}</b>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Waktu Dibuat:{" "}
                  {moment(selectedMaterials.createdAt)
                    .locale("id")
                    .format("DD MMM YYYY, HH.mm")}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider className={classes.dividerColor} />
              </Grid>

              {user.role === "Teacher" ? (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Kelas yang Diberikan:
                  </Typography>
                  <Typography>
                    {!selectedMaterials.class_assigned || !all_classes_map.size
                      ? null
                      : selectedMaterials.class_assigned.map((kelas, i) => {
                          if (all_classes_map.get(kelas)) {
                            if (
                              i ===
                              selectedMaterials.class_assigned.length - 1
                            )
                              return `${all_classes_map.get(kelas).name}`;
                            return `${all_classes_map.get(kelas).name}, `;
                          }
                          return null;
                        })}
                  </Typography>
                </Grid>
              ) : null}
              <Grid item xs={12} style={{ marginTop: "15px" }}>
                <Typography color="textSecondary" gutterBottom>
                  Deskripsi Materi:
                </Typography>
                <Typography>{selectedMaterials.description}</Typography>
              </Grid>
              {fileLampiran.map((lampiran) => (
                <LampiranFile
                  file_id={lampiran._id}
                  onPreviewFile={viewFileMaterial}
                  onDownloadFile={downloadFileMaterial}
                  filename={lampiran.filename}
                  filetype={fileType(lampiran.filename)}
                />
              ))}
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
                commentList.map((comment, idx) => (
                  generateComments(comment.author_id, comment.name, comment.createdAt, comment.content, comment.author_id === user._id, idx, comment.edited)
                ))
              }
              <Grid item xs={12}>
                <Divider />
              </Grid>
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
                    <Avatar src={`/api/upload/avatar/${user.avatar}`}/>
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
        {user.role === "Teacher" ? (
          <Grid item container justify="flex-end" alignItems="center">
            <Grid item>
              <Link to={`/sunting-materi/${materi_id}`}>
                <LightTooltip title="Sunting" placement="bottom">
                  <Fab className={classes.editButton}>
                    <EditIcon />
                  </Fab>
                </LightTooltip>
              </Link>
            </Grid>
            <Grid item>
              <LightTooltip title="Hapus" placement="bottom">
                <Fab
                  className={classes.deleteButton}
                  onClick={(e) => handleOpenDeleteDialog(e, materi_id)}
                >
                  <DeleteIcon />
                </Fab>
              </LightTooltip>
            </Grid>
          </Grid>
        ) : null}
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

ViewMaterial.propTypes = {
  auth: PropTypes.object.isRequired,
  materialsCollection: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  materialsFiles: PropTypes.object.isRequired,
  deleteMaterial: PropTypes.func.isRequired,
  getOneUser: PropTypes.func.isRequired, // For the person in charge task
  getOneMaterial: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getSelectedClasses: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getFileMaterials: PropTypes.func.isRequired,
  viewFileMaterial: PropTypes.func.isRequired,
  downloadFileMaterial: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  materialsCollection: state.materialsCollection,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  materialsFiles: state.materialsFiles,
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, {
  getAllSubjects,
  getOneMaterial,
  deleteMaterial,
  getOneUser,
  getAllClass,
  getSelectedClasses,
  getFileMaterials,
  viewFileMaterial,
  downloadFileMaterial,
  updateMaterialComment,
  getTeachers, 
  getStudents,
  clearErrors,
  clearSuccess,
  getFileAvatar,
  getMultipleFileAvatar
})(ViewMaterial);
