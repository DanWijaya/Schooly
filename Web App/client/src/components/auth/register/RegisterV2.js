import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { registerUser } from "../../../actions/UserActions";
import { viewClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions"
import schoolyLogo from "../../../images/SchoolyLogo.png";
import authBackground from "../AuthBackground.png";
import PolicyContent from "../../layout/policy/PolicyContent";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField"
import RegisterStepIcon from "./RegisterStepIcon";
import RegisterStepConnector from "./RegisterStepConnector";
import { Button, Dialog, Divider, FormControl, FormHelperText, Grid, Hidden, Link,
   MenuItem, Paper, Select, Snackbar, Stepper, Step, StepLabel, TextField, Typography } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/Error";

const styles = (theme) => ({
  rootMobile: {
    margin: "auto",
    maxWidth: "1000px",
    height: "500px",
    padding: "10px",
    backgroundImage: `url(${authBackground})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  rootDesktop: {
    margin: "auto",
    maxWidth: "1000px",
    minHeight: "500px",
    padding: "10px",
    backgroundImage: `url(${authBackground})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  mainPaper: {
    margin: "auto",
    maxWidth: "350px",
    padding: "40px",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px",
  },
  inputField: {
    width: "300px",
  },
  schoolyLogo: {
    width: "30%",
    height: "30%",
    marginBottom: "30px",
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
    backgroundColor: "#61BD4F",
    color: "white",
    width: "90px",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
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

class RegsiterV2 extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      role: "",
      email: "",
      address: "",
      phone:"",
      emergency_phone:"",
      password: "",
      password2: "",
      errors: {},
      kelas: "", // Student Data
      subject_teached: "", // Teacher Data
      activeStep: 0,
      snackbarOpen: false,
      dialogOpen: false,
      submitButtonClicked: false,
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    this.props.viewClass()
    this.props.getAllSubjects()
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/beranda");
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(Object.keys(nextProps.errors).length > 0) {
      console.log(this.state.snackbarOpen)
      this.setState({
        errors: nextProps.errors,
        snackbarOpen: true
      });
    }
  }

  onChange = (e, otherfield) => {
    if(otherfield === "kelas")
      this.setState({kelas: e.target.value});
    else if(otherfield === "role")
      this.setState({ role: e.target.value})
    else if(otherfield === "subject")
      this.setState({ subject_teached: e.target.value})
    else
      this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
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
    };

    const role = this.state.role;

    if(role === "Student") {
      newUser.kelas = this.state.kelas;
    }
    else if (role === "Teacher") {
      newUser.subject_teached = this.state.subject_teached;
    }

    if(this.state.activeStep === 2)
      this.setState({submitButtonClicked: true})

    console.log(newUser)
    if(this.state.submitButtonClicked)
      this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { classes, classesCollection, subjectsCollection } = this.props;
    const { errors } = this.state;

    var classesOptions = []
    var subjectOptions = []

    if(Object.keys(classesCollection).length !== 0) {
      classesOptions = classesCollection.all_classes
    }

    if(Object.keys(subjectsCollection).length !== 0) {
      subjectOptions = subjectsCollection.all_subjects
    }

    console.log(subjectOptions)
    const getSteps = () => {
      return ["Kredensial Masuk", "Informasi Pribadi", "Konfirmasi Registrasi"];
    }

    const getStepContent = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return(
            <Grid container direction="column" spacing={4} alignItems="stretch">
              <Grid item>
                <label for="email">Email</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="email"
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  type="email"
                  helperText={
                    <div style={{display: "flex", alignItems: "center"}}>
                      {errors.email ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                      <Typography variant="h8" style={{marginLeft: "4px"}}>
                        {errors.email}
                      </Typography>
                    </div>
                  }
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
              </Grid>
              <Grid item>
                <label for="password">Kata Sandi</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="password"
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  type="password"
                  helperText={
                    <div style={{display: "flex", alignItems: "center"}}>
                      {errors.password ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                      <Typography variant="h8" style={{marginLeft: "4px"}}>
                        {errors.password}
                      </Typography>
                    </div>
                  }
                  className={classnames("", {
                    invalid: errors.password
                  })}
                />
              </Grid>
              <Grid item>
                <label for="password2">Konfirmasi Kata Sandi</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="password2"
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  type="password"
                  helperText={
                    <div style={{display: "flex", alignItems: "center"}}>
                      {errors.password2 ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                      <Typography variant="h8" style={{marginLeft: "4px"}}>
                        {errors.password2}
                      </Typography>
                    </div>
                  }
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
              </Grid>
            </Grid>
          );
        case 1:
          return(
            <Grid container direction="column" spacing={4} alignItems="stretch">
              <Grid item>
                <FormControl id="role" variant="outlined" color="primary" fullWidth error={Boolean(errors.role)}>
                  <label id="role">Daftar Sebagai</label>
                  <Select
                    value={this.state.role}
                    onChange={(event) => {this.onChange(event, "role")}}
                  >
                    <MenuItem value={"Student"}>Murid</MenuItem>
                    <MenuItem value={"Teacher"}>Guru</MenuItem>
                    <MenuItem value={"Admin"}>Pengelola</MenuItem>
                  </Select>
                  <FormHelperText style={{display: "flex", alignItems: "center"}}>
                    {Boolean(errors.role) ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                    {Boolean(errors.role) ? <Typography variant="h8" style={{marginLeft: "4px"}}>{errors.role}</Typography> : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <label for="name">Konfirmasi Kata Sandi</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="name"
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  type="text"
                  helperText={
                    <div style={{display: "flex", alignItems: "center"}}>
                      {errors.name ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                      <Typography variant="h8" style={{marginLeft: "4px"}}>
                        {errors.name}
                      </Typography>
                    </div>
                  }
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
              </Grid>
              {this.state.role === "Student" ?
                <Grid item className={classes.inputField}>
                  <FormControl id="kelas" variant="outlined" color="primary" fullWidth error={Boolean(errors.kelas)}>
                    <label id="kelas">Kelas</label>
                    <Select
                      value={this.state.kelas._id}
                      onChange={(event) => {this.onChange(event, "kelas")}}
                    >
                      {classesOptions.map((kelas) => (
                        <MenuItem value={kelas._id}>{kelas.name}</MenuItem>
                      ))}
                  </Select>
                  <FormHelperText style={{display:"flex", alignItems:"center"}}>
                    {Boolean(errors.kelas) ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                    {Boolean(errors.kelas) ? <Typography variant="h8" style={{marginLeft: "4px"}}>{errors.kelas}</Typography> : null}
                  </FormHelperText>
                </FormControl>
                </Grid>
              : this.state.role === "Teacher" ?
                <Grid item className={classes.inputField}>
                  <FormControl id="subject" variant="outlined" color="primary" fullWidth error={Boolean(errors.subject_teached)}>
                    <label id="subject">Mata Pelajaran</label>
                    <Select
                      value={this.state.subject_teached}
                      onChange={(event) => {this.onChange(event, "subject")}}
                    >
                      {subjectOptions.map((subject) => (
                        <MenuItem value={subject.name}>{subject.name}</MenuItem>
                      ))}
                  </Select>
                  <FormHelperText style={{display:"flex", alignItems:"center"}}>
                    {Boolean(errors.subject_teached) ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                    {Boolean(errors.subject_teached) ? <Typography variant="h8" style={{marginLeft: "4px"}}>{errors.subject_teached}</Typography> : null}
                  </FormHelperText>
                </FormControl>
                </Grid>
              :
                null
              }
              <Grid item>
                <label for="phone">Nomor Telepon</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="phone"
                  onChange={this.onChange}
                  value={this.state.phone}
                  error={errors.phone}
                  type="tel"
                  helperText={
                    <div style={{display: "flex", alignItems: "center"}}>
                      {errors.phone ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                      <Typography variant="h8" style={{marginLeft: "4px"}}>
                        {errors.phone}
                      </Typography>
                    </div>
                  }
                  className={classnames("", {
                    invalid: errors.phone
                  })}
                />
              </Grid>
              <Grid item>
                <label for="emergency_phone">Nomor Telepon Darurat</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="emergency_phone"
                  onChange={this.onChange}
                  value={this.state.emergency_phone}
                  error={errors.emergency_phone}
                  type="tel"
                  helperText={
                    <div style={{display: "flex", alignItems: "center"}}>
                      {errors.emergency_phone ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                      <Typography variant="h8" style={{marginLeft: "4px"}}>
                        {errors.emergency_phone}
                      </Typography>
                    </div>
                  }
                  className={classnames("", {
                    invalid: errors.emergency_phone
                  })}
                />
              </Grid>
              <Grid item>
                <label for="address">Nomor Telepon Darurat</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="address"
                  onChange={this.onChange}
                  value={this.state.address}
                  error={errors.address}
                  type="text"
                  helperText={
                    <div style={{display: "flex", alignItems: "center"}}>
                      {errors.address ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                      <Typography variant="h8" style={{marginLeft: "4px"}}>
                        {errors.address}
                      </Typography>
                    </div>
                  }
                  className={classnames("", {
                    invalid: errors.address
                  })}
                />
              </Grid>
            </Grid>
          );
        case 2:
          return(
            <Grid container direction="column" spacing={4} alignItems="stretch">
              <Grid item>
                <Typography align="center">
                  Dengan mendaftar, berarti anda dan sekolah anda telah membaca dan
                  menyetujui <Link onClick={handleToggleDialog} style={{cursor: "pointer"}}>
                  Kebijakan Penggunaan Schooly</Link>.
                </Typography>
                <Dialog
                  fullWidth
                  maxWidth="lg"
                  open={this.state.dialogOpen}
                  onClose={handleToggleDialog}
                >
                  <Grid container direction="column" alignItems="center" style={{padding: "15px"}}>
                    <Grid item>
                      <PolicyContent />
                    </Grid>
                    <Grid item style={{marginTop: "50px"}}>
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
                <Typography variant="body2" color="textSecondary" align="center" style={{marginTop: "20px"}}>
                  Jangan lupa untuk melengkapi profil anda pada halaman profil yang dapat diakses pada
                  menekan foto profil pada bagian kanan atas aplikasi.
                </Typography>
              </Grid>
            </Grid>
          );
        default:
          return "Unknown stepIndex";
      }
    }

    const steps = getSteps();

    const handleNext = () => {
      if(this.state.activeStep !== 2 || this.state.errors === null)
        this.setState(prevState => ({
          activeStep: prevState.activeStep + 1,
          submitButtonClicked: false
        })
      )
    };

    const handleBack = () => {
      this.setState(prevState => ({
        activeStep: prevState.activeStep - 1,
        })
      )
    }

    // Policy Dialog
     const handleToggleDialog = () => {
      this.setState(prevState => ({dialogOpen: !prevState.dialogOpen }))
    };


    // Error Snackbar
    const handleCloseSnackbar = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      this.setState({snackbarOpen: false});
    };

    document.title = "Daftar ke Schooly";
    document.body.style = "background: linear-gradient(#6A8CF6, #FFFFFF); background-repeat: no-repeat";

    return(
      <div>
        <Hidden smUp implementation="css">
          <div className={classes.rootMobile}>
            <Paper className={classes.mainPaper}>
              <Grid container direction="column" spacing={5}>
                <Grid item>
                  <Typography variant="h6" align="center">
                    <b>Daftar ke Schooly</b>
                  </Typography>
                </Grid>
                <Stepper alternativeLabel activeStep={this.state.activeStep} connector={<RegisterStepConnector />}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={RegisterStepIcon}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Grid item>
                  <form noValidate onSubmit={this.onSubmit} style={{width: "100%"}}>
                    {getStepContent(this.state.activeStep)}
                    <Grid container justify="space-between" style={{marginTop: "40px"}}>
                      <Grid item>
                        {this.state.activeStep === 0 ?
                          null
                          :
                            <Button
                              onClick={handleBack}
                              className={classes.backButton}
                            >
                              Kembali
                            </Button>
                        }
                      </Grid>
                      <Grid item>
                        {this.state.activeStep === steps.length - 1 ?
                            <Button
                              type="submit"
                              className={classes.registerButton}
                            >
                              Daftar
                            </Button>
                          :
                            <Button
                              onClick={handleNext}
                              className={classes.continueButton}
                            >
                              Lanjut
                            </Button>
                        }
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
                <Divider />
                <Grid item>
                  <Link href="/masuk" style={{marginTop: "20px"}}>
                    <Typography align="center">
                      Sudah ada Akun?
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Paper>
            <Snackbar
              open={this.state.snackbarOpen}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{vertical : "bottom", horizontal: "center"}}
            >
              <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="error">
                Terdapat kesalahan dalam pengisian!
              </MuiAlert>
            </Snackbar>
          </div>
        </Hidden>
        <Hidden xsDown implementation="css">
          <div className={classes.rootDesktop}>
            <Paper className={classes.mainPaper}>
              <Grid container direction="column" spacing={5}>
                <Grid item>
                  <Typography variant="h6" align="center">
                    <b>Daftar ke Schooly</b>
                  </Typography>
                </Grid>
                <Stepper alternativeLabel activeStep={this.state.activeStep} connector={<RegisterStepConnector />}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={RegisterStepIcon}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Grid item>
                  <form noValidate onSubmit={this.onSubmit} style={{width: "100%"}}>
                    {getStepContent(this.state.activeStep)}
                    <Grid container justify="space-between" style={{marginTop: "40px"}}>
                      <Grid item>
                        {this.state.activeStep === 0 ?
                          null
                          :
                            <Button
                              onClick={handleBack}
                              className={classes.backButton}
                            >
                              Kembali
                            </Button>
                        }
                      </Grid>
                      <Grid item>
                        {this.state.activeStep === steps.length - 1 ?
                            <Button
                              type="submit"
                              className={classes.registerButton}
                            >
                              Daftar
                            </Button>
                          :
                            <Button
                              onClick={handleNext}
                              className={classes.continueButton}
                            >
                              Lanjut
                            </Button>
                        }
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
                <Divider />
                <Grid item>
                  <Link href="/masuk" style={{marginTop: "20px"}}>
                    <Typography align="center">
                      Sudah ada Akun?
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Paper>
            <Snackbar
              open={this.state.snackbarOpen}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{vertical : "bottom", horizontal: "center"}}
            >
              <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="error">
                Terdapat kesalahan dalam pengisian!
              </MuiAlert>
            </Snackbar>
          </div>
        </Hidden>
      </div>
    );
  }
}

RegsiterV2.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  viewClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
});

export default withRouter(
  connect(mapStateToProps, { registerUser, viewClass , getAllSubjects})
  (withStyles(styles)(RegsiterV2))
)