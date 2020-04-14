import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import TaskDataTable from './TaskDataTable';
import { viewTask, deleteTask } from '../../../actions/TaskActions'
import { Modal, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewTask.css'
import {Typography} from "@material-ui/core";
import isEmpty from 'is-empty';

class ViewTask extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            tasksCollection: [],
            show: false,
            isDelete: false,
        }
        
    }
    
    
    showModal(){
        this.setState({show: true})
    }

    closeModal(){ // update show and isDelete to false. 
        this.setState({ show: false, isDelete: false})
    }

    UNSAFE_componentWillReceiveProps(nextProps) { // bakal dirun pas cuma props yg berubah... State berubah dia tak dirun...

        if(nextProps.location.state){

            if(!this.state.isDelete) 
                this.showModal()
            else{
                const { taskId } = nextProps.location.state;
                this.props.deleteTask(taskId, nextProps.history)
                this.props.viewTask()
            }
        }

        if(this.props.tasksCollection.length - nextProps.tasksCollection.length == 1) // This is to update state to modal closed and isDelete false when it is already deleted
            this.closeModal()

        console.log(nextProps.tasksCollection)
        if(nextProps.tasksCollection){
            this.setState({ tasksCollection: nextProps.tasksCollection})
        }
    }


    dataTable(){

        const { tasksCollection } = this.state;
        if(tasksCollection.length == 0){
            this.props.viewTask();
        }
        
            return this.state.tasksCollection.map((data, i) => {
                return <TaskDataTable obj={data} key={i} style={{overflow: "auto"}}/>;            })
    }
    
    deletePopWindow = () => {
        return(
        <Modal style={{marginTop: '200px'}} show={this.state.show} onHide={() => {this.closeModal()}}>
            <Modal.Header>Deleting Task <Link to="/viewtask" class="close" onClick={() => {this.closeModal()}}>
                <span aria-hidden="true">x</span>
                <span class="sr-only">Close</span>
                </Link></Modal.Header>
            <Modal.Body> Are you sure you want to delete the task? </Modal.Body>
            <Modal.Footer>
                <Button  className="btn btn-danger" onClick={() => { 
                    this.setState({isDelete: true, show:false})
                    this.props.viewTask()} // ini ada call this.props.viewTask() for the sake function itu dirun... 
                }>
                    Yes, Delete
                </Button>
                <Link to="/viewtask" className="btn btn-primary" onClick={() => { this.closeModal()}
                }>
                    No, Cancel
                </Link>
            </Modal.Footer>
        </Modal>
        )
    }

    render() {

        const { user } = this.props.auth
        if( user.role == "Teacher") {

            return( 
                <div className="wrapper-taskCollection">
                    {this.deletePopWindow()}
                <div className="container">
                    {/* <h3 align="center">List of tasks</h3>
                    <table className="table table-striped table-dark" style={{ marginTop: 20}}>
                        <thead className="thead-dark">
                            <tr>
                                <th style={{textAlign: "center"}}>Name</th>
                                <th style={{textAlign: "center"}}>Subject</th>
                                <th style={{textAlign: "center"}}>Deadline</th>
                                <th style={{textAlign: "center"}}>Assigned Class</th>
                                <th colSpan="2" style={{textAlign: "center"}}>
                                    Action 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.dataTable()}
                        </tbody>
                    </table> */}
                    {this.dataTable()}
                </div>
            </div>
            )
        } else if (user.role == "Student"){
            return (
                <div className="wrapper-taskCollection">
                    <Typography variant="h4" style={{ display: 'flex' , justifyContent : 'center'}}> Here is your due task</Typography>
                    {this.dataTable()}
                </div>
            )
        }
    }
}

ViewTask.propTypes = {
    viewTask: PropTypes.func.isRequired,
    tasksCollection: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

// If your mapStateToProps function is declared as taking one parameter, 
// it will be called whenever the store state changes, and given the store state as the only parameter.
const mapStateToProps = state => (
    {
        auth: state.auth,
        tasksCollection: state.tasksCollection,
        errors: state.errors
    }
)

export default connect(
    mapStateToProps, 
    { viewTask , deleteTask}
) (ViewTask)