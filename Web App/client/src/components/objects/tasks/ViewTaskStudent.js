import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { clearSuccess } from "../../../actions/SuccessActions";
import {
  uploadTugas,
  deleteTugas,
  downloadTugas,
  previewTugas,
  downloadLampiran,
  previewLampiran,
} from "../../../actions/UploadActions";
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
  Paper,
  Typography,
  Badge,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
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
    maxWidth: "1000px",
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
  listItemPaperUnSubmitted: {
    backgroundColor: "#f2f2f2",
    marginTop: "5px",
    marginBottom: "5px",
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
            onPreviewFile(file_id, "lampiran");
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
          <IconButton
            size="small"
            className={classes.downloadIconButton}
            onClick={(e) => {
              e.stopPropagation();
              onDownloadFile(file_id, "lampiran");
            }}
          >
            <CloudDownloadIcon fontSize="small" />
          </IconButton>
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

  let displayedName = "";
  file_name.length >= 10
    ? (displayedName = `${file_name.slice(0, 7)}..${path.extname(file_name)}`)
    : (displayedName = file_name);

  return (
    <>
      {type === "chosen" ? (
        <Paper variant="outlined" className={classes.listItemPaper}>
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
                  <Typography variant="subtitle2">{displayedName}</Typography>
                </LightTooltip>
              }
              secondary={file_type}
            />
          </ListItem>
        </Paper>
      ) : (
        <Paper variant="outlined" className={classes.listItemPaperUnSubmitted}>
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
              ) : file_type === "Excel" ? (
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
              ) : file_type === "Gambar" ? (
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
              ) : file_type === "PDF" ? (
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
              ) : file_type === "Teks" ? (
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
              ) : file_type === "Presentasi" ? (
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
              ) : file_type === "File Lainnya" ? (
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
              ) : null}
            </ListItemAvatar>
            <ListItemText
              primary={
                <LightTooltip title={file_name} placement="top">
                  <Typography variant="subtitle2">{displayedName}</Typography>
                </LightTooltip>
              }
              secondary={file_type}
            />
            <IconButton
              size="small"
              className={classes.downloadIconButton}
              onClick={(e) => {
                e.stopPropagation();
                onDownloadFile(file_id, "tugas");
              }}
            >
              <CloudDownloadIcon fontSize="small" />
            </IconButton>
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
    uploadTugas,
    deleteTugas,
    success,
    getTaskFilesByUser,
    tasksCollection,
    filesCollection,
    downloadTugas,
    previewTugas,
    clearSuccess,
    getOneTask,
    getOneUser,
    getAllSubjects,
    downloadLampiran,
    previewLampiran,
  } = props;
  const { all_subjects_map } = props.subjectsCollection;

  // ref itu untuk ngerefer html yang ada di render.

  const tugasUploader = React.useRef(null);
  const uploadedTugas = React.useRef(null);
  const [fileTugas, setFileTugas] = React.useState(null);
  const [tasksContents, setTaskContents] = React.useState([]);

  // React HOOKS React.use bla2

  // setOpenDeleteDialog(true); // state openDeleteDialog akan berubah jadi true.
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedFileName, setSelectedFileName] = React.useState(null);
  const [selectedFileId, setSelectedFileId] = React.useState(null);

  let tugasId = props.match.params.id;
  console.log(filesCollection);

  // kalau misalnya parameter keduanya masukkin aja array kosong, dia acts like compomnentDidMount()
  // useEffect(() => {getAllSubjects("map")}, [])

  // This page is only for student later on, so for now put the user.role logic condition
  // Ini seperti componentDidUpdate(). yang didalam array itu kalau berubah, akan dirun lagi.
  useEffect(() => {
    getTaskFilesByUser(user.id, tugasId);
    getOneTask(tugasId);
    getAllSubjects("map");
    // Will run getOneUser again once the tasksCollection is retrieved
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
    let temp = [];
    for (let i = 0; i < filesCollection.files.length; i++) {
      console.log(filesCollection.files[i], i);
      temp.push(
        <WorkFile
          handleOpenDeleteDialog={handleOpenDeleteDialog}
          onDownloadFile={onDownloadFile}
          onPreviewFile={onPreviewFile}
          file_name={filesCollection.files[i].filename}
          file_id={filesCollection.files[i].id}
          file_type={fileType(filesCollection.files[i].filename)}
          type="work"
        />
      );
    }
    if (temp.length !== tasksContents.length) {
      console.log("tasks added");
      setTaskContents(temp);
    }
    console.log(tasksContents);
    return tasksContents;
  };

  // For upload, showing file names before submitting
  const listFileChosen = () => {
    let temp = [];
    if (fileTugas) {
      for (var i = 0; i < fileTugas.length; i++) {
        temp.push(
          // <Typography className={classes.workChosenFile}>
          //   {fileTugas[i].name.length < 27 ? fileTugas[i].name : `${fileTugas[i].name.slice(0,21)}..${path.extname(fileTugas[i].name)}`}
          // </Typography>
          <WorkFile
            handleOpenDeleteDialog={handleOpenDeleteDialog}
            onDownloadFile={onDownloadFile}
            onPreviewFile={onPreviewFile}
            file_name={fileTugas[i].name}
            file_id={fileTugas[i].id}
            file_type={fileType(fileTugas[i].name)}
            type="chosen"
          />
        );
      }
    } else if (!fileTugas && filesCollection.files.length === 0) {
      temp.push(
        <Paper className={classes.submittedButton}>
          <Typography variant="button">KOSONG</Typography>
        </Paper>
      );
    }
    return temp;
  };

  const handleTugasUpload = (e) => {
    const files = e.target.files;
    setFileTugas(files);
    console.log(fileTugas);
  };

  const onSubmitTugas = (e) => {
    console.log("Submit tugas");
    console.log("File Tugas: ", fileTugas);
    e.preventDefault();
    let formData = new FormData();
    for (var i = 0; i < fileTugas.length; i++) {
      formData.append("tugas", fileTugas[i]);
    }
    console.log(formData.get("tugas"), fileTugas);

    handleOpenUploadDialog();
    uploadTugas(
      formData,
      user,
      tugasId,
      new Date() < new Date(tasksCollection.deadline)
    );
    setFileTugas(null);
  };

  const onDeleteTugas = (id) => {
    console.log("On delete tugass");
    deleteTugas(id, user);
    setFileTugas(null);
  };

  const onDownloadFile = (id, fileCategory = "none") => {
    if (fileCategory === "tugas") downloadTugas(id);
    else if (fileCategory === "lampiran") downloadLampiran(id);
    else console.log("File Category is not specified");
  };

  const onPreviewFile = (id, fileCategory = "none") => {
    if (fileCategory === "tugas") previewTugas(id);
    else if (fileCategory === "lampiran") previewLampiran(id);
    else console.log("File Category is not specified");
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
          onDeleteTugas(selectedFileId);
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
            <Grid container spacing={6}>
              <Grid item xs={12} md={7}>
                <Typography variant="h4">{tasksCollection.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  <h6>
                    Mata Pelajaran:{" "}
                    {all_subjects_map.get(tasksCollection.subject)}
                  </h6>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Oleh:{" "}
                  <b>
                    {selectedUser._id !== tasksCollection.person_in_charge_id
                      ? null
                      : selectedUser.name}
                  </b>
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Hidden mdUp implementation="css">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className={classes.deadlineWarningText}
                    gutterBottom
                  >
                    Batas Waktu:{" "}
                    {moment(tasksCollection.deadline)
                      .locale("id")
                      .format("DD MMM YYYY, HH.mm")}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nilai Maksimum: 100
                  </Typography>
                </Hidden>
                <Hidden smDown implementation="css">
                  <Typography
                    variant="body2"
                    align="right"
                    color="textSecondary"
                    className={classes.deadlineWarningText}
                    gutterBottom
                  >
                    Batas Waktu:{" "}
                    {moment(tasksCollection.deadline)
                      .locale("id")
                      .format("DD MMM YYYY, HH.mm")}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="right"
                    color="textSecondary"
                  >
                    Nilai Maksimum: 100
                  </Typography>
                </Hidden>
              </Grid>
            </Grid>
            {!tasksCollection.description ? null : (
              <Grid item style={{ marginTop: "40px" }}>
                <Typography color="primary" gutterBottom>
                  Deskripsi Tugas:
                </Typography>
                <Typography>{tasksCollection.description}</Typography>
              </Grid>
            )}
            {!tasksCollection.lampiran ||
            tasksCollection.lampiran.length === 0 ? null : (
              <div style={{ marginTop: "30px" }}>
                <Typography color="primary" gutterBottom>
                  Lampiran Berkas:
                </Typography>
                <Grid container spacing={1}>
                  {!tasksCollection.lampiran
                    ? null
                    : tasksCollection.lampiran.map((lampiran) => (
                        <LampiranFile
                          file_id={lampiran.id}
                          onPreviewFile={onPreviewFile}
                          onDownloadFile={onDownloadFile}
                          filename={lampiran.filename}
                          filetype={fileType(lampiran.filename)}
                        />
                      ))}
                </Grid>
              </div>
            )}
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
            {!fileTugas && filesCollection.files.length === 0 ? (
              <Grid
                item
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {/* Kasus Kosong */}
                {listFileChosen()}
              </Grid>
            ) : (
              <Grid
                item
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
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
            : !tasksCollection.grades[user.id]
            ? "Belum Diperiksa"
            : "Telah Diperiksa"}
        </Typography>
        <Typography variant="h4" gutterBottom>
          Nilai:{" "}
          {!tasksCollection.grades
            ? "N/A"
            : !tasksCollection.grades[user.id]
            ? "N/A"
            : `${tasksCollection.grades[user.id]}/100`}
        </Typography>
      </Grid>
    </div>
  );
}

ViewTaskStudent.propTypes = {
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  filesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  uploadTugas: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  deleteTugas: PropTypes.func.isRequired,
  downloadTugas: PropTypes.func.isRequired,
  previewTugas: PropTypes.func.isRequired,
  updateUserData: PropTypes.func.isRequired, // When you upload files, then update the user data.
  getOneTask: PropTypes.func.isRequired,
  getTaskFilesByUser: PropTypes.func.isRequired, // Get the task files.
  getOneUser: PropTypes.func.isRequired, // For the person in charge task
  previewLampiran: PropTypes.func.isRequired,
  downloadLampiran: PropTypes.func.isRequired,
  clearSuccess: PropTypes.func.isRequired,
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
  downloadTugas,
  previewTugas,
  getTaskFilesByUser,
  getOneUser,
  downloadLampiran,
  previewLampiran,
  getOneTask,
  getAllSubjects,
})(ViewTaskStudent);
