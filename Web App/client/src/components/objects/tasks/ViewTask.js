import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import TaskDataTable from './TaskDataTable';
import { viewTask, deleteTask } from '../../../actions/TaskActions'
import { Modal, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewTask.css'
class ViewTask extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            tasksCollection: [],
            show: false,
            isDelete: false
        }
        
    }
    
    showModal(){
        this.setState({show: true})
    }

    closeModal(){
        this.setState({ show: false, isDelete: false})
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.location.state != null){
            this.showModal()

            if(this.state.isDelete){
                const { taskId } = nextProps.location.state;
                this.props.deleteTask(taskId, nextProps.history)
                this.closeModal()
            }

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
            <Modal show={this.state.show} onHide={() => {this.closeModal()}}>
            <Modal.Header>Deleting Task {this.props.tasksCollection.name} <Link to="/viewtask" class="close" onClick={() => {this.closeModal()}}>
                <span aria-hidden="true">x</span>
                <span class="sr-only">Close</span>
                </Link></Modal.Header>
            <Modal.Body> Are you sure you want to delete the task? </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-danger" onClick={() => { 
                    this.setState({isDelete: true, show:false})}
                }>
                    Yes, Delete
                </Button>

                <Link to="/viewtask" className="btn btn-primary" onClick={() => { this.closeModal()}
                }>
                    No, Cancel
                </Link>
            </Modal.Footer>
            </Modal>
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