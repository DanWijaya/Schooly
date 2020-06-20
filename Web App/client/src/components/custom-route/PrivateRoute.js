import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  const [firstTime, setFirstTime] = React.useState(true);
if(firstTime){
    rest.setLoggedIn(auth.isAuthenticated)
    setFirstTime(false)
}
  return (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        <Component {...props} handleMarginTopValue={rest.handleMarginTopValue}/>
      ) : (
        <Redirect to="/masuk" />
      )
    }
  />
)}
;

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
