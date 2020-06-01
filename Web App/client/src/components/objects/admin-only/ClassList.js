import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { viewClass, deleteClass } from "../../../actions/ClassActions"
import { Modal, Button } from 'react-bootstrap';
import './ClassList.css'

function ClassDataView(props) {
  return(
    <tr>
      <td style={{textAlign: "center"}}>
        {props.obj.name}
      </td>
      <td style={{textAlign: "center"}}>
        {props.obj.walikelas.name}
      </td>
      <td style={{textAlign: "center"}}>
        {props.obj.ukuran}
      </td>
      <td style={{textAlign: "center"}}>
        {props.obj.nihil.toString()}
      </td>
      <td style={{textAlign: "center"}}>
        <Link
          to={{
            pathname: `/class/${props.obj._id}`,
            state:{ classId : props.obj._id}
          }}
          className="btn btn-primary"
        >
          Edit
        </Link>
      </td>
      <td style={{textAlign: "center"}}>
        <Link
          to={{
            pathname: `/deleteclass/${props.obj._id}`,
            state:{classId : props.obj._id}
          }}
          className="btn btn-danger"
        >
          Delete
        </Link>
      </td>
    </tr>
  )
}

class ClassList extends Component {
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
    if(this.props.classesCollection.length - nextProps.classesCollection.length === 1)
        this.closeModal()
    if(nextProps.classesCollection)
        this.setState({ classesCollection: nextProps.classesCollection})
  }

  deletePopWindow = () => {
    return (
      <Modal style={{marginTop: '200px'}} show={this.state.show} onHide={() => {this.closeModal()}}>
        <Modal.Header>Deleting Class {this.props.classesCollection.name}
          <Link to="/classdatatable" class="close" onClick={() => {this.closeModal()}}>
            <span aria-hidden="true">x</span>
            <span class="sr-only">Close</span>
          </Link>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the class?
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-danger" onClick={() => {
              this.setState({isDelete: true, show:false})
              this.props.viewClass()}
          }>
            Yes, Delete
          </Button>
          <Link to="/classdatatable" className="btn btn-primary" onClick={() => { this.closeModal()}}>
            No, Cancel
          </Link>
        </Modal.Footer>
      </Modal>
      )
    }

  dataTable() {
    const { classesCollection } = this.state;
    if(classesCollection.length == 0)
        this.props.viewClass();

    console.log(this.state.classesCollection)
    return this.state.classesCollection.map((data, i) => {
        return <ClassDataView obj={data} key={i}/>;
    });
  }

  render() {
    const { user } = this.props.auth;

    if( user.role == "Teacher") {
      return(
        <div className="wrapper-classesCollection">
            {this.deletePopWindow()}
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
        )}
    else if (user.role =="Student") {
      return(
        <div style={{ marginLeft: '250px'}}>
          <h1 style={{ alignItems : 'center'}}> Your class is <b>{user.kelas.name}</b></h1>
        </div>
      )}
  }
}

ClassList.propTypes = {
    viewClass: PropTypes.func.isRequired,
    classesCollection: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    deleteClass: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

// If your mapStateToProps function is declared as taking one parameter,
// it will be called whenever the store state changes, and given the store state as the only parameter.
const mapStateToProps = state => ({
    errors: state.errors,
    classesCollection: state.classesCollection,
    auth: state.auth
})

export default connect(
    mapStateToProps,
    { viewClass, deleteClass }
) (ClassList)
