import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { getTeachers } from "../../../actions/UserActions";
import { createClass, getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import { clearErrors } from "../../../actions/ErrorActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import {
  AppBar,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { withStyles } from "@material-ui/core/styles";
import {
  AssignmentInd as AssignmentIndIcon,
  LibraryBooks as LibraryBooksIcon
} from "@material-ui/icons";
import { FaChalkboard } from "react-icons/fa";

const styles = (theme) => ({
  root: {
    display: "flex",
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  menuBar: {
    zIndex: theme.zIndex.drawer + 1,
    padding: "15px 20px",
    boxShadow: "0 1px 6px 0px rgba(32,33,36,0.28)",
    backgroundColor: "white",
    color: "black",
  },
  cancelButton: {
    width: "90px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.main,
      color: "white",
      boxShadow: "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  createClassButton: {
    width: "90px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
      boxShadow: "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
  labelIcon: {
    fontSize: "14px",
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
      openUploadDialog: null,
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

    const { handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    handleNavbar(false);
    handleSideDrawerExist(false);
    handleFooter(false);
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.clearSuccess();

    const { handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    handleNavbar(true);
    handleSideDrawerExist(true);
    handleFooter(true);
  }

  render() {
    const { classes, success } = this.props;
    const { all_teachers, user } = this.props.auth;
    const { errors } = this.state;

    document.title = "Schooly | Buat Kelas";

    return (
      <div className={classes.root}>
        <form noValidate onSubmit={this.onSubmit} style={{ width: "100%" }}>
          <AppBar position="fixed" className={classes.menuBar}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs>
                <Typography variant="h5" color="textSecondary">
                  Kelas
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Link to="/daftar-kelas">
                      <Button className={classes.cancelButton}>
                        Batal
                      </Button>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Button type="submit" className={classes.createClassButton}>
                      Buat
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AppBar>
          <div className={classes.content}>
            <div className={classes.toolbar} />
            <Typography variant="h5">
              Buat Kelas
            </Typography>
            <Typography color="textSecondary" style={{ marginBottom: "35px" }}>
              Setelah semua murid dimasukkan ke dalam kelas, jangan lupa untuk menyunting kelas dan
              menentukan ketua kelas, sekretaris, dan bendahara dari kelas yang baru dibuat.
            </Typography>
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <div style={{ display: "flex", alignItems: "center"}}>
                  <FaChalkboard className={classes.labelIcon} />
                  <Typography for="name" color="primary">
                    Nama Kelas
                  </Typography>
                </div>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="name"
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  type="text"
                  helperText={errors.name}
                  className={classnames("", {
                    invalid: errors.name,
                  })}
                />
              </Grid>
              <Grid item>
                <div style={{ display: "flex", alignItems: "center"}}>
                  <AssignmentIndIcon className={classes.labelIcon} />
                  <Typography for="walikelas" color="primary">
                    Wali Kelas
                  </Typography>
                </div>
                <FormControl
                  fullWidth
                  id="walikelas"
                  variant="outlined"
                  color="primary"
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
                <div style={{ display: "flex", alignItems: "center"}}>
                  <LibraryBooksIcon className={classes.labelIcon} />
                  <Typography for="matapelajaran" color="primary">
                    Mata Pelajaran
                  </Typography>
                </div>
                <FormControl fullWidth id="matapelajaran" color="primary">
                  <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={
                      this.props.subjectsCollection
                        ? this.props.subjectsCollection.all_subjects
                        : null
                    }
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    size="small"
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
        </form>
        <UploadDialog
          openUploadDialog={this.state.openUploadDialog}
          success={success}
          messageUploading="Kelas sedang dibuat"
          messageSuccess="Kelas telah dibuat"
          redirectLink={`/kelas/${success}`}
        />
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
