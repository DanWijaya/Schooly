import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const CustomRoute = ({ component: Component, auth, ...rest }) => {

const [firstTime, setFirstTime] = React.useState(true);
console.log("CUSTOm Route")
if(firstTime){
    console.log("AA")
    console.log(rest)
    rest.setLoggedIn(auth.isAuthenticated)
    setFirstTime(false)
}
return (
  <Route
    {...rest}
    render={props =>
        <Component {...props} handleMarginTopValue={rest.handleMarginTopValue}/>
    }
  />
)
};

CustomRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(CustomRoute);
