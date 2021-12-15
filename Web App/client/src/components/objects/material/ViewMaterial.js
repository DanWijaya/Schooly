import React from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import CustomLinkify from "../../misc/linkify/Linkify";
import {
  getFileMaterials,
  downloadFileMaterial,
  viewFileMaterial,
} from "../../../actions/files/FileMaterialActions";
import { getSelectedClasses, getAllClass } from "../../../actions/ClassActions";
import { getTeachers, getStudents } from "../../../actions/UserActions";
import {
  getOneMaterial,
  deleteMaterial,
  createMaterialComment,
  editMaterialComment,
  deleteMaterialComment,
} from "../../../actions/MaterialActions";
import { getMultipleFileAvatar } from "../../../actions/files/FileAvatarActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import FileAttachment from "../file/FileAttachment";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import {
  Button,
  Divider,
  Grid,
  Hidden,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Comment from "../comment/Comment";

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
  materialPaper: {
    padding: "20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px",
    },
  },
  materialDivider: {
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
  commentPaper: {
    padding: "20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px",
    },
  },
  commentActionButton: {
    width: "18px",
    height: "18px",
    "&:focus, &:hover": {
      backgroundColor: "#F1F1F1",
    },
  },
  commentActionIcon: {
    fontSize: "18px",
  },
  commentLittleIcon: {
    color: theme.palette.text.disabled,
    opacity: 0.5,
    "&:focus, &:hover": {
      opacity: 1,
      cursor: "pointer",
    },
  },
  cancelButton: {
    width: "100px",
    color: theme.palette.text.secondary,
  },
  saveButton: {
    width: "100px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));

function ViewMaterial(props) {
  const classes = useStyles();
  const history = useHistory();
  const {
    getAllSubjects,
    viewFileMaterial,
    deleteMaterial,
    getOneMaterial,
    getAllClass,
    getFileMaterials,
    getTeachers,
    getStudents,
    clearErrors,
    clearSuccess,
    getMultipleFileAvatar,
  } = props;
  const { user, all_students, all_teachers } = props.auth;
  const { all_classes_map } = props.classesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedMaterials } = props.materialsCollection;
  const materi_id = props.match.params.id;

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [fileLampiran, setFileLampiran] = React.useState([]);
  const materialAuthorName = React.useRef(null);

  React.useEffect(() => {
    getAllSubjects(user.unit, "map"); // this will get the selectedMaterials.
    getOneMaterial(materi_id);
    getAllClass(user.unit, "map");
    // COba S3
    getFileMaterials(materi_id).then((result) => {
      setFileLampiran(result);
    });
    // bakal ngedapat collection of S3 files di

    getStudents(user.unit);
    getTeachers(user.unit);
    clearErrors();
    clearSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    return () => {
      clearErrors();
      clearSuccess();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteMaterial = (id) => {
    deleteMaterial(id, history).then((res) => {});
  };

  // Delete Dialog
  const handleOpenDeleteDialog = (fileid, filename) => {
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  document.title = `Schooly | ${selectedMaterials.name}`;

  const commentMethod = {
    createComment: createMaterialComment,
    editComment: editMaterialComment,
    deleteComment: deleteMaterialComment,
  };

  const dataMethod = {
    getData: getOneMaterial,
    deleteData: deleteMaterial,
  };

  return (
    <div className={classes.root}>
      <Grid container wrap="nowrap" direction="column" spacing={3}>
        <Grid item>
          <Paper className={classes.materialPaper}>
            <Typography variant="h4" style={{ marginBottom: "5px" }}>
              {selectedMaterials.name}
            </Typography>
            <Typography color="primary" paragraph>
              Materi {all_subjects_map.get(selectedMaterials.subject)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Oleh: {materialAuthorName.current}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Waktu Dibuat:{" "}
              {moment(selectedMaterials.createdAt)
                .locale("id")
                .format("DD MMM YYYY, HH.mm")}
            </Typography>
            <Divider className={classes.materialDivider} />
            <Grid container spacing={4}>
              {user.role === "Teacher" ? (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Diberikan kepada:
                  </Typography>
                  <Typography>
                    {!selectedMaterials.class_assigned || !all_classes_map.size
                      ? null
                      : selectedMaterials.class_assigned.map((kelas, i) => {
                          if (all_classes_map.get(kelas)) {
                            if (
                              i ===
                              selectedMaterials.class_assigned.length - 1
                            )
                              return `${all_classes_map.get(kelas).name}`;
                            return `${all_classes_map.get(kelas).name}, `;
                          }
                          return null;
                        })}
                  </Typography>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                  Deskripsi Materi:
                </Typography>
                <Typography
                  align="justify"
                  style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                  <CustomLinkify text={selectedMaterials.description} />
                </Typography>
              </Grid>
              {fileLampiran.length === 0 ? null : (
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Lampiran:
                  </Typography>
                  <Grid container spacing={1}>
                    <FileAttachment
                      data={fileLampiran}
                      onPreviewFile={viewFileMaterial}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        {user.role === "Teacher" ? (
          <Grid
            item
            container
            justify="flex-end"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <Link to={`/sunting-materi/${materi_id}`}>
                <Hidden xsDown>
                  <Button
                    variant="outlined"
                    className={classes.editButton}
                    startIcon={<EditIcon style={{ color: "grey" }} />}
                  >
                    <Typography>Sunting</Typography>
                  </Button>
                </Hidden>
                <Hidden smUp>
                  <Tooltip title="Sunting">
                    <Button variant="outlined" className={classes.editButton}>
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
                  onClick={(e) => handleOpenDeleteDialog(e, materi_id)}
                >
                  <Typography>Hapus</Typography>
                </Button>
              </Hidden>
              <Hidden smUp>
                <Tooltip title="Hapus">
                  <Button
                    variant="outlined"
                    className={classes.deleteButton}
                    onClick={(e) => handleOpenDeleteDialog(e, materi_id)}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              </Hidden>
            </Grid>
          </Grid>
        ) : null}
        <Grid item>
          <Comment
            data={selectedMaterials}
            commentMethod={commentMethod}
            dataMethod={dataMethod}
          />
        </Grid>
      </Grid>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Materi"
        itemName={selectedMaterials.name}
        warningText="Lampiran dan komentar yang ada juga akan dihapus."
        deleteItem={() => onDeleteMaterial(materi_id)}
      />
    </div>
  );
}

ViewMaterial.propTypes = {
  auth: PropTypes.object.isRequired,
  materialsCollection: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  materialsFiles: PropTypes.object.isRequired,
  deleteMaterial: PropTypes.func.isRequired,
  // getOneUser: PropTypes.func.isRequired, // For the person in charge task
  getOneMaterial: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getSelectedClasses: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getFileMaterials: PropTypes.func.isRequired,
  viewFileMaterial: PropTypes.func.isRequired,
  downloadFileMaterial: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  materialsCollection: state.materialsCollection,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  materialsFiles: state.materialsFiles,
});

export default connect(mapStateToProps, {
  getAllSubjects,
  getOneMaterial,
  deleteMaterial,
  // getOneUser,
  getAllClass,
  getSelectedClasses,
  getFileMaterials,
  viewFileMaterial,
  downloadFileMaterial,
  getTeachers,
  getStudents,
  clearErrors,
  clearSuccess,
  getMultipleFileAvatar,
})(ViewMaterial);
