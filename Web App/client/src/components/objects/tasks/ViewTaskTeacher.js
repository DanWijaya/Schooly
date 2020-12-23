import React from "react";
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getOneTask, deleteTask } from "../../../actions/TaskActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { uploadTugas, downloadLampiran, previewLampiran } from "../../../actions/UploadActions";
import { getOneUser } from "../../../actions/UserActions";
import { getAllClass } from "../../../actions/ClassActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Fab, Grid, Hidden, IconButton, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DeleteIcon from "@material-ui/icons/Delete";
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
  paperBox: {
    padding: "20px",
    marginBottom: "10px",
  },
  deadlineWarningText: {
    color: theme.palette.warning.main,
  },
  seeAllTaskButton: {
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.create.main,
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

  return (
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

// component ini akan view task yang teacher dia sendiri buat.
function ViewTaskTeacher(props) {
  const classes = useStyles();

  const { user } = props.auth;
  const { deleteTask, tasksCollection, downloadLampiran, previewLampiran, getOneTask, getAllClass, getAllSubjects } = props;
  const { all_classes_map } = props.classesCollection;
  const task_id = props.match.params.id;
  const { all_subjects_map} = props.subjectsCollection;
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);

  React.useEffect(() => {
    getOneTask(task_id)
    getAllClass("map")
    getAllSubjects("map")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // [tasksCollection._id, all_classes_map.size, all_subjects_map.size]

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

console.log(all_classes_map)
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

  document.title = !tasksCollection.name ? "Schooly | Lihat Tugas" : `Schooly | ${tasksCollection.name}`

  return (
    <div className={classes.root}>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Tugas"
        itemName={tasksCollection.name}
        deleteItem={() => { onDeleteTask(task_id)}}
      />
      <Paper className={classes.paperBox}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Typography variant="h4">
              {tasksCollection.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              <h6>Mata Pelajaran: {all_subjects_map.get(tasksCollection.subject)}</h6>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Penanggung Jawab: <b>{user.name}</b>
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Hidden mdUp implementation="css">
              <Typography variant="body2" className={classes.deadlineWarningText} gutterBottom>
                Batas Waktu: {moment(tasksCollection.deadline).locale("id").format("DD MMM YYYY, HH.mm")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Nilai Maksimum: 100
              </Typography>
            </Hidden>
            <Hidden smDown implementation="css" style={{display: "flex"}}>
              <Typography variant="body2" align="right" className={classes.deadlineWarningText} gutterBottom>
                Batas Waktu: {moment(tasksCollection.deadline).locale("id").format("DD MMM YYYY, HH.mm")}
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
              {!tasksCollection.class_assigned || !all_classes_map.size? null :
              tasksCollection.class_assigned.map((kelas, i) => {
                if(all_classes_map.get(kelas)){
                  if (i === tasksCollection.class_assigned.length - 1)
                    return `${all_classes_map.get(kelas).name}`
                  return (`${all_classes_map.get(kelas).name}, `)
                }
                return null;
              })}
            </Typography>
          </Grid>
          {!tasksCollection.description ? null :
            <Grid item xs={12} style={{marginTop: "30px"}}>
              <Typography color="primary" gutterBottom>
                Deskripsi Tugas:
              </Typography>
              <Typography>
                {tasksCollection.description}
              </Typography>
            </Grid>
          }
          {(!tasksCollection.lampiran || tasksCollection.lampiran.length === 0) ? null :
            <Grid item xs={12} style={{marginTop: "30px"}}>
              <Typography color="primary" gutterBottom>
                Lampiran Berkas:
              </Typography>
              <Grid container spacing={1}>
              {
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
          }
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
                <EditIcon/>
              </Fab>
            </LightTooltip>
          </Link>
        </Grid>
        <Grid item>
          <LightTooltip title="Hapus" placement="bottom">
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
   subjectsCollection: PropTypes.object.isRequired,

   downloadLampiran: PropTypes.func.isRequired,
   previewLampiran: PropTypes.func.isRequired,
   deleteTask: PropTypes.func.isRequired,
   getAllSubjects: PropTypes.func.isRequired,
   updateUserData: PropTypes.func.isRequired,
   getOneUser: PropTypes.func.isRequired, // For the person in charge task
   getTaskFilesByUser: PropTypes.func.isRequired, // Get the task files.
   getOneTask: PropTypes.func.isRequired,
 }

const mapStateToProps = (state) => ({
   auth: state.auth,
   tasksCollection: state.tasksCollection,
   classesCollection: state.classesCollection,
   subjectsCollection: state.subjectsCollection,
 });

export default connect(
   mapStateToProps,  {uploadTugas, deleteTask, downloadLampiran,
    previewLampiran, getOneTask, getOneUser, getAllClass, getAllSubjects }
 ) (ViewTaskTeacher);
