import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import moment from "moment";
import { Button, Chip, FormControl, Grid, IconButton, Input, InputLabel,Menu, MenuItem,ListItemIcon, ListItemText, Paper, Select, Typography, withStyles } from "@material-ui/core";
import { viewClass } from "../../../actions/ClassActions";
import { viewOneTask, updateTask } from "../../../actions/TaskActions";
import { Multiselect } from "multiselect-react-dropdown";
import { getAllSubjects} from "../../../actions/SubjectActions"
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider,KeyboardTimePicker, KeyboardDatePicker} from '@material-ui/pickers';
import 'date-fns';
import lokal from "date-fns/locale/id";
import PostAddIcon from '@material-ui/icons/PostAdd';
import DescriptionIcon from '@material-ui/icons/Description';
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
const path = require("path");

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

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
            deadline: new Date(),
            tasksCollection: [],
            class_assigned: null,
            classChanged: false,
            focused: false,
            description: "",
            fileLampiran: null,
            anchorEl: null,
            errors: {},
        }
        const { id } = this.props.match.params;
        console.log(id)
        this.props.viewOneTask(id)
    }

    tugasUploader = React.createRef(null)
    uploadedTugas = React.createRef(null)

    
    componentDidMount() {
        this.props.viewClass()
        this.props.getAllSubjects()
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log("Tasks props is received");
        const { name } = this.state;
        // console.log(nextProps.tasksCollection.deadline);
        console.log(nextProps.tasksCollection.class_assigned);
        if(!name){
            this.setState({
                name: nextProps.tasksCollection.name,
                subject: nextProps.tasksCollection.subject,
                deadline: nextProps.tasksCollection.deadline,
                class_assigned: nextProps.tasksCollection.class_assigned,
                description: nextProps.tasksCollection.description,
                fileLampiran: nextProps.tasksCollection.lampiran
            })
        }
    }

    onSubmit = (e, classesOptions) => {
        e.preventDefault();

        const { id } = this.props.match.params;
        const { class_assigned, classChanged} = this.state;

        let classesSelected = [];
        console.log(class_assigned)

        class_assigned.map((id) => {
          for( var i = 0; i < classesOptions.length; i++){
            console.log(classesOptions[i]._id, id, classesOptions[i]._id == id)
          if(classesOptions[i]._id == id){
            console.log("SAME")
            classesSelected.push(classesOptions[i])
            break;
          }
        }
        })

        const taskObject = {
            name: this.state.name,
            deadline: this.state.deadline,
            subject: this.state.subject,
            // class_assigned: classesSelected,
            description: this.state.description,
            errors: {}
        }
        if(classChanged)
          taskObject.class_assigned = classesSelected // when the classes is changed
        else
          taskObject.class_assigned = class_assigned // when it has no change

        console.log(taskObject)
        this.props.updateTask(taskObject, id, this.props.history);
    }

    handleLampiranUpload = (e) => {
      const files = e.target.files;
      console.log(this.state.fileLampiran)
      if(Boolean(this.state.fileLampiran)){
        let temp = this.state.fileLampiran;
        console.log(files)
        // for(var i = 0; i < files.length; i++){
          
        // }
      }
      // this.setState({fileLampiran: files})
      // if(!this.state.fileLampiran)
      //   this.setState({fileLampiran: files})
      // else{
      //   if(files.length != 0){
      //     let temp = [];

      //     for(var i = 0; i < this.state.fileLampiran.length; i++)
      //       temp.push(this.state.fileLampiran[i])
      //     for(var i = 0; i < files.length; i++)
      //       temp.push(files[i]) 

      //     this.setState({ fileLampiran: temp})
      //     }
      // }
    }

    handleClickMenu = (event) => {
      if(!Boolean(this.state.anchorEl))
        this.setState({ anchorEl: event.currentTarget})
    }

    handleCloseMenu = () => { this.setState({ anchorEl: null}) }
    
    onChange = (e, otherfield) => {
      if(otherfield == "kelas"){
        console.log(this.state.class_assigned, e.target.value)
        this.setState({ class_assigned: e.target.value, classChanged: true})
      }
      else if(otherfield == "deadline"){
        this.setState({ deadline: e}) // e is the date value itself.
      }
      else if(otherfield == "description"){
        this.setState({ description : e.target.value})
      }
      else if(otherfield == "subject"){
        console.log(e.target.value)
        this.setState({subject: e.target.value })
      }
      else
        this.setState({ [e.target.id]: e.target.value});
    }

    onDateChange = (date) => {
        console.log(date)
        this.setState({ deadline: date})
      }
    render() {
      console.log(this.state.fileLampiran)
        document.title = "Schooly - Edit Task"
        const { errors , fileLampiran} = this.state;
        const {classes, subjectsCollection, tasksCollection} = this.props;
        const { all_classes, selectedClasses} = this.props.classesCollection;
        const { user } = this.props.auth;

        console.log(this.state.class_assigned)
        let classIds = []
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

        const listFileChosen = () => {
          let temp = []
          if(!fileLampiran) {
            temp.push(
              <Typography className={classes.workChosenFile}>
                Kosong
              </Typography>
            )
          }
          else{
            for (var i = 0; i < fileLampiran.length; i++){
              temp.push(
                <StyledMenuItem style={{width:"270px"}}>
                  <ListItemIcon>
                    <DescriptionIcon/>
                  </ListItemIcon>
                  <ListItemText primary={fileLampiran[i].filename.length < 21 ? fileLampiran[i].filename : `${fileLampiran[i].filename.slice(0,17)}..${path.extname(fileLampiran[i].filename)}`}/>
                </StyledMenuItem>
              )
            }
          }
          return temp;
        }

        var classesOptions = []
        var selectedClassOptions = []
        var subjectOptions = []
        if(all_classes.length !== 0) {
          classesOptions = all_classes
          selectedClassOptions = selectedClasses
        }

        if(Object.keys(subjectsCollection.all_subjects).length !== 0){
          subjectOptions = subjectsCollection.all_subjects
        }
        console.log(this.state.class_assigned)
        if(this.state.class_assigned != null) // when firstly received.
          this.state.class_assigned.map((kelas) => {
            if(kelas._id != undefined)
              classIds.push(kelas._id)
            else 
              classIds.push(kelas)
          }
        )

        console.log(classIds)
        if(user.role == "Teacher" || user.role=="Admin"){
        return(
            <div className={classes.root}>
              <Paper>
              <div className={classes.mainGrid}>
                <Typography variant="h5" className={classes.formTitle}>
                  <b>Sunting Tugas</b>
                </Typography>
                <form noValidate onSubmit={(e) => {this.onSubmit(e, classesOptions)}}>
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
                        value={classIds}
                        onChange={(event) => {this.onChange(event, "kelas")}}
                        renderValue={(selected) => {
                          
                          return (
                            <div className={classes.chips}>
                            {selected.map((id) => {
                              let name
                              for (var i in classesOptions){ // i is the index
                                if(classesOptions[i]._id === id){
                                  name = classesOptions[i].name
                                  break;
                                }
                              }
                              return (
                                <Chip key={id} label={name} className={classes.chip} />
                            ) 
                          })}
                            </div>
                        )}}
                        MenuProps={MenuProps}
                        >
                    {classesOptions.map((kelas) => (
                        <MenuItem value={kelas._id} selected>{kelas.name}</MenuItem>
                    ))}
                    </Select>
            </FormControl>
          </Grid>

          <Grid item className={classes.gridItem}>
      <OutlinedTextField
          on_change={(e) => this.onChange(e, "description")}
          value={this.state.description}
          // error={errors.subject}
          id="descripton"
          type="textarea"
          className={classnames("", {
            invalid: errors.name
          })}
          labelname="Deskripsi"
          html_for="description"
          label_classname={classes.inputLabel}
          span_classname={classes.errorInfo}
          multiline={true}
          // error1={errors.subject}
        />
      </Grid>
      <Grid item container direction="row" className={classes.gridItem} alignItems="center">
      <input
          type="file"
          multiple={true}
          name="lampiran"
          onChange={this.handleLampiranUpload}
          ref={this.tugasUploader}
          accept="file/*"
          style={{display: "none"}}/>
        <input
          type="file"
          multiple={true}
          name="file"
          id="file"
          ref={this.uploadedTugas}
          style={{display: "none"}}/>
          <Grid item container direction="row" alignItems="center">
          <Grid item xs={11} onClick={this.handleClickMenu}>
            <OutlinedTextField
              disabled={true}
              value={fileLampiran ? `${fileLampiran.length} berkas (Klik untuk melihat)` : "Kosong"}
              id="file_tugas"
              type="text"
              width="100%"
              labelname="Berkas Lampiran"
              html_for="Berkas lampiran"
              label_classname={classes.inputLabel}
              pointer= {true}/>
              
            </Grid>
            <StyledMenu
              id="fade-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleCloseMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            >
              {listFileChosen()}
            </StyledMenu>
            <Grid item xs={1}>
            <LightTooltip title="Tambahkan berkas lampiran">
            <IconButton onClick={() => {this.tugasUploader.current.click()}}> 
              <PostAddIcon/>
             </IconButton>
             </LightTooltip>
            </Grid>
            </Grid>
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
                        backgroundColor: "#61BD4F",
                          color: "white",
                          width: "100%",
                          marginTop: "20px",
                      }}
                    >
                      Sunting Tugas
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
              <b>Anda tidak punya izin untuk menyunting Tugas</b>
            </Typography>
            </div>
            );
        }
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
    viewOneTask : PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    getAllSubjects: PropTypes.func.isRequired,
    tasksCollection: PropTypes.object.isRequired,
    classesCollection: PropTypes.object.isRequired,
    subjectsCollection: PropTypes.object.isRequired,
    viewClass: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    errors: state.errors,
    auth: state.auth,
    tasksCollection: state.tasksCollection,
    classesCollection: state.classesCollection,
    subjectsCollection: state.subjectsCollection
    // name: state.name,
    // subject: state.subject,
    // deadline: state.deadline
})

export default connect(
    mapStateToProps, { viewOneTask, updateTask, viewClass, getAllSubjects }
) (withStyles(styles)(EditTask))