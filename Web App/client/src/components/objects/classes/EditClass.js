import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { getTeachers , getStudents} from "../../../actions/UserActions";
import { clearErrors } from "../../../actions/ErrorActions"
import { setCurrentClass, updateClass } from "../../../actions/ClassActions";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button, FormControl, MenuItem, Grid, Select,Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

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
    var next_ketua_kelas = {}
    var next_bendahara = {}
    var next_sekretaris = {}
    var next_walikelas = {}

    //classesCollection.kelas = individual class, .all_classes = all classes
    if(nextProps.classesCollection.kelas.ketua_kelas)
      next_ketua_kelas = nextProps.classesCollection.kelas.ketua_kelas._id

    if(nextProps.classesCollection.kelas.sekretaris)
      next_sekretaris = nextProps.classesCollection.kelas.sekretaris._id

    if(nextProps.classesCollection.kelas.bendahara)
      next_bendahara = nextProps.classesCollection.kelas.bendahara._id

    if(nextProps.classesCollection.kelas.walikelas)
      next_walikelas = nextProps.classesCollection.kelas.walikelas._id

    if(!name){
      this.setState({
        name: nextProps.classesCollection.kelas.name,
        nihil: nextProps.classesCollection.kelas.nihil,
        walikelas: next_walikelas,
        ukuran: nextProps.classesCollection.kelas.ukuran,
        ketua_kelas: next_ketua_kelas,
        sekretaris: next_sekretaris,
        bendahara: next_bendahara,
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
    const { getTeachers, getStudents, clearErrors} = this.props;
    
    clearErrors()
    getTeachers()
    getStudents()
  }

  render() {
    const { classes, classesCollection } = this.props;
    const { errors } = this.state;
    const { user } = this.props.auth;
    const { all_teachers} = this.props.auth;
    const { all_students } = this.props.auth;
    const { sekretaris, bendahara, ketua_kelas, walikelas} = this.state;
    var teacher_options = all_teachers
    var student_options = all_students

    console.log(classesCollection.kelas.walikelas)
    const returnId = (user_id, arr) => {
      if(arr === "student") {
        for (var i = 0; i < student_options.length; i++) {
          if(student_options[i]._id === user_id._id){
            return user_id._id
          }
        }
      }
      else {
        for (var i = 0; i < teacher_options.length; i++) {
          // console.log(student_options[i]._id)
          if(teacher_options[i]._id === user_id._id){
            return user_id._id
          }
        }
      }
    }

    const showValue = (options, arr) => {
      let items = []
      options.map((student) => {
        console.log(student, this.state.sekretaris)
        items.push(
          <MenuItem
            value={returnId(student, arr)}
          >
            {student.name}
          </MenuItem>
        )
      })
      return items;
    }

    document.title = "Schooly | Sunting Kelas";

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
                    {this.state.name === "" ?
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
                    }
                    <OutlinedTextField
                      on_change={this.onChange}
                      value={this.state.ukuran}
                      error={errors.ukuran}
                      id="ukuran"
                      type="number"
                      classname={classnames("", {
                          invalid: errors.ukuran
                      })}
                      span_classname={classes.errorInfo}
                      error1={errors.name}
                    />
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <FormControl id="walikelas" variant="outlined" color="primary" style={{width: "100%"}}>
                      <label id="walikelas" className={classes.inputLabel}>Walikelas</label>
                      <Select
                        value={walikelas}
                        displayEmpty
                        onChange={(event) => {this.onChange(event, "walikelas")}}
                      >
                        {showValue(teacher_options, "teacher")}
                      </Select>
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
    getStudents: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    classesCollection: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    errors: state.errors,
    auth: state.auth,
    classesCollection: state.classesCollection
})

export default connect(
    mapStateToProps, { setCurrentClass, updateClass, getTeachers, getStudents, clearErrors}
) (withStyles(styles)(EditClass));
