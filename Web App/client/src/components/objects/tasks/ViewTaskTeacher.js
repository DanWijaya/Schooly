import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Avatar, Button, Dialog, Divider, Grid, IconButton,
   List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, ListItemIcon,
   Menu, MenuItem, Paper, Snackbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload"
import MuiAlert from "@material-ui/lab/Alert";
import AddIcon from "@material-ui/icons/Add";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import GetAppIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";
import { viewOneTask } from "../../../actions/TaskActions"
import { uploadTugas, deleteTugas, downloadTugas, previewTugas } from "../../../actions/UploadActions";
import { getTaskFilesByUser } from "../../../actions/UploadActions"
import { getOneUser } from "../../../actions/UserActions"
import moment from "moment";
import "moment/locale/id";
import { Link } from "react-router-dom"

const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  dialogRoot: {
    width: "350px",
    padding: "10px",
  },
  profilePicture: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  paperBox: {
    padding: "20px",
    marginBottom: "40px"
  },
  workBox: {
    margin: "auto",
    marginTop: "30px",
    justifyContent: "center",
    flexDirection: "row"
  },
  workChosenFile: {
    width: "200px",
    textAlign:"center",
    color:"#2196F3",
  },
  workButton: {
    width: "200px",
  },
  workResultSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  deadlineWarningText: {
    color: theme.palette.warning.main
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function WorkFile(props) {
  const classes = useStyles();
  const {file_type_icon, file_name, file_type, onDownloadTugas, file_id} = props;
  let displayedName = ""

  file_name.length >= 25 ?
  displayedName = `${file_name.slice(0,17)}..${path.extname(file_name)}`
  : displayedName = file_name

  return (
    <ListItem button disableRipple onClick={() => {props.onPreviewTugas(file_id)}}>
      <ListItemAvatar>
        <Avatar src={file_type_icon} className={classes.profilePicture} />
      </ListItemAvatar>
      <ListItemText
        primary={displayedName}
        secondary={file_type}
      />
      <ListItemIcon>
        <IconButton className={classes.iconButton}
          onClick={() => {props.onDownloadTugas(file_id)}}
         >
          <CloudDownloadIcon />
        </IconButton>
      </ListItemIcon>

      <ListItemSecondaryAction>
        <IconButton className={classes.iconButton}
          // onClick={() => {props.onDeleteTugas(props.file_id)}}
          onClick={() => {props.handleOpenDeleteDialog(props.file_id, props.file_name)}}
         >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

function ViewTaskTeacher(props) {
  const classes = useStyles();
  const { user } = props.auth;
  const { uploadTugas, getTaskByUser, viewOneTask, tasksCollection, downloadTugas, previewTugas } = props;

  const tugasUploader = React.useRef(null);
  const uploadedTugas = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [fileTugas, setFileTugas] = React.useState(null);
  const [tasksContents, setTaskContents] = React.useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedFileName, setSelectedFileName] = React.useState(null);
  const [selectedFileId, setSelectedFileId] = React.useState(null);

  const task_id = props.match.params.id
  React.useEffect(() => {
    viewOneTask(task_id)
  }, [tasksCollection._id])
  // if(tasksCollection.length === undefined) // it means it is empty
  //   getTaskByUser(user.id)

  const fileType = (filename) => {
    let ext_file = path.extname(filename)
    switch(ext_file) {
      case ".docx" : return "Word"
      case ".xlsx" :
      case ".csv"  : return "Excel"

      case ".png":
      case ".jpg":
      case ".jpeg" : return "Gambar"

      case ".pdf" : return "PDF"

      case ".txt" :
      case ".rtf" : return "Teks"

      case ".ppt" :
      case ".pptx": return "Presentasi"

      default: return "File lainnya"
    }
  }

  const listWorkFile = () => {
    let temp = []
    if(tasksCollection.length !== undefined) {
      for (let i = 0 ; i < tasksCollection.length; i++) {
        temp.push(
          <WorkFile
            handleOpenDeleteDialog = {handleOpenDeleteDialog}
            onDownloadTugas = {onDownloadTugas}
            onPreviewTugas = {onPreviewTugas}
            file_type_icon={0}
            file_name={tasksCollection[i].filename}
            file_id={tasksCollection[i].id}
            file_type={fileType(tasksCollection[i].filename)}
        />
        )
      }
    }
    if(temp.length !== tasksContents.length){
      console.log("tasks added")
      setTaskContents(temp);
    }
    return tasksContents
  }

  const listFileChosen = () => {
    let temp = []
    if(!fileTugas) {
      temp.push(
        <Typography className={classes.workChosenFile}>
          Kosong
        </Typography>
      )
    }
    else {
      for (var i = 0; i < fileTugas.length; i++){
        temp.push(
          <Typography className={classes.workChosenFile}>
            {fileTugas[i].name.length < 27 ? fileTugas[i].name : `${fileTugas[i].name.slice(0,21)}..${path.extname(fileTugas[i].name)}`}
          </Typography>
        )
      }
    }
    return temp
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleTugasUpload = (e) => {
    const files = e.target.files;
    setFileTugas(files)

    if (files) {
      const reader = new FileReader();
      const { current } = uploadedTugas;
      current.file = files;
    }
    console.log(fileTugas)
  }

  const onSubmitTugas = (e) => {
    console.log("Submit tugas")
    e.preventDefault();
    let formData = new FormData()
    for (var i = 0; i < fileTugas.length; i++){
      formData.append("tugas", fileTugas[i])
    }
    uploadTugas(formData, user)
    // getTaskByUser(user.id)
    setFileTugas(null)
    handleClick()
  }

  const onDeleteTugas = (id) => {
    deleteTugas(id, user)
    setFileTugas(null)
  }
  const onDownloadTugas = (id) => {downloadTugas(id)}
  const onPreviewTugas = (id) => {previewTugas(id)}

  //Delete Dialog box
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true);
    setSelectedFileId(fileid)
    setSelectedFileName(filename)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  function DeleteDialog(){
    return (
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        className={classes.root}
      >
        <Grid container justify="center" className={classes.dialogRoot}>
          <Grid item
            container
            justify="flex-end"
            alignItems="flex-start"
            style={{marginBottom: "10px"}}
          >
            <IconButton
              size="small"
              disableRipple
              onClick={handleCloseDeleteDialog}
              className={classes.iconButtonClose}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h5" gutterBottom>
              Hapus file berikut?
            </Typography>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px", textAlign:"center"}}>
            <Typography variant="h6" gutterBottom>
              <b>{selectedFileName}</b>
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
            style={{marginBottom: "20px"}}
          >
            <Grid item>
              <Button
                onClick={() => { onDeleteTugas(selectedFileId)}}
                startIcon={<DeleteOutlineIcon />}
                style={{
                  backgroundColor: "#B22222",
                  color: "white",
                  width: "150px",
                }}
              >
                Hapus
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseDeleteDialog}
                startIcon={< CancelIcon/>}
                style={{
                  backgroundColor: "#2196F3",
                  color: "white",
                  width: "150px",
                }}
              >
                Batalkan
              </Button>
            </Grid>
          </Grid>
          </Grid>
      </Dialog>
    )
  }

  return (
    <div className={classes.root}>
      {DeleteDialog()}
      <Paper className={classes.paperBox}>
        <Grid
          container
          spacing={2}
        >
          <Grid item xs={6}>
            <Typography variant="h4" >
              {tasksCollection.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              <h6>{tasksCollection.subject}</h6>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Penanggung Jawab: {user.name}
            </Typography>
          </Grid>
          <Grid item xs={6}
            container
            direction="column"
            alignItems="flex-end"
          >
            <Typography variant="overline" className={classes.deadlineWarningText}>
              Batas waktu kumpul: {moment(tasksCollection.deadline).locale("id").format("DD-MM-YYYY")}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Nilai Maksimum: 100
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Deskripsi Tugas:
            </Typography>
            <Typography variant="paragraph" gutterBottom>
              {tasksCollection.description}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Berkas yang Terlampir:
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Grid container direction="column" alignItems="center">
      <Link to={`/task/${task_id}`}>
        <Button startIcon={<AssignmentIcon />} style={{backgroundColor: "white", color: "#2196F3"}}>
          Sunting Tugas
        </Button>
      </Link>
        <Button startIcon={<AssignmentIcon />} style={{backgroundColor: "#2196F3", color: "white"}}>
          Lihat Daftar Hasil Pekerjaan Siswa
        </Button>
      </Grid>
    </div>
  )
}

ViewTaskTeacher.propTypes = {
   auth: PropTypes.object.isRequired,
   tasksCollection: PropTypes.object.isRequired,
   filesCollection: PropTypes.object.isRequired,

   uploadTugas: PropTypes.func.isRequired,
   deleteTugas: PropTypes.func.isRequired,
   downloadTugas: PropTypes.func.isRequired,
   previewTugas: PropTypes.func.isRequired,
   updateUserData: PropTypes.func.isRequired,
   getOneUser: PropTypes.func.isRequired, // for the person in charge task
   getTaskFilesByUser: PropTypes.func.isRequired, //get the task files.
   viewOneTask: PropTypes.func.isRequired
 }

const mapStateToProps = (state) => ({
   auth: state.auth,
   tasksCollection: state.tasksCollection
 });

export default connect(
   mapStateToProps, {uploadTugas, deleteTugas, downloadTugas, 
    previewTugas, viewOneTask, getTaskFilesByUser, getOneUser}
 ) (ViewTaskTeacher);
