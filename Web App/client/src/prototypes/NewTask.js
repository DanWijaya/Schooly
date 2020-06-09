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
import { uploadTugas , deleteTugas, downloadTugas, previewTugas} from "../actions/UploadActions"
import { getTaskByUser } from "../actions/TaskActions"
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
    color:"#2196f3",
  },
  workButton: {
    width: "200px",
  },
  workResultSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
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

function CheckedWorkFilesButton() {
  const StyledMenu = withStyles({
    paper: {
      border: "1px solid #d3d4d5",
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
        backgroundColor: "#2196f3",
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
        style={{color: "white", backgroundColor: "#2196f3"}}>
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
  const { user } = props.auth;
  const { uploadTugas, getTaskByUser, tasksCollection, downloadTugas, previewTugas } = props;

  const tugasUploader = React.useRef(null);
  const uploadedTugas = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [fileTugas, setFileTugas] = React.useState(null);
  const [tasksContents, setTaskContents] = React.useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedFileName, setSelectedFileName] = React.useState(null);
  const [selectedFileId, setSelectedFileId] = React.useState(null);

  const [openDownloadDialog, setOpenDownloadDialog] = React.useState(null);

  if(tasksCollection.length === undefined) // it means it is empty
    getTaskByUser(user.id)

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

  //Download Dialog box
  const handleOpenDownloadDialog = (fileid, filename) => {
    setOpenDownloadDialog(true);
    setSelectedFileId(fileid)
    setSelectedFileName(filename)
  }

  const handleCloseDownloadDialog = () => {
    setOpenDownloadDialog(false)
  }

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
                  backgroundColor: "#2196f3",
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

  function DownloadDialog() {
    return (
      <Dialog
        open={openDownloadDialog}
        onClose={handleCloseDownloadDialog}
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
              onClick={handleCloseDownloadDialog}
              className={classes.iconButtonClose}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h5" gutterBottom>
              Unduh file berikut?
            </Typography>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
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
                onClick={() => { onDownloadTugas(selectedFileId)}}
                startIcon={<CloudDownloadIcon />}
                style={{
                  backgroundColor: "#61bd4f",
                  color: "white",
                  width: "150px",
                }}
              >
              Unduh
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={handleCloseDownloadDialog}
              startIcon={< CancelIcon/>}
              style={{
                backgroundColor: "#2196f3",
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
      {DownloadDialog()}
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
                Task Title
              </Typography>
              <Typography variant="caption" color="textSecondary">
                <h6>Subject Name</h6>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Penanggung Jawab:
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
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
                dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Berkas yang Terlampir:
              </Typography>
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
                  style={{color: "#2196f3", backgroundColor: "white"}}
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
                  style={{color: "white", backgroundColor: "#2196f3"}}
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
   uploadTugas: PropTypes.func.isRequired,
   deleteTugas: PropTypes.func.isRequired,
   downloadTugas: PropTypes.func.isRequired,
   previewTugas: PropTypes.func.isRequired,
   updateUserData: PropTypes.func.isRequired,
   getTaskByUser: PropTypes.func.isRequired,
   tasksCollection: PropTypes.object.isRequired
 }

const mapStateToProps = (state) => ({
   auth: state.auth,
   tasksCollection: state.tasksCollection
 });

export default connect(
   mapStateToProps, {uploadTugas, getTaskByUser, deleteTugas, downloadTugas, previewTugas}
 ) (NewTask);
