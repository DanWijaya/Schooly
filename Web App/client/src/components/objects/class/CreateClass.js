import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import { createClass, getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getTeachers } from "../../../actions/UserActions";
import {
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
import UploadDialog from "../../misc/dialog/UploadDialog";
import { withStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";

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
  createClassButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
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

  onSubmit = (e) => {
    e.preventDefault();
    const { user } = this.props.auth;
    const classObject = {
      name: this.state.name,
      nihil: this.state.nihil,
      walikelas: this.state.walikelas,
      ukuran: 1, // Temporary biar tidak error
      ketua_kelas: this.state.ketua_kelas,
      sekretaris: this.state.sekretaris,
      bendahara: this.state.bendahara,
      errors: {},
      unit: user.unit,
      mata_pelajaran: this.state.mata_pelajaran.map((matpel) => matpel._id),
    };
    console.log(user);
    
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
    this.props.getTeachers();
    this.props.getAllSubjects(this.props.auth.user.unit);
    this.props.getAllClass();
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.clearSuccess();
  }

  render() {
    const { classes, success } = this.props;
    const { errors } = this.state;
    const { all_teachers, user } = this.props.auth;

    // console.log(errors);
    // console.log(all_teachers);
    document.title = "Schooly | Buat Kelas";
    console.log(user);
    if (user.role === "Teacher" || user.role === "Admin") {
      return (
        <div className={classes.root}>
          <UploadDialog
            openUploadDialog={this.state.openUploadDialog}
            success={success}
            messageUploading="Kelas sedang dibuat"
            messageSuccess="Kelas telah dibuat"
            redirectLink={`/kelas/${success}`}
          />
          <Paper>
            <div className={classes.content}>
              <Typography variant="h5" gutterBottom>
                <b>Buat Kelas</b>
              </Typography>
              <Typography color="textSecondary">
                Setelah semua murid masuk, jangan lupa untuk menyunting kelas
                dan menentukan ketua kelas, sekretaris, dan bendahara kelas.
              </Typography>
            </div>
            <Divider />
            <form noValidate onSubmit={this.onSubmit}>
              <Grid
                container
                direction="column"
                spacing={4}
                className={classes.content}
              >
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
                  <Typography component="label" for="walikelas" color="primary">
                    Wali Kelas
                  </Typography>
                  <FormControl
                    id="walikelas"
                    variant="outlined"
                    color="primary"
                    fullWidth
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
                    <FormHelperText error>
                      {Boolean(errors.walikelas) ? errors.walikelas : null}
                    </FormHelperText>
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
                  <FormControl id="matapelajaran" color="primary" fullWidth>
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
                      // size="small"
                      onChange={(event, value) => {
                        this.onChange(value, "mata_pelajaran");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          size="small"
                          // fullWidth
                          style={{ border: "none" }}
                          error={errors.mata_pelajaran}
                          helperText={errors.mata_pelajaran}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item >
                  <Typography component="label" for="ukuran" color="primary">
                    Jumlah Murid
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="ukuran"
                    onChange={this.onChange}
                    value={2}
                    error={errors.ukuran}
                    type="number"
                    helperText={errors.ukuran}
                    className={classnames("", {
                      invalid: errors.ukuran
                    })}
                  />
                </Grid> */}
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
                    className={classes.createClassButton}
                  >
                    Buat Kelas
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

CreateClass.propTypes = {
  createClass: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  getTeachers: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  success: PropTypes.object.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  success: state.success,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
});

export default connect(mapStateToProps, {
  createClass,
  getTeachers,
  getAllSubjects,
  clearErrors,
  clearSuccess,
  getAllClass,
})(withStyles(styles)(CreateClass));
