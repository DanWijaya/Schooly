import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Multiselect } from "multiselect-react-dropdown";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Button, Grid, InputLabel, MenuItem, Paper, Select } from "@material-ui/core";
import { withStyles, useTheme } from "@material-ui/core/styles";
import { registerUser } from "../../actions/AuthActions";
import { viewClass } from "../../actions/ClassActions";
import schoolyLogo from "../../images/SchoolyLogo.png";

const styles = (theme) => ({
  schoolyLogo: {
    width: "30%",
    height: "30%",
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
    document.title="Daftar di Schooly"

    const { classes } = this.props;
    const { errors } = this.state;

    console.log(this.state.role)
    const classesCollection = this.props.classesCollection;
    var options = []
    if(Object.keys(classesCollection).length != 0){
      options = classesCollection
    }

    return (
      <div className="container">
        <div>
          <img src={schoolyLogo} className={classes.schoolyLogo} />
        </div>

          <div className="col s8 offset-s2">
            <form noValidate onSubmit={this.onSubmit} id="registerform">
              <div className="col s12">
                <InputLabel id="demo-simple-select-label">Register As</InputLabel>
                <Select
                  style={{ width: "200px"}}
                  labelId="demo-simple-select-label"
                  id="role"
                  name="role"
                  value={this.state.role}
                  onChange={this.onChange}>
                    <MenuItem value={"Student"}>Student</MenuItem>
                    <MenuItem value={"Teacher"}>Teacher</MenuItem>
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                </Select>
                {/* <label htmlFor="role">Register As</label> */}
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <label htmlFor="name">Name</label>
                <span className="red-text">{errors.name}</span>
              </div>

            {this.state.role === "Student" ?
            <div className=" col s12">
            <InputLabel id="class">Class</InputLabel>
          <Multiselect id="class" options={options} onSelect={this.onSelect}
          onRemove={this.onRemove} displayValue="name" error={errors.class_assigned} showCheckBox={true}
          className={classnames("", {
            invalid: errors.class
          })}/>
        </div>
        :
        this.state.role === "Teacher" ?
          <div className="input-field col s12">
            <input
              onChange={this.onChange}
              value={this.state.subject_teached}
              error={errors.subject_teached}
              id="subject_teached"
              type="text"
              className={classnames("", {
                invalid: errors.subject_teached
              })}
            />
            <label htmlFor="subject_teached">Subject Teached</label>
            <span className="red-text">{errors.subject_teached}</span>
          </div> : null}
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">{errors.email}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.phone}
                  error={errors.phone}
                  id="phone"
                  type="text"
                  className={classnames("", {
                    invalid: errors.phone
                  })}
                />
                <label htmlFor="email">Phone Contact </label>
                <span className="red-text">{errors.phone}</span>
              </div>

              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.emergency_phone}
                  error={errors.emergency_phone}
                  id="emergency_phone"
                  type="text"
                  className={classnames("", {
                    invalid: errors.emergency_phone
                  })}
                />
                <label htmlFor="email">Emergency Contact</label>
                <span className="red-text">{errors.emergency_phone}</span>
              </div>

              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.address}
                  error={errors.address}
                  id="address"
                  type="text"
                  className={classnames("", {

                    invalid: errors.address
                  })}
                />
                <label htmlFor="email">Address</label>
                <span className="red-text">{errors.address}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">{errors.password}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
                <label htmlFor="password2">Confirm Password</label>
                <span className="red-text">{errors.password2}</span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  style={{backgroundColor: "#2196f3"}}
                >
                  Register
                </Button>
              </div>
            </form>
          </div>
        {/* </div> */}
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

export default connect(
  mapStateToProps,
  { registerUser , viewClass}
)(withRouter(Register));
