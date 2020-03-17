import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import TaskDataTable from './TaskDataTable';
import { viewTask, deleteTask } from '../../../actions/TaskActions'

class ViewTask extends Component {
    constructor(props) {
        super(props);
        this.state = { tasksCollection: []}
        
        console.log(this.props.location)
        if(this.props.location.state != null){
            const { taskId } = this.props.location.state
            console.log(taskId)
        }
    }
    
    UNSAFE_componentWillReceiveProps(nextProps) {
        // console.log(nextProps.location.state)
        // console.log(nextProps.tasksCollection);
        if(nextProps.location.state != null){
            const { taskId } = nextProps.location.state;
            this.props.deleteTask(taskId, nextProps.history)
            this.props.viewTask()
        }
        
        if(nextProps.tasksCollection){
            this.setState({ tasksCollection: nextProps.tasksCollection})
        }
    }


    dataTable(){

        const { tasksCollection } = this.state;
        if(tasksCollection.length == 0)
            this.props.viewTask();
        
            return this.state.tasksCollection.map((data, i) => {
                return <TaskDataTable obj={data} key={i} style={{overflow: "auto"}}/>;            })
    }
    
    
    render() {

        return( 
            <div className="wrapper-taskCollection">
            <div className="container">
                <h3 align="center">List of tasks</h3>
                <table className="table table-striped table-dark" style={{ marginTop: 20}}>
                    <thead className="thead-dark">
                        <tr>
                            <th style={{textAlign: "center"}}>Name</th>
                            <th style={{textAlign: "center"}}>Subject</th>
                            <th style={{textAlign: "center"}}>Deadline</th>
                            <th style={{textAlign: "center"}}>Submitted</th>
                            <th colSpan="2" style={{textAlign: "center"}}>
                                Action 
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.dataTable()}
                    </tbody>
                </table>
            </div>
        </div>
        )
    }
}

ViewTask.propTypes = {
    viewTask: PropTypes.func.isRequired,
    tasksCollection: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
}

// If your mapStateToProps function is declared as taking one parameter, 
// it will be called whenever the store state changes, and given the store state as the only parameter.
const mapStateToProps = state => (
    {
        tasksCollection: state.tasksCollection,
        errors: state.errors
    }
)

export default connect(
    mapStateToProps, 
    { viewTask , deleteTask}
) (ViewTask)