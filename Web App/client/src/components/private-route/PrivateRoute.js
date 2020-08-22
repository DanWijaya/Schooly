import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, handleSideDrawerExist, auth, access, ...rest }) => {
  return (
<Route
  {...rest}
  render={props =>
    auth.isAuthenticated === true ?
    !access || access.indexOf(auth.user.role) !== -1 ? (
      <Component {...props} 
      handleSideDrawerExist={handleSideDrawerExist}/>
    ) 
    : <Redirect to="/tidak-ditemukan"/>
    : (<Redirect to="/masuk" />)
  }
/>
);
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
