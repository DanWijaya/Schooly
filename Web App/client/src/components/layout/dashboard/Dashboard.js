import React, { Component } from "react";
// For working with Reducers
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../../actions/AuthActions";

// import NavBar from "../../misc/nav-bar/NavBar";
// import SideDrawer from "../../misc/side-drawer/SideDrawer";

class Dashboard extends Component {

    constructor(props) {
      super(props);
      this.state = {
          sidebarOpen: true
      };
    }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    document.body.style.background = "white"
    
    return (
      <div>
          <div style={{ height: "75vh"}} className="container valign-wrapper">

            <div className="landing-copy col s12 center-align">
              <h4>
                <b>Hey there {user.role} </b> {user.name.split(" ")[0]}
                <p className="flow-text grey-text text-darken-1">
                  You are logged into our Schooly Web app 👏! {" "}
                  {/* <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏 */}
                </p>
              </h4>
              <button
                style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem"
                }}
                onClick={this.onLogoutClick}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Logout
              </button>
            </div>
          {/* </div> */}
          </div>
          </div>
    )
  };
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
