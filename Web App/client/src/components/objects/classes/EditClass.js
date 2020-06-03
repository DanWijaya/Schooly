import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { getTeachers , getStudents} from "../../../actions/AuthActions";
import { editClass, updateClass } from "../../../actions/ClassActions";
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
    color: "#2196f3",
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
    const { classId } = this.props.location.state;
    console.log(classId);
    console.log("Aduh");
    this.props.editClass(classId);
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

      default:
        this.setState({ [e.target.id]: e.target.value});
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Class props is received")
    const { name } = this.state;
    var next_ketua_kelas = {"name" : "Not selected"}
    var next_bendahara = {"name" : "Not selected"}
    var next_sekretaris = {"name" : "Not selected"}

    if(nextProps.classesCollection.ketua_kelas)
      next_ketua_kelas = nextProps.classesCollection.ketua_kelas

    if(nextProps.classesCollection.sekretaris){
      next_sekretaris = nextProps.classesCollection.sekretaris
    }

    if(nextProps.classesCollection.bendahara)
      next_bendahara = nextProps.classesCollection.bendahara

    if(!name){
      this.setState({
        name: nextProps.classesCollection.name,
        nihil: nextProps.classesCollection.nihil,
        walikelas: nextProps.classesCollection.walikelas,
        ukuran: nextProps.classesCollection.ukuran,
        ketua_kelas: next_ketua_kelas,
        sekretaris: next_sekretaris,
        bendahara: next_bendahara
      });
    }
  }

  onSubmit = (e) => {
    e.preventDefault()

    const { classId } = this.props.location.state;
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

    this.props.updateClass(classObject, classId, this.props.history);
  }

  // onSelectTeacher = (selectedList, selectedItem) => {
  //   if(selectedList.length === 0)
  //     selectedList.push(this.state.walikelas)
  //   if(selectedList.length > 1)
  //     selectedList.shift()

  //   this.setState({ walikelas: selectedList[0]})
  // }

  // onSelectKetuaKelas = (selectedList, selectedItem) => {
  //   if(selectedList.length === 0)
  //     selectedList.push(this.state.ketua_kelas)
  //   if(selectedList.length > 1)
  //     selectedList.shift()

  //   this.setState({ ketua_kelas: selectedList[0]})
  // }

  // onSelectSekretaris = (selectedList, selectedItem) => {
  //   if(selectedList.length === 0)
  //     selectedList.push(this.state.sekretaris)
  //   if(selectedList.length > 1)
  //     selectedList.shift()

  //   this.setState({ sekretaris: selectedList[0]})
  // }

  // onSelectBendahara = (selectedList, selectedItem) => {
  //   if(selectedList.length === 0)
  //     selectedList.push(this.state.bendahara)
  //   if(selectedList.length > 1)
  //     selectedList.shift()

  //   this.setState({ bendahara: selectedList[0]})
  // }
  componentDidMount() {
    this.props.getTeachers()
    this.props.getStudents()
  }

  render() {
    document.title = "Schooly | Sunting Kelas"
    const { errors } = this.state;
    const { classes } = this.props;

    const { all_teachers} = this.props.auth;
    const { all_students } = this.props.auth;
    const { sekretaris } = this.state;
    var teacher_options = all_teachers
    var student_options = all_students

    const returnId = (student_id) => {
      for (var i = 0; i < student_options.length; i++) {
          // console.log(student_options[i]._id)
          if(student_options[i]._id == student_id._id){
            return student_id._id
          }
      }
    }

    const showValue = (options) => {
      let items = []
      options.map((student) => {
        console.log(student, this.state.sekretaris)
        items.push(
        <MenuItem 
        value={returnId(student)}
        // value={student}
        > 
        {student.name}
        </MenuItem>)
      })
      return items;
    }

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
                {/* <div className="input-field col s12">
                    <input
                        onChange={this.onChange}
                        value={this.state.nihil}
                        error={errors.nihil}
                        id="nihil"
                        type="radio"
                        className={classnames("", {
                            invalid: errors.nihil
                        })}
                    />
                    <label htmlFor="nihil">Nihil</label>
                    <span className="red-text">{errors.nihil}</span>

                </div> */}
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
                  <label id="walikelas">
                    <div className={classes.inputLabel}>
                      Wali Kelas
                    </div>
                  </label>
                   {this.state.walikelas ? <Multiselect id="walikelas" options={teacher_options} onSelect={this.onSelectTeacher} selectedValues={[this.state.walikelas]} onRemove={this.onRemove} displayValue="name" error={errors.walikelas} showCheckBox={true}
                  className={classnames("", {
                      invalid: errors.walikelas
                  })}/> : ""}
                </Grid>
                <Grid item className={classes.gridItem}>
                  <label id="ketuakelas">
                    <div className={classes.inputLabel}>
                      Ketua Kelas
                    </div>
                  </label>
                    {this.state.ketua_kelas ? <Multiselect id="ketuakelas" options={student_options} onSelect={this.onSelectKetuaKelas} selectedValues={[this.state.ketua_kelas]} onRemove={this.onRemove} displayValue="name" error={errors.ketua_kelas} showCheckBox={true}
                  className={classnames("", {
                      invalid: errors.ketuakelas
                  })}/> : ""}
                </Grid>
                <Grid item className={classes.gridItem}>
                <FormControl id="sekretaris" variant="outlined" color="primary" style={{width: "100%"}}>
                    <label id="sekretaris" className={classes.inputLabel}>Sekretaris</label>
                    <Select
                    value={sekretaris}
                    displayEmpty
                    onChange={(event) => {this.onChange(event, "sekretaris")}}
                  >
                    {showValue(student_options)}
                  </Select>
                
                </FormControl>
                </Grid>

                <Grid item className={classes.gridItem}>
                
                <FormControl id="bendahara" variant="outlined" color="primary" style={{width: "100%"}}>
                    <label id="bendahara" className={classes.inputLabel}>Bendahara</label>
                    <Select
                    value={this.state.bendahara}
                    onChange={(event) => {this.onChange(event, "bendahara")}}
                  >
                    {student_options.map((student) => (
      <MenuItem value={student}>{student.name}</MenuItem>
                    )
    )}
                  </Select>
                
                </FormControl>
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
}

EditClass.propTypes = {
    editClass: PropTypes.func.isRequired,
    updateClass: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    getTeachers: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    classesCollection: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    errors: state.errors,
    auth: state.auth,
    classesCollection: state.classesCollection
})

export default connect(
    mapStateToProps, { editClass, updateClass , getTeachers, getStudents}
) (withStyles(styles)(EditClass))
