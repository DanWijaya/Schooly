import React, { useEffect, useState } from "react";
import * as queryString from "query-string";
import { Redirect } from "react-router-dom";
import { setDropboxToken } from "../../actions/UserActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";

function DropboxAuth(props) {

  const [tokenSaved, updateTokenSaved] = useState(false);
  const { setDropboxToken } = props;
  
  useEffect(() => {
    const accessToken = queryString.parse(window.location.hash).access_token;
    setDropboxToken(accessToken)
    updateTokenSaved(true)
  }, [setDropboxToken])

  return tokenSaved ? <Redirect to="/dropbox-connect"/> : null;
  
}

DropboxAuth.propTypes = {
  auth: PropTypes.object.isRequired,
  setDropboxToken: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(
  mapStateToProps, { setDropboxToken }
)(DropboxAuth);

// export default DropboxAuth;