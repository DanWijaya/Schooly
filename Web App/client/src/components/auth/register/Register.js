import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Multiselect } from "multiselect-react-dropdown";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { registerUser } from "../../../actions/AuthActions";
import { viewClass } from "../../../actions/ClassActions";
import schoolyLogoAlt from "../../../images/SchoolyLogoAlt.png";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField"
import RegisterStepIcon from "./RegisterStepIcon";
import RegisterStepConnector from "./RegisterStepConnector";
import { Button, FormControl, Grid, MenuItem, Paper, Select, Typography, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper"
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

const styles = (theme) => ({
  root: {
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "750px",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px"
  },
  inputField: {
    width: "300px",
  },
  mainGrid: {
    width: "400px",
    padding: "40px",
  },
  schoolyLogoAlt: {
    width: "30%",
    height: "30%",
    marginBottom: "30px",
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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
      kelas: "", //Student Data
      subject_teached: "", //Teacher Data
      activeStep: 0,
      submitButtonClicked: false,
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    this.props.viewClass()
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
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
    if(otherfield == "kelas")
      this.setState({kelas: e.target.value});
    else if(otherfield == "role")
      this.setState({ role: e.target.value})
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
    } else if (role === "Teacher") {
      newUser.subject_teached = this.state.subject_teached;
    }

    if(this.state.activeStep === 1)
        this.setState({submitButtonClicked: true})

    console.log(newUser)
    if(this.state.submitButtonClicked)
      this.props.registerUser(newUser, this.props.history);
  };

  render() {

    document.title="Daftar ke Schooly"
    const { classes, classesCollection } = this.props;
    const { errors } = this.state;

    var options = []

    if(Object.keys(classesCollection).length !== 0){
      options = classesCollection
    }

    const getSteps = () => {
      return ["Kredensial Masuk", "Informasi Pribadi"];
    }

    const getStepContent = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return (
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
          return (
            <Grid
              container
              direction="column"
              spacing={3}
              alignItems="center"
            >
              <Grid item className={classes.inputField}>
                <FormControl id="role" variant="outlined" color="primary" style={{width: "100%"}}>
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
                  <FormControl id="kelas" variant="outlined" color="primary" style={{width: "100%"}}>
                    <label id="kelas">Kelas</label>
                    <Select
                    value={this.state.kelas._id}
                    onChange={(event) => {this.onChange(event, "kelas")}}
                  >
                    {options.map((kelas) => (
                      <MenuItem value={kelas._id}>{kelas.name}</MenuItem>
                    ))}
                  </Select>

                </FormControl>
                </Grid>
              :
              this.state.role === "Teacher" ?
                <Grid item className={classes.inputField}>
                  <OutlinedTextField
                    on_change={this.onChange}
                    value={this.state.subject_teached}
                    error={errors.subject_teached}
                    id="subject_teached"
                    type="text"
                    className={classnames("", {
                      invalid: errors.subject_teached
                    })}
                    html_for="subject_teached"
                    labelname="Mata Pelajaran"
                    span_classname={classes.errorInfo}
                    error1={errors.subject_teached}
                  />
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
        default:
          return "Unknown stepIndex";
      }
    }

    const steps = getSteps();

    const handleNext = () => {
      if(this.state.activeStep !== 1 || this.state.errors === null)
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

    return (
      <div className={classes.root}>
        <img src={schoolyLogoAlt} className={classes.schoolyLogoAlt} alt="schooly logo alt"/>
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
                  <div style={{display: "flex", justifyContent: "space-between", marginTop: "30px"}}>
                    {this.state.activeStep === 0 ?
                      null
                      :
                      <Button
                        variant="contained"
                        onClick={handleBack}
                        style={{
                          backgroundColor: "#DCDCDC",
                          color: "black",
                          width: "90px",
                        }}
                      >
                        Kembali
                      </Button>
                    }
                    {this.state.activeStep === steps.length - 1 ?
                      <Grid container justify="flex-end">
                        <Button
                          type="submit"
                          variant="contained"
                          size="medium"
                          style={{
                            backgroundColor: "#61bd4f",
                            color: "white",
                            width: "90px",
                          }}
                        >
                          Daftar
                        </Button>
                      </Grid>
                      :
                      <Grid container justify="flex-end">
                        <Button
                          variant="contained"
                          type="button"
                          onClick={handleNext}
                          style={{
                            backgroundColor: "#2196f3",
                            color: "white",
                          }}
                        >
                          Lanjut
                        </Button>
                      </Grid>
                    }
                  </div>
              </form>
            </Grid>
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
  viewClass: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  classesCollection: state.classesCollection
});

export default withRouter(
  connect(mapStateToProps, { registerUser, viewClass })
  (withStyles(styles)(Register))
  )
