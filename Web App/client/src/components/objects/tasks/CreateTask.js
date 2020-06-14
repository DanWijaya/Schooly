import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { createTask } from "../../../actions/TaskActions"
import { viewClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions"
import { Button, Chip, FormControl, Grid, Input, InputLabel, MenuItem, Paper, Select, Typography, withStyles } from "@material-ui/core";
// import { Multiselect } from "multiselect-react-dropdown";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';
import lokal from "date-fns/locale/id";

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
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
});

class CreateTask extends Component {
  constructor() {
    super();

        this.state = {
            name: "",
            subject: "",
            deadline: new Date(),
            focused: false,
            // submitted: false,
            class_assigned: [],
            description: "",
            errors: {}
        };
    }


    onChange = (e, otherfield) => {
      console.log(this.state.deadline)
      if(otherfield == "kelas"){
        this.setState({ class_assigned: e.target.value})
      } else if(otherfield == "deadline"){
        this.setState({ deadline: e}) // e is the date value itself.
      } else if(otherfield == "description"){
        this.setState({ description : e.target.value})
      } else if(otherfield == "subject"){
        this.setState({ subject: e.target.value})
      } else
        this.setState({ [e.target.id]: e.target.value});
    }

    onDateChange = (date) => {
      console.log(date)
      this.setState({ deadline: date})
    }

    onSubmit = (e, id) => {
        e.preventDefault();

        const taskObject = {
            name: this.state.name,
            deadline: this.state.deadline,
            subject: this.state.subject,
            class_assigned: this.state.class_assigned,
            person_in_charge_id: id,
            description: this.state.description,
            // submitted: this.state.submitted,
            errors: {}
        };

        this.props.createTask(taskObject, this.props.history);
        this.setState({name: "", subject: ""})
    }

    // UNSAFE_componentWillReceiveProps() is invoked before
    //  a mounted component receives new props. If you need
    //   update the state in response to prop changes (for example, to reset it),
    //   you may compare this.props and nextProps and perform state transitions
    //   using this.setState() in this method.

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.errors){
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    componentDidMount() {
      this.props.viewClass()
      this.props.getAllSubjects()
      console.log("AAA")
    }

    render() {
      const {classesCollection,  classes, viewClass, subjectsCollection} = this.props;
      const{ class_assigned} = this.state;
      const { user } = this.props.auth

        var options = []
        var subjectOptions = []

        if(Object.keys(classesCollection).length !== 0) {
          options = classesCollection.all_classes
        }

        if(Object.keys(subjectsCollection).length !== 0){
          subjectOptions = subjectsCollection.all_subjects
        }

        document.title = "Schooly - Create Task"
        const { errors } = this.state;

        console.log(options, subjectOptions)
        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;
        const MenuProps = {
          PaperProps: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
              width: 250,
            },
          },
        };

        if(user.role == "Teacher"){
        return(
        <div className={classes.root}>
          <Paper>
          <div className={classes.mainGrid}>
            <Typography variant="h5" className={classes.formTitle}>
              <b>Tambahkan keterangan tugas untuk membuat tugas</b>
            </Typography>
            <form noValidate onSubmit={(e) =>this.onSubmit(e,user.id)}>
              <Grid
              container
              direction="column"
              alignItems="center"
               spacing={4}>
                <Grid item className={classes.gridItem}>
                <OutlinedTextField
                    on_change={this.onChange}
                    value={this.state.name}
                    error={errors.name}
                    id="name"
                    type="text"
                    className={classnames("", {
                      invalid: errors.name
                    })}
                    labelname="Nama Tugas"
                    html_for="tugas"
                    label_classname={classes.inputLabel}
                    span_classname={classes.errorInfo}
                    error1={errors.name}
                  />
              </Grid>


                  <Grid item className={classes.gridItem}>
                   <FormControl id="subject" variant="outlined" color="primary" fullWidth>
                    <label id="subject" className={classes.inputLabel}>Mata Pelajaran</label>
                    <Select
                    value={this.state.subject}
                    onChange={(event) => {this.onChange(event, "subject")}}
                    >
                      {subjectOptions.map((subject) => (
                        <MenuItem value={subject.name}>{subject.name}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
                  </Grid>

                <Grid item className={classes.gridItem}>
                <FormControl variant="outlined" fullWidth>
                <label id="class_assigned" className={classes.inputLabel}>Kelas yang dipilih</label>
                <Select
                  id="class_assigned"
                  multiple
                  value={class_assigned}
                  onChange={(event) => {this.onChange(event, "kelas")}}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((kelas) => {
                        console.log(selected)
                        console.log(kelas, class_assigned)
                        return (
                        <Chip key={kelas} label={kelas.name} className={classes.chip} />
                      )}
                      )}
                    </div>

                  )}
                  MenuProps={MenuProps}
                >
                  {options.map((kelas) => {
                    console.log(kelas, class_assigned)
                    return (
                    <MenuItem key={kelas} selected={true} value={kelas}>{kelas.name}</MenuItem>
                  )})}
                </Select>
      </FormControl>
      </Grid>
      <Grid item className={classes.gridItem}>
      <OutlinedTextField
          on_change={(e) => this.onChange(e, "description")}
          value={this.state.description}
          error={errors.description}
          id="descripton"
          type="textarea"
          className={classnames("", {
            invalid: errors.description
          })}
          labelname="Deskripsi"
          html_for="description"
          label_classname={classes.inputLabel}
          span_classname={classes.errorInfo}
          multiline={true}
          error1={errors.description}
        />
      </Grid>
      <Grid item className={classes.gridItem}>
      <MuiPickersUtilsProvider locale={lokal} utils={DateFnsUtils}>
        <label id="class_assigned" className={classes.inputLabel}>Batas Waktu</label>
        <KeyboardDatePicker
          fullWidth
          disablePast
          // disableToolbar
          format="dd/MM/yyyy"
          margin="normal"
          okLabel="Simpan"
          cancelLabel="Batal"
          id="date-picker-inline"
          value={this.state.deadline}
          // onChange={(date) => this.onChange(date, "deadline")}
          onChange={(date) => this.onDateChange(date)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          InputProps={{
            disableUnderline: true
          }}
        />
      </MuiPickersUtilsProvider>
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
                  Tambahkan Tugas
                </Button>
              </Grid>
              </Grid>
            </form>
          </div>
          </Paper>
          </div>


                  );
                }
        else {
          return(
            <div className={classes.root}>
              <Typography variant="h5" className={classes.formTitle}>
              <b>Anda tidak punya izin untuk membuat Tugas</b>
            </Typography>
            </div>
          )
        }
    }
}

CreateTask.propTypes = {
    createTask: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    viewClass: PropTypes.func.isRequired,
    getAllSubjects: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection
})

export default connect(
  mapStateToProps, { createTask, viewClass, getAllSubjects }
) (withStyles(styles )(CreateTask))