import React from "react";
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { viewOneTask, deleteTask } from "../../../actions/TaskActions";
import { uploadTugas, deleteTugas, downloadLampiran, previewLampiran } from "../../../actions/UploadActions";
import { getTaskFilesByUser } from "../../../actions/UploadActions";
import { getOneUser } from "../../../actions/UserActions";
import LightToolTip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Button, Dialog, Fab, Grid, IconButton,
   ListItem, ListItemAvatar, ListItemText, ListItemIcon,
   Paper, Typography } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "10px",
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
    marginBottom: "10px"
  },
  workBox: {
    margin: "auto",
    marginTop: "30px",
    justifyContent: "center",
    flexDirection: "row"
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
  },
  seeAllTaskButton: {
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: "#61BD4F",
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
    marginBottom: "10px"
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
}));

function LampiranFile(props) {
  const classes = useStyles();
  const {file_id, filename, filetype, onDownloadFile, onPreviewFile} = props;
  return (
    <Grid item xs={6}>
      <Paper variant="outlined" className={classes.listItemPaper}>
        <ListItem button disableRipple className={classes.listItem}
        onClick={() => {onPreviewFile(file_id, "lampiran")}}>
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

function ViewTaskTeacher(props) {
  const classes = useStyles();
  const { user } = props.auth;
  const {deleteTask, tasksCollection, downloadLampiran, previewLampiran, viewOneTask } = props;
  const task_id = props.match.params.id
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);

  document.title = !tasksCollection.name ? "Schooly | Lihat Tugas" : `Schooly | ${tasksCollection.name}`

  React.useEffect(() => {
    viewOneTask(task_id)
  }, [tasksCollection._id])

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

  const onDownloadFile = (id, fileCategory="none") => {
    if(fileCategory === "lampiran")
      downloadLampiran(id)
    else
      console.log("File Category is not specified")
  }

  const onPreviewFile = (id, fileCategory="none") => {
   if(fileCategory === "lampiran")
      previewLampiran(id)
    else
      console.log("File Category is not specified")
  }

  const onDeleteTask = (id) => {
    deleteTask(id)
    // setFileTugas(null)
  }

  //Delete Dialog box
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  function DeleteDialog(){
    return (
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
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
              Hapus tugas berikut?
            </Typography>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h6" align="center" gutterBottom>
              <b>{tasksCollection.name}</b>
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
                onClick={() => { onDeleteTask(task_id)}}
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
          <Grid item xs={6} style={{marginBottom: "30px"}}>
            <Typography variant="h4" >
              {tasksCollection.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              <h6>Mata Pelajaran: {tasksCollection.subject}</h6>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Penanggung Jawab: <b>{user.name}</b>
            </Typography>
          </Grid>
          <Grid item xs={6} container direction="column" alignItems="flex-end">
            <Typography variant="overline" className={classes.deadlineWarningText}>
              Tanggal Kumpul: {moment(tasksCollection.deadline).locale("id").format("DD-MM-YYYY")}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Nilai Maksimum: 100
            </Typography>
          </Grid>
          <Grid item xs={12} style={{marginBottom: "30px"}}>
            <Typography color="primary" gutterBottom>
              Deskripsi Tugas:
            </Typography>
            <Typography>
              {tasksCollection.description}
            </Typography>
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </Paper>
      <Grid container spacing={2} justify="flex-end" alignItems="center">
        <Grid item>
          <Link to={`/daftar-tugas-terkumpul/${task_id}`}>
            <Fab variant="extended" className={classes.seeAllTaskButton}>
              <AssignmentIcon style={{marginRight: "10px"}} />
              Lihat Hasil Pekerjaan
            </Fab>
          </Link>
        </Grid>
        <Grid item>
          <Link to={`/sunting-tugas/${task_id}`}>
            <LightToolTip title="Sunting Tugas" placement="bottom">
              <Fab className={classes.editTaskButton}>
                <EditIcon />
              </Fab>
            </LightToolTip>
          </Link>
        </Grid>
        <Grid item>
          <LightToolTip title="Buang Tugas" placement="bottom">
            <Fab className={classes.deleteTaskButton} onClick={(e) => handleOpenDeleteDialog(e,task_id)}>
              <DeleteIcon />
            </Fab>
          </LightToolTip>
        </Grid>
      </Grid>
    </div>
  )
}

ViewTaskTeacher.propTypes = {
   auth: PropTypes.object.isRequired,
   tasksCollection: PropTypes.object.isRequired,
   filesCollection: PropTypes.object.isRequired,
   downloadLampiran: PropTypes.func.isRequired,
   previewLampiran: PropTypes.func.isRequired,
   deleteTask: PropTypes.func.isRequired,
   updateUserData: PropTypes.func.isRequired,
   getOneUser: PropTypes.func.isRequired, // for the person in charge task
   getTaskFilesByUser: PropTypes.func.isRequired, //get the task files.
   viewOneTask: PropTypes.func.isRequired,
 }

const mapStateToProps = (state) => ({
   auth: state.auth,
   tasksCollection: state.tasksCollection
 });

export default connect(
   mapStateToProps,  {uploadTugas, deleteTask, downloadLampiran,
    previewLampiran, viewOneTask, getTaskFilesByUser, getOneUser }
 ) (ViewTaskTeacher);
