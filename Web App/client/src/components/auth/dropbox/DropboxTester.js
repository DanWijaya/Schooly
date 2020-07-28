import React, { useState } from "react";
// import { tokenUrl } from "../getToken";
import { tokenUrl } from "../../../utils/getDropboxToken"
import { Redirect } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { Dropbox } from "dropbox";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  containerLogin: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "relative",
  }
}));

function ConnectDropbox() {
  const classes = useStyles();

  // const [connected, setConnected] = useState(true);

  let dropbox = new Dropbox({ fetch: fetch, accessToken: "uj_hS4Qew-AAAAAAAAABWRne3UW1-W-eoolaHez_5MIEqUOG0wWUFPMR7UboXZtt" });
  dropbox.filesListFolder({ path: '' }).then((response) => {
    console.log('resonse.entries', response.entries);
  }).catch((err) => {
    console.log("Terjadi error")
});

  console.log(localStorage.dropbox_token)
  // uj_hS4Qew-AAAAAAAAABWNnveSE2fjlII7AVZkvKfUvg0Sg4ahdeAJz004hJYIHj
  if(localStorage.dropbox_token){
    return(
      <div className="container-login">
        <h1>Sudah terhubung</h1>
      </div>
    ) 
  }
  else {
    return (
      <div className="container-login">
        <h1>CLOUD STORAGE</h1>
        <p>Cloud storage is a cloud computing model in which data is stored on remote servers accessed from the internet, or “cloud.” It is maintained, operated and managed by a cloud storage service provider on a storage servers that are built on virtualization techniques</p>
        <a href={tokenUrl}>Hubungkan ke Dropbox</a>
      </div>
    )
  }
};

ConnectDropbox.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
})

export default connect(
  mapStateToProps
)(ConnectDropbox);

