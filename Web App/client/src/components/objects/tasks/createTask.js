import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { createTask } from "../../../actions/taskActions"

class CreateTask extends Component {
    constructor() {
        super();

        this.state = {
            name: '',
            deadline: null,
            subject: '',
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
            deadline: this.state.deadline,
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
                <input
                  onChange={this.onChange}
                  value={this.state.deadline}
                  error={errors.deadline}
                  id="deadline"
                  type="Date"
                  className={classnames("", {
                    invalid: errors.deadline
                  })}
                />
                <label htmlFor="deadline">Deadline</label>
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
                    marginTop: "1rem"
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

