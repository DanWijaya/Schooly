import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, handleSideDrawerExist, auth, access, loginRedirect, ...rest }) => {
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
    : (loginRedirect) ? (
      <Redirect
      to={{
        pathname: "/masuk",
        state: {
              // untuk mengarahkan murid ke halaman assessment setelah login 
              url: props.match.url
            }
          }}
        />
    ) : (<Redirect to="/masuk"/>)
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
