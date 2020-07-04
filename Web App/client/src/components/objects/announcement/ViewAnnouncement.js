import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LightToolTip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Button, Dialog, Fab, Grid, IconButton, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getAllAnnouncements, getAnnouncement, getOneAnnouncement, deleteAnnouncement} from "../../../actions/AnnouncementActions"
import { viewSelectedClasses } from "../../../actions/ClassActions"
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import moment from "moment";
import "moment/locale/id";
import { downloadLampiranAnnouncement, previewLampiranAnnouncement } from "../../../actions/UploadActions";

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
    width: "350px",
    padding: "10px",
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
  deleteAnnouncementButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
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
        onClick={() => {onPreviewFile(file_id, "lampiran_announcement")}}>
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
              onDownloadFile(file_id, "lampiran_announcement")}}>
              <CloudDownloadIcon />
            </IconButton>
          </ListItemIcon>
        </ListItem>
      </Paper>
    </Grid>
  )
}

function ViewAnnouncement(props) {
  document.title = "Schooly | Lihat Pengumuman"

  const classes = useStyles();
  const { selectedAnnouncements, all_announcements } = props.announcements;
  const { classesCollection, getOneAnnouncement,downloadLampiranAnnouncement,previewLampiranAnnouncement, deleteAnnouncement, viewSelectedClasses } = props;
  const { user } = props.auth;
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const announcement_id = props.match.params.id;

  React.useEffect(() => {
    getOneAnnouncement(announcement_id)
    viewSelectedClasses(selectedAnnouncements.class_assigned)
    console.log(selectedAnnouncements)
  }, selectedAnnouncements._id) // beacause only receive one announcement.

  console.log(classesCollection)
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

  function DeleteDialog(){
    return(
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <Grid container justify="center" className={classes.dialogBox}>
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
            style={{marginBottom: "20px"}}
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
    if(fileCategory === "lampiran_announcement")
      downloadLampiranAnnouncement(id)
    else
      console.log("File Category is not specified")
  }

  const onPreviewFile = (id, fileCategory="none") => {
   if(fileCategory === "lampiran_announcement")
      previewLampiranAnnouncement(id)
    else
      console.log("File Category is not specified")
  }

  return(
    <div className={classes.root}>
      {DeleteDialog()}
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={3}>
          <Grid item container direction="row">
            <ListItemText
              primary={selectedAnnouncements.title}
              secondary={selectedAnnouncements.author_name}
            />
            <ListItemText
              align="right"
              primary={`Tanggal diumumkan: ${moment(selectedAnnouncements.date_announced).locale("id").format("DD-MM-YYYY")}`}
              secondary={`Pukul: ${moment(selectedAnnouncements.date_announced).locale("id").format("HH:mm:ss")}`}
            />
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
              {!selectedAnnouncements.lampiran ? null : 
              selectedAnnouncements.lampiran.map((lampiran) => (
                <LampiranFile
                  file_id={lampiran.id}
                  onPreviewFile={onPreviewFile}
                  onDownloadFile ={onDownloadFile}
                  filename={lampiran.filename}
                  filetype={fileType(lampiran.filename)}/>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      { user.role === "Admin" || user.id === selectedAnnouncements.author_id? // kalau studentnya ketua kelas yang buat pengumumannya
          <div className={classes.teacherButtonContainer}>
            <Link to={`/sunting-pengumuman/${announcement_id}`}>
              <LightToolTip title="Sunting Pengumuman" placement="bottom">
                <Fab className={classes.editAnnouncementButton}>
                  <EditIcon />
                </Fab>
              </LightToolTip>
            </Link>
            <LightToolTip title="Hapus Pengumuman" placement="bottom">
              <Fab className={classes.deleteAnnouncementButton} onClick={(e) => handleOpenDeleteDialog(e,announcement_id)}>
                <DeleteIcon />
              </Fab>
            </LightToolTip>
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
  getAnnouncement: PropTypes.func.isRequired,
  getAllAnnouncements: PropTypes.func.isRequired,
  getOneAnnouncement: PropTypes.func.isRequired,
  deleteAnnouncement: PropTypes.func.isRequired,
  downloadLampiranAnnouncement: PropTypes.func.isRequired,
  previewLampiranAnnouncement: PropTypes.func.isRequired,
  viewSelectedClasses: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  announcements: state.announcementsCollection
});

export default connect(
  mapStateToProps, { getOneAnnouncement, getAnnouncement, deleteAnnouncement, getAllAnnouncements, 
    previewLampiranAnnouncement, downloadLampiranAnnouncement, viewSelectedClasses}
) (ViewAnnouncement);
