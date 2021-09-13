import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getTeachers, getStudentsByClass } from "../../../actions/UserActions";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import {
  getAllClass,
  setCurrentClass,
  updateClass,
} from "../../../actions/ClassActions";
import UploadDialog from "../../misc/dialog/UploadDialog";
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  MenuItem,
  Grid,
  Select,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { withStyles } from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiOutlinedInput: {
      input: {},
    },
    MuiInputBase: {
      input: {
        borderBottom: "none",
      },
    },
    MuiAutocomplete: {
      input: {
        borderBottom: "none",
      },
    },
    MuiTextField: {
      root: {
        borderBottom: "none",
      },
    },
  },
});

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    padding: "10px",
  },
  content: {
    padding: "20px",
  },
  divider: {
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "1px",
    },
  },
  editClassButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  underline: {
    padding: 0,
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
    const { id } = this.props.match.params;
    // console.log(id);
    // console.log("Aduh");
    this.props.setCurrentClass(id);
  }

  onChange = (e, otherfield = null) => {
    // otherfield ini adalah yang untuk field controllers Select atau variannya.
    // Karena Select ini tidak memiliki nilai e.target.id, maka awalnya kita lakukan check dulu jika
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
    // if (this.props.success && !prevProps.success) { // (?) kalau pake ini, kadang dialognya bisa kebuka, kadang tidak
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
    console.log("Class props is received");
    const { kelas, all_classes } = nextProps.classesCollection;
    const { all_teachers } = nextProps.auth;

    if (
      Boolean(kelas) &&
      Array.isArray(all_classes) &&
      all_classes.length !== 0 &&
      Array.isArray(all_teachers) &&
      all_teachers.length !== 0
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
      errors: {},
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
    const {
      getTeachers,
      getStudentsByClass,
      getAllClass,
      getAllSubjects,
    } = this.props;
    getTeachers();
    getStudentsByClass(this.props.match.params.id);
    getAllClass();
    getAllSubjects();
  }

  componentWillUnmount() {
    const { clearErrors } = this.props;
    clearErrors();
    clearSuccess();
  }

  render() {
    const { classes, success } = this.props;
    const { user, students_by_class } = this.props.auth;
    // const { all_teachers} = this.props.auth;
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
    console.log(this.state.walikelas);
    if (user.role === "Teacher" || user.role === "Admin") {
      return (
        <div className={classes.root}>
          <UploadDialog
            openUploadDialog={this.state.openUploadDialog}
            success={success}
            messageUploading="Kelas sedang disunting"
            messageSuccess="Kelas telah disunting"
            redirectLink={`/kelas/${success}`}
          />
          <Paper>
            <div className={classes.content}>
              <Typography variant="h5" gutterBottom>
                <b>Sunting Kelas</b>
              </Typography>
            </div>
            <Divider />
            <form noValidate onSubmit={this.onSubmit}>
              <Grid container>
                <Grid item xs={12} md className={classes.content}>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Typography component="label" for="name" color="primary">
                        Nama Kelas
                      </Typography>
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
                      <Typography
                        component="label"
                        for="walikelas"
                        color="primary"
                      >
                        Wali Kelas
                      </Typography>
                      <FormControl
                        id="walikelas"
                        variant="outlined"
                        color="primary"
                        fullWidth
                      >
                        <Select
                          value={walikelas}
                          // displayEmpty
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
                                    <em>{teacherInfo.name}</em>
                                  )}
                                </MenuItem>
                              ))
                            : null}
                          {/* {showValue(teacher_options, "teacher")} */}
                        </Select>
                        <FormHelperText></FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <Typography
                        component="label"
                        for="matapelajaran"
                        color="primary"
                      >
                        Mata Pelajaran
                      </Typography>
                      <FormControl
                        id="matapelajaran"
                        color="primary"
                        fullWidth
                        className={classes.underline}
                      >
                        <Autocomplete
                          multiple
                          id="tags-outlined"
                          options={
                            this.state.allSubjectObject
                              ? this.state.allSubjectObject
                              : []
                          }
                          getOptionLabel={(option) => option.name}
                          filterSelectedOptions
                          classes={{
                            input: classes.underline,
                            inputRoot: classes.underline,
                          }}
                          value={
                            this.state.mata_pelajaran
                              ? this.state.mata_pelajaran
                              : []
                          }
                          onChange={(event, value) => {
                            this.onChange(value, "mata_pelajaran");
                          }}
                          renderInput={(params) => (
                            <TextField
                              variant="outlined"
                              size="small"
                              fullWidth
                              className={classes.underline}
                              classes={{ root: classes.underline }}
                              InputProps={{ className: classes.underline }}
                              error={errors.mata_pelajaran}
                              helperText={errors.mata_pelajaran}
                              {...params}
                            />
                          )}
                        />
                        {/* <FormHelperText>
                        </FormHelperText> */}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider
                  flexItem
                  orientation="vertical"
                  className={classes.divider}
                />
                <Grid item xs={12} md className={classes.content}>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Typography
                        component="label"
                        for="ketua_kelas"
                        color="primary"
                      >
                        Ketua Kelas
                      </Typography>
                      <FormControl
                        id="ketua_kelas"
                        variant="outlined"
                        color="primary"
                        fullWidth
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
                      <Typography
                        component="label"
                        for="sekretaris"
                        color="primary"
                      >
                        Sekretaris
                      </Typography>
                      <FormControl
                        id="sekretaris"
                        variant="outlined"
                        color="primary"
                        fullWidth
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
                      <Typography
                        component="label"
                        for="bendahara"
                        color="primary"
                      >
                        Bendahara
                      </Typography>
                      <FormControl
                        id="bendahara"
                        variant="outlined"
                        color="primary"
                        fullWidth
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
              <Divider />
              <div
                style={{ display: "flex", justifyContent: "flex-end" }}
                className={classes.content}
              >
                <div>
                  <Button
                    variant="contained"
                    type="submit"
                    className={classes.editClassButton}
                  >
                    Sunting Kelas
                  </Button>
                </div>
              </div>
            </form>
          </Paper>
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <Typography variant="h5" align="center">
            <b>Anda tidak mempunyai izin akses halaman ini.</b>
          </Typography>
        </div>
      );
    }
  }
}

EditClass.propTypes = {
  setCurrentClass: PropTypes.func.isRequired,
  updateClass: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  getTeachers: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  getStudentsByClass: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  getAllClass: PropTypes.func.isRequired,
  success: PropTypes.object.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
  success: state.success,
  subjectsCollection: state.subjectsCollection,
});

export default connect(mapStateToProps, {
  setCurrentClass,
  updateClass,
  getStudentsByClass,
  getTeachers,
  getAllSubjects,
  clearErrors,
  getAllClass,
  clearSuccess,
})(withStyles(styles)(EditClass));
