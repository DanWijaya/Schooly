import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { getTeachers , getStudentsByClass} from "../../../actions/UserActions";
import { clearErrors } from "../../../actions/ErrorActions"
import { setCurrentClass, updateClass } from "../../../actions/ClassActions";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button, FormControl, FormHelperText, MenuItem, Grid, Select,Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/Error";

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    margin: "auto",
    maxWidth: "1000px",
  },
  mainGrid: {
    width: "450px",
    padding: "30px",
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
    color: theme.palette.primary.main,
    fontSize: "15px",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px"
  },
  editClassButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
});


class EditClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nihil: true,
      walikelas: null,
      ukuran: 0,
      errors: {},
      classesCollection: [],
      ketua_kelas: null,
      sekretaris: null,
      bendahara: null
    }
    const { id } = this.props.match.params;
    console.log(id);
    console.log("Aduh");
    this.props.setCurrentClass(id);
  }

  onChange = (e, otherfield) => {
    console.log(this.state.walikelas)
    switch(otherfield){
      case "bendahara":
        this.setState({ bendahara: e.target.value})
        break;
      case "sekretaris":
        this.setState({ sekretaris: e.target.value})
        break;
      case "ketua_kelas":
        this.setState({ ketua_kelas: e.target.value})
        break;
      case "walikelas":
        this.setState({ walikelas: e.target.value})
        break;
      default:
        this.setState({ [e.target.id]: e.target.value});
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Class props is received")
    const { name } = this.state;
    // var next_ketua_kelas = {}
    // var next_bendahara = {}
    // var next_sekretaris = {}
    // var next_walikelas = {}

    const {kelas} = nextProps.classesCollection
    //classesCollection.kelas = individual class, .all_classes = all classes
    // if(kelas.ketua_kelas)
    //   next_ketua_kelas = kelas.ketua_kelas

    // if(kelas.sekretaris)
    //   next_sekretaris = kelas.sekretaris

    // if(kelas.bendahara)
    //   next_bendahara = kelas.bendahara

    // if(kelas.walikelas)
    //   next_walikelas = kelas.walikelas

    if(Boolean(kelas)){
      this.setState({
        name: kelas.name,
        nihil: kelas.nihil,
        walikelas: kelas.walikelas,
        ukuran: kelas.ukuran,
        ketua_kelas: kelas.ketua_kelas,
        sekretaris: kelas.sekretaris,
        bendahara: kelas.bendahara
      });
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { id } = this.props.match.params;
    const classObject = {
      name: this.state.name,
      nihil: this.state.nihil,
      walikelas: this.state.walikelas,
      ukuran: this.state.ukuran,
      ketua_kelas: this.state.ketua_kelas,
      sekretaris: this.state.sekretaris,
      bendahara: this.state.bendahara,
      errors: {}
    }
    this.props.updateClass(classObject, id, this.props.history);
  }

  componentDidMount() {
    const { getTeachers, getStudentsByClass, clearErrors} = this.props;
    
    clearErrors()
    getTeachers()
    getStudentsByClass(this.props.match.params.id)
  }

  render() {
    const { classes, classesCollection } = this.props;
    const { errors } = this.props;
    const { user } = this.props.auth;
    const { all_teachers} = this.props.auth;
    const { students_by_class } = this.props.auth;
    const { sekretaris, bendahara, ketua_kelas, walikelas} = this.state;
    var teacher_options = all_teachers
    var student_options = students_by_class

    const returnId = (user, arr) => {
      if(arr === "student") {
        for (var i = 0; i < student_options.length; i++) {
          if(student_options[i]._id === user._id){
            return user._id
          }
        }
      }
      else {
        for (var i = 0; i < teacher_options.length; i++) {
          // console.log(student_options[i]._id)
          if(teacher_options[i]._id === user._id){
            return user._id
          }
        }
      }
    }


    const showValue = (options, arr) => {
      let items = []
      options.map((user) => {
        console.log(user, this.state.sekretaris)
        items.push(
          <MenuItem
            value={returnId(user, arr)}
          >
            {user.name}
          </MenuItem>
        )
      })
      return items;
    }

    document.title = "Schooly | Sunting Kelas";
    console.log(this.state.walikelas)
    if(user.role === "Teacher" || user.role === "Admin") {
      return(
        <div className={classes.root}>
          <Paper>
            <div className={classes.mainGrid}>
              <Typography variant="h5" className={classes.formTitle}>
                <b>Sunting Kelas</b>
              </Typography>
              <form noValidate onSubmit={this.onSubmit}>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  spacing={4}
                >
                  <Grid item className={classes.gridItem}>
                    {this.state.name === "" ?
                      <label htmlFor="name">
                        <div className={classes.inputLabel}>
                          Nama Kelas
                        </div>
                      </label>
                    :
                      <label htmlFor="name" class="active">
                        <div className={classes.inputLabel}>
                          Nama Kelas
                        </div>
                      </label>
                    }
                    <OutlinedTextField
                      on_change={this.onChange}
                      value={this.state.name}
                      error={errors.name}
                      id="name"
                      type="text"
                      classname={classnames("", {
                          invalid: errors.name
                      })}
                      span_classname={classes.errorInfo}
                      error1={errors.name}
                    />
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    {/* {this.state.name === "" ?
                      <label htmlFor="ukuran">
                        <div className={classes.inputLabel}>
                          Jumlah Murid
                        </div>
                      </label>
                    :
                      <label htmlFor="ukuran" class="active">
                        <div className={classes.inputLabel}>
                          Jumlah Murid
                        </div>
                      </label>
                    } */}
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
                      label_classname={classes.inputLabel}
                      span_classname={classes.errorInfo}
                      error1={errors.ukuran}
                    />
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <FormControl id="walikelas" variant="outlined" color="primary" style={{width: "100%"}} error={Boolean(errors.walikelas)}>
                      <label id="walikelas" className={classes.inputLabel}>Walikelas</label>
                      <Select
                        value={walikelas}
                        displayEmpty
                        onChange={(event) => {this.onChange(event, "walikelas")}}
                      >
                        {showValue(teacher_options, "teacher")}
                      </Select>
                      <FormHelperText style={{marginLeft: 0, paddingLeft: 0, display:"flex", alignItems:"center"}}>
                      {Boolean(errors.walikelas) ? <ErrorIcon style={{ height: "5%", width:"5%"}} /> : null}
                      {Boolean(errors.walikelas) ? <Typography variant="h8" style={{marginLeft: "4px"}}>{errors.walikelas}</Typography> : null}
                    </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <FormControl id="ketua_kelas" variant="outlined" color="primary" style={{width: "100%"}}>
                      <label id="ketua_kelas" className={classes.inputLabel}>Ketua Kelas</label>
                      <Select
                        value={ketua_kelas}
                        displayEmpty
                        onChange={(event) => {this.onChange(event, "ketua_kelas")}}
                      >
                        {showValue(student_options, "student")}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <FormControl id="sekretaris" variant="outlined" color="primary" style={{width: "100%"}}>
                      <label id="sekretaris" className={classes.inputLabel}>Sekretaris</label>
                      <Select
                        value={sekretaris}
                        displayEmpty
                        onChange={(event) => {this.onChange(event, "sekretaris")}}
                      >
                        {showValue(student_options, "student")}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <FormControl id="bendahara" variant="outlined" color="primary" style={{width: "100%"}}>
                      <label id="bendahara" className={classes.inputLabel}>Bendahara</label>
                      <Select
                        value={bendahara}
                        displayEmpty
                        onChange={(event) => {this.onChange(event, "bendahara")}}
                      >
                        {showValue(student_options, "student")}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <Button
                      type="submit"
                      variant="contained"
                      className={classes.editClassButton}
                    >
                      Sunting Kelas
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
            <b>Anda tidak mempunyai izin akses halaman ini.</b>
          </Typography>
        </div>
      )
    }
  }
}

EditClass.propTypes = {
    setCurrentClass: PropTypes.func.isRequired,
    updateClass: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    getTeachers: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getStudentsByClass: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    classesCollection: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    errors: state.errors,
    auth: state.auth,
    classesCollection: state.classesCollection
})

export default connect(
    mapStateToProps, { setCurrentClass, updateClass, getStudentsByClass, getTeachers, clearErrors}
) (withStyles(styles)(EditClass));
