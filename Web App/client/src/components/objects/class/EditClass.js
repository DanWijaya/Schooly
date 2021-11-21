import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTeachers, getStudentsByClass } from "../../../actions/UserActions";
import { getAllClass, setCurrentClass, updateClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import { clearErrors } from "../../../actions/ErrorActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import {
  AppBar,
  Button,
  Divider,
  FormControl,
  Grid,
  Hidden,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { withStyles } from "@material-ui/core/styles";
import {
  AssignmentInd as AssignmentIndIcon,
  Close as CloseIcon,
  Filter1 as Filter1Icon,
  Filter2 as Filter2Icon,
  Filter3 as Filter3Icon,
  LibraryBooks as LibraryBooksIcon
} from "@material-ui/icons";
import { FaChalkboard } from "react-icons/fa";

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
  editButton: {
    width: "90px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      boxShadow: "0px 1px 2px 0px rgba(194,100,1,0.3), 0px 2px 6px 2px rgba(194,100,1,0.15)",
    },
  },
  closeButton: {
    width: "32px",
    height: "32px",
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
  labelIcon: {
    fontSize: "18px",
    marginRight: "10px",
    color: "grey",
  },
});

class EditClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nihil: true,
      walikelas: null,
      ukuran: 0,
      errors: {},
      classesCollection: [],
      ketua_kelas: null,
      sekretaris: null,
      bendahara: null,
      teacher_options: [],
      openUploadDialog: null,
      mata_pelajaran: null,
      allSubjectObject: null,
    };
  }

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

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.success && !prevProps.success) if this is used, sometime the dialog won't open.
    if (!this.props.errors && this.props.errors !== prevProps.errors) {
      this.handleOpenUploadDialog();
    }

    if (
      prevState.mata_pelajaran === null &&
      Object.keys(this.props.classesCollection.kelas).length !== 0 &&
      this.props.subjectsCollection.all_subjects &&
      this.props.subjectsCollection.all_subjects.length !== 0
    ) {
      let all_subjects_obj = {};
      for (let subject of this.props.subjectsCollection.all_subjects) {
        all_subjects_obj[subject._id] = subject.name;
      }
      this.setState({
        mata_pelajaran: this.props.classesCollection.kelas.subject_assigned.map(
          (subjectId) => {
            return { _id: subjectId, name: all_subjects_obj[subjectId] };
          }
        ),
        allSubjectObject: this.props.subjectsCollection.all_subjects.map(
          (subject) => {
            return { _id: subject._id, name: subject.name };
          }
        ),
      });
    }
  }

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { kelas, all_classes } = nextProps.classesCollection;
    const { all_teachers } = nextProps.auth;

    if (
      Boolean(kelas) &&
      Array.isArray(all_classes) &&
      Array.isArray(all_teachers)
      // all_classes.length !== 0 &&
      // all_teachers.length !== 0
    ) {
      let all_walikelas = new Set(all_classes.map((cls) => cls.walikelas));
      all_walikelas.delete(kelas.walikelas);

      let teacher_options = [{ _id: null, name: "Kosong" }];
      teacher_options = teacher_options.concat(
        all_teachers.filter((teacher) => !all_walikelas.has(teacher._id))
      );

      this.setState({
        name: kelas.name,
        nihil: kelas.nihil,
        walikelas: kelas.walikelas,
        ukuran: kelas.ukuran,
        ketua_kelas: kelas.ketua_kelas,
        sekretaris: kelas.sekretaris,
        bendahara: kelas.bendahara,
        teacher_options: teacher_options,
      });
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const classObject = {
      name: this.state.name,
      nihil: this.state.nihil,
      walikelas: this.state.walikelas,
      ukuran: this.state.ukuran,
      ketua_kelas: this.state.ketua_kelas,
      sekretaris: this.state.sekretaris,
      bendahara: this.state.bendahara,
      mata_pelajaran: this.state.mata_pelajaran.map((matpel) => matpel._id),
    };
    this.props
      .updateClass(classObject, id, this.props.history)
      .then(() => this.handleOpenUploadDialog())
      .catch((err) => {
        this.setState({ errors: err });
      });
  };

  componentDidMount() {
    const { user } = this.props.auth;
    const { id } = this.props.match.params;
    const {
      getTeachers,
      getStudentsByClass,
      getAllClass,
      getAllSubjects,
      setCurrentClass,
    } = this.props;

    // Case when the student opens view class and not assigned to any class yet.
    if (id) {
      setCurrentClass(id);
    }
    getTeachers(user.unit);
    getStudentsByClass(this.props.match.params.id);
    getAllClass(user.unit);
    getAllSubjects(this.props.auth.user.unit);

    const { handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    handleNavbar(false);
    handleSideDrawerExist(false);
    handleFooter(false);
  }

  componentWillUnmount() {
    const { clearErrors } = this.props;
    clearErrors();
    clearSuccess();

    const { handleNavbar, handleSideDrawerExist, handleFooter } = this.props;
    handleNavbar(true);
    handleSideDrawerExist(true);
    handleFooter(true);
  }

  render() {
    const { classes, success } = this.props;
    const { user, students_by_class } = this.props.auth;
    const {
      sekretaris,
      bendahara,
      ketua_kelas,
      walikelas,
      teacher_options,
      errors,
    } = this.state;

    // var teacher_options = all_teachers
    var student_options = students_by_class;

    const returnId = (user, arr) => {
      var i;
      if (arr === "student") {
        for (i = 0; i < student_options.length; i++) {
          if (student_options[i]._id === user._id) {
            return user._id;
          }
        }
      } else {
        for (i = 0; i < teacher_options.length; i++) {
          if (teacher_options[i]._id === user._id) {
            return user._id;
          }
        }
      }
    };

    const showValue = (options, arr) => {
      if (!Array.isArray(options)) return null;

      let menuItems =
        arr === "teacher"
          ? [<MenuItem value={undefined}>Kosong</MenuItem>]
          : [];

      return menuItems.concat(
        options.map((user) => (
          <MenuItem value={returnId(user, arr)}>{user.name}</MenuItem>
        ))
      );
    };

    document.title = "Schooly | Sunting Kelas";

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
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Button type="submit" className={classes.editButton}>
                        Sunting
                      </Button>
                    </Grid>
                    <Grid item>
                      <Link to="/daftar-kelas">
                        <IconButton className={classes.closeButton}>
                          <CloseIcon style={{ fontSize: "24px" }} />
                        </IconButton>
                      </Link>
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
                    Sunting Kelas
                  </Typography>
                  <Typography color="textSecondary">
                    Tentukan ketua kelas, sekretaris, dan bendahara dari kelas ini.
                  </Typography>
                </div>
                <Divider />
                <Grid container>
                  <Grid item xs={12} md className={classes.contentDetails}>
                    <Grid container direction="column" spacing={4}>
                      <Grid item>
                        <div style={{ display: "flex", alignItems: "center"}}>
                          <FaChalkboard className={classes.labelIcon} />
                          <Typography color="primary">
                            Nama Kelas
                          </Typography>
                        </div>
                        <TextField
                          fullWidth
                          variant="outlined"
                          id="name"
                          type="text"
                          onChange={this.onChange}
                          value={this.state.name}
                          error={errors.name}
                          helperText={errors.name}
                        />
                      </Grid>
                      <Grid item>
                        <div style={{ display: "flex", alignItems: "center"}}>
                          <AssignmentIndIcon className={classes.labelIcon} />
                          <Typography color="primary">
                            Wali Kelas
                          </Typography>
                        </div>
                        <FormControl
                          fullWidth
                          id="walikelas"
                          variant="outlined"
                          color="primary"
                        >
                          <Select
                            value={walikelas}
                            onChange={(event) => {
                              this.onChange(event, "walikelas");
                            }}
                          >
                            {this.state.teacher_options !== null
                              ? this.state.teacher_options.map((teacherInfo) => (
                                  <MenuItem
                                    key={teacherInfo._id}
                                    value={teacherInfo._id}
                                  >
                                    {teacherInfo._id !== null ? (
                                      teacherInfo.name
                                    ) : (
                                      <span style={{ color: "grey" }}>{teacherInfo.name}</span>
                                    )}
                                  </MenuItem>
                                ))
                              : null}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <div style={{ display: "flex", alignItems: "center"}}>
                          <LibraryBooksIcon className={classes.labelIcon} />
                          <Typography color="primary">
                            Mata Pelajaran
                          </Typography>
                        </div>
                        <FormControl
                          fullWidth
                          color="primary"
                          id="matapelajaran"
                        >
                          <Autocomplete
                            multiple
                            filterSelectedOptions
                            size="small"
                            getOptionLabel={(option) => option.name}
                            options={
                              this.state.allSubjectObject
                                ? this.state.allSubjectObject
                                : []
                            }
                            onChange={(event, value) => {
                              this.onChange(value, "mata_pelajaran");
                            }}
                            value={
                              this.state.mata_pelajaran
                                ? this.state.mata_pelajaran
                                : []
                            }
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={errors.mata_pelajaran}
                                helperText={errors.mata_pelajaran}
                                {...params}
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hidden smDown>
                    <Grid item>
                      <Divider flexItem orientation="vertical" />
                    </Grid>
                  </Hidden>
                  <Hidden mdUp>
                    <Grid item xs={12}>
                      <Divider flexItem orientation="horizontal" />
                    </Grid>
                  </Hidden>
                  <Grid item xs={12} md className={classes.contentDetails}>
                    <Grid container direction="column" spacing={4}>
                      <Grid item>
                        <div style={{ display: "flex", alignItems: "center"}}>
                          <Filter1Icon className={classes.labelIcon} />
                          <Typography color="primary">
                            Ketua Kelas
                          </Typography>
                        </div>
                        <FormControl
                          fullWidth
                          id="ketua_kelas"
                          variant="outlined"
                          color="primary"
                        >
                          <Select
                            value={ketua_kelas}
                            displayEmpty
                            onChange={(event) => {
                              this.onChange(event, "ketua_kelas");
                            }}
                          >
                            {showValue(student_options, "student")}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <div style={{ display: "flex", alignItems: "center"}}>
                          <Filter2Icon className={classes.labelIcon} />
                          <Typography color="primary">
                            Sekretaris
                          </Typography>
                        </div>
                        <FormControl
                          fullWidth
                          id="sekretaris"
                          variant="outlined"
                          color="primary"
                        >
                          <Select
                            value={sekretaris}
                            displayEmpty
                            onChange={(event) => {
                              this.onChange(event, "sekretaris");
                            }}
                          >
                            {showValue(student_options, "student")}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <div style={{ display: "flex", alignItems: "center"}}>
                          <Filter3Icon className={classes.labelIcon} />
                          <Typography color="primary">
                            Bendahara
                          </Typography>
                        </div>
                        <FormControl
                          fullWidth
                          id="bendahara"
                          variant="outlined"
                          color="primary"
                        >
                          <Select
                            value={bendahara}
                            displayEmpty
                            onChange={(event) => {
                              this.onChange(event, "bendahara");
                            }}
                          >
                            {showValue(student_options, "student")}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </div>
          </form>
          <UploadDialog
            openUploadDialog={this.state.openUploadDialog}
            success={success}
            messageUploading="Kelas sedang disunting"
            messageSuccess="Kelas telah disunting"
            redirectLink={`/kelas/${success}`}
          />
        </div>
      </div>
    );
  }
}

EditClass.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  getAllClass: PropTypes.func.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  updateClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  getStudentsByClass: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  success: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  success: state.success,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getAllClass,
  setCurrentClass,
  updateClass,
  getStudentsByClass,
  getTeachers,
  getAllSubjects,
  clearSuccess,
  clearErrors,
})(withStyles(styles)(EditClass));
