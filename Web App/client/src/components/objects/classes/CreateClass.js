import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { clearErrors } from "../../../actions/ErrorActions"
import { createClass } from "../../../actions/ClassActions";
import { getTeachers } from "../../../actions/UserActions";
import { Button, Divider, FormControl, FormHelperText, Grid, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  content: {
    padding: "20px",
  },
  createClassButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "#61BD4F",
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
      errors: {},
    };
  }

  onChange = (e, otherfield) => {
    if (otherfield === "walikelas")
      this.setState({ walikelas: e.target.value});
    else {
      this.setState({ [e.target.id]: e.target.value});
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const classObject = {
      name: this.state.name,
      nihil: this.state.nihil,
      walikelas: this.state.walikelas,
      ukuran: this.state.ukuran,
      ketua_kelas: this.state.ketua_kelas,
      sekretaris: this.state.sekretaris,
      bendahara: this.state.bendahara,
      errors: {}
    };
    this.props.createClass(classObject, this.props.history);
  }

  onSelect = (selectedList, selectedItem) => {
    if (selectedList.length > 1)
      selectedList.shift()
      this.setState({ walikelas: selectedList[0]})
  }

  onRemove = (selectedList, selectedItem) => {
    this.setState({ class_assigned: selectedList[0]})
  }

  // UNSAFE_componentWillReceiveProps() is invoked before
  //  a mounted component receives new props. If you need
  //  update the state in response to prop changes (for example, to reset it),
  //  you may compare this.props and nextProps and perform state transitions
  //  using this.setState() in this method.

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  componentDidMount() {
    this.props.clearErrors()
    this.props.getTeachers()
  }

  render() {
    const { classes } = this.props;

    const { all_teachers, user } = this.props.auth
    const { errors } = this.state;
    console.log(errors)
    var options = all_teachers;

    document.title = "Schooly | Buat Kelas";

    if (user.role === "Teacher" || user.role === "Admin") {
      return (
        <div className={classes.root}>
          <Paper>
            <div className={classes.content}>
              <Typography variant="h5" gutterBottom>
                <b>Buat Kelas</b>
              </Typography>
              <Typography color="textSecondary">
                Setelah semua murid masuk, jangan lupa untuk menyunting kelas dan menentukan ketua kelas, sekretaris, dan bendahara kelas.
              </Typography>
            </div>
            <Divider />
            <form noValidate onSubmit={this.onSubmit}>
              <Grid container direction="column" spacing={4} className={classes.content}>
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
                      invalid: errors.name
                    })}
                  />
                </Grid>
                <Grid item>
                  <Typography component="label" for="walikelas" color="primary">
                    Wali Kelas
                  </Typography>
                  <FormControl id="walikelas" variant="outlined" color="primary" fullWidth error={Boolean(errors.walikelas)}>
                    <Select
                      value={this.state.walikelas}
                      onChange={(event) => {this.onChange(event, "walikelas")}}
                    >
                      {options.map((walikelas) => (
                        <MenuItem value={walikelas}>{walikelas.name}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText error>
                      {Boolean(errors.walikelas) ? errors.walikelas : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Typography component="label" for="ukuran" color="primary">
                    Jumlah Murid
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="ukuran"
                    onChange={this.onChange}
                    value={this.state.ukuran}
                    error={errors.ukuran}
                    type="number"
                    helperText={errors.ukuran}
                    className={classnames("", {
                      invalid: errors.ukuran
                    })}
                  />
                </Grid>
              </Grid>
              <Divider />
              <div style={{display: "flex", justifyContent: "flex-end"}} className={classes.content}>
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
      )
    }
    else {
      return (
        <div className={classes.root}>
          <Typography variant="h5" align="center">
            <b>Anda tidak mempunyai izin akses halaman ini.</b>
          </Typography>
        </div>
      )
    };
  };
};

CreateClass.propTypes = {
  createClass: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  getTeachers: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth,
})

export default connect(
  mapStateToProps, { createClass, getTeachers, clearErrors }
) (withStyles(styles)(CreateClass));
