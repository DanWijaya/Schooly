import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import {
  getFileAnnouncements,
  downloadFileAnnouncements,
  viewFileAnnouncement,
} from "../../../actions/files/FileAnnouncementActions";
import {
  getOneAnnouncement,
  deleteAnnouncement,
} from "../../../actions/AnnouncementActions";
import { getSelectedClasses, getAllClass } from "../../../actions/ClassActions";
import { getUsers } from "../../../actions/UserActions";
import {
  downloadLampiranAnnouncement,
  previewLampiranAnnouncement,
} from "../../../actions/UploadActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Fab,
  Grid,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";

const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "10px",
  },
  paperBox: {
    padding: "20px",
    // marginBottom: "10px",
  },
  listItemPaper: {
    marginBottom: "10px",
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  teacherButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    // marginTop: "20px",
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
  deadlineWarningText: {
    color: theme.palette.warning.main,
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function LampiranFile(props) {
  const classes = useStyles();

  const { file_id, filename, filetype, onDownloadFile, onPreviewFile } = props;

  let displayedName = "";
  filename.length >= 26
    ? (displayedName = `${filename.slice(0, 25)}..${path.extname(filename)}`)
    : (displayedName = filename);

  return (
    <Grid item xs={12} sm={6}>
      <Paper variant="outlined" className={classes.listItemPaper}>
        <ListItem
          button
          disableRipple
          className={classes.listItem}
          onClick={() => {
            onPreviewFile(file_id, "lampiran_announcement");
          }}
        >
          <ListItemAvatar>
            {filetype === "Word" ? (
              <Avatar className={classes.wordFileTypeIcon}>
                <FaFileWord />
              </Avatar>
            ) : filetype === "Excel" ? (
              <Avatar className={classes.excelFileTypeIcon}>
                <FaFileExcel />
              </Avatar>
            ) : filetype === "Gambar" ? (
              <Avatar className={classes.imageFileTypeIcon}>
                <FaFileImage />
              </Avatar>
            ) : filetype === "PDF" ? (
              <Avatar className={classes.pdfFileTypeIcon}>
                <FaFilePdf />
              </Avatar>
            ) : filetype === "Teks" ? (
              <Avatar className={classes.textFileTypeIcon}>
                <FaFileAlt />
              </Avatar>
            ) : filetype === "Presentasi" ? (
              <Avatar className={classes.presentationFileTypeIcon}>
                <FaFilePowerpoint />
              </Avatar>
            ) : filetype === "File Lainnya" ? (
              <Avatar className={classes.otherFileTypeIcon}>
                <FaFile />
              </Avatar>
            ) : null}
          </ListItemAvatar>
          <ListItemText
            primary={
              <LightTooltip title={filename} placement="top">
                <Typography variant="subtitle2">{displayedName}</Typography>
              </LightTooltip>
            }
            secondary={filetype}
          />
          {/* <IconButton
            size="small"
            className={classes.downloadIconButton}
            onClick={(e) => {
              e.stopPropagation();
              onDownloadFile(file_id, "lampiran_announcement");
            }}
          >
            <CloudDownloadIcon fontSize="small" />
          </IconButton> */}
        </ListItem>
      </Paper>
    </Grid>
  );
}

function ViewAnnouncement(props) {
  document.title = "Schooly | Lihat Pengumuman";

  const classes = useStyles();
  const { selectedAnnouncements } = props.announcements;
  const {
    getUsers,
    classesCollection,
    getOneAnnouncement,
    downloadLampiranAnnouncement,
    previewLampiranAnnouncement,
    deleteAnnouncement,
    getSelectedClasses,
    getAllClass,
    getFileAnnouncements,
    viewFileAnnouncement,
    downloadFileAnnouncements,
  } = props;
  const { all_classes_map } = props.classesCollection;
  const { user, retrieved_users } = props.auth;
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [fileLampiran, setFileLampiran] = React.useState([]);

  const announcement_id = props.match.params.id;

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    getOneAnnouncement(announcement_id);
    getAllClass("map");
    getSelectedClasses(selectedAnnouncements.class_assigned);
    if (selectedAnnouncements._id) {
      getUsers([selectedAnnouncements.author_id]);
    }
    getFileAnnouncements(announcement_id).then((result) => {
      setFileLampiran(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnnouncements._id]); // beacause only receive one announcement.

  const fileType = (filename) => {
    let ext_file = path.extname(filename);
    switch (ext_file) {
      case ".docx":
        return "Word";
      case ".xlsx":
      case ".csv":
        return "Excel";

      case ".png":
      case ".jpg":
      case ".jpeg":
        return "Gambar";

      case ".pdf":
        return "PDF";

      case ".txt":
      case ".rtf":
        return "Teks";

      case ".ppt":
      case ".pptx":
        return "Presentasi";

      default:
        return "File Lainnya";
    }
  };

  const onDeleteAnnouncement = (announcement_id) => {
    deleteAnnouncement(announcement_id);
    // setFileTugas(null)
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const onDownloadFile = (id, fileCategory = "none") => {
    if (fileCategory === "lampiran_announcement") console.log(":Download");
    // downloadLampiranAnnouncement(id)
    else console.log("File Category is not specified");
  };

  const onPreviewFile = (id, fileCategory = "none") => {
    if (fileCategory === "lampiran_announcement") console.log("Download");
    // previewLampiranAnnouncement(id)
    else console.log("File Category is not specified");
  };

  return (
    <div className={classes.root}>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Pengumuman"
        itemName={selectedAnnouncements.title}
        deleteItem={() => {
          onDeleteAnnouncement(announcement_id);
        }}
      />
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Paper className={classes.paperBox}>
            <Grid container spacing={2}>
              <Grid item xs={12} style={{ paddingBottom: "0" }}>
                <Typography variant="h4">
                  {selectedAnnouncements.title}
                </Typography>
              </Grid>
              <Grid item xs={12} style={{ paddingTop: "0" }}>
              {/* h6 ditambahkan agar margin teks ini dengan teks nama pengumuman 
              memiliki margin yang sama seperti pada halaman-halaman view objek lainnya */}
                <h6 style={{ marginBottom: "0" }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    // style={{ marginTop: "10px" }}
                  >
                    Oleh:{" "}
                    <b>
                      {!retrieved_users.size ||
                      !selectedAnnouncements.author_id ||
                      !retrieved_users.get(selectedAnnouncements.author_id)
                        ? ""
                        : retrieved_users.get(selectedAnnouncements.author_id)
                            .name}
                    </b>
                  </Typography>
                </h6>
                <Typography variant="body2" color="textSecondary">
                  Waktu Dibuat:{" "}
                  {moment(selectedAnnouncements.createdAt)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider className={classes.dividerColor} />
              </Grid>
              {user.role === "Teacher" &&
              retrieved_users.size &&
              selectedAnnouncements.author_id &&
              retrieved_users.get(selectedAnnouncements.author_id).role ===
                "Teacher" ? (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Kelas yang Diberikan:
                  </Typography>
                  <Typography>
                    {!selectedAnnouncements.class_assigned ||
                    !all_classes_map.size
                      ? null
                      : selectedAnnouncements.class_assigned.map((kelas, i) => {
                          if (all_classes_map.get(kelas)) {
                            if (
                              i ===
                              selectedAnnouncements.class_assigned.length - 1
                            )
                              return `${all_classes_map.get(kelas).name}`;
                            return `${all_classes_map.get(kelas).name}, `;
                          }
                          return null;
                        })}
                  </Typography>
                </Grid>
              ) : null}

              <Grid item xs={12} style={{ marginTop: "15px" }}>
                <Typography color="textSecondary" gutterBottom>
                  Deskripsi Pengumuman:
                </Typography>
                <Typography variant="body1">
                  {selectedAnnouncements.description}
                </Typography>
              </Grid>
              {!fileLampiran.length === 0 ? null : (
                <Grid item xs={12} style={{ marginTop: "15px" }}>
                  <Typography color="textSecondary" gutterBottom>
                    Lampiran Berkas:
                  </Typography>
                  <Grid item container spacing={1}>
                    {fileLampiran.map((lampiran) => (
                      <LampiranFile
                        file_id={lampiran._id}
                        onPreviewFile={viewFileAnnouncement}
                        onDownloadFile={downloadFileAnnouncements}
                        filename={lampiran.filename}
                        filetype={fileType(lampiran.filename)}
                      />
                    ))}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        {user.role === "Admin" ||
        user._id === selectedAnnouncements.author_id ? ( // kalau studentnya ketua kelas yang buat pengumumannya
          <Grid item container justify="flex-end" alignItems="center">
            <Grid item>
              {/* <div className={classes.teacherButtonContainer}> */}
              <Link to={`/sunting-pengumuman/${announcement_id}`}>
                <LightTooltip title="Sunting Pengumuman" placement="bottom">
                  <Fab className={classes.editAnnouncementButton}>
                    <EditIcon />
                  </Fab>
                </LightTooltip>
              </Link>
            </Grid>
            <Grid item>
              <LightTooltip title="Hapus Pengumuman" placement="bottom">
                <Fab
                  className={classes.deleteAnnouncementButton}
                  onClick={(e) => handleOpenDeleteDialog(e, announcement_id)}
                >
                  <DeleteIcon />
                </Fab>
              </LightTooltip>
            </Grid>
          </Grid>
        ) : // {/* </div> */}
        null}
      </Grid>
    </div>
  );
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
  getAllClass: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  announcements: state.announcementsCollection,
});

export default connect(mapStateToProps, {
  getOneAnnouncement,
  getUsers,
  deleteAnnouncement,
  previewLampiranAnnouncement,
  downloadLampiranAnnouncement,
  getSelectedClasses,
  getAllClass,
  getFileAnnouncements,
  viewFileAnnouncement,
  downloadFileAnnouncements,
})(ViewAnnouncement);
