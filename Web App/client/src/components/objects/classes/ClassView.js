import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";

class ClassView extends Component {
    constructor() {
        super();
        this.state = {
            isAuthenticated: false,
            errors: {},
        }
    }

    componentDidMount() {
        // If logged in, then it allows user to 
    }


}

ClassView.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth
});