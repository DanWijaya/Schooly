import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { createTask } from "../../../actions/TaskActions"
import { viewClass } from "../../../actions/ClassActions";
import moment from "moment";
import { SingleDatePicker } from "react-dates";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { Button, Chip, FormControl, Grid,Input,InputLabel, MenuItem, Paper, Select, Typography, withStyles, withTheme } from "@material-ui/core";
// import { Multiselect } from "multiselect-react-dropdown";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";

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
            deadline: moment(),
            focused: false,
            // submitted: false,
            class_assigned: [],
            errors: {}
        };
    }

    
    onChange = (e, otherfield) => {
      if(otherfield == "kelas"){

        this.setState({ class_assigned: e.target.value})
      }
        this.setState({ [e.target.id]: e.target.value});
    }

    onSubmit = (e) => {
        e.preventDefault();

        const taskObject = {
            name: this.state.name,
            deadline: this.state.deadline,
            subject: this.state.subject,
            class_assigned: this.state.class_assigned,
            // submitted: this.state.submitted,
            errors: {}
        };

        this.props.createTask(taskObject, this.props.history);
        this.setState({name: "", subject: ""})

    }

    onSelect = (selectedList, selectedItem) => {
      console.log(this.state.class_assigned)
      this.setState({ class_assigned: selectedList})
    }

    onRemove = (selectedList, selectedItem) => {
      this.setState({ class_assigned: selectedList})
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
      console.log("AAA")
    }

    render() {
      const {classesCollection,  classes, viewClass} = this.props;
      
        if(classesCollection)
            viewClass()

        var options = []
        if(Object.keys(classesCollection).length !== 0) {
          options = classesCollection
        }

        document.title = "Schooly - Create Task"
        const { errors } = this.state;

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

        return(

        <div className={classes.root}>
          <Paper>
          <div className={classes.mainGrid}>
            <Typography variant="h5" className={classes.formTitle}>
              <b>Tambahkan keterangan tugas untuk membuat tugas</b>
            </Typography>
            <form noValidate onSubmit={this.onSubmit}>
              <Grid 
              container 
              direction="column" 
              alignItems="center"
               spacing={4}>
                <Grid item className={classes.gridItem}>
                <OutlinedTextField
                    onChange={this.onChange}
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
                  <OutlinedTextField
                      onChange={this.onChange}
                      value={this.state.subject}
                      error={errors.subject}
                      id="subject"
                      type="text"
                      className={classnames("", {
                        invalid: errors.name
                      })}
                      labelname="Mata Pelajaran"
                      html_for="subject"
                      label_classname={classes.inputLabel}
                      span_classname={classes.errorInfo}
                      error1={errors.subject}
                    />
                  </Grid>

                <Grid item className={classes.gridItem}>
                <FormControl className={classes.formControl}>
                <label id="class_assigned" className={classes.inputLabel}>Kelas yang dipilih</label>
        <Select
          id="class_assigned"
          multiple
          value={this.state.class_assigned}
          onChange={(event) => {this.onChange(event, "kelas")}}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((kelas) => (
                <Chip key={kelas} label={kelas.name} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {options.map((kelas) => (
            <MenuItem key={kelas} value={kelas}>{kelas.name}</MenuItem>
          ))}
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
                  Add Task
                </Button>
              </Grid>
              </Grid>
            </form>
          </div>
          </Paper>
          </div>

               
                  );
    }
}

CreateTask.propTypes = {
    createTask: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    viewClass: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  classesCollection: state.classesCollection
})

export default connect(
  mapStateToProps, { createTask, viewClass }
) (withStyles(styles )(CreateTask))

// <form noValidate onSubmit={this.onSubmit}>
//               <div className="input-field col s12">
//                 <input
//                   onChange={this.onChange}
//                   value={this.state.name}
//                   error={errors.name}
//                   id="name"
//                   type="text"
//                   className={classnames("", {
//                     invalid: errors.name
//                   })}
//                 />
//                 <label htmlFor="name">Name</label>
//                 <span className="red-text">{errors.name}</span>
//               </div>

//               <div className="input-field col s12">
//                 Deadline <SingleDatePicker
//                   id="deadline"
//                   date={this.state.deadline}
//                   onDateChange={(date) => this.setState({ deadline : date})}
//                   focused={this.state.focused}
//                   onFocusChange={({focused}) => this.setState({ focused})}
//                   />

//                 <label htmlFor="deadline">Deadline</label> 
//                 <span className="red-text">{errors.deadline}</span>
//               </div>

//               <div className="input-field col s12">
//                 <input
//                   onChange={this.onChange}
//                   value={this.state.subject}
//                   error={errors.subject}
//                   id="subject"
//                   type="text"
//                   className={classnames("", {
//                     invalid: errors.subject
//                   })}
//                 />
//                 <label htmlFor="subject">Subject</label>
//                 <span className="red-text">{errors.subject}</span>
//               </div>

//               <div className=" col s12">
//                 <InputLabel id="class-assigned">Classes assigned</InputLabel>
//               <Multiselect id="class_assigned" options={options} onSelect={this.onSelect}
//               onRemove={this.onRemove} displayValue="name" error={errors.class_assigned} showCheckBox={true}
//               className={classnames("", {
//                 invalid: errors.class_assigned
//               })}/>
//             </div>

//               <div className="col s12" style={{ paddingLeft: "11.250px" }}>
//                 <button
//                   style={{
//                     width: "150px",
//                     borderRadius: "3px",
//                     letterSpacing: "1.5px",
//                     marginTop: "1rem",
//                     zIndex: 0
//                   }}
//                   type="submit"
//                   className="btn btn-large waves-effect waves-light hoverable blue accent-3"
//                 >
//                   Add Task
//                 </button>
//               </div>
//             </form>