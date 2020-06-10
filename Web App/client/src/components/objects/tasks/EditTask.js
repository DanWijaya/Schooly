import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import moment from "moment";
import { Button, Chip, FormControl, Grid, Input, InputLabel, MenuItem, Paper, Select, Typography, withStyles } from "@material-ui/core";
import { viewClass } from "../../../actions/ClassActions";
import { editTask, updateTask } from "../../../actions/TaskActions";
import { Multiselect } from "multiselect-react-dropdown";

import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
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
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
  });

class EditTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            subject: "",
            deadline: moment(),
            tasksCollection: [],
            class_assigned: [],
            focused: false,
            errors: {},
        }
        // this.nameInput = React.createRef();
        // this.subjectInput = React.createRef();

        const { id } = this.props.match.params;
        console.log(id)
        this.props.editTask(id)
    }

    onChange = (e, otherfield) => {
      if(otherfield == "kelas"){
        console.log(this.state.class_assigned, e.target.value)
        this.setState({ class_assigned: e.target.value})
      }
      else if(otherfield == "deadline"){
        this.setState({ deadline: e}) // e is the date value itself.
      }
      else
        this.setState({ [e.target.id]: e.target.value});
    }

    onDateChange = (date) => {
        console.log(date)
        this.setState({ deadline: date})
      }
    componentDidMount() {
        this.props.viewClass()
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log("Tasks props is received");
        const { name } = this.state;
        // console.log(nextProps.tasksCollection.deadline);
        console.log(nextProps.tasksCollection);
        if(!name){
            this.setState({
                name: nextProps.tasksCollection.name,
                subject: nextProps.tasksCollection.subject,
                deadline: nextProps.tasksCollection.deadline,
                class_assigned: nextProps.tasksCollection.class_assigned

            })
        }
    }

    onSelect = (selectedList, selectedItem) => {
        console.log(this.state.class_assigned)
        this.setState({ class_assigned: selectedList})
      }

      onRemove = (selectedList, selectedItem) => {
        this.setState({ class_assigned: selectedList})
      }

    onSubmit = (e) => {
        e.preventDefault();

        const { id } = this.props.match.params;
        const taskObject = {
            name: this.state.name,
            deadline: this.state.deadline,
            subject: this.state.subject,
            class_assigned: this.state.class_assigned,
            errors: {}
        }

        this.props.updateTask(taskObject, id, this.props.history);
    }

    // focus = () =>{
    //     this.nameInput.current.click();
    //     this.subjectInput.current.click()
    // }
    render() {
        document.title = "Schooly - Edit Task"
        const { errors } = this.state;
        const {classes, classesCollection} = this.props;
        console.log(classesCollection)
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

        var options = []
        if(Object.keys(classesCollection).length !== 0) {
          options = classesCollection
        }

        return(
            <div className={classes.root}>
              <Paper>
              <div className={classes.mainGrid}>
                <Typography variant="h5" className={classes.formTitle}>
                  <b>Sunting Tugas</b>
                </Typography>
                <form noValidate onSubmit={this.onSubmit}>
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
                      <OutlinedTextField
                          on_change={(e) => {this.onChange(e)}}
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
                    <FormControl variant="outlined" fullWidth>
                    <label id="class_assigned" className={classes.inputLabel}>Kelas yang dipilih</label>
                    {this.state.class_assigned == undefined ? null : 
                        <Select
                        id="class_assigned"
                        multiple
                        value={this.state.class_assigned}
                        onChange={(event) => {this.onChange(event, "kelas")}}
                        renderValue={(selected) => {
                          console.log(selected)
                          return (
                            <div className={classes.chips}>
                            {selected.map((kelas) => (
                                <Chip key={kelas} label={kelas.name} className={classes.chip} />
                            ))}
                            </div>
                        )}}
                        MenuProps={MenuProps}
                        >
                    {options.map((kelas) => (
                        <MenuItem value={kelas} selected>{kelas.name}</MenuItem>
                    ))}
                    </Select>
                  }
            </FormControl>
          </Grid>
          <Grid item className={classes.gridItem}>
          <MuiPickersUtilsProvider locale={lokal} utils={DateFnsUtils}>
            <Grid container>
            <KeyboardDatePicker
              fullWidth
              disablePast
              format="dd/MM/yyyy"
              margin="normal"
              okLabel="Simpan"
              cancelLabel="Batal"
              id="date-picker-inline"
              label="Deadline"
              value={this.state.deadline}
              onChange={(date) => this.onChange(date, "deadline")}
            //   onChange={(date) => this.onDateChange(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              InputProps={{
                disableUnderline: true
              }}
            />
            </Grid>
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
                      Edit Task
                    </Button>
                  </Grid>
                  </Grid>
                </form>
              </div>
              </Paper>
              </div>
    
    
                      );
        // return (
        //     <div className="container">
        //         <div className="col s8 offset-s2">
        //             <div className="col s12" style={{ paddingLeft: "11.250px"}}>
        //                 <h4>
        //                  <b>Edit task</b>
        //                 </h4>
        //             </div>
        //             <form noValidate onSubmit={this.onSubmit}>
        //             <div className="input-field col s12">
        //                 <input
        //                     onChange={this.onChange}
        //                     value={this.state.name}
        //                     error={errors.name}
        //                     id="name"
        //                     type="text"
        //                     className={classnames("", {
        //                         invalid: errors.name
        //                     })}
        //                 />
        //                 {/* <label htmlFor="name" class="active">Name</label> */}
        //                 {/* This is another solution */}
        //                 {this.state.name === "" ?
        //             <label htmlFor="name">Name</label> :
        //             <label htmlFor="name" class="active">Name</label>}
        //                 <span className="red-text">{errors.name}</span>
        //             </div>


        //             <div className="input-field col s12">
        //               Deadline <SingleDatePicker
        //                 id="deadline"
        //                 date={this.state.deadline}
        //                 onDateChange={(date) => this.setState({ deadline : date})}
        //                 focused={this.state.focused}
        //                 onFocusChange={({focused}) => this.setState({ focused})}
        //                 />

        //             {/* <label htmlFor="deadline">Deadline</label> */}
        //             <span className="red-text">{errors.deadline}</span>
        //             </div>

        //             <div className="input-field col s12">
        //             <input
        //             onChange={this.onChange}
        //             value={this.state.subject}
        //             error={errors.subject}
        //             ref={this.subjectInput}
        //             id="subject"
        //             type="text"
        //             className={classnames("", {
        //                 invalid: errors.subject
        //             })}
        //             />
        //             {/* <label htmlFor="subject" class="active">Subject</label> */}
        //            {/* This is another solution, might not an elegant solution...  */}
        //            {this.state.subject === "" ?
        //             <label htmlFor="subject">Subject</label> :
        //             <label htmlFor="subject" class="active">Subject</label>}
        //             <span className="red-text">{errors.subject}</span>
        //             </div>

        //             <div className=" col s12">
        //                 <InputLabel id="class-assigned">Classes assigned</InputLabel>
        //                 <Multiselect id="class_assigned" options={options} selectedValues={this.state.class_assigned} onSelect={this.onSelect}
        //                 onRemove={this.onRemove} value displayValue="name" error={errors.class_assigned} showCheckBox={true}
        //                 className={classnames("", {
        //                     invalid: errors.class_assigned
        //                 })}/>
        //             </div>

        //             <div className="col s12" style={{ paddingLeft: "11.250px" }}>
        //             <button
        //             style={{
        //                 width: "150px",
        //                 borderRadius: "3px",
        //                 letterSpacing: "1.5px",
        //                 marginTop: "1rem",
        //                 zIndex: 0
        //             }}
        //             type="submit"
        //             className="btn btn-large waves-effect waves-light hoverable blue accent-3"
        //             >
        //             Edit Task
        //             </button>
        //             </div>
        //         </form>
        //     </div>
        // </div>
        // )
    }

}

EditTask.propTypes = {
    errors: PropTypes.object.isRequired,
    editTask : PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    tasksCollection: PropTypes.object.isRequired,
    viewClass: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    errors: state.errors,
    tasksCollection: state.tasksCollection,
    classesCollection: state.classesCollection
    // name: state.name,
    // subject: state.subject,
    // deadline: state.deadline
})

export default connect(
    mapStateToProps, { editTask, updateTask, viewClass}
) (withStyles(styles)(EditTask))
