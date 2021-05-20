import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import CustomLinkify from "../../misc/linkify/Linkify";
import { clearSuccess } from "../../../actions/SuccessActions";
import { uploadTugas, deleteTugas } from "../../../actions/UploadActions";
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
import { getOneTask } from "../../../actions/TaskActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getTaskFilesByUser } from "../../../actions/UploadActions";
import { getOneUser } from "../../../actions/UserActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import UploadDialog from "../../misc/dialog/UploadDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  Hidden,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Link,
  Paper,
  Typography,
  Badge,
  Snackbar,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import MuiAlert from "@material-ui/lab/Alert";
import DeleteIcon from "@material-ui/icons/Delete";
import PublishIcon from "@material-ui/icons/Publish";
import {
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";

const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    padding: "10px",
  },
  paperBox: {
    padding: "20px",
  },
  deadlineWarningText: {
    color: theme.palette.warning.main,
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
  submitWorkButton: {
    width: "200px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  listItemPaper: {
    marginTop: "5px",
    marginBottom: "5px",
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  downloadIconButton: {
    marginLeft: "5px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteIconButton: {
    marginLeft: "7.5px",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
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
  submittedButton: {
    margin: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "5px",
    paddingLeft: "10px",
    paddingRight: "10px",
    maxWidth: "100px",
    backgroundColor: theme.palette.error.main,
    color: "white",
  },
  checkButton: {
    borderRadius: "100%",
    backgroundColor: theme.palette.success.main,
    color: "white",
    marginBottom: "10px",
    marginRight: "10px",
  },
  listItemPaperSubmitted: {
    backgroundColor: "#f2f2f2",
    marginTop: "5px",
    marginBottom: "5px",
  },
  fileNameTrim: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    marginRight: "13px",
  },
}));

function LampiranFile(props) {
  const classes = useStyles();

  const { file_id, filename, filetype, onDownloadFile, onPreviewFile } = props;

  let displayedName = "";
  filename.length >= 16
    ? (displayedName = `${filename.slice(0, 15)}..${path.extname(filename)}`)
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
                <Typography className={classes.fileNameTrim}>
                  {displayedName}
                </Typography>
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

function WorkFile(props) {
  const classes = useStyles();

  const {
    file_id,
    file_name,
    file_type,
    onDownloadFile,
    onPreviewFile,
    handleOpenDeleteDialog,
    type,
  } = props;

  let displayedName = file_name;

  return (
    <>
      {type === "chosen" ? (
        <Paper variant="outlined" className={classes.listItemPaper}>
          <ListItem disableRipple className={classes.listItem}>
            <ListItemAvatar>
              {file_type === "Word" ? (
                <Avatar className={classes.wordFileTypeIcon}>
                  <FaFileWord />
                </Avatar>
              ) : file_type === "Excel" ? (
                <Avatar className={classes.excelFileTypeIcon}>
                  <FaFileExcel />
                </Avatar>
              ) : file_type === "Gambar" ? (
                <Avatar className={classes.imageFileTypeIcon}>
                  <FaFileImage />
                </Avatar>
              ) : file_type === "PDF" ? (
                <Avatar className={classes.pdfFileTypeIcon}>
                  <FaFilePdf />
                </Avatar>
              ) : file_type === "Teks" ? (
                <Avatar className={classes.textFileTypeIcon}>
                  <FaFileAlt />
                </Avatar>
              ) : file_type === "Presentasi" ? (
                <Avatar className={classes.presentationFileTypeIcon}>
                  <FaFilePowerpoint />
                </Avatar>
              ) : file_type === "File Lainnya" ? (
                <Avatar className={classes.otherFileTypeIcon}>
                  <FaFile />
                </Avatar>
              ) : null}
            </ListItemAvatar>
            <ListItemText
              primary={
                <LightTooltip title={file_name} placement="top">
                  <Typography
                    variant="subtitle2"
                    className={classes.fileNameTrim}
                  >
                    {displayedName}
                  </Typography>
                </LightTooltip>
              }
              secondary={file_type}
            />
          </ListItem>
        </Paper>
      ) : (
        <Paper variant="outlined" className={classes.listItemPaperSubmitted}>
          <ListItem
            button
            disableRipple
            className={classes.listItem}
            onClick={() => {
              onPreviewFile(file_id, "tugas");
            }}
          >
            <ListItemAvatar>
              {file_type === "Word" ? (
                <LightTooltip title="Terkumpul">
                  <Badge
                    badgeContent={
                      <PublishIcon
                        className={classes.checkButton}
                        fontSize="small"
                      />
                    }
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar className={classes.wordFileTypeIcon}>
                      <FaFileWord />
                    </Avatar>
                  </Badge>
                </LightTooltip>
              ) : file_type === "Excel" ? (
                <LightTooltip title="Terkumpul">
                  <Badge
                    badgeContent={
                      <PublishIcon
                        className={classes.checkButton}
                        fontSize="small"
                      />
                    }
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar className={classes.excelFileTypeIcon}>
                      <FaFileExcel />
                    </Avatar>
                  </Badge>
                </LightTooltip>
              ) : file_type === "Gambar" ? (
                <LightTooltip title="Terkumpul">
                  <Badge
                    badgeContent={
                      <PublishIcon
                        className={classes.checkButton}
                        fontSize="small"
                      />
                    }
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar className={classes.imageFileTypeIcon}>
                      <FaFileImage />
                    </Avatar>
                  </Badge>
                </LightTooltip>
              ) : file_type === "PDF" ? (
                <LightTooltip title="Terkumpul">
                  <Badge
                    badgeContent={
                      <PublishIcon
                        className={classes.checkButton}
                        fontSize="small"
                      />
                    }
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar className={classes.pdfFileTypeIcon}>
                      <FaFilePdf />
                    </Avatar>
                  </Badge>
                </LightTooltip>
              ) : file_type === "Teks" ? (
                <LightTooltip title="Terkumpul">
                  <Badge
                    badgeContent={
                      <PublishIcon
                        className={classes.checkButton}
                        fontSize="small"
                      />
                    }
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar className={classes.textFileTypeIcon}>
                      <FaFileAlt />
                    </Avatar>
                  </Badge>
                </LightTooltip>
              ) : file_type === "Presentasi" ? (
                <LightTooltip title="Terkumpul">
                  <Badge
                    badgeContent={
                      <PublishIcon
                        className={classes.checkButton}
                        fontSize="small"
                      />
                    }
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar className={classes.presentationFileTypeIcon}>
                      <FaFilePowerpoint />
                    </Avatar>
                  </Badge>
                </LightTooltip>
              ) : file_type === "File Lainnya" ? (
                <LightTooltip title="Terkumpul">
                  <Badge
                    badgeContent={
                      <PublishIcon
                        className={classes.checkButton}
                        fontSize="small"
                      />
                    }
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar className={classes.otherFileTypeIcon}>
                      <FaFile />
                    </Avatar>
                  </Badge>
                </LightTooltip>
              ) : null}
            </ListItemAvatar>
            <ListItemText
              primary={
                <LightTooltip title={file_name} placement="top">
                  <Typography
                    variant="subtitle2"
                    className={classes.fileNameTrim}
                  >
                    {displayedName}
                  </Typography>
                </LightTooltip>
              }
              secondary={file_type}
            />
            {/* <IconButton
              size="small"
              className={classes.downloadIconButton}
              onClick={(e) => {
                e.stopPropagation();
                onDownloadFile(file_id, "tugas");
              }}
            >
              <CloudDownloadIcon fontSize="small" />
            </IconButton> */}
            <IconButton
              size="small"
              className={classes.deleteIconButton}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDeleteDialog(props.file_id, props.file_name);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItem>
        </Paper>
      )}
    </>
  );
}

function ViewTaskStudent(props) {
  const classes = useStyles();

  const { user, selectedUser } = props.auth;
  const {
    uploadFileSubmitTasks,
    viewFileSubmitTasks,
    downloadFileSubmitTasks,
    getFileSubmitTasks_AT,
    deleteFileSubmitTasks,
    deleteTugas,
    success,
    tasksCollection,
    filesCollection,
    clearSuccess,
    getOneTask,
    getOneUser,
    getAllSubjects,
    getFileTasks,
    viewFileTasks,
    downloadFileTasks,
  } = props;
  const { all_subjects_map } = props.subjectsCollection;

  // const theme = useTheme();
  // ref itu untuk ngerefer html yang ada di render.

  const tugasUploader = React.useRef(null);
  const uploadedTugas = React.useRef(null);
  const [fileTugas, setFileTugas] = React.useState([]);
  const [fileToSubmit, setFileToSubmit] = React.useState([]);
  // const [tasksContents, setTaskContents] = React.useState([]);
  const [fileLampiran, setFileLampiran] = React.useState([]);
  const [over_limit, setOverLimit] = React.useState([]);
  const [fileLimitSnackbar, setFileLimitSnackbar] = React.useState(false);

  // setOpenDeleteDialog(true); // state openDeleteDialog akan berubah jadi true.
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedFileName, setSelectedFileName] = React.useState(null);
  const [selectedFileId, setSelectedFileId] = React.useState(null);

  let tugasId = props.match.params.id;
  // kalau misalnya parameter keduanya masukkin aja array kosong, dia acts like compomnentDidMount()
  // useEffect(() => {getAllSubjects("map")}, [])

  // This page is only for student later on, so for now put the user.role logic condition
  // Ini seperti componentDidUpdate(). yang didalam array itu kalau berubah, akan dirun lagi.
  useEffect(() => {
    // getTaskFilesByUser(user._id, tugasId)
    getFileSubmitTasks_AT(tugasId, user._id).then((results) =>
      setFileTugas(results)
    );
    getOneTask(tugasId);
    getAllSubjects("map");
    // Will run getOneUser again once the tasksCollection is retrieved
    getFileTasks(tugasId).then((results) => setFileLampiran(results));
    if (tasksCollection.person_in_charge_id) {
      getOneUser(tasksCollection.person_in_charge_id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, tasksCollection.person_in_charge_id]);

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

  const listWorkFile = () => {
    // Yang udah diupload
    return fileTugas.map((item) => (
      <WorkFile
        handleOpenDeleteDialog={handleOpenDeleteDialog}
        onDownloadFile={downloadFileSubmitTasks}
        onPreviewFile={viewFileSubmitTasks}
        file_name={item.filename}
        file_id={item._id}
        file_type={fileType(item.filename)}
        type="work"
      />
    ));
  };

  const listFileChosen = () => {
    // Yang belum diupload
    if (fileTugas.length === 0 && fileToSubmit.length === 0) {
      return (
        <Paper className={classes.submittedButton}>
          <Typography variant="button">KOSONG</Typography>
        </Paper>
      );
    } else {
      let temp = [];
      for (var i = 0; i < fileToSubmit.length; i++) {
        temp.push(
          <WorkFile
            handleOpenDeleteDialog={handleOpenDeleteDialog}
            file_name={fileToSubmit[i].name}
            file_id={fileToSubmit[i].id}
            file_type={fileType(fileToSubmit[i].name)}
            type="chosen"
          />
        );
      }
      return temp;
    }
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
  };

  const onSubmitTugas = (e) => {
    e.preventDefault();
    let formData = new FormData();
    // fileToSubmit ini bukan array biasa, itu FileList object.
    for (var i = 0; i < fileToSubmit.length; i++) {
      formData.append("tugas", fileToSubmit[i]);
    }
    handleOpenUploadDialog();
    // uploadTugas(formData, tugasId, user._id, new Date() < new Date(tasksCollection.deadline))
    uploadFileSubmitTasks(formData, tugasId, user._id);
    setFileToSubmit([]);
  };

  const handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFileLimitSnackbar(false);
  };
  // Delete Dialog
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true); // state openDeleteDialog akan berubah jadi true.
    setSelectedFileId(fileid);
    setSelectedFileName(filename);
    // getFileSubmitTasks_AT(tugasId, user._id).then((items) => setTaskContents(items))
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
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

  document.title = !tasksCollection.name
    ? "Schooly | Lihat Tugas"
    : `Schooly | ${tasksCollection.name}`;

  console.log("Ontime : ", new Date() < new Date(tasksCollection.deadline));
  console.log(success, filesCollection.files);

  return (
    <div className={classes.root}>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Berkas"
        itemName={selectedFileName}
        deleteItem={() => {
          deleteFileSubmitTasks(selectedFileId);
        }}
      />
      <UploadDialog
        openUploadDialog={openUploadDialog}
        success={success}
        messageUploading="Tugas sedang dikumpul"
        messageSuccess="Tugas telah dikumpul"
        handleCloseUploadDialog={handleCloseUploadDialog}
        redirectLink={false}
      />
      <Grid
        container
        spacing={2}
        justify="space-between"
        alignItems="stretch"
        style={{ marginBottom: "30px" }}
      >
        <Grid item xs={12} md={8}>
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
                  Oleh: &nbsp;
                  <b>
                    {selectedUser._id !== tasksCollection.person_in_charge_id
                      ? null
                      : selectedUser.name}
                  </b>
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

              {/* <Grid item xs={12} style={{ marginTop: "30px" }}>
                <Typography color="primary" gutterBottom>
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
              </Grid> */}
              {!tasksCollection.description ? null : (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Deskripsi Tugas:
                  </Typography>
                  <Typography>
                    <CustomLinkify text={tasksCollection.description} />
                  </Typography>
                  {/* <Typography>{tasksCollection.description}</Typography> */}
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
        <Grid item xs={12} md={4}>
          <Paper className={classes.paperBox}>
            <Grid item>
              <Typography
                variant="h5"
                align="center"
                style={{ marginBottom: "20px" }}
              >
                Hasil Pekerjaan
              </Typography>
            </Grid>
            <Divider />
            {/* <Grid
                item
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                  {listWorkFile()}
                  {listFileChosen()}
              </Grid> */}

            {fileTugas.length === 0 ? (
              <Grid
                item
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  // alignItems:"center",
                  justifyContent: "center",
                }}
              >
                {/* Kasus Kosong */}
                {listFileChosen()}
                {listWorkFile()}
              </Grid>
            ) : (
              <Grid
                item
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {listWorkFile()}
                {listFileChosen()}
              </Grid>
            )}
            <Divider />
            <Grid
              item
              container
              direction="column"
              alignItems="center"
              spacing={2}
              style={{ padding: "20px" }}
            >
              <form onSubmit={onSubmitTugas}>
                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="file"
                    multiple={true}
                    name="tugas"
                    onChange={handleTugasUpload}
                    ref={tugasUploader}
                    accept="file/*"
                    style={{ display: "none" }}
                  />
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
                </div>
                <div>
                  <Button
                    variant="contained"
                    startIcon={<PublishIcon />}
                    className={classes.submitWorkButton}
                    type="submit"
                    disabled={!fileTugas}
                    // onClick={handleOpenUploadDialog}
                  >
                    Kumpul Tugas
                  </Button>
                </div>
              </form>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Grid container direction="column" alignItems="center">
        <Typography variant="h6">
          Status:{" "}
          {!tasksCollection.grades
            ? "Belum Diperiksa"
            : !tasksCollection.grades[user._id]
            ? "Belum Diperiksa"
            : "Telah Diperiksa"}
        </Typography>
        <Typography variant="h4" gutterBottom>
          Nilai:{" "}
          {!tasksCollection.grades
            ? "N/A"
            : !tasksCollection.grades[user._id]
            ? "N/A"
            : `${tasksCollection.grades[user._id]}/100`}
        </Typography>
      </Grid>
      <Snackbar
        open={fileLimitSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" severity="error">
          {over_limit.length} file melebihi batas 10MB!
        </MuiAlert>
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
  tasksCollection: state.tasksCollection,
  subjectsCollection: state.subjectsCollection,
  filesCollection: state.filesCollection,
});

export default connect(mapStateToProps, {
  uploadTugas,
  clearSuccess,
  deleteTugas,
  getFileTasks,
  downloadFileTasks,
  viewFileTasks,
  getTaskFilesByUser,
  getOneUser,
  getOneTask,
  getAllSubjects,
  uploadFileSubmitTasks,
  getFileSubmitTasks_AT,
  viewFileSubmitTasks,
  downloadFileSubmitTasks,
  deleteFileSubmitTasks,
})(ViewTaskStudent);
