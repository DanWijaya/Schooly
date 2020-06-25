import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Avatar, Button, Dialog, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, ListItemIcon,
   Menu, MenuItem, Paper, Snackbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload"
import MuiAlert from "@material-ui/lab/Alert";
import AddIcon from "@material-ui/icons/Add";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import GetAppIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";
import { uploadTugas , deleteTugas, downloadTugas, previewTugas, downloadLampiran, previewLampiran} from "../../../actions/UploadActions"
import { viewOneTask } from "../../../actions/TaskActions"
import { getTaskFilesByUser } from "../../../actions/UploadActions"
import { getOneUser } from "../../../actions/UserActions"
import { useEffect } from "react";
import { useMemo } from "react";

const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1175px", // before that was 1075px
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
  listItemPaper: {
    marginBottom: "10px"
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function LampiranFile(props) {
  const classes = useStyles();
  const {file_id, filename, filetype, onDownloadFile, onPreviewFile} = props;
  return(
    <Grid item xs={6}>
      <Paper variant="outlined" className={classes.listItemPaper}>
        <ListItem button disableRipple className={classes.listItem}
        onClick={() => {props.onPreviewFile(file_id, "lampiran")}}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText
            primary={filename}
            secondary={filetype}
          />
          <ListItemIcon>
            <IconButton onClick={(e) => {
              e.stopPropagation()
              onDownloadFile(file_id, "lampiran")}}>
              <CloudDownloadIcon />
            </IconButton>
          </ListItemIcon>
        </ListItem>
      </Paper>
    </Grid>
  )
}

function WorkFile(props) {
  const classes = useStyles();
  const {file_type_icon, file_name, file_type, onDownloadFile, file_id} = props;
  let displayedName = ""

  file_name.length >= 25 ?
  displayedName = `${file_name.slice(0,17)}..${path.extname(file_name)}`
  : displayedName = file_name

  return (
    <ListItem button disableRipple onClick={() => {props.onPreviewFile(file_id, "tugas")}}>
      <ListItemAvatar>
        <Avatar src={file_type_icon} className={classes.profilePicture} />
      </ListItemAvatar>
      <ListItemText
        primary={displayedName}
        secondary={file_type}
      />
      <ListItemIcon>
        <IconButton className={classes.iconButton}
          onClick={(e) => { e.stopPropagation()
            props.onDownloadFile(file_id, "tugas")}}
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

function CheckedWorkFilesButton() {
  const StyledMenu = withStyles({
    paper: {
      border: "1px solid #D3D4D5",
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      {...props}
    />
  ));

  const StyledMenuItem = withStyles((theme) => ({
    root: {
      "&:focus": {
        backgroundColor: "#2196F3",
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClick}
        startIcon={<AssignmentTurnedInIcon />}
        style={{color: "white", backgroundColor: "#2196F3"}}>
        Lihat Hasil Pengecekkan
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem>
          <ListItemAvatar>
            <Avatar src={0} />
          </ListItemAvatar>
          <ListItemText
            primary="File Name"
            secondary="File Type"
          />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <GetAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Download Semua File" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}

function NewTask(props) {
  const classes = useStyles();
  const { user, selectedUser } = props.auth;
  const { uploadTugas, getTaskFilesByUser, tasksCollection,
    filesCollection, downloadTugas, previewTugas,
    viewOneTask, getOneUser, downloadLampiran, previewLampiran } = props;

  const tugasUploader = React.useRef(null);
  const uploadedTugas = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [fileTugas, setFileTugas] = React.useState(null);
  const [tasksContents, setTaskContents] = React.useState([]);

  const [isEmptyFileTugas, setIsEmpty] = React.useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedFileName, setSelectedFileName] = React.useState(null);
  const [selectedFileId, setSelectedFileId] = React.useState(null);

  let tugasId = props.match.params.id;

  // this page is only for student later on, so for now put the user.role logic condition
  useEffect(() => {
    getTaskFilesByUser(user.id, tugasId)
    viewOneTask(tugasId)
    // will run getOneUser again once the tasksCollection is retrieved
    getOneUser(tasksCollection.person_in_charge_id)
  },[tasksCollection.person_in_charge_id]
    )

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
      for (let i = 0 ; i < filesCollection.files.length; i++) {
        console.log(filesCollection.files[i], i)
        temp.push(
          <WorkFile
            handleOpenDeleteDialog = {handleOpenDeleteDialog}
            onDownloadFile = {onDownloadFile}
            onPreviewFile = {onPreviewFile}
            file_type_icon={0}
            file_name={filesCollection.files[i].filename}
            file_id={filesCollection.files[i].id}
            file_type={fileType(filesCollection.files[i].filename)}
        />
        )
      }

    if(temp.length !== tasksContents.length){
      console.log("tasks added")
      setTaskContents(temp);
    }
    return tasksContents
  }

  // ini untuk pas upload punya, munculin filenamenya sblm disubmit worknya
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

    // if (files) {
    //   const reader = new FileReader();
    //   const { current } = uploadedTugas;
    //   current.file = files;
    // }
    console.log(fileTugas)
  }

  const onSubmitTugas = (e) => {
    console.log("Submit tugas")
    e.preventDefault();
    let formData = new FormData()
    for (var i = 0; i < fileTugas.length; i++){
      formData.append("tugas", fileTugas[i])
    }
    console.log(formData, fileTugas)
    uploadTugas(formData, user, tugasId)
    setFileTugas(null)
    handleClick()
  }

  const onDeleteTugas = (id) => {
    deleteTugas(id, user)
    setFileTugas(null)
  }
  const onDownloadFile = (id, fileCategory="none") => {
    if(fileCategory == "tugas")
      downloadTugas(id)
    else if(fileCategory == "lampiran")
      downloadLampiran(id)
    else
      console.log("File Category is not specified")
  }

  const onPreviewFile = (id, fileCategory="none") => {
    if(fileCategory == "tugas")
      previewTugas(id)
    else if(fileCategory == "lampiran")
      previewLampiran(id)
    else
      console.log("File Category is not specified")
  }

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
      <Grid container
        spacing={2}
        justify="space-between"
        alignItems="flex-start"
        style={{marginBottom: "30px"}}
      >
        <Paper className={classes.paperBox}>
          <Grid item
            container
            spacing={2}
            style={{width: "750px"}}
          >
            <Grid item xs={6}>
              <Typography variant="h4" >
                {tasksCollection.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                <h6>{tasksCollection.subject}</h6>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Penanggung Jawab: <b>{selectedUser.name}</b>
              </Typography>
            </Grid>
            <Grid item xs={6}
              container
              direction="column"
              alignItems="flex-end"
            >
              <Typography variant="overline" color="textSecondary">
                Tanggal Kumpul:
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
                Berkas yang terlampir:
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
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paperBox}>
          <Grid item
            container
            direction="column"
            justify="space-evenly"
            style={{width: "350px"}}
          >
            <Grid item>
              <div className={classes.workResultSection}>
                <Typography variant="h5">
                  Hasil Pekerjaan
                </Typography>
              </div>
            </Grid>
            <Divider />
            <Grid item>
              <List>
                {listWorkFile()}
              </List>
            </Grid>
            <Divider />
            <Grid item container direction="column" alignItems="center">
              <Typography variant="h6">
                <b><u>File terpilih</u></b>
              </Typography>
              {listFileChosen()}
            </Grid>
            <Divider/>
            <Grid item container direction="column" spacing={2} className={classes.workBox}>
            <form onSubmit={onSubmitTugas}>
              <Grid item style={{ marginBottom: "15px"}}>
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
                  className={classes.workButton}
                  style={{color: "#2196F3", backgroundColor: "white"}}
                  onClick={() => {tugasUploader.current.click()}}
                >
                  Pilih File
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<PublishIcon />}
                  className={classes.workButton}
                  style={{color: "white", backgroundColor: "#2196F3"}}
                  type="submit"
                  disabled={fileTugas == null}
                >
                  Kumpul Tugas
                </Button>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="success">
                    File Berhasil Dikumpulkan!
                  </Alert>
                </Snackbar>
              </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid container direction="column" alignItems="center">
        <Typography variant="subtitle1">
          Status: Sudah Diperiksa/Belum Diperiksa
        </Typography>
        <Typography variant="h4" gutterBottom>
          Hasil Penilaian: {100}
        </Typography>
        <CheckedWorkFilesButton />
      </Grid>
    </div>
  )
}

NewTask.propTypes = {
   auth: PropTypes.object.isRequired,
   tasksCollection: PropTypes.object.isRequired,
   filesCollection: PropTypes.object.isRequired,

   uploadTugas: PropTypes.func.isRequired,
   deleteTugas: PropTypes.func.isRequired,
   downloadTugas: PropTypes.func.isRequired,
   previewTugas: PropTypes.func.isRequired,
   updateUserData: PropTypes.func.isRequired, // when you upload files, then update the user data.
   viewOneTask: PropTypes.func.isRequired,
   getTaskFilesByUser: PropTypes.func.isRequired, //get the task files.
   getOneUser: PropTypes.func.isRequired, // for the person in charge task
   previewLampiran: PropTypes.func.isRequired,
   downloadLampiran: PropTypes.func.isRequired
 }

const mapStateToProps = (state) => ({
   auth: state.auth,
   tasksCollection: state.tasksCollection,
   filesCollection: state.filesCollection
 });

export default connect(
   mapStateToProps, {uploadTugas, deleteTugas, downloadTugas,
     previewTugas, getTaskFilesByUser, getOneUser, downloadLampiran,
     previewLampiran, viewOneTask}
 ) (NewTask);
