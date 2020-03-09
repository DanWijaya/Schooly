import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import Axios from 'axios';
import DataTable from './DataTable';
import { viewClass } from "../../../actions/ClassActions"

class ViewClass extends Component {
    constructor(props) {
        super(props);
        this.state = { classesCollection: []};

    }

    showData() {
        this.dataTable();
    }

    dataTable() {
        return this.state.classesCollection.map((data, i) => {
            return <DataTable obj={data} key={i}/>;
        });
    }

    componentDidMount(){
        
        Axios.get('/api/classes/view')
          .then(response => {
            this.setState({ classesCollection: response.data });
          })
          .catch(function (error) {
            console.log(error);
          })
      }

    render() {
        return( 
            <div className="wrapper-classes">
            <div className="container">
                <h3 align="center">List of Classes</h3>
                <table className="table table-striped table-dark" style={{ marginTop: 20}}>
                    <thead className="thead-dark">
                        <tr>
                            <td>Name</td>
                            <td>Nihil</td>
                            <td>Walikelas</td>
                            <td>Ukuran</td>
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
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    errors: state.errors
})

export default connect(
    mapStateToProps, { viewClass }
) (ViewClass)