import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { createTask } from "../../../actions/TaskActions"
import moment from "moment";
import { SingleDatePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

class CreateTask extends Component {
    constructor() {
        super();

        this.state = {
            name: '',
            subject: '',
            deadline: moment(),
            focused: false,
            submitted: false,
            errors: {}
        };
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value});
    }

    onSubmit = (e) => {
        e.preventDefault();

        const taskObject = {
            name: this.state.name,
            deadline: moment().toDate(),
            subject: this.state.subject,
            submitted: this.state.submitted,
            errors: {}
        };

        this.props.createTask(taskObject);
        this.setState({name: '', subject: ''})

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

    render() {
        document.title = "Schooly - Create Task"
        const { errors } = this.state;

        return(

        <div className="container">
          <div className="col s8 offset-s2">
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Fill up Task details to add class</b>
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
                <label htmlFor="name">Name</label>
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
                  id="subject"
                  type="text"
                  className={classnames("", {
                    invalid: errors.subject
                  })}
                />
                <label htmlFor="subject">Subject</label>
                <span className="red-text">{errors.subject}</span>
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
                  Add Task
                </button>
              </div>
            </form>
          </div>
      </div>
                  );
    }
}

CreateTask.propTypes = {
    createTask: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors
})

export default connect(
  mapStateToProps, { createTask }
) (CreateTask)

