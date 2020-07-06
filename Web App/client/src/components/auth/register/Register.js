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
import { Button, Dialog, FormControl, Grid, Link, MenuItem, Paper, Select, Stepper, Step, StepLabel, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "1000px",
    padding: "10px",
    backgroundImage: `url(${authBackground})`,
    backgroundPosition: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px",
  },
  inputField: {
    width: "300px",
  },
  mainGrid: {
    width: "400px",
    padding: "40px",
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

class Register extends Component {
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
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
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

  // Policy Dialog
  handleToggleDialog = () => {
    this.setState(prevState => ({dialogOpen: !prevState.dialogOpen }))
  };

  render() {
    const { classes, classesCollection, subjectsCollection } = this.props;
    const { errors } = this.state;

    var classesOptions = []
    var subjectOptions = []

    if(Object.keys(classesCollection).length !== 0){
      classesOptions = classesCollection.all_classes
    }

    if(Object.keys(subjectsCollection).length !== 0){
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
            <Grid
              container
              direction="column"
              spacing={3}
              alignItems="center"
            >
              <Grid item className={classes.inputField}>
                <OutlinedTextField
                  on_change={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                  html_for="email"
                  labelname="Email"
                  span_classname={classes.errorInfo}
                  error1={errors.email}
                />
              </Grid>
              <Grid item className={classes.inputField}>
                <OutlinedTextField
                  on_change={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password
                  })}
                  html_for="password"
                  labelname="Kata Sandi"
                  span_classname={classes.errorInfo}
                  error1={errors.password}
                />
              </Grid>
              <Grid item className={classes.inputField}>
                <OutlinedTextField
                  on_change={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                  html_for="password2"
                  labelname="Konfirmasi Kata Sandi"
                  span_classname={classes.errorInfo}
                  error1={errors.password2}
                />
              </Grid>
            </Grid>
          );
        case 1:
          return(
            <Grid
              container
              direction="column"
              spacing={3}
              alignItems="center"
            >
              <Grid item className={classes.inputField}>
                <FormControl id="role" variant="outlined" color="primary" fullWidth>
                  <label id="role">Daftar Sebagai</label>
                  <Select
                    value={this.state.role}
                    onChange={(event) => {this.onChange(event, "role")}}
                  >
                    <MenuItem value={"Student"}>Murid</MenuItem>
                    <MenuItem value={"Teacher"}>Guru</MenuItem>
                    <MenuItem value={"Admin"}>Pengelola</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item className={classes.inputField}>
                <OutlinedTextField
                  on_change={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  classname={classnames("", {
                    invalid: errors.name
                  })}
                  html_for="name"
                  labelname="Nama"
                  span_classname={classes.errorInfo}
                  error1={errors.name}
                />
              </Grid>
              {this.state.role === "Student" ?
                <Grid item className={classes.inputField}>
                  <FormControl id="kelas" variant="outlined" color="primary" fullWidth>
                    <label id="kelas">Kelas</label>
                    <Select
                    value={this.state.kelas._id}
                    onChange={(event) => {this.onChange(event, "kelas")}}
                    >
                      {classesOptions.map((kelas) => (
                        <MenuItem value={kelas._id}>{kelas.name}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
                </Grid>
              :
              this.state.role === "Teacher" ?
                <Grid item className={classes.inputField}>
                  <FormControl id="subject" variant="outlined" color="primary" fullWidth>
                    <label id="subject">Mata Pelajaran</label>
                    <Select
                    value={this.state.subject_teached}
                    onChange={(event) => {this.onChange(event, "subject")}}
                    >
                      {subjectOptions.map((subject) => (
                        <MenuItem value={subject.name}>{subject.name}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
                </Grid>
              : null
              }
              <Grid item className={classes.inputField}>
                <OutlinedTextField
                  on_change={this.onChange}
                  value={this.state.phone}
                  id="phone"
                  type="text"
                  className={classnames("", {
                    invalid: errors.phone
                  })}
                  html_for="phone"
                  labelname="Nomor Telepon"
                  span_classname={classes.errorInfo}
                  error1={errors.phone}
                />
              </Grid>
              <Grid item className={classes.inputField}>
                <OutlinedTextField
                  on_change={this.onChange}
                  value={this.state.emergency_phone}
                  error={errors.emergency_phone}
                  id="emergency_phone"
                  type="text"
                  className={classnames("", {
                    invalid: errors.emergency_phone
                  })}
                  html_for="emergency_phone"
                  labelname="Nomor Telepon Darurat"
                  span_classname={classes.errorInfo}
                  error1={errors.emergency_phone}
                />
              </Grid>
              <Grid item className={classes.inputField}>
                <OutlinedTextField
                  on_change={this.onChange}
                  value={this.state.address}
                  error={errors.address}
                  id="address"
                  type="text"
                  className={classnames("", {
                    invalid: errors.address
                  })}
                  html_for="address"
                  labelname="Alamat"
                  span_classname={classes.errorInfo}
                  error1={errors.address}
                />
              </Grid>
            </Grid>
          );
        case 2:
          return(
            <Grid
              container
              direction="column"
              spacing={3}
              alignItems="center"
            >
              <Grid item className={classes.inputField}>
                <Typography align="center">
                  Dengan mendaftar, berarti anda dan sekolah anda telah membaca dan
                  menyetujui <Link onClick={this.handleToggleDialog} style={{cursor: "pointer"}}>
                  Kebijakan Penggunaan Schooly</Link>.
                </Typography>
                <Dialog
                  fullWidth
                  maxWidth="lg"
                  open={this.state.dialogOpen}
                  onClose={this.handleToggleDialog}
                >
                  <Grid container direction="column" alignItems="center" style={{padding: "15px"}}>
                    <Grid item>
                      <PolicyContent />
                    </Grid>
                    <Grid item style={{marginTop: "50px"}}>
                      <Button
                        size="large"
                        className={classes.closeDialogButton}
                        onClick={this.handleToggleDialog}
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

    document.title = "Daftar ke Schooly";
    document.body.style = "background: linear-gradient(#6A8CF6, #FFFFFF); background-repeat: no-repeat";

    return(
      <div className={classes.root}>
        <img src={schoolyLogo} className={classes.schoolyLogo} alt="schooly logo alt"/>
        <Paper>
          <Grid
            container
            direction="column"
            alignItems="center"
            spacing={4}
            className={classes.mainGrid}
          >
            <Grid item>
              <Typography variant="h6">
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
              <form noValidate onSubmit={this.onSubmit}>
                {getStepContent(this.state.activeStep)}
                <div style={{display: "flex", justifyContent: "space-between", width: "100%", marginTop: "40px"}}>
                  <div style={{display: "flex", justifyContent: "flex-start"}}>
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
                  </div>
                  <div style={{display: "flex", justifyContent: "flex-end"}}>
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
                  </div>
                </div>
              </form>
            </Grid>
            <Link href="/masuk" style={{marginTop: "20px"}}>
              Sudah ada Akun?
            </Link>
          </Grid>
        </Paper>
      </div>
    );
  }
}

Register.propTypes = {
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
  (withStyles(styles)(Register))
)
