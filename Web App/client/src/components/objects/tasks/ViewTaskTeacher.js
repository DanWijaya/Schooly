import React from "react";
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { viewOneTask, deleteTask } from "../../../actions/TaskActions";
import { uploadTugas, deleteTugas, downloadLampiran, previewLampiran } from "../../../actions/UploadActions";
import { getOneUser } from "../../../actions/UserActions";
import { viewClass } from "../../../actions/ClassActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Button, Dialog, Fab, Grid, Hidden, IconButton, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import { FaFile, FaFileAlt, FaFileExcel, FaFileImage, FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa";


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
    marginBottom: "10px",
  },
  deadlineWarningText: {
    color: theme.palette.warning.main,
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
    marginBottom: "10px",
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
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
}));

function LampiranFile(props) {
  const classes = useStyles();

  const { file_id, filename, filetype, onDownloadFile, onPreviewFile } = props;

  let displayedName = ""
  filename.length >= 31 ?
    displayedName = `${filename.slice(0,30)}..${path.extname(filename)}`
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

function ViewTaskTeacher(props) {
  const classes = useStyles();

  const { user } = props.auth;
  const { deleteTask, tasksCollection, downloadLampiran, previewLampiran, viewOneTask, viewClass } = props;
  const { all_classes } = props.classesCollection;
  const task_id = props.match.params.id
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [classes_map, setClassesMap] = React.useState(new Map());

  React.useEffect(() => {
    viewOneTask(task_id)
    viewClass()
    if (all_classes.length) {
      let temp = new Map()
      all_classes.map((kelas) => temp.set(kelas._id, kelas))
      setClassesMap(temp);
    }
  }, [tasksCollection._id, all_classes.length])

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

  const onDownloadFile = (id, fileCategory="none") => {
    if (fileCategory === "lampiran")
      downloadLampiran(id)
    else
      console.log("File Category is not specified")
  }

  const onPreviewFile = (id, fileCategory="none") => {
   if (fileCategory === "lampiran")
      previewLampiran(id)
    else
      console.log("File Category is not specified")
  }

  const onDeleteTask = (id) => {
    deleteTask(id)
    // setFileTugas(null)
  }

  // Delete Dialog
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true);
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
            style={{marginBottom: "10px"}}
          >
            <Grid item>
              <Button
                onClick={() => { onDeleteTask(task_id)}}
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
                Batalkan
              </Button>
            </Grid>
          </Grid>
          </Grid>
      </Dialog>
    )
  }

  document.title = !tasksCollection.name ? "Schooly | Lihat Tugas" : `Schooly | ${tasksCollection.name}`

  return(
    <div className={classes.root}>
      {DeleteDialog()}
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
              Penanggung Jawab: <b>{user.name}</b>
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Hidden mdUp implementation="css">
              <Typography variant="body2" className={classes.deadlineWarningText} gutterBottom>
                Batas Waktu: {moment(tasksCollection.deadline).locale("id").format("DD/MMMM/YYYY - HH.mm")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Nilai Maksimum: 100
              </Typography>
            </Hidden>
            <Hidden smDown implementation="css" style={{display: "flex"}}>
              <Typography variant="body2" align="right" className={classes.deadlineWarningText} gutterBottom>
                Batas Waktu: {moment(tasksCollection.deadline).locale("id").format("DD/MMMM/YYYY - HH.mm")}
              </Typography>
              <Typography variant="body2" align="right" color="textSecondary">
                Nilai Maksimum: 100
              </Typography>
            </Hidden>
          </Grid>
          <Grid item xs={12} style={{marginTop: "30px"}}>
            <Typography color="primary" gutterBottom>
              Kelas yang Diberikan:
            </Typography>
            <Typography>
              {!tasksCollection.class_assigned || !classes_map.size? null :
              tasksCollection.class_assigned.map((kelas, i) => {
                if (i === tasksCollection.class_assigned.length - 1)
                  return `${classes_map.get(kelas).name}`
                return (`${classes_map.get(kelas).name}, `)
              })}
            </Typography>
          </Grid>

          <Grid item xs={12} style={{marginTop: "30px"}}>
            <Typography color="primary" gutterBottom>
              Deskripsi Tugas:
            </Typography>
            <Typography>
              {tasksCollection.description}
            </Typography>
          </Grid>
          <Grid item xs={12} style={{marginTop: "30px"}}>
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
              Lihat Hasil
            </Fab>
          </Link>
        </Grid>
        <Grid item>
          <Link to={`/sunting-tugas/${task_id}`}>
            <LightTooltip title="Sunting Tugas" placement="bottom">
              <Fab className={classes.editTaskButton}>
                <EditIcon />
              </Fab>
            </LightTooltip>
          </Link>
        </Grid>
        <Grid item>
          <LightTooltip title="Buang Tugas" placement="bottom">
            <Fab className={classes.deleteTaskButton} onClick={(e) => handleOpenDeleteDialog(e,task_id)}>
              <DeleteIcon />
            </Fab>
          </LightTooltip>
        </Grid>
      </Grid>
    </div>
  )
}

ViewTaskTeacher.propTypes = {
   auth: PropTypes.object.isRequired,
   tasksCollection: PropTypes.object.isRequired,
   classesCollection: PropTypes.object.isRequired,

   downloadLampiran: PropTypes.func.isRequired,
   previewLampiran: PropTypes.func.isRequired,
   deleteTask: PropTypes.func.isRequired,
   updateUserData: PropTypes.func.isRequired,
   getOneUser: PropTypes.func.isRequired, // For the person in charge task
   getTaskFilesByUser: PropTypes.func.isRequired, // Get the task files.
   viewOneTask: PropTypes.func.isRequired,
 }

const mapStateToProps = (state) => ({
   auth: state.auth,
   tasksCollection: state.tasksCollection,
   classesCollection: state.classesCollection
 });

export default connect(
   mapStateToProps,  {uploadTugas, deleteTask, downloadLampiran,
    previewLampiran, viewOneTask, getOneUser, viewClass }
 ) (ViewTaskTeacher);
