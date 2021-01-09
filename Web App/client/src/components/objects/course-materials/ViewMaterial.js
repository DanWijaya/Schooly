import React from "react";
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getFileMaterials, downloadFileMaterial, viewFileMaterial} from "../../../actions/Files/FileMaterialActions"
import { getSelectedClasses, getAllClass } from "../../../actions/ClassActions";
import { getOneUser } from "../../../actions/UserActions";
import { getOneMaterial, deleteMaterial } from "../../../actions/MaterialActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, CircularProgress, Fab, Grid, IconButton, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
    },
  },
  editButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteButton: {
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
      backgroundColor: theme.palette.primary.fade,
    },
  },
  downloadIconButton: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  downloadIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
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
  const [progress, setProgress] = React.useState(null);
  var req = null
  let displayedName = ""
  filename.length >= 31 ?
    displayedName = `${filename.slice(0,30)}..${path.extname(filename)}`
  :
    displayedName = filename
  return (
    <Grid item xs={6}>
      <Paper variant="outlined" className={classes.listItemPaper}>
        <ListItem
          button
          disableRipple
          className={classes.listItem}
          onClick={() => {onPreviewFile(file_id)}}>
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
            className={classes.downloadIconButton}
            onClick={(e) => { 
              e.stopPropagation(); 
              onDownloadFile(file_id)
            }}
          >
            <CloudDownloadIcon className={classes.downloadIcon} />
          </IconButton>
        </ListItem>
        {/* <div id="myProgress" style="display:none;">      
            sds
          </div>  */}
      </Paper>
    </Grid>
  )
}

function ViewMaterial(props) {
  const classes = useStyles();

  const { user, selectedUser} = props.auth;
  const { deleteMaterial, getOneUser, getAllSubjects, viewFileMaterial,
    downloadFileMaterial, getOneMaterial, getAllClass, getFileMaterials } = props;
  const { selectedMaterials, all_materials } = props.materialsCollection;
  const { all_classes_map } = props.classesCollection;
  const materi_id = props.match.params.id
  const { all_subjects_map} = props.subjectsCollection;
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [fileLampiran, setFileLampiran] = React.useState([])
  
  console.log(props.materialsFiles)
  React.useEffect(() => {
    getAllSubjects("map") // this will get the selectedMaterials.
    getOneMaterial(materi_id)
    getAllClass("map")
    getOneUser(selectedMaterials.author_id)
    // COba S3
    getFileMaterials(materi_id).then((result) => {
      setFileLampiran(result)
    })
     // bakal ngedapat collection of S3 files di 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMaterials.author_id])

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

  const onDeleteTask = (id) => {
    deleteMaterial(id)
    // setFileMateri(null)
  }

  // Delete Dialog
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  document.title = !selectedMaterials.name ? "Schooly | Lihat Materi" : `Schooly | ${selectedMaterials.name}`
  return (
    <div className={classes.root}>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Materi"
        itemName={selectedMaterials.name}
        deleteItem={() => { onDeleteTask(materi_id)}}
      />
      <Paper className={classes.paperBox}>
        <Grid
          container
          spacing={2}
        >
          <Grid item xs={12} style={{marginBottom: "30px"}}>
            <Typography variant="h4" >
              {selectedMaterials.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              <h6>Mata Pelajaran: {all_subjects_map.get(selectedMaterials.subject)}</h6>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Penanggung Jawab: <b>{selectedUser.name}</b>
            </Typography>
          </Grid>
          {user.role === "Teacher" ?
            <Grid item xs={12} style={{marginBottom: "30px"}}>
              <Typography color="primary" gutterBottom>
                Kelas yang Diberikan:
              </Typography>
              <Typography>
                {!selectedMaterials.class_assigned || !all_classes_map.size? null :
                selectedMaterials.class_assigned.map((kelas, i) => {
                  if(all_classes_map.get(kelas)){
                    if(i === selectedMaterials.class_assigned.length - 1)
                      return `${all_classes_map.get(kelas).name}`
                    return (`${all_classes_map.get(kelas).name}, `)
                  }
                  return null
                })}
              </Typography>
            </Grid>
          :
            null
          }
          <Grid item xs={12} style={{marginBottom: "30px"}}>
            <Typography color="primary" gutterBottom>
              Deskripsi Materi:
            </Typography>
            <Typography>
              {selectedMaterials.description}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="primary" gutterBottom>
              Lampiran Materi:
            </Typography>
            <Grid container spacing={1}>
            {fileLampiran.map((lampiran) => 
            ( <LampiranFile
                file_id={lampiran._id}
                onPreviewFile ={viewFileMaterial}
                onDownloadFile={downloadFileMaterial}
                filename={lampiran.filename}
                filetype={fileType(lampiran.filename)}
            /> ))}
            {/* {!selectedMaterials.lampiran ? null :
              selectedMaterials.lampiran.map((lampiran) => (
                <LampiranFile
                  file_id={lampiran.id}
                  onPreviewFile ={onPreviewFile}
                  onDownloadFile ={onDownloadFile}
                  filename={lampiran.filename}
                  filetype={fileType(lampiran.filename)}
                />
              ))} */}
            </Grid>
        </Grid>
        </Grid>
      </Paper>
      {user.role === "Teacher" ?
      <Grid container spacing={2} justify="flex-end" alignItems="center">
        <Grid item>
        </Grid>
        <Grid item>
          <Link to={`/sunting-materi/${materi_id}`}>
            <LightTooltip title="Sunting" placement="bottom">
              <Fab className={classes.editButton}>
                <EditIcon />
              </Fab>
            </LightTooltip>
          </Link>
        </Grid>
        <Grid item>
          <LightTooltip title="Hapus" placement="bottom">
            <Fab className={classes.deleteButton} onClick={(e) => handleOpenDeleteDialog(e,materi_id)}>
              <DeleteIcon />
            </Fab>
          </LightTooltip>
        </Grid>
      </Grid> : null
      }
    </div>
  )
}

ViewMaterial.propTypes = {
   auth: PropTypes.object.isRequired,
   materialsCollection: PropTypes.object.isRequired,
   classesCollection: PropTypes.object.isRequired,
   subjectsCollection: PropTypes.object.isRequired,
   materialsFiles: PropTypes.object.isRequired,

   deleteMaterial: PropTypes.func.isRequired,
   getOneUser: PropTypes.func.isRequired, // For the person in charge task
   getOneMaterial: PropTypes.func.isRequired,
   getAllSubjects: PropTypes.func.isRequired,
   getSelectedClasses: PropTypes.func.isRequired,
   getAllClass: PropTypes.func.isRequired,
   getFileMaterials: PropTypes.func.isRequired,
   viewFileMaterial: PropTypes.func.isRequired,
   downloadFileMaterial: PropTypes.func.isRequired
 }

const mapStateToProps = (state) => ({
   auth: state.auth,
   materialsCollection: state.materialsCollection,
   classesCollection: state.classesCollection,
   subjectsCollection: state.subjectsCollection,
   materialsFiles: state.materialsFiles
 });

export default connect(
   mapStateToProps,  {getAllSubjects,getOneMaterial, 
    deleteMaterial,getOneUser, getAllClass, 
    getSelectedClasses, getFileMaterials,
    viewFileMaterial, downloadFileMaterial }
 ) (ViewMaterial);
