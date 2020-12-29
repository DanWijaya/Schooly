import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux"; //provide state from Store to the component
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import store from "./Store";

import { ThemeProvider } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
//Routing and Actions
import { setCurrentUser, logoutUser, setDropboxToken } from "./actions/UserActions";
import PrivateRoute from "./components/private-route/PrivateRoute";
//Auth
import Register from "./components/auth/register/Register";
import Login from "./components/auth/login/Login";
import LoginForgot from "./components/auth/login/LoginForgot";
import ResetPassword from "./components/auth/reset-password/ResetPassword";
//Layout

//Misc
import { globalStyles } from "./components/misc/global-styles/GlobalStyles";
import NavBar from "./components/misc/nav-bar/NavBar";
import SideDrawer from "./components/misc/side-drawer/SideDrawer";

//Class
import Store from "./components/objects/store/Store";
//Material
import CreateFileSharing from "./components/objects/file-sharing/CreateFileSharing";
import EditFileSharing from "./components/objects/file-sharing/EditFileSharing";
import ViewMaterial from "./components/objects/file-sharing/ViewFileSharing";
import FileSharing from "./components/objects/file-sharing/FileSharingList";

//Landing
import Landing from "./components/layout/landing/Landing";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./masuk";
  }
}

if (localStorage.dropbox_token) {
  const dropbox_token = localStorage.dropbox_token;
  console.log(dropbox_token)
  store.dispatch(setDropboxToken(dropbox_token));
}

class App extends Component {

  state = {
    mobileOpen: false,
    desktopOpen: false,
    loggedIn: false,
    marginTopValue: 20,
    posts: [],
    sideDrawerExist: true
  };

  //Drawer at Mobile View Hooks
  handleDrawerMobile = () => {
    this.setState(prevState => ({mobileOpen: !prevState.mobileOpen }))
  };

  //Drawer at Desktop View Hooks
  handleDrawerDesktop = () => {
    this.setState(prevState => ({desktopOpen: !prevState.desktopOpen }))
  };

  handleMarginTopValue = (dataFromChild) => {
    this.setState({ marginTopValue: dataFromChild })
  }

  // Bascically run this whenever user logs in or logs out.
  setLoggedIn = (dataFromChild) => {
    this.setState({ loggedIn : dataFromChild})
  }

  handleSideDrawerExist = (dataFromChild) => {
    this.setState({ sideDrawerExist: dataFromChild})
  }

  render() {
    console.log(localStorage.getItem(`status`))
    return (
      <div>
        <Provider store={store}>
          <ThemeProvider theme={globalStyles}>
            <Router>
              <div style={{display: "flex"}}>
                <NavBar
                  handleDrawerDesktop={this.handleDrawerDesktop}
                  handleDrawerMobile={this.handleDrawerMobile}
                  sideDrawerExist={this.state.sideDrawerExist}
                  assessmentState={localStorage.getItem(`status`)}
                />
                {(this.state.sideDrawerExist && localStorage.getItem(`status`) !== "ujian") ?
                  <SideDrawer
                    mobileOpen={this.state.mobileOpen}
                    desktopOpen={this.state.desktopOpen}
                    handleDrawerMobile={this.handleDrawerMobile}
                  /> :
                  null
                }
                <div style={{flexGrow: "1", overflowX: "hidden", marginTop: `${this.state.marginTopValue}px`}}>
                  <Toolbar />
                  <Switch>
                    <Route exact path="/"
                      render={(props) => (
                        <Landing {...props} handleMarginTopValue={(data) => this.handleMarginTopValue(data)} />
                      )}
                    />
                    <Route exact path="/daftar" component={Register} />
                    <Route exact path="/masuk" component={Login} />
                    <Route exact path="/akun/lupa-katasandi" component={LoginForgot} />
                    <Route exact path="/akun/ubah-katasandi/:hash" component={ResetPassword}/>
                    <PrivateRoute exact access={["Teacher", "Admin"]} path="/store" component={Store} />

                    {/* Route Course Materials */}
                    <PrivateRoute exact access={["Teacher"]} path="/buat-FileSharing" component={CreateFileSharing} />
                    <PrivateRoute exact access={["Teacher"]} path="/sunting-FileSharing/:id" component={EditFileSharing} />
                    <PrivateRoute exact access={["Student", "Teacher"]} path="/File Sharing/:id" component={ViewMaterial} />
                    <PrivateRoute exact access={["Student", "Teacher"]} path="/daftar-FileSharing" component={FileSharing} />
                    {/* Not Found */}
                  </Switch>
                  {/* <Footer assessmentState={localStorage.getItem(`status`)}/> */}
                </div>
              </div>
            </Router>
          </ThemeProvider>
        </Provider>
      </div>
    );
  }
}

export default App;
