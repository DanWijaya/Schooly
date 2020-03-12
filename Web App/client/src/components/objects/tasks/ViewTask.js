import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import TaskDataTable from './TaskDataTable';
import { viewTask } from '../../../actions/TaskActions'

class ViewTask extends Component {
    constructor(props) {
        super(props);
        this.state = { tasksCollection: []}

    }

    dataTable(){

        const { tasksCollection } = this.state;
        if(tasksCollection.length == 0)
            this.props.viewTask();
        
            return this.state.tasksCollection.map((data, i) => {
                return <TaskDataTable obj={data} key={i}/>;            })
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
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => (
    {
        tasksCollection: state.tasksCollection,
        errors: state.errors
    }
)

export default connect(
    mapStateToProps, 
    { viewTask }
) (ViewTask)