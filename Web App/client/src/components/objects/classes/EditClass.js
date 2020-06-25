import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { getTeachers , getStudents} from "../../../actions/UserActions";
import { viewOneClass, updateClass } from "../../../actions/ClassActions";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button, FormControl, MenuItem, Grid, Select,Paper, Typography, Menu } from "@material-ui/core";
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
    color: "#2196F3",
    fontSize: "15px",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px"
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
    this.props.viewOneClass(id);
  }

  onChange = (e, otherfield) => {
    switch(otherfield){
      case "bendahara": 
        this.setState({ bendahara: e.target.value})
        break;

      case "sekretaris":
        console.log("set sekretaris")
        console.log(e.target.value)
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

    //classesCollection.selectedClasses itu kelasnya, kalau semua kelas .all_classes
    if(nextProps.classesCollection.selectedClasses.ketua_kelas)
      next_ketua_kelas = nextProps.classesCollection.selectedClasses.ketua_kelas._id

    if(nextProps.classesCollection.selectedClasses.sekretaris)
      next_sekretaris = nextProps.classesCollection.selectedClasses.sekretaris._id

    if(nextProps.classesCollection.selectedClasses.bendahara)
      next_bendahara = nextProps.classesCollection.selectedClasses.bendahara._id

    if(nextProps.classesCollection.selectedClasses.walikelas)
      next_walikelas = nextProps.classesCollection.selectedClasses.walikelas._id
    
    if(!name){
      this.setState({
        name: nextProps.classesCollection.selectedClasses.name,
        nihil: nextProps.classesCollection.selectedClasses.nihil,
        walikelas: next_walikelas,
        ukuran: nextProps.classesCollection.selectedClasses.ukuran,
        ketua_kelas: next_ketua_kelas,
        sekretaris: next_sekretaris,
        bendahara: next_bendahara
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
    this.props.getTeachers()
    this.props.getStudents()
  }

  render() {
    document.title = "Schooly | Sunting Kelas"
    const { errors } = this.state;
    const { classes, classesCollection } = this.props;
    const { user } = this.props.auth;
    const { all_teachers} = this.props.auth;
    const { all_students } = this.props.auth;
    const { sekretaris , bendahara, ketua_kelas, walikelas} = this.state;
    var teacher_options = all_teachers
    var student_options = all_students

    console.log(classesCollection.selectedClasses.walikelas)
    const returnId = (user_id, arr) => {
      if(arr == "student"){
        for (var i = 0; i < student_options.length; i++) {
            // console.log(student_options[i]._id)
            if(student_options[i]._id == user_id._id){
              return user_id._id
            }
        }
    } else {
      for (var i = 0; i < teacher_options.length; i++) {
        // console.log(student_options[i]._id)
        if(teacher_options[i]._id == user_id._id){
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
        // value={student}
        > 
        {student.name}
        </MenuItem>)
      })
      return items;
    }

    if(user.role == "Teacher" || user.role == "Admin"){
    return (
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
                    <label id="bendahara" className={classes.inputLabel}>bendahara</label>
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
                    style={{
                      backgroundColor: "#61BD4F",
                      color: "white",
                      width: "100%",
                      marginTop: "20px",
                    }}
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
        <b>Anda tidak punya izin untuk menyunting kelas</b>
      </Typography>
      </div>
    )
  }
  }
}

EditClass.propTypes = {
    viewOneClass: PropTypes.func.isRequired,
    updateClass: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    getTeachers: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    classesCollection: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    errors: state.errors,
    auth: state.auth,
    classesCollection: state.classesCollection
})

export default connect(
    mapStateToProps, { viewOneClass, updateClass , getTeachers, getStudents}
) (withStyles(styles)(EditClass))
