import React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { uploadTugas , deleteTugas, downloadTugas, previewTugas, downloadLampiran, previewLampiran } from "../../../actions/UploadActions";
import { viewOneTask } from "../../../actions/TaskActions";
import { getTaskFilesByUser } from "../../../actions/UploadActions";
import { getOneUser } from "../../../actions/UserActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Button, CircularProgress, Dialog, Divider, Grid, Hidden, IconButton, List, ListItem, ListItemAvatar, ListItemText,
   Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload"
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import PublishIcon from "@material-ui/icons/Publish";
import { FaFile, FaFileAlt, FaFileExcel, FaFileImage, FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa";

const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  dialogBox: {
    width: "350px",
    padding: "15px",
  },
  dialogDeleteButton: {
    width: "150px",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
    },
  },
  dialogCancelButton: {
    width: "150px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  paperBox: {
    padding: "20px",
  },
  deadlineWarningText: {
    color: theme.palette.warning.main,
  },
  workChosenFile: {
    width: "200px",
    textAlign: "center",
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
    marginBottom: "10px"
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
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
  uploadDialogGrid: {
    width: "300px",
    minHeight: "200px",
    padding: "15px",
  },
  uploadSuccessIcon: {
    color: "green",
    height: "45px",
    width: "45px"
  },
  uploadFinishButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
      color: "white",
    },
  },
}));

function LampiranFile(props) {
  const classes = useStyles();

  const { file_id, filename, filetype, onDownloadFile, onPreviewFile } = props;

  let displayedName = ""
  filename.length >= 16 ?
    displayedName = `${filename.slice(0,15)}..${path.extname(filename)}`
  :
    displayedName = filename

  return(
    <Grid item xs={12} md={6}>
      <Paper variant="outlined" className={classes.listItemPaper}>
        <ListItem
          button
          disableRipple
          className={classes.listItem}
          onClick={() => {onPreviewFile(file_id, "lampiran")}}
        >
          <ListItemAvatar>
            {filetype === "Word" ?
                <Avatar className={classes.wordFileTypeIcon}>
                  <FaFileWord />
                </Avatar>
              :
              filetype === "Excel" ?
                <Avatar className={classes.excelFileTypeIcon}>
                  <FaFileExcel />
                </Avatar>
              :
              filetype === "Gambar" ?
                <Avatar className={classes.imageFileTypeIcon}>
                  <FaFileImage />
                </Avatar>
              :
              filetype === "PDF" ?
                <Avatar className={classes.pdfFileTypeIcon}>
                  <FaFilePdf />
                </Avatar>
              :
              filetype === "Teks" ?
                <Avatar className={classes.textFileTypeIcon}>
                  <FaFileAlt />
                </Avatar>
              :
              filetype === "Presentasi" ?
                <Avatar className={classes.presentationFileTypeIcon}>
                  <FaFilePowerpoint />
                </Avatar>
              :
              filetype === "File Lainnya" ?
                <Avatar className={classes.otherFileTypeIcon}>
                  <FaFile />
                </Avatar>
              : null
            }
          </ListItemAvatar>
          <ListItemText
            primary={
              <LightTooltip title={filename} placement="top">
                <Typography>
                  {displayedName}
                </Typography>
              </LightTooltip>
            }
            secondary={filetype}
          />
          <IconButton
            size="small"
            className={classes.downloadIconButton}
            onClick={(e) => { e.stopPropagation(); onDownloadFile(file_id, "lampiran") }}
          >
            <CloudDownloadIcon fontSize="small" />
          </IconButton>
        </ListItem>
      </Paper>
    </Grid>
  )
}

function WorkFile(props) {
  const classes = useStyles();

  const { file_id, file_name, file_type, onDownloadFile, onPreviewFile, handleOpenDeleteDialog } = props;

  let displayedName = ""
  file_name.length >= 10 ?
    displayedName = `${file_name.slice(0,7)}..${path.extname(file_name)}`
  :
    displayedName = file_name

  return(
    <Paper variant="outlined" className={classes.listItemPaper}>
      <ListItem
        button
        disableRipple
        className={classes.listItem}
        onClick={() => {onPreviewFile(file_id, "tugas")}}
      >
        <ListItemAvatar>
          {file_type === "Word" ?
              <Avatar className={classes.wordFileTypeIcon}>
                <FaFileWord />
              </Avatar>
            :
            file_type === "Excel" ?
              <Avatar className={classes.excelFileTypeIcon}>
                <FaFileExcel />
              </Avatar>
            :
            file_type === "Gambar" ?
              <Avatar className={classes.imageFileTypeIcon}>
                <FaFileImage />
              </Avatar>
            :
            file_type === "PDF" ?
              <Avatar className={classes.pdfFileTypeIcon}>
                <FaFilePdf />
              </Avatar>
            :
            file_type === "Teks" ?
              <Avatar className={classes.textFileTypeIcon}>
                <FaFileAlt />
              </Avatar>
            :
            file_type === "Presentasi" ?
              <Avatar className={classes.presentationFileTypeIcon}>
                <FaFilePowerpoint />
              </Avatar>
            :
            file_type === "File Lainnya" ?
              <Avatar className={classes.otherFileTypeIcon}>
                <FaFile />
              </Avatar>
            : null
          }
        </ListItemAvatar>
        <ListItemText
          primary={
            <LightTooltip title={file_name} placement="top">
              <Typography variant="subtitle2">
                {displayedName}
              </Typography>
            </LightTooltip>
          }
          secondary={file_type}
        />
        <IconButton
          size="small"
          className={classes.downloadIconButton}
          onClick={(e) => { e.stopPropagation(); onDownloadFile(file_id, "tugas") }}
         >
          <CloudDownloadIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          className={classes.deleteIconButton}
          onClick={(e) => { e.stopPropagation()
            handleOpenDeleteDialog(props.file_id, props.file_name)}}
         >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </ListItem>
    </Paper>
  )
}

function ViewTaskStudent(props) {
  const classes = useStyles();

  const { user, selectedUser } = props.auth;
  const { uploadTugas, deleteTugas, success, getTaskFilesByUser, tasksCollection,
    filesCollection, downloadTugas, previewTugas,
    viewOneTask, getOneUser, downloadLampiran, previewLampiran } = props;

  const tugasUploader = React.useRef(null);
  const uploadedTugas = React.useRef(null);
  const [fileTugas, setFileTugas] = React.useState(null);
  const [tasksContents, setTaskContents] = React.useState([]);

  const [isEmptyFileTugas, setIsEmpty] = React.useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedFileName, setSelectedFileName] = React.useState(null);
  const [selectedFileId, setSelectedFileId] = React.useState(null);

  let tugasId = props.match.params.id;

  // This page is only for student later on, so for now put the user.role logic condition
  useEffect(() => {
    getTaskFilesByUser(user.id, tugasId)
    viewOneTask(tugasId)
    // Will run getOneUser again once the tasksCollection is retrieved
    getOneUser(tasksCollection.person_in_charge_id)
  }, [tasksCollection.person_in_charge_id])

  const fileType = (filename) => {
    let ext_file = path.extname(filename)
    switch(ext_file) {
      case ".docx" : return "Word"
      case ".xlsx" :
      case ".csv"  : return "Excel"

      case ".png" :
      case ".jpg" :
      case ".jpeg" : return "Gambar"

      case ".pdf" : return "PDF"

      case ".txt" :
      case ".rtf" : return "Teks"

      case ".ppt" :
      case ".pptx" : return "Presentasi"

      default: return "File Lainnya"
    }
  }

  const listWorkFile = () => {
    let temp = []
    for (let i = 0; i < filesCollection.files.length; i++) {
      console.log(filesCollection.files[i], i)
      temp.push(
        <WorkFile
          handleOpenDeleteDialog = {handleOpenDeleteDialog}
          onDownloadFile={onDownloadFile}
          onPreviewFile={onPreviewFile}
          file_name={filesCollection.files[i].filename}
          file_id={filesCollection.files[i].id}
          file_type={fileType(filesCollection.files[i].filename)}
        />
      )
    }
    if (temp.length !== tasksContents.length) {
      console.log("tasks added")
      setTaskContents(temp);
    }
    return tasksContents
  }

  // For upload, showing file names before submitting
  const listFileChosen = () => {
    let temp = []
    if (!fileTugas) {
      temp.push(
        <Typography className={classes.workChosenFile}>
          Kosong
        </Typography>
      )
    }
    else {
      for (var i = 0; i < fileTugas.length; i++) {
        temp.push(
          <Typography className={classes.workChosenFile}>
            {fileTugas[i].name.length < 27 ? fileTugas[i].name : `${fileTugas[i].name.slice(0,21)}..${path.extname(fileTugas[i].name)}`}
          </Typography>
        )
      }
    }
    return temp
  }

  const handleTugasUpload = (e) => {
    const files = e.target.files;
    setFileTugas(files)
    console.log(fileTugas)
  }

  const onSubmitTugas = (e) => {
    console.log("Submit tugas")
    console.log("File Tugas: ", fileTugas)
    e.preventDefault();
    let formData = new FormData()
    for (var i = 0; i < fileTugas.length; i++) {
      formData.append("tugas", fileTugas[i])
    }
    console.log(formData.get("tugas"), fileTugas)


    handleOpenUploadDialog()
    uploadTugas(formData, user, tugasId, new Date() < new Date(tasksCollection.deadline))
    setFileTugas(null)
  }

  const onDeleteTugas = (id) => {
    console.log("On delete tugass")
    deleteTugas(id, user)
    setFileTugas(null)
  }

  const onDownloadFile = (id, fileCategory="none") => {
    if (fileCategory === "tugas")
      downloadTugas(id)
    else if (fileCategory === "lampiran")
      downloadLampiran(id)
    else
      console.log("File Category is not specified")
  }

  const onPreviewFile = (id, fileCategory="none") => {
    if (fileCategory === "tugas")
      previewTugas(id)
    else if (fileCategory === "lampiran")
      previewLampiran(id)
    else
      console.log("File Category is not specified")
  }

  // Delete Dialog
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true);
    setSelectedFileId(fileid)
    setSelectedFileName(filename)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  function DeleteDialog() {
    return(
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
          <Grid item container justify="flex-end" alignItems="flex-start">
            <IconButton
              size="small"
              onClick={handleCloseDeleteDialog}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h5" gutterBottom>
              Hapus file berikut?
            </Typography>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h6" align="center" gutterBottom>
              <b>{selectedFileName}</b>
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
            style={{marginBottom: "10px"}}
          >
            <Grid item>
              <Button
                onClick={() => { onDeleteTugas(selectedFileId)}}
                startIcon={<DeleteOutlineIcon />}
                className={classes.dialogDeleteButton}
              >
                Hapus
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseDeleteDialog}
                startIcon={< CancelIcon/>}
                className={classes.dialogCancelButton}
              >
                Batal
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    )
  }

  // Upload Dialog
  const [openUploadDialog, setOpenUploadDialog] = React.useState(null);
  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };
  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  function UploadDialog() {
    return(
      <Dialog open={openUploadDialog}>
        <Grid container direction="column" justify="space-between" alignItems="center" className={classes.uploadDialogGrid}>
          <Grid item justify="center">
            <Typography variant="h6" align="center" gutterBottom>
              {!success ? "Tugas sedang dikumpul" : "Tugas berhasil dikumpul"}
            </Typography>
          </Grid>
          <Grid item>
            {!success ? <CircularProgress /> : <CheckCircleIcon className={classes.uploadSuccessIcon} />}
          </Grid>
          <Grid item>
            {!success ?
              <Typography variant="body1" align="center" gutterBottom>
                <b>Mohon tetap tunggu di halaman ini.</b>
              </Typography>
            :
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                className={classes.uploadFinishButton}
              >
                Selesai
              </Button>
            }
          </Grid>
        </Grid>
      </Dialog>
    )
}

  document.title = !tasksCollection.name ? "Schooly | Lihat Tugas" : `Schooly | ${tasksCollection.name}`;
  console.log("Ontime : ", new Date() < new Date(tasksCollection.deadline))
  return(
    <div className={classes.root}>
      {DeleteDialog()}
      {UploadDialog()}
      <Grid container
        spacing={2}
        justify="space-between"
        alignItems="stretch"
        style={{marginBottom: "30px"}}
      >
        <Grid item xs={12} md={8}>
          <Paper className={classes.paperBox}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <Typography variant="h4">
                  {tasksCollection.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  <h6>Mata Pelajaran: {tasksCollection.subject}</h6>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Penanggung Jawab: <b>{selectedUser.name}</b>
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Hidden mdUp implementation="css">
                  <Typography variant="body2" color="textSecondary" className={classes.deadlineWarningText} gutterBottom>
                    Batas Waktu: {moment(tasksCollection.deadline).locale("id").format("DD/MMMM/YYYY - HH.mm")}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nilai Maksimum: 100
                  </Typography>
                </Hidden>
                <Hidden smDown implementation="css">
                  <Typography variant="body2" align="right" color="textSecondary" className={classes.deadlineWarningText} gutterBottom>
                    Batas Waktu: {moment(tasksCollection.deadline).locale("id").format("DD/MMMM/YYYY - HH.mm")}
                  </Typography>
                  <Typography variant="body2" align="right" color="textSecondary">
                    Nilai Maksimum: 100
                  </Typography>
                </Hidden>
              </Grid>
            </Grid>
            <div style={{marginTop: "30px"}}>
              <Typography color="primary" gutterBottom>
                Deskripsi Tugas:
              </Typography>
              <Typography>
                {tasksCollection.description}
              </Typography>
            </div>
            <div style={{marginTop: "30px"}}>
              <Typography color="primary" gutterBottom>
                Lampiran Berkas:
              </Typography>
              <Grid container spacing={1}>
                {!tasksCollection.lampiran ? null :
                tasksCollection.lampiran.map((lampiran) => (
                  <LampiranFile
                    file_id={lampiran.id}
                    onPreviewFile ={onPreviewFile}
                    onDownloadFile ={onDownloadFile}
                    filename={lampiran.filename}
                    filetype={fileType(lampiran.filename)}
                  />
                ))}
              </Grid>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className={classes.paperBox}>
            <Grid item>
              <Typography variant="h5" align="center" style={{marginBottom: "20px"}}>
                Hasil Pekerjaan
              </Typography>
            </Grid>
            <Divider />
            <Grid item style={{padding: "10px"}}>
              <List>
                {listWorkFile()}
              </List>
            </Grid>
            <Divider />
            <Grid item container direction="column" alignItems="center" style={{padding: "10px"}}>
              <Typography variant="h6">
                <b><u>File Terpilih</u></b>
              </Typography>
              {listFileChosen()}
            </Grid>
            <Divider/>
            <Grid item container direction="column" alignItems="center" spacing={2} style={{padding: "20px"}}>
              <form onSubmit={onSubmitTugas}>
                <div style={{ marginBottom: "15px"}}>
                  <input
                    type="file"
                    multiple={true}
                    name="tugas"
                    onChange={handleTugasUpload}
                    ref={tugasUploader}
                    accept="file/*"
                    style={{display: "none"}}
                  />
                  <input
                    type="file"
                    multiple={true}
                    name="file"
                    id="file"
                    ref={uploadedTugas}
                    style={{display: "none"}}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    className={classes.selectFileButton}
                    onClick={() => {tugasUploader.current.click()}}
                  >
                    Pilih File
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
          Status: {!tasksCollection.grades ? "Belum Diperiksa" : !tasksCollection.grades[user.id] ? "Belum Diperiksa" :  "Telah Diperiksa"}
        </Typography>
        <Typography variant="h4" gutterBottom>
          Nilai: {!tasksCollection.grades ? "N/A" : !tasksCollection.grades[user.id] ? "N/A" :  `${tasksCollection.grades[user.id]}/100`}
        </Typography>
      </Grid>
    </div>
  )
}

ViewTaskStudent.propTypes = {
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  filesCollection: PropTypes.object.isRequired,
  uploadTugas: PropTypes.func.isRequired,
  deleteTugas: PropTypes.func.isRequired,
  downloadTugas: PropTypes.func.isRequired,
  previewTugas: PropTypes.func.isRequired,
  updateUserData: PropTypes.func.isRequired, // When you upload files, then update the user data.
  viewOneTask: PropTypes.func.isRequired,
  getTaskFilesByUser: PropTypes.func.isRequired, // Get the task files.
  getOneUser: PropTypes.func.isRequired, // For the person in charge task
  previewLampiran: PropTypes.func.isRequired,
  downloadLampiran: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  success: state.success,
  tasksCollection: state.tasksCollection,
  filesCollection: state.filesCollection
});

export default connect(
   mapStateToProps, { uploadTugas, deleteTugas, downloadTugas,
     previewTugas, getTaskFilesByUser, getOneUser, downloadLampiran,
     previewLampiran, viewOneTask }
 ) (ViewTaskStudent);
