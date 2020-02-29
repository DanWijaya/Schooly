import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";


import Profile from "./components/auth/Profile";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import NavBar from './components/NavBar/NavBar';
import BackDrop from '../src/Backdrop/Backdrop';
import "./App.css";
import SideDrawer from "./components/SideDrawer/SideDrawer";
import SideBar from "../src/components/SideDrawer/SideBar";

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
    window.location.href = "./login";
  }
}
class App extends Component {

  state = {
    sideDrawerOpen: false
  };

  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return {sideDrawerOpen: !prevState.sideDrawerOpen};
    });
  };

  //38:55
  backdropClickHandler = () => {
    this.setState({sideDrawerOpen: false});
  }

  render() {
    // let sideDrawer;
    let backdrop;

    if(this.state.sideDrawerOpen){
      // sideDrawer = <SideDrawer/>
      backdrop = <BackDrop click={this.backdropClickHandler}/>
    }
    return (
      <div style={{height: '100%'}}>
        <NavBar drawerClickHandler={this.drawerToggleClickHandler}/>
        <SideDrawer show={this.state.sideDrawerOpen}/>
        <br/><br/><br/><br/>
       <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Landing} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </Router>
      </Provider>
        {backdrop}
        {/* <main style={{marginTop: '64px'}}>
          <p>This is the page content!</p>
        </main> */}
      </div>
    );
  }
}
export default App;

{/* <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </Router>
      </Provider> */}
