import React from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getSelectedClasses, getAllClass } from "../../../actions/ClassActions";
import { getUsers } from "../../../actions/UserActions";
import { getFileAnnouncements, downloadFileAnnouncements, viewFileAnnouncement } from "../../../actions/files/FileAnnouncementActions";
import { getOneAnnouncement, deleteAnnouncement } from "../../../actions/AnnouncementActions";
import { downloadLampiranAnnouncement, previewLampiranAnnouncement } from "../../../actions/UploadActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import CustomLinkify from "../../misc/linkify/Linkify";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  Hidden,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tooltip,
  Typography
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  Edit as EditIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import {
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  announcementPaper: {
    padding: "20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px",
    },
  },
  announcementDivider: {
    margin: "22.5px 0px",
    backgroundColor: theme.palette.primary.light,
  },
  editButton: {
    width: "110px",
    textTransform: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  deleteButton: {
    width: "110px",
    textTransform: "none",
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.fade,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
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

const path = require("path");

function LampiranFile(props) {
  const classes = useStyles();
  const { file_id, filename, filetype, onDownloadFile, onPreviewFile } = props;

  let displayedName = "";
  filename.length >= 26
    ? (displayedName = `${filename.slice(0, 25)}..${path.extname(filename)}`)
    : (displayedName = filename);

  return (
    <Paper variant="outlined">
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
              <Typography variant="subtitle2" noWrap>{displayedName}</Typography>
            </LightTooltip>
          }
          secondary={filetype}
        />
      </ListItem>
    </Paper>
  );
}

function ViewAnnouncement(props) {
  const classes = useStyles();
  const history = useHistory();
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
  const { selectedAnnouncements } = props.announcements;
  const { all_classes_map } = props.classesCollection;
  const { user, retrieved_users } = props.auth;
  const announcement_id = props.match.params.id;

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [fileLampiran, setFileLampiran] = React.useState([]);

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
  }, [selectedAnnouncements._id]); // Because only receive one announcement.

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

  const onDownloadFile = (id, fileCategory = "none") => {
    if (fileCategory === "lampiran_announcement");
  };
  const onPreviewFile = (id, fileCategory = "none") => {
    if (fileCategory === "lampiran_announcement");
  };

  const onDeleteAnnouncement = (announcement_id) => {
    deleteAnnouncement(announcement_id, history).then((res) => {
    });
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  document.title = !selectedAnnouncements.title
    ? "Schooly | Lihat Pengumuman"
    : `Schooly | ${selectedAnnouncements.title}`;

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Paper className={classes.announcementPaper}>
            <Typography variant="h4" style={{ marginBottom: "5px" }}>
              {selectedAnnouncements.title}
            </Typography>
            <Typography color="primary" paragraph>
              Pengumuman
            </Typography>
            {/*Ini mau bikin logicnya ngapit typographynya kalau ada <typography> Oleh: user.name</typo> : null */}
            <Typography variant="body2" color="textSecondary">
              Oleh: {!retrieved_users.size || !selectedAnnouncements.author_id || !retrieved_users.get(selectedAnnouncements.author_id)
                ? ""
                : retrieved_users.get(selectedAnnouncements.author_id).name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Waktu Dibuat: {moment(selectedAnnouncements.createdAt)
                .locale("id")
                .format("DD MMM YYYY, HH:mm")}
            </Typography>
            <Divider className={classes.announcementDivider} />
            <Grid container spacing={4}>
              {retrieved_users.get(selectedAnnouncements.author_id) ? user.role === "Teacher" &&
                retrieved_users.size &&
                selectedAnnouncements.author_id &&
                retrieved_users.get(selectedAnnouncements.author_id).role === "Teacher" ? (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Diberikan kepada:
                  </Typography>
                  <Typography>
                    {!selectedAnnouncements.class_assigned ||
                    !all_classes_map.size
                      ? null
                      : selectedAnnouncements.class_assigned.map((kelas, i) => {
                          if (all_classes_map.get(kelas)) {
                            if (i === selectedAnnouncements.class_assigned.length - 1)
                              return `${all_classes_map.get(kelas).name}`;
                            return `${all_classes_map.get(kelas).name}, `;
                          }
                          return null;
                        })}
                  </Typography>
                </Grid>
              ) : null : null}
              <Grid item>
                <Typography color="textSecondary" gutterBottom>
                  Deskripsi Pengumuman:
                </Typography>
                <Typography
                  align="justify"
                  style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                  <CustomLinkify text={selectedAnnouncements.description} />
                </Typography>
              </Grid>
              {!fileLampiran.length === 0 ? null : (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Lampiran Berkas:
                  </Typography>
                  <Grid container spacing={1}>
                    {fileLampiran.map((lampiran) => (
                      <Grid item xs={12} sm={6}>
                        <LampiranFile
                          file_id={lampiran._id}
                          onPreviewFile={viewFileAnnouncement}
                          onDownloadFile={downloadFileAnnouncements}
                          filename={lampiran.filename}
                          filetype={fileType(lampiran.filename)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        {user.role === "Admin" || user._id === selectedAnnouncements.author_id ? (
          <Grid item container justify="flex-end" alignItems="center" spacing={1}>
            <Grid item>
              <Link to={`/sunting-pengumuman/${announcement_id}`}>
                <Hidden xsDown>
                  <Button
                    variant="outlined"
                    className={classes.editButton}
                    startIcon={<EditIcon style={{ color: "grey" }} />}
                  >
                    <Typography>
                      Sunting
                    </Typography>
                  </Button>
                </Hidden>
                <Hidden smUp>
                  <Tooltip title="Sunting">
                    <Button
                      variant="outlined"
                      className={classes.editButton}
                    >
                      <EditIcon />
                    </Button>
                  </Tooltip>
                </Hidden>
              </Link>
            </Grid>
            <Grid item>
              <Hidden xsDown>
                <Button
                  variant="outlined"
                  className={classes.deleteButton}
                  startIcon={<DeleteIcon style={{ color: "grey" }} />}
                  onClick={(e) => handleOpenDeleteDialog(e, announcement_id)}
                >
                  <Typography>
                    Hapus
                  </Typography>
                </Button>
              </Hidden>
              <Hidden smUp>
                <Tooltip title="Hapus">
                  <Button
                    variant="outlined"
                    className={classes.deleteButton}
                    onClick={(e) => handleOpenDeleteDialog(e, announcement_id)}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              </Hidden>
            </Grid>
          </Grid>
        ) : null}
      </Grid>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Pengumuman"
        itemName={selectedAnnouncements.title}
        deleteItem={() => {
          onDeleteAnnouncement(announcement_id);
        }}
      />
    </div>
  );
}

ViewAnnouncement.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  getSelectedClasses: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  getOneAnnouncement: PropTypes.func.isRequired,
  announcements: PropTypes.object.isRequired,
  deleteAnnouncement: PropTypes.func.isRequired,
  downloadLampiranAnnouncement: PropTypes.func.isRequired,
  previewLampiranAnnouncement: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  announcements: state.announcementsCollection,
});

export default connect(mapStateToProps, {
  getAllClass,
  getSelectedClasses,
  getUsers,
  getOneAnnouncement,
  deleteAnnouncement,
  getFileAnnouncements,
  viewFileAnnouncement,
  downloadFileAnnouncements,
  previewLampiranAnnouncement,
  downloadLampiranAnnouncement,
})(ViewAnnouncement);
