import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import moment from "moment";
import { SingleDatePicker } from "react-dates";
import { editTask, updateTask } from "../../../actions/TaskActions";
import { Multiselect } from "multiselect-react-dropdown";
import { InputLabel } from "@material-ui/core";
// import { viewTask } from "../../../actions/TaskActions"

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

        const { taskId } = this.props.location.state;
        this.props.editTask(taskId)
    }

    onChange = (e) => {
        this.setState({ [e.target.id] : e.target.value});
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
                deadline: moment(nextProps.tasksCollection.deadline),
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

        const { taskId } = this.props.location.state;
        const taskObject = {
            name: this.state.name,
            deadline: this.state.deadline,
            subject: this.state.subject,
            class_assigned: this.state.class_assigned,
            errors: {}
        }

        this.props.updateTask(taskObject, taskId, this.props.history);
    }

    // focus = () =>{
    //     this.nameInput.current.click();
    //     this.subjectInput.current.click()
    // }
    render() {
        document.title = "Schooly - Edit Task"
        const { errors } = this.state;

        const options = [
            {
              name: "X A",
              id: "X A"
            },
            {
              name: "X B",
              id: "X B"
            },
            {
              name: "XI A",
              id: "XI A"
            },
            {
              name: "XI B",
              id: "XI B"
            },
            {
              name: "XII A",
              id: "XII A"
            },
            {
              name: "XII B",
              id: "XII B"
            },

          ]
        return (
            <div className="container">
                <div className="col s8 offset-s2">
                    <div className="col s12" style={{ paddingLeft: "11.250px"}}>
                        <h4>
                         <b>Edit task</b>
                        </h4>
                    </div>
                    <form noValidate onSubmit={this.onSubmit}>
                    <div className="input-field col s12">
                        <input
                            onChange={this.onChange}
                            value={this.state.name}
                            error={errors.name}
                            id="name"
                            type="text"
                            className={classnames("", {
                                invalid: errors.name
                            })}
                        />
                        {/* <label htmlFor="name" class="active">Name</label> */}
                        {/* This is another solution */}
                        {this.state.name === "" ?
                    <label htmlFor="name">Name</label> :
                    <label htmlFor="name" class="active">Name</label>}
                        <span className="red-text">{errors.name}</span>
                    </div>


                    <div className="input-field col s12">
                      Deadline <SingleDatePicker
                        id="deadline"
                        date={this.state.deadline}
                        onDateChange={(date) => this.setState({ deadline : date})}
                        focused={this.state.focused}
                        onFocusChange={({focused}) => this.setState({ focused})}
                        />

                    {/* <label htmlFor="deadline">Deadline</label> */}
                    <span className="red-text">{errors.deadline}</span>
                    </div>

                    <div className="input-field col s12">
                    <input
                    onChange={this.onChange}
                    value={this.state.subject}
                    error={errors.subject}
                    ref={this.subjectInput}
                    id="subject"
                    type="text"
                    className={classnames("", {
                        invalid: errors.subject
                    })}
                    />
                    {/* <label htmlFor="subject" class="active">Subject</label> */}
                   {/* This is another solution, might not an elegant solution...  */}
                   {this.state.subject === "" ?
                    <label htmlFor="subject">Subject</label> :
                    <label htmlFor="subject" class="active">Subject</label>}
                    <span className="red-text">{errors.subject}</span>
                    </div>

                    <div className=" col s12">
                        <InputLabel id="class-assigned">Classes assigned</InputLabel>
                        <Multiselect id="class_assigned" options={options} selectedValues={this.state.class_assigned} onSelect={this.onSelect}
                        onRemove={this.onRemove} value displayValue="name" error={errors.class_assigned} showCheckBox={true}
                        className={classnames("", {
                            invalid: errors.class_assigned
                        })}/>
                    </div>

                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <button
                    style={{
                        width: "150px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem",
                        zIndex: 0
                    }}
                    type="submit"
                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                    >
                    Edit Task
                    </button>
                    </div>
                </form>
            </div>
        </div>
        )
    }

}

EditTask.propTypes = {
    errors: PropTypes.object.isRequired,
    editTask : PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    tasksCollection: PropTypes.object.isRequired,
    // editedId: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    errors: state.errors,
    tasksCollection: state.tasksCollection
    // name: state.name,
    // subject: state.subject,
    // deadline: state.deadline
})

export default connect(
    mapStateToProps, { editTask, updateTask}
) (EditTask)
