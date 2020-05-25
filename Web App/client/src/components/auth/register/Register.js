import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Multiselect } from "multiselect-react-dropdown";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { registerUser } from "../../../actions/AuthActions";
import { viewClass } from "../../../actions/ClassActions";
import schoolyLogoAlt from "../../../images/SchoolyLogoAlt.png";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField"
import { Button, FormControl, Grid, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

const styles = (theme) => ({
  root: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "750px",
    margin: "auto",
    flexDirection: "column"
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
  // Edit
  backButton: {
    marginRight: theme.spacing(1),
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
      kelas: {}, //Student Data
      subject_teached: "", //Teacher Data

      activeStep: 0,
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

  onChange = e => {
    if(e.target.id)
      this.setState({ [e.target.id]: e.target.value });
    else
      this.setState({role: e.target.value});
  };


  onSelect = (selectedList, selectedItem) => {
    if(selectedList.length > 1)
      selectedList.shift()
    this.setState({ kelas: selectedList[0]})
    console.log(selectedItem)
  };

  onSubmit = e => {
    e.preventDefault();
    var newUser;
    
    const role = this.state.role;
    if(role == "Student") {
      newUser = {
        name: this.state.name,
        role: this.state.role,
        email: this.state.email,
        phone: this.state.phone,
        emergency_phone: this.state.emergency_phone,
        address: this.state.address,
        password: this.state.password,
        password2: this.state.password2,
        kelas: this.state.kelas, //Student Data
      };
    } else if (role == "Teacher") {
      newUser = {
        name: this.state.name,
        role: this.state.role,
        email: this.state.email,
        phone: this.state.phone,
        emergency_phone: this.state.emergency_phone,
        address: this.state.address,
        password: this.state.password,
        password2: this.state.password2,
        subject_teached: this.state.subject_teached, //Teacher Data
      };
    }
    console.log(e)
      this.props.registerUser(newUser, this.props.history);
  };
  render() {

    const getSteps = () => {
      return ["Pilih peran", "Masukkan informasi", "Masukkan email dan kata sandi"];
    }
    
    const getStepContent = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return (
            <Grid>
              <Grid item className={classes.inputField}>
                <FormControl variant="outlined" color="primary" style={{width: "100%"}}>
                <label>Daftar Sebagai</label>
                <Select
                  value={this.state.role}
                  onChange={this.onChange}
                >
                  <MenuItem value={"Student"}>Murid</MenuItem>
                  <MenuItem value={"Teacher"}>Guru</MenuItem>
                  <MenuItem value={"Admin"}>Pengelola</MenuItem>
                </Select>
                </FormControl>
              </Grid>
            </Grid>
          )
        case 1:
          return (
            <Grid>
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
              <label id="class">Class</label>
              <Multiselect
                id="class"
                options={options}
                onSelect={this.onSelect}
                onRemove={this.onRemove}
                displayValue="name"
                error={errors.class_assigned}
                showCheckBox={true}
                className={classnames("", {
                  invalid: errors.class
                })}
              />
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
          : null}

            <Grid item className={classes.inputField}>
              <OutlinedTextField
                on_change={this.onChange}
                value={this.state.phone}
                error={errors.phone}
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
        )
        case 2:
          return (
          <Grid>
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
        default:
          return "Unknown stepIndex";
      }
    }

    document.title="Daftar ke Schooly"
    const { classes } = this.props;

    const { errors } = this.state;

    console.log(this.state.role)
    const classesCollection = this.props.classesCollection;
    var options = []

    if(Object.keys(classesCollection).length != 0){
      options = classesCollection
    }

    const steps = getSteps();

    const handleNext = () => {
      this.setState(prevState => ({
        activeStep: prevState.activeStep + 1
        })
      )
    };

    const handleBack = () => {
      this.setState(prevState => ({
        activeStep: prevState.activeStep - 1
        })
      )
    }

    const handleReset = () => {
      this.setState({ activeStep : 0 })
    };

  

    return (
      <div className={classes.root}>
        <img src={schoolyLogoAlt} className={classes.schoolyLogoAlt}/>
          <Paper>
            <Grid
              container
              direction="column"
              alignItems="center"
              spacing={5}
              className={classes.mainGrid}
            >

              <Grid item>
                <Typography variant="h6">
                  <b>Daftar ke Schooly</b>
                </Typography>
              </Grid>

              <Stepper activeStep={this.state.activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Grid item>
                <form noValidate onSubmit={this.onSubmit}>
                  <Grid container spacing={3} justify="space-between">
                    {getStepContent(this.state.activeStep)}

            <Grid item >
              <Button
                disabled={this.state.activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Kembali
              </Button>
              </Grid>

                <Grid item >
                {this.state.activeStep === steps.length - 1 ?
                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    style={{
                      backgroundColor: "#2196f3",
                      color: "white",
                      // width: "100%",
                      // marginTop: "20px"
                    }}
                  >
                    Daftar
                  </Button>
                
                : 
                <Button variant="contained" type="button" color="primary" onClick={handleNext}>
                Lanjut
              </Button>
                }
                </Grid>

                  </Grid>
                </form>
              </Grid>

              {/* <Grid item> */}
          
      {/* </Grid> */}
 
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