import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { downloadLampiranAnnouncement, previewLampiranAnnouncement } from "../../../actions/UploadActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Button, Dialog, Fab, Grid, Hidden, IconButton, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getOneAnnouncement, deleteAnnouncement} from "../../../actions/AnnouncementActions"
import { getSelectedClasses } from "../../../actions/ClassActions"
import { getUsers } from "../../../actions/UserActions";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { FaFile, FaFileAlt, FaFileExcel, FaFileImage, FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa";

const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  paper: {
    padding: "30px",
  },
  listItemPaper: {
    marginBottom: "10px"
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  teacherButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  editAnnouncementButton: {
    marginRight: "10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  dialogBox: {
    maxWidth: "350px",
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
  downloadIconButton: {
    marginLeft: "5px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteAnnouncementButton: {
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
}));


function LampiranFile(props) {
  const classes = useStyles();

  const {file_id, filename, filetype, onDownloadFile, onPreviewFile} = props;

  let displayedName = ""
  filename.length >= 26 ?
    displayedName = `${filename.slice(0,25)}..${path.extname(filename)}`
  :
    displayedName = filename

  return (
    <Grid item xs={12} sm={6}>
      <Paper variant="outlined" className={classes.listItemPaper}>
        <ListItem button disableRipple className={classes.listItem}
          onClick={() => {onPreviewFile(file_id, "lampiran_announcement")}}
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
                <Typography variant="subtitle2">
                  {displayedName}
                </Typography>
              </LightTooltip>
            }
            secondary={filetype}
          />
          <IconButton
            size="small"
            className={classes.downloadIconButton}
            onClick={(e) => { e.stopPropagation(); onDownloadFile(file_id, "lampiran_announcement") }}
          >
            <CloudDownloadIcon fontSize="small" />
          </IconButton>
        </ListItem>
      </Paper>
    </Grid>
  )
}

function ViewAnnouncement(props) {
  document.title = "Schooly | Lihat Pengumuman"

  const classes = useStyles();
  const { selectedAnnouncements } = props.announcements;
  const { getUsers, classesCollection, getOneAnnouncement,downloadLampiranAnnouncement,previewLampiranAnnouncement, deleteAnnouncement, getSelectedClasses } = props;
  const { user, retrieved_users } = props.auth;
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const announcement_id = props.match.params.id;

  React.useEffect(() => {
    getOneAnnouncement(announcement_id)
    getSelectedClasses(selectedAnnouncements.class_assigned)
    if (selectedAnnouncements._id) {
      console.log("getusers is runned")
      getUsers([selectedAnnouncements.author_id])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnnouncements._id]) // beacause only receive one announcement.

  console.log(new Date(), classesCollection)
  console.log("selected announcement: ", selectedAnnouncements)
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

  const onDeleteAnnouncement = (announcement_id) => {
    deleteAnnouncement(announcement_id)
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
    return (
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
              Hapus Pengumuman berikut?
            </Typography>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h6" align="center" gutterBottom>
              <b>{selectedAnnouncements.title}</b>
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
                onClick={() => { onDeleteAnnouncement(announcement_id)}}
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

  const onDownloadFile = (id, fileCategory="none") => {
    if (fileCategory === "lampiran_announcement")
      downloadLampiranAnnouncement(id)
    else
      console.log("File Category is not specified")
  }

  const onPreviewFile = (id, fileCategory="none") => {
   if (fileCategory === "lampiran_announcement")
      previewLampiranAnnouncement(id)
    else
      console.log("File Category is not specified")
  }

  console.log(retrieved_users)
  return (
    <div className={classes.root}>
      {DeleteDialog()}
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={3}>
          <Grid item container direction="row">
            <Grid item xs={12} md={6}>
              <ListItemText
                primary={
                  <Typography variant="h4">
                    {selectedAnnouncements.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="h6" color="textSecondary">
                    {!retrieved_users.size || !selectedAnnouncements.author_id || !retrieved_users.get(selectedAnnouncements.author_id) ?  "" : retrieved_users.get(selectedAnnouncements.author_id).name }
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Hidden mdUp implementation="css">
                <ListItemText
                  primary={`Tanggal diumumkan: ${moment(selectedAnnouncements.date_announced).locale("id").format("DD-MM-YYYY")}`}
                  secondary={`Pukul: ${moment(selectedAnnouncements.date_announced).locale("id").format("HH:mm:ss")}`}
                />
              </Hidden>
              <Hidden smDown implementation="css">
                <ListItemText
                  align="right"
                  primary={`Tanggal diumumkan: ${moment(selectedAnnouncements.date_announced).locale("id").format("DD-MM-YYYY")}`}
                  secondary={`Pukul: ${moment(selectedAnnouncements.date_announced).locale("id").format("HH:mm:ss")}`}
                />
              </Hidden>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="primary" gutterBottom>
              Deskripsi:
            </Typography>
            <Typography variant="body1">
            {selectedAnnouncements.description}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="primary" gutterBottom>
              Lampiran Berkas:
            </Typography>
            <Grid item container spacing={1}>
              {!selectedAnnouncements.lampiran ? null
              :
              selectedAnnouncements.lampiran.map((lampiran) => (
                <LampiranFile
                  file_id={lampiran.id}
                  onPreviewFile={onPreviewFile}
                  onDownloadFile ={onDownloadFile}
                  filename={lampiran.filename}
                  filetype={fileType(lampiran.filename)}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      { user.role === "Admin" || user.id === selectedAnnouncements.author_id? // kalau studentnya ketua kelas yang buat pengumumannya
          <div className={classes.teacherButtonContainer}>
            <Link to={`/sunting-pengumuman/${announcement_id}`}>
              <LightTooltip title="Sunting Pengumuman" placement="bottom">
                <Fab className={classes.editAnnouncementButton}>
                  <EditIcon />
                </Fab>
              </LightTooltip>
            </Link>
            <LightTooltip title="Hapus Pengumuman" placement="bottom">
              <Fab className={classes.deleteAnnouncementButton} onClick={(e) => handleOpenDeleteDialog(e,announcement_id)}>
                <DeleteIcon />
              </Fab>
            </LightTooltip>
          </div>
      : null
    }
    </div>
  )
}

ViewAnnouncement.propTypes = {
  auth: PropTypes.object.isRequired,
  announcements: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  getOneAnnouncement: PropTypes.func.isRequired,
  deleteAnnouncement: PropTypes.func.isRequired,
  downloadLampiranAnnouncement: PropTypes.func.isRequired,
  previewLampiranAnnouncement: PropTypes.func.isRequired,
  getSelectedClasses: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  announcements: state.announcementsCollection
});

export default connect(
  mapStateToProps, { getOneAnnouncement, getUsers, deleteAnnouncement,
    previewLampiranAnnouncement, downloadLampiranAnnouncement, getSelectedClasses}
) (ViewAnnouncement);
