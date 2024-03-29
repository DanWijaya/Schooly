import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTeachers } from "../../../actions/UserActions";
import { createClass, getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import { clearErrors } from "../../../actions/ErrorActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import FloatingHelp from "../../misc/floating-help/FloatingHelp";
import {
  AppBar,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { withStyles } from "@material-ui/core/styles";
import {
  AssignmentInd as AssignmentIndIcon,
  LibraryBooks as LibraryBooksIcon,
} from "@material-ui/icons";
import { FaChalkboard } from "react-icons/fa";
import DeleteDialog from "../../misc/dialog/DeleteDialog";

const styles = (theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "85%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  background: {
    backgroundColor: "#F9F9F9",
    minHeight: "100%",
  },
  menuBar: {
    zIndex: theme.zIndex.drawer + 1,
    padding: "15px 20px",
    boxShadow: "0 1px 6px 0px rgba(32,33,36,0.28)",
    backgroundColor: "white",
    color: "black",
  },
  createButton: {
    width: "90px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "75px",
    },
  },
  deleteButton: {
    width: "90px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.main,
      color: "white",
      boxShadow:
        "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "75px",
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
  contentDetails: {
    padding: "20px 20px 25px 20px",
  },
  label: {
    display: "flex",
    alignItems: "center",
  },
  labelIcon: {
    width: "1rem",
    height: "1rem",
    marginRight: "10px",
    color: "grey",
  },
});

class CreateClass extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      nihil: true,
      walikelas: {},
      ukuran: 0,
      openUploadDialog: false,
      openDeleteDialog: false,
      teacherOptions: null,
      errors: {},
      mata_pelajaran: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.success && !prevProps.success) {
      this.handleOpenUploadDialog();
    }

    if (prevState.teacherOptions === null) {
      let all_classes = this.props.classesCollection.all_classes;
      let all_teachers = this.props.auth.all_teachers;
      if (
        all_classes &&
        Array.isArray(all_classes) &&
        all_classes.length !== 0 &&
        all_teachers &&
        Array.isArray(all_teachers) &&
        all_teachers.length !== 0
      ) {
        let all_walikelas = new Set(all_classes.map((cls) => cls.walikelas));
        let teacherOptions = all_teachers.filter(
          (teacher) => !all_walikelas.has(teacher._id)
        );

        this.setState({ teacherOptions });
      }
    }
  }

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true });
  };

  handleCloseUploadDialog = () => {
    this.setState({ openUploadDialog: false });
  };

  handleOpenDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  onChange = (e, otherfield = null) => {
    // This otherfield is for field controllers like Select or its variants.
    // Becasue Select doesn't have e.target.id value, that's why it needs to be checked first.

    let field = otherfield ? otherfield : e.target.id;

    if (this.state.errors[field]) {
      this.setState({ errors: { ...this.state.errors, [field]: null } });
    }

    if (field === "mata_pelajaran") {
      this.setState({ [field]: e });
    } else {
      this.setState({ [field]: e.target.value });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { user } = this.props.auth;
    const classObject = {
      name: this.state.name,
      nihil: this.state.nihil,
      walikelas: this.state.walikelas,
      ukuran: 1, // Temporary so it won't be error
      ketua_kelas: this.state.ketua_kelas,
      sekretaris: this.state.sekretaris,
      bendahara: this.state.bendahara,
      unit: user.unit,
      mata_pelajaran: this.state.mata_pelajaran.map((matpel) => matpel._id),
    };

    this.props
      .createClass(classObject, this.props.history)
      .then((res) => this.handleOpenUploadDialog())
      .catch((err) => {
        this.setState({ errors: err });
      });
  };

  onSelect = (selectedList, selectedItem) => {
    if (selectedList.length > 1) selectedList.shift();
    this.setState({ walikelas: selectedList[0] });
  };

  onRemove = (selectedList, selectedItem) => {
    this.setState({ class_assigned: selectedList[0] });
  };

  componentDidMount() {
    const { user } = this.props.auth;
    this.props.getTeachers(user.unit);
    this.props.getAllSubjects(user.unit);
    this.props.getAllClass(user.unit);

    const { handleNavbar, handleSideDrawer, handleFooter } = this.props;
    handleNavbar(false);
    handleSideDrawer(false);
    handleFooter(false);
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.clearSuccess();

    const { handleNavbar, handleSideDrawer, handleFooter } = this.props;
    handleNavbar(true);
    handleSideDrawer(true);
    handleFooter(true);
  }

  render() {
    const { classes, success } = this.props;
    const { errors } = this.state;

    document.title = "Schooly | Buat Kelas";

    return (
      <div className={classes.background}>
        <div className={classes.root}>
          <form noValidate onSubmit={this.onSubmit} style={{ width: "100%" }}>
            <AppBar position="fixed" className={classes.menuBar}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item xs>
                  <Typography variant="h6" color="textSecondary">
                    Kelas
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <Button type="submit" className={classes.createButton}>
                        Buat
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        className={classes.deleteButton}
                        onClick={this.handleOpenDeleteDialog}
                      >
                        Hapus
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AppBar>
            <div className={classes.content}>
              <div className={classes.toolbar} />
              <Paper>
                <div className={classes.contentDetails}>
                  <Typography variant="h5" gutterBottom>
                    Buat Kelas
                  </Typography>
                  <Typography color="textSecondary">
                    Setelah semua murid dimasukkan ke dalam kelas, jangan lupa
                    untuk menyunting kelas dan menentukan ketua kelas,
                    sekretaris, dan bendahara dari kelas yang baru dibuat.
                  </Typography>
                </div>
                <Divider />
                <div className={classes.contentDetails}>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Typography color="primary" className={classes.label}>
                        <FaChalkboard className={classes.labelIcon} />
                        Nama Kelas
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        id="name"
                        type="text"
                        onChange={this.onChange}
                        value={this.state.name}
                        error={errors.name}
                        helperText={errors.name}
                      />
                    </Grid>
                    <Grid item>
                      <Typography color="primary" className={classes.label}>
                        <AssignmentIndIcon className={classes.labelIcon} />
                        Wali Kelas
                      </Typography>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        color="primary"
                        id="walikelas"
                        error={Boolean(errors.walikelas)}
                      >
                        <Select
                          value={this.state.walikelas}
                          onChange={(event) => {
                            this.onChange(event, "walikelas");
                          }}
                        >
                          {this.state.teacherOptions !== null
                            ? this.state.teacherOptions.map((teacherInfo) => (
                                <MenuItem
                                  key={teacherInfo._id}
                                  value={teacherInfo._id}
                                >
                                  {teacherInfo.name}
                                </MenuItem>
                              ))
                            : null}
                        </Select>
                        {Boolean(errors.walikelas) ? (
                          <FormHelperText error>
                            {errors.walikelas}
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <Typography color="primary" className={classes.label}>
                        <LibraryBooksIcon className={classes.labelIcon} />
                        Mata Pelajaran
                      </Typography>
                      <FormControl fullWidth color="primary" id="matapelajaran">
                        <Autocomplete
                          multiple
                          filterSelectedOptions
                          getOptionLabel={(option) => option.name}
                          options={
                            this.props.subjectsCollection
                              ? this.props.subjectsCollection.all_subjects
                              : null
                          }
                          onChange={(event, value) => {
                            this.onChange(value, "mata_pelajaran");
                          }}
                          renderInput={(params) => (
                            <TextField
                              variant="outlined"
                              error={errors.mata_pelajaran}
                              helperText={errors.mata_pelajaran}
                              {...params}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </div>
              </Paper>
            </div>
          </form>
          <UploadDialog
            openUploadDialog={this.state.openUploadDialog}
            success={success}
            messageUploading="Kelas sedang dibuat"
            messageSuccess="Kelas telah dibuat"
            redirectLink={`/kelas/${success}`}
          />
          <DeleteDialog
            openDeleteDialog={this.state.openDeleteDialog}
            handleCloseDeleteDialog={this.handleCloseDeleteDialog}
            itemType="Kelas"
            redirectLink="/daftar-kelas"
          />
        </div>
        <FloatingHelp />
      </div>
    );
  }
}

CreateClass.propTypes = {
  createClass: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  success: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  success: state.success,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  createClass,
  getAllClass,
  getTeachers,
  getAllSubjects,
  clearSuccess,
  clearErrors,
})(withStyles(styles)(CreateClass));
