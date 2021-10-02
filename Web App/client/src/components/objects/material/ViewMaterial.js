import React from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import CustomLinkify from "../../misc/linkify/Linkify";
import {
  getFileMaterials,
  downloadFileMaterial,
  viewFileMaterial,
} from "../../../actions/files/FileMaterialActions";
import { getSelectedClasses, getAllClass } from "../../../actions/ClassActions";
import {
  getTeachers,
  getStudents
} from "../../../actions/UserActions";
import {
  getOneMaterial,
  deleteMaterial,
  createMaterialComment,
  editMaterialComment,
  deleteMaterialComment
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
  Button,
  Divider,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Create as CreateIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
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
  materialPaper: {
    padding: "20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px",
    },
  },
  materialDivider: {
    margin: "22.5px 0px",
    backgroundColor: theme.palette.primary.light,
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
  commentActionButton: {
    width: "18px",
    height: "18px",
    "&:focus, &:hover": {
      backgroundColor: "#F1F1F1",
    },
  },
  commentActionIcon: {
    fontSize: "18px",
  },
  commentLittleIcon: {
    color: theme.palette.text.disabled,
    opacity: 0.5,
    "&:focus, &:hover": {
      opacity: 1,
      cursor: "pointer"
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
      backgroundColor: theme.palette.success.dark
    },
  },
}));

const path = require("path");

function LampiranFile(props) {
  const classes = useStyles();

  const { file_id, filename, filetype, onDownloadFile, onPreviewFile } = props;

  var req = null;
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
        </ListItem>
      </Paper>
    </Grid>
  );
}

function ViewMaterial(props) {
  const classes = useStyles();
  const history = useHistory();
  const {
    deleteMaterial,
    // getOneUser,
    getAllSubjects,
    viewFileMaterial,
    downloadFileMaterial,
    getOneMaterial,
    getAllClass,
    getFileMaterials,
    getTeachers,
    getStudents,
    clearErrors,
    clearSuccess,
    getFileAvatar,
    getMultipleFileAvatar
  } = props;
  const { user, all_students, all_teachers } = props.auth;
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedMaterials, all_materials } = props.materialsCollection;
  const materi_id = props.match.params.id;

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [fileLampiran, setFileLampiran] = React.useState([]);
  const materialAuthorName = React.useRef(null);

  // Comment
  const [commentValue, setCommentValue] = React.useState("");
  const [commentEditorValue, setCommentEditorValue] = React.useState("");
  const [commentList, setCommentList] = React.useState([]);
  const [commentAvatar, setCommentAvatar] = React.useState({});
  const [selectedCommentIdx, setSelectedCommentIdx] = React.useState(null);
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = React.useState(null);
  const [deleteCommentIdx, setDeleteCommentIdx] = React.useState(null);
  const deleteDialogHandler = React.useRef(null);

  // Snackbar
  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openCommentSnackbar, setOpenCommentSnackbar] = React.useState(false);

  React.useEffect(() => {
    getAllSubjects("map"); // This will get the selectedMaterials.
    getOneMaterial(materi_id);
    getAllClass("map");
    getFileMaterials(materi_id).then((result) => {
      setFileLampiran(result);
    });
    getStudents();
    getTeachers();
    clearErrors();
    clearSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      materialAuthorName.current = usernames[selectedMaterials.author_id];

      setCommentList(selectedMaterials.comments.map((comment) => ({ ...comment, name: usernames[comment.author_id] })));
      if (selectedCommentIdx !== null && deleteCommentIdx !== null && deleteCommentIdx < selectedCommentIdx) {
        // Move edit textfield.
        setSelectedCommentIdx(selectedCommentIdx - 1);
      }
      setDeleteCommentIdx(null);
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
      createMaterialComment(materi_id, {
        author_id: user._id,
        content: commentValue
      }).then(() => {
        handleOpenCommentSnackbar("success", "Komentar berhasil dibuat");
        setCommentValue("");
        getOneMaterial(materi_id);
      }).catch(() => {
        handleOpenCommentSnackbar("error", "Komentar gagal dibuat");
      });
    }
  };

  const handleEditComment = () => {
    if (commentEditorValue.length === 0) {
      handleOpenDeleteCommentDialog(selectedCommentIdx);
    } else {
      editMaterialComment(materi_id, commentEditorValue, commentList[selectedCommentIdx]._id).then(() => {
        handleOpenCommentSnackbar("success", "Komentar berhasil disunting");
        getOneMaterial(materi_id);
      }).catch(() => {
        handleOpenCommentSnackbar("error", "Komentar gagal disunting");
      });
      closeEditMode();
    }
  };

  const handleDeleteComment = (idx) => {
    deleteMaterialComment(materi_id, commentList[idx]._id).then(() => {
      handleOpenCommentSnackbar("success", "Komentar berhasil dihapus");
      getOneMaterial(materi_id);
    }).catch(() => {
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

  const onDeleteMaterial = (id) => {
    deleteMaterial(id, history).then((res) => {
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
    deleteDialogHandler.current =  (idx === selectedCommentIdx)
    ? () => {
      handleDeleteComment(idx);
      closeEditMode();
    }
    : () => {
      handleDeleteComment(idx);
    }  };
  const handleCloseDeleteCommentDialog = () => {
    // setDeleteCommentIdx(null) will be run after material is reloaded.
    setOpenDeleteCommentDialog(false);
  };

  // Comment
  const generateComments = (author_id, authorName, date, comment, isSelfMade, idx, edited) => {
    return (
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <Avatar src={commentAvatar[author_id]} />
        </Grid>
        <Grid item xs zeroMinWidth container>
          <Grid item xs={12} container alignItems="center" spacing={1}>
            <Grid item xs zeroMinWidth>
              <Typography variant="body2" noWrap gutterBottom>
                {authorName} <span style={{ color: "grey" }}>
                {edited === true ? "(Disunting)" : null} • {moment(date)
                .locale("id").format("DD MMM YYYY, HH.mm")}</span>
              </Typography>
            </Grid>
            {(isSelfMade && !(selectedCommentIdx !== null && selectedCommentIdx === idx)) ?
              <Grid item>
                <IconButton className={classes.commentActionButton}>
                  <MoreVertIcon className={classes.commentActionIcon}/>
                </IconButton>
                {/*<LightTooltip title="Sunting">
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
                </LightTooltip>*/}
              </Grid>
            : null}
          </Grid>
          <Grid item xs={12}>
          {(selectedCommentIdx !== null && selectedCommentIdx === idx) ?
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
          :
            <Typography align="justify" style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
              {comment}
            </Typography>
          }
          </Grid>
        </Grid>
      </Grid>
    )
  }

  document.title = !selectedMaterials.name
    ? "Schooly | Lihat Materi"
    : `Schooly | ${selectedMaterials.name}`;

  return (
    <div className={classes.root}>
      <Grid container wrap="nowrap" direction="column" spacing={3}>
        <Grid item>
          <Paper className={classes.materialPaper}>
            <Typography variant="h4" style={{ marginBottom: "5px" }}>
              {selectedMaterials.name}
            </Typography>
            <Typography color="primary" paragraph>
              Materi {all_subjects_map.get(selectedMaterials.subject)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Oleh: {materialAuthorName.current}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Waktu Dibuat: {moment(selectedMaterials.createdAt)
                .locale("id")
                .format("DD MMM YYYY, HH.mm")}
            </Typography>
            <Divider className={classes.materialDivider} />
            <Grid container spacing={4}>
              {user.role === "Teacher" ? (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Diberikan kepada:
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
              <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                  Deskripsi Materi:
                </Typography>
                <Typography
                  align="justify"
                  style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                  <CustomLinkify text={selectedMaterials.description} />
                </Typography>
              </Grid>
              {fileLampiran.length === 0 ? null : (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Lampiran:
                  </Typography>
                  <Grid container spacing={1}>
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
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        {user.role === "Teacher" ? (
          <Grid item container justify="flex-end" alignItems="center" spacing={1}>
            <Grid item>
              <Link to={`/sunting-materi/${materi_id}`}>
                <Hidden xsDown>
                  <Button
                    variant="outlined"
                    className={classes.editButton}
                    startIcon={<EditIcon style={{ color: "grey" }} />}
                  >
                    <Typography>
                      Sunting
                    </Typography>
                  </Button>
                </Hidden>
                <Hidden smUp>
                  <Tooltip title="Sunting">
                    <Button
                      variant="outlined"
                      className={classes.editButton}
                    >
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
                  onClick={(e) => handleOpenDeleteDialog(e, materi_id)}
                >
                  <Typography>
                    Hapus
                  </Typography>
                </Button>
              </Hidden>
              <Hidden smUp>
                <Tooltip title="Hapus">
                  <Button
                    variant="outlined"
                    className={classes.deleteButton}
                    onClick={(e) => handleOpenDeleteDialog(e, materi_id)}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              </Hidden>
            </Grid>
          </Grid>
        ) : null}
        <Grid item>
          <Paper className={classes.commentPaper}>
            <Typography variant="h6" gutterBottom>
              Komentar
            </Typography>
            <Divider />
            {(commentList.length !== 0) ?
                <div style={{ padding: "16px 0px" }}>
                  <Grid container wrap="nowrap" direction="column" spacing={2}>
                    {commentList.map((comment, idx) => (
                        <Grid item>
                          {generateComments(comment.author_id, comment.name, comment.createdAt, comment.content, comment.author_id === user._id, idx, comment.edited)}
                        </Grid>
                      ))
                    }
                  </Grid>
                  <Divider style={{ marginTop: "16px" }} />
                </div>
              : null
            }
            <Grid container spacing={2}>
              <Grid item>
                <Avatar src={commentAvatar[user._id]}/>
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  placeholder="Tambahkan komentar..."
                  onChange={handleCommentInputChange}
                  value={commentValue}
                  InputProps={{
                    style: {
                      borderRadius: "20px",
                      padding: "12.5px 0px"
                     },
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        style={{ marginRight: "5px" }}
                      >
                        <LightTooltip title="Kirim">
                          <IconButton size="small" onClick={handleCreateComment}>
                            <SendIcon />
                          </IconButton>
                        </LightTooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Materi"
        itemName={selectedMaterials.name}
        deleteItem={() => {
          onDeleteMaterial(materi_id);
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

ViewMaterial.propTypes = {
  auth: PropTypes.object.isRequired,
  materialsCollection: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  materialsFiles: PropTypes.object.isRequired,
  deleteMaterial: PropTypes.func.isRequired,
  // getOneUser: PropTypes.func.isRequired, // For the person in charge task
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
  // errors: state.errors,
  // success: state.success
});

export default connect(mapStateToProps, {
  getAllSubjects,
  getOneMaterial,
  deleteMaterial,
  // getOneUser,
  getAllClass,
  getSelectedClasses,
  getFileMaterials,
  viewFileMaterial,
  downloadFileMaterial,
  getTeachers,
  getStudents,
  clearErrors,
  clearSuccess,
  getFileAvatar,
  getMultipleFileAvatar
})(ViewMaterial);
