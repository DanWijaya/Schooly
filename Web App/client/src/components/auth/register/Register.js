import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import DateFnsUtils from "@date-io/date-fns";
import lokal from "date-fns/locale/id";
import { clearErrors } from "../../../actions/ErrorActions";
import { registerUser } from "../../../actions/UserActions";
// import { getAllClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import authBackground from "../AuthBackground.png";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import PolicyContent from "../../layout/policy/PolicyContent";
import RegisterStepIcon from "./RegisterStepIcon";
import RegisterStepConnector from "./RegisterStepConnector";
import {
  Button,
  Dialog,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MuiAlert from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";
import UploadDialog from "../../misc/dialog/UploadDialog";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
        maxWidth: "100%",
    },
    minHeight: "500px",
    padding: "10px",
    backgroundImage: `url(${authBackground})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    [theme.breakpoints.up("sm")]: {
      backgroundSize: "contain",
    },
  },
  schoolyLogo: {
    width: "250px",
    height: "125px",
    marginBottom: "25px",
  },
  registerPaper: {
    margin: "auto",
    maxWidth: "350px",
    padding: "40px",
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  backButton: {
    backgroundColor: "#DCDCDC",
    color: "black",
    width: "90px",
    "&:focus, &:hover": {
      backgroundColor: "#DCDCDC",
      color: "black",
    },
  },
  continueButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    width: "90px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  registerButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    width: "90px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  closeDialogButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    width: "90px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
});

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      role: "",
      email: "",
      address: "",
      phone: "",
      emergency_phone: "",
      password: "",
      password2: "",
      errors: {},
      // kelas: "", // Student Data
      subject_teached: "", // Teacher Data
      tanggal_lahir: new Date(),
      activeStep: 0,
      snackbarOpen: false,
      dialogOpen: false,
      submitButtonClicked: false,
      openUploadDialog: false
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    // this.props.getAllClass();
    window.scrollTo(0, 0);
    this.props.getAllSubjects();
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/beranda");
    }
    this.props.handleNavbar(false);
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.handleNavbar(true);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors === false) {
      this.setState({
        errors: nextProps.errors
      });
      return;
    } 

    if (Object.keys(nextProps.errors).length > 0) {
      console.log(this.state.snackbarOpen);
      this.setState({
        errors: nextProps.errors,
        snackbarOpen: true,
      });
    }
  }

  handleDateChange = (date) => {
    this.setState({ tanggal_lahir: date });
  };

  onChange = (e, otherfield) => {
    // if (otherfield === "kelas") {
    //   console.log(e.target.value);
    //   this.setState({ kelas: e.target.value });
    // } else if (otherfield === "role") {
    if (otherfield === "role") {
      this.setState({ role: e.target.value });
    } else if (otherfield === "subject") {
      this.setState({ subject_teached: e.target.value });
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    var newUser = {
      name: this.state.name,
      role: this.state.role,
      email: this.state.email,
      phone: this.state.phone,
      emergency_phone: this.state.emergency_phone,
      address: this.state.address,
      password: this.state.password,
      password2: this.state.password2,
      tanggal_lahir: this.state.tanggal_lahir,
    };

    const role = this.state.role;

    // if (role === "Student") {
    //   newUser.kelas = this.state.kelas;
    // } else if (role === "Teacher") {
    if (role === "Teacher") {
      newUser.subject_teached = this.state.subject_teached;
    }

    if (this.state.activeStep === 2) {
      this.setState({ submitButtonClicked: true });
    }

    console.log(newUser);
    if (this.state.submitButtonClicked) {
      // this.props.registerUser(newUser, this.props.history);
      this.props.registerUser(newUser);
      this.handleOpenUploadDialog();
    }
  };

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true });
  };

  render() {
    const { classes } = this.props;
    // const { all_classes } = this.props.classesCollection;
    const { all_subjects } = this.props.subjectsCollection;
    const { errors } = this.state;

    const getSteps = () => {
      return ["Kredensial Masuk", "Informasi Pribadi", "Konfirmasi Registrasi"];
    };
    const getStepContent = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return (
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="email"
                  label="Email"
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  type="email"
                  helperText={errors.email}
                  className={classnames("", {
                    invalid: errors.email,
                  })}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="password"
                  label="Kata Sandi"
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  type="password"
                  helperText={errors.password}
                  className={classnames("", {
                    invalid: errors.password,
                  })}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="password2"
                  label="Konfirmasi Kata Sandi"
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  type="password"
                  helperText={errors.password2}
                  className={classnames("", {
                    invalid: errors.password2,
                  })}
                />
              </Grid>
            </Grid>
          );
        case 1:
          return (
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <FormControl
                  id="role"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  error={Boolean(errors.role)}
                >
                  <InputLabel id="role-label">Daftar Sebagai</InputLabel>
                  <Select
                    labelId="role-label"
                    label="Daftar Sebagai"
                    value={this.state.role}
                    onChange={(event) => {
                      this.onChange(event, "role");
                    }}
                  >
                    <MenuItem value="Student">Murid</MenuItem>
                    <MenuItem value="Teacher">Guru</MenuItem>
                    <MenuItem value="Admin">Pengelola</MenuItem>
                  </Select>
                  <FormHelperText>
                    {Boolean(errors.role) ? errors.role : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="name"
                  label="Nama"
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
              {/* {
              // this.state.role === "Student" ? (
              //   <Grid item>
              //     <FormControl
              //       id="kelas"
              //       variant="outlined"
              //       color="primary"
              //       fullWidth
              //       error={Boolean(errors.kelas)}
              //     >
              //       <InputLabel id="kelas-label">Kelas</InputLabel>
              //       <Select
              //         labelId="kelas-label"
              //         label="Kelas"
              //         value={this.state.kelas}
              //         onChange={(event) => {
              //           this.onChange(event, "kelas");
              //         }}
              //       >
              //         {all_classes.map((kelas) => (
              //           <MenuItem value={kelas._id}>{kelas.name}</MenuItem>
              //         ))}
              //       </Select>
              //       <FormHelperText>
              //         {Boolean(errors.kelas) ? errors.kelas : null}
              //       </FormHelperText>
              //     </FormControl>
              //   </Grid>
              // ) : 
              this.state.role === "Teacher" ? (
                <Grid item>
                  <FormControl
                    id="subject"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    error={Boolean(errors.subject_teached)}
                  >
                    <InputLabel id="subject-label">Mata Pelajaran</InputLabel>
                    <Select
                      labelId="subject-label"
                      label="Mata Pelajaran"
                      value={this.state.subject_teached}
                      onChange={(event) => {
                        this.onChange(event, "subject");
                      }}
                    >
                      {all_subjects.map((subject) => (
                        <MenuItem value={subject._id}>{subject.name}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {Boolean(errors.subject_teached)
                        ? errors.subject_teached
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              ) : null} */}
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="phone"
                  label="Nomor Telepon"
                  onChange={this.onChange}
                  value={this.state.phone}
                  error={errors.phone}
                  type="tel"
                  helperText={errors.phone}
                  className={classnames("", {
                    invalid: errors.phone,
                  })}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="emergency_phone"
                  label="Nomor Telepon Darurat"
                  onChange={this.onChange}
                  value={this.state.emergency_phone}
                  error={errors.emergency_phone}
                  type="tel"
                  helperText={errors.emergency_phone}
                  className={classnames("", {
                    invalid: errors.emergency_phone,
                  })}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="address"
                  label="Alamat"
                  onChange={this.onChange}
                  value={this.state.address}
                  error={errors.address}
                  type="text"
                  helperText={errors.address}
                  className={classnames("", {
                    invalid: errors.address,
                  })}
                />
              </Grid>
              <Grid item>
                <MuiPickersUtilsProvider locale={lokal} utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    fullWidth
                    disableFuture
                    label="Tanggal Lahir"
                    inputVariant="outlined"
                    maxDateMessage="Batas waktu harus waktu yang akan datang"
                    invalidDateMessage="Format tanggal tidak benar"
                    format="dd/MMMM/yyyy"
                    okLabel="Simpan"
                    cancelLabel="Batal"
                    id="tanggal_lahir"
                    value={this.state.tanggal_lahir}
                    onChange={(date) => this.handleDateChange(date)}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
          );
        case 2:
          return (
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <Typography align="center">
                  Setelah registrasi selesai, silahkan hubungi pengelola sekolah
                  Anda untuk mengaktifkan akun Anda.
                </Typography>
                <Dialog
                  fullWidth
                  maxWidth="lg"
                  open={this.state.dialogOpen}
                  onClose={handleToggleDialog}
                >
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    style={{ padding: "15px" }}
                  >
                    <Grid item>
                      <PolicyContent />
                    </Grid>
                    <Grid item style={{ marginTop: "50px" }}>
                      <Button
                        size="large"
                        className={classes.closeDialogButton}
                        onClick={handleToggleDialog}
                      >
                        Tutup
                      </Button>
                    </Grid>
                  </Grid>
                </Dialog>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                  style={{ marginTop: "20px" }}
                >
                  Dengan mendaftar, Anda telah membaca dan menyetujui{" "}
                  <Link
                    onClick={handleToggleDialog}
                    style={{ cursor: "pointer" }}
                  >
                    Kebijakan Penggunaan Schooly
                  </Link>
                  .
                </Typography>
              </Grid>
            </Grid>
          );
        default:
          return "Unknown stepIndex";
      }
    };
    const steps = getSteps();
    const handleNext = () => {
      if (this.state.activeStep !== 2 || this.state.errors === null)
        this.setState((prevState) => ({
          activeStep: prevState.activeStep + 1,
          submitButtonClicked: false,
        }));
    };
    const handleBack = () => {
      if (this.state.snackbarOpen) {
        this.setState({ snackbarOpen: false });
      }
      this.setState((prevState) => ({
        activeStep: prevState.activeStep - 1,
      }));
    };

    // Policy Dialog
    const handleToggleDialog = () => {
      this.setState((prevState) => ({ dialogOpen: !prevState.dialogOpen }));
    };

    // Error Snackbar
    const handleCloseSnackbar = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      this.setState({ snackbarOpen: false });
    };

    document.title = "Daftar ke Schooly";
    document.body.style =
      "background: linear-gradient(#6A8CF6, #FFFFFF); background-repeat: no-repeat";

    return (
      <div className={classes.root}>
        <UploadDialog
          openUploadDialog={this.state.openUploadDialog}
          success={!errors}
          messageUploading="Akun baru sedang dibuat"
          messageSuccess="Akun baru telah terdaftar"
          redirectLink="/masuk"
        />
        <Link to="/">
          <img
            alt="Schooly Introduction"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </Link>
        <Paper elevation={11} className={classes.registerPaper}>
          <Grid container direction="column" spacing={5}>
            <Grid item>
              <Typography variant="h6" align="center">
                <b>Daftar ke Schooly</b>
              </Typography>
            </Grid>
            <Stepper
              alternativeLabel
              activeStep={this.state.activeStep}
              connector={<RegisterStepConnector />}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={RegisterStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <Grid item>
              <form
                noValidate
                onSubmit={this.onSubmit}
                style={{ width: "100%" }}
              >
                {getStepContent(this.state.activeStep)}
                <Grid
                  container
                  justify="space-between"
                  style={{ marginTop: "40px" }}
                >
                  <Grid item>
                    {this.state.activeStep === 0 ? null : (
                      <Button
                        variant="contained"
                        onClick={handleBack}
                        className={classes.backButton}
                      >
                        Kembali
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    {this.state.activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        className={classes.registerButton}
                      >
                        Daftar
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        className={classes.continueButton}
                      >
                        Lanjut
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Divider />
            <Grid item>
              <Typography align="center">
                <Link to="/masuk" style={{ marginTop: "20px" }}>
                  Sudah ada Akun?
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Snackbar
          open={this.state.snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleCloseSnackbar}
            severity="error"
          >
            Terdapat kesalahan dalam pengisian!
          </MuiAlert>
        </Snackbar>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  // getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  subjectsCollection: state.subjectsCollection,
  // classesCollection: state.classesCollection,
});

export default withRouter(
  connect(mapStateToProps, {
    registerUser,
    // getAllClass,
    getAllSubjects,
    clearErrors,
  })(withStyles(styles)(Register))
);
