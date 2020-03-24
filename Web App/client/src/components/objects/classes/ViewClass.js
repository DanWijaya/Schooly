import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import ClassDataTable from './ClassDataTable';
import { viewClass, deleteClass } from "../../../actions/ClassActions"
import { Modal, Button } from 'react-bootstrap';
import './ViewClass.css'

class ViewClass extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            classesCollection: [], 
            show: false,
            isDelete: false
        }
    }

    showModal(){
        this.setState({ show: true})
    }

    closeModal(){
        this.setState({ show: false, isDelete: false})
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextState) {

        if(nextProps.location.state){
            if(!this.state.isDelete)
                this.showModal()
            else{
                const { classId } = nextProps.location.state;
                this.props.deleteClass(classId, nextProps.history)
                this.props.viewClass()
            }
        }

        if(this.props.classesCollection.length - nextProps.classesCollection.length == 1)
            this.closeModal()
        
        if(nextProps.classesCollection)
            this.setState({ classesCollection: nextProps.classesCollection})

    }

    dataTable() {
        const { classesCollection } = this.state;
        if(classesCollection.length == 0)
            this.props.viewClass();

        console.log(this.state.classesCollection)
        return this.state.classesCollection.map((data, i) => {
            return <ClassDataTable obj={data} key={i}/>;
        });
    }

    render() {
        return( 
            <div className="wrapper-classesCollection">
            
            <Modal show={this.state.show} onHide={() => {this.closeModal()}}>
            <Modal.Header>Deleting Class {this.props.classesCollection.name} <Link to="/viewclass" class="close" onClick={() => {this.closeModal()}}>
                <span aria-hidden="true">x</span>
                <span class="sr-only">Close</span>
                </Link></Modal.Header>

                <Modal.Body> Are you sure you want to delete the class? </Modal.Body>
                <Modal.Footer>
                <Button className="btn btn-danger" onClick={() => { 
                    this.setState({isDelete: true, show:false})
                    this.props.viewClass()}
                }>
                    Yes, Delete
                </Button>

                <Link to="/viewclass" className="btn btn-primary" onClick={() => { this.closeModal()}
                }>
                    No, Cancel
                </Link>
            </Modal.Footer>
            </Modal>

            <div className="container">
                <h3 align="center">List of Classes</h3>
                <table className="table table-striped table-dark" style={{ marginTop: 20}}>
                    <thead className="thead-dark">
                        <tr>
                            <th style={{textAlign: "center"}}>Name</th>
                            <th style={{textAlign: "center"}}>Walikelas</th>
                            <th style={{textAlign: "center"}}>Ukuran</th>
                            <th style={{textAlign: "center"}}>Nihil</th>
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

ViewClass.propTypes = {
    viewClass: PropTypes.func.isRequired,
    classesCollection: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    deleteClass: PropTypes.func.isRequired
}

// If your mapStateToProps function is declared as taking one parameter, 
// it will be called whenever the store state changes, and given the store state as the only parameter.
const mapStateToProps = state => ({
    errors: state.errors,
    classesCollection: state.classesCollection
})

export default connect(
    mapStateToProps, 
    { viewClass, deleteClass }
) (ViewClass)