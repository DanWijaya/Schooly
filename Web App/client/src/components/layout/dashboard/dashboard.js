import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
<<<<<<< HEAD:Web App/client/src/components/layout/dashboard/dashboard.js
import { logoutUser } from "../../../actions/authActions";
import NavBar from "../../misc/navBar/navBar";
import SideDrawer from "../../misc/sideDrawer/sideDrawer";

=======
import { logoutUser } from "../../actions/authActions";
import NavBar from "../NavBar/NavBar";
import SideDrawer from "../SideDrawer/SideDrawer";
import SideBar from '../SideDrawer/SideBar'
>>>>>>> 838a7926c3155c7e10660cc411c9b5ace6bb4c58:Web App/client/src/components/dashboard/Dashboard.js
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
<<<<<<< HEAD:Web App/client/src/components/layout/dashboard/dashboard.js

=======
    document.body.style.background = "white"
>>>>>>> 838a7926c3155c7e10660cc411c9b5ace6bb4c58:Web App/client/src/components/dashboard/Dashboard.js
    return (
      
      <div>
          <div style={{ height: "75vh"}} className="container valign-wrapper">

            <div className="landing-copy col s12 center-align">
              <h4>
                <b>Hey there, </b> {user.name.split(" ")[0]}
                <p className="flow-text grey-text text-darken-1">
                  You are logged into our Schooly Web app! {" "}
                  <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏
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
