import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Multiselect } from "multiselect-react-dropdown";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Button, FormControl, Grid, MenuItem, Paper, Select,
   Step, StepLabel, Stepper, TextField, Typography } from "@material-ui/core";
import { withStyles, useTheme } from "@material-ui/core/styles";
import { registerUser } from "../../actions/AuthActions";
import { viewClass } from "../../actions/ClassActions";
import schoolySymbolLogo from "../../images/SchoolySymbolLogo.png";
import schoolyLogoAlt from "../../images/SchoolyLogoAlt.png";
import OutlinedTextField from "../misc/text-field/OutlinedTextField"

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
    width: "400px",
  },
  mainGrid: {
    width: "600px",
    padding: "40px",
  },
  schoolyLogoAlt: {
    width: "30%",
    height: "30%",
    marginBottom: "30px",
  },
});


//Stepper
// function getSteps() {
//   return ["Select master blaster campaign settings", "Create an ad group", "Create an ad"];
// }
//
// function getStepContent(stepIndex) {
//   switch (stepIndex) {
//     case 0:
//       return "Select campaign settings...";
//     case 1:
//       return "What is an ad group anyways?";
//     case 2:
//       return "This is the bit I really care about!";
//     default:
//       return "Unknown stepIndex";
//   }
// }

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
      subject_teached: "" //Teacher Data
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

  onSubmit = e => {
    e.preventDefault();
    var newUser
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
    this.props.registerUser(newUser, this.props.history);
  };

  onSelect = (selectedList, selectedItem) => {
    if(selectedList.length > 1)
      selectedList.shift()
    this.setState({ kelas: selectedList[0]})
    console.log(selectedItem)
  }

  render() {
    document.title="Daftar ke Schooly"

    const { classes } = this.props;

    const { errors } = this.state;

    console.log(this.state.role)
    const classesCollection = this.props.classesCollection;
    var options = []
    if(Object.keys(classesCollection).length != 0){
      options = classesCollection
    }

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
                  <b>Daftarkan dirimu di Schooly</b>
                </Typography>
              </Grid>
              <Grid item>
                <form noValidate onSubmit={this.onSubmit}>
                  <Grid container spacing={3} className={classes.inputField}>
                      <Grid item>
                        <FormControl variant="outlined">
                          <label>Daftar Sebagai</label>
                          <Select
                            value={this.state.role}
                            onChange={this.onChange}
                            className={classes.inputField}
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
                      <Grid item className={classes.inputField}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          style={{
                            backgroundColor: "#61bd4f",
                            color: "white",
                            width: "100%",
                            marginTop: "20px"
                          }}
                        >
                          Daftar
                        </Button>
                      </Grid>
                  </Grid>
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
