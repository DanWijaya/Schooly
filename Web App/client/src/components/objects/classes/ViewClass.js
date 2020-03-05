import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import Axios from 'axios';

class ViewClass extends Component {
    constructor(props) {
        super(props);
        this.state = { classesCollection: []};

    }

    // componentDidMount() {
    //     Axios.get('/api/classes/view')
    //         .then(res => {
    //             console.log("Berhasil");
    //             this.setState({ classesCollection: res.data});
    //         })
    //         .catch((err) => console.log("Error hak"))
    // }


    dataTable() {
        return this.state.classesCollection.map((data, i) => {
            return <DataTable obj={data} key={i}/>;
        });
    }

    render() {
        return( 
            <div className="wrapper-classes">
            <div className="container">
                <table className="table table-striped table-dark">
                    <thead className="thead-dark">
                        <tr>
                            <td>Name</td>
                            <td>Nihil</td>
                            <td>Walikelas</td>
                            <td>UKuran</td>
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

export default ViewClass;