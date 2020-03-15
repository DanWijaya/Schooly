import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import ClassDataTable from './ClassDataTable';
import { viewClass } from "../../../actions/ClassActions"

class ViewClass extends Component {
    constructor(props) {
        super(props);
        this.state = { classesCollection: []}
    }

    // componentDidMount(nextProps) {
    //     console.log("Receive")
    //     console.log(nextProps.classesCollection.classesCollection);
    //     if(!nextProps.classesCollection.classesCollection)
    //         this.setState({ classesCollection: nextProps.classesCollection});
    // }

    // componentDidUpdate(nextProps){
    //     console.log("Props is received");
    //     if(nextProps.classesCollection) {
    //         this.setState({ classesCollection: nextProps.classesCollection})
    //     }
    // }
    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log("Props is received");
        if(nextProps.classesCollection) {
            this.setState({ classesCollection: nextProps.classesCollection})
        }
    }

    // onSearch = (e) => {
    //     e.preventDefault();

    //     this.props.viewClass();
    // }

    dataTable() {
        const { classesCollection } = this.state;
        if(classesCollection.length == 0)
            this.props.viewClass();

        return this.state.classesCollection.map((data, i) => {
            return <ClassDataTable obj={data} key={i}/>;
        });
    }

    render() {

        return( 
            <div className="wrapper-classesCollection">
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
    errors: PropTypes.object.isRequired
}

// If your mapStateToProps function is declared as taking one parameter, 
// it will be called whenever the store state changes, and given the store state as the only parameter.
const mapStateToProps = state => ({
    errors: state.errors,
    classesCollection: state.classesCollection
})

export default connect(
    mapStateToProps, 
    { viewClass }
) (ViewClass)