import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { createClass } from "../../../actions/ClassActions"
import { getTeachers } from "../../../actions/AuthActions";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button, FormControl, Grid, MenuItem,Paper, Select, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Multiselect } from "multiselect-react-dropdown";

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    margin: "auto",
    maxWidth: "800px",
  },
  mainGrid: {
    width: "450px",
    padding: "20px",
  },
  gridItem: {
    width: "350px",
  },
  formTitle: {
    textAlign: "center",
    marginBottom: "30px",
  },
  inputField: {
    width: "400px",
  },
  inputLabel: {
    color: "#2196f3",
    fontSize: "15px",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px"
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
      errors: {}
    };
  }

  onChange = (e, otherfield) => {
    if(otherfield == "walikelas")
      this.setState({ walikelas: e.target.value});
    else
      this.setState({ [e.target.id]: e.target.value});
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
    this.setState({name: "", nihil: true, walikelas: "", ukuran: 0})
  }

  onSelect = (selectedList, selectedItem) => {
    if(selectedList.length > 1)
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
    if(nextProps.errors) {
        this.setState({
            errors: nextProps.errors
        });
    }
  }

  componentDidMount() {
    this.props.getTeachers()
  }

  render() {
    document.title = "Schooly | Buat Kelas"

    const { classes } = this.props;
    const { all_teachers, user } = this.props.auth
    const { errors } = this.state;
    var options = all_teachers

    if(user.role == "Teacher" || user.role == "Admin"){
    return (
      <div className={classes.root}>
        <Paper>
          <div className={classes.mainGrid}>
            <Typography variant="h5" className={classes.formTitle}>
              <b>Tambahkan Keterangan Kelas untuk Membuat Kelas</b>
            </Typography>
            <form noValidate onSubmit={this.onSubmit}>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={4}
              >
                <Grid item className={classes.gridItem}>
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
                    labelname="Nama Kelas"
                    label_classname={classes.inputLabel}
                    span_classname={classes.errorInfo}
                    error1={errors.name}
                  />
                </Grid>
                <Grid item className={classes.gridItem}>
                <FormControl id="walikelas" variant="outlined" color="primary" style={{width: "100%"}}>
                    <label id="walikelas" className={classes.inputLabel}>Walikelas</label>
                    <Select
                    value={this.state.walikelas}
                    onChange={(event) => {this.onChange(event, "walikelas")}}
                  >
                    {options.map((walikelas) => (
                      <MenuItem value={walikelas}>{walikelas.name}</MenuItem>
                    ))}
                  </Select>
                
                </FormControl>
                </Grid>
                <Grid item className={classes.gridItem}>
                  <OutlinedTextField
                    on_change={this.onChange}
                    value={this.state.ukuran}
                    error={errors.ukuran}
                    id="ukuran"
                    type="number"
                    classname={classnames("", {
                        invalid: errors.ukuran
                    })}
                    html_for="ukuran"
                    labelname="Jumlah Murid"
                    label_classname={classes.inputLabel}
                    span_classname={classes.errorInfo}
                    error1={errors.ukuran}
                  />
                </Grid>
                <Grid item className={classes.gridItem}>
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: "#61bd4f",
                      color: "white",
                      width: "100%",
                      marginTop: "20px",
                    }}
                  >
                    Buat Kelas
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Paper>
      </div>
    )
  }
  else {
    return(
      <div className={classes.root}>
        <Typography variant="h5" className={classes.formTitle}>
        <b>Anda tidak punya izin untuk membuat Kelas</b>
      </Typography>
      </div>
    )
  }
  }
}

CreateClass.propTypes = {
  createClass: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  getTeachers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
})

export default connect(
  mapStateToProps, { createClass , getTeachers}
) (withStyles(styles)(CreateClass))
