//IMPORT COMPONENTS
  //Basic Components and Styling Components
import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

  //Authentication Components
import { setCurrentUser, logoutUser } from "./actions/AuthActions";
import { Provider } from "react-redux";
import store from "./Store";

import Profile from "./components/layout/profile/Profile";
import About from "./components/layout/about/About";
import Landing from "./components/layout/landing/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/layout/dashboard/Dashboard.js";
import NavBar from "./components/misc/nav-bar/NavBar";
import Backdrop from '../src/components/misc/back-drop/Backdrop';
import SideDrawer from "./components/misc/side-drawer/SideDrawer"
import CreateClass from "./components/objects/classes/CreateClass"
import CreateTask from "./components/objects/tasks/CreateTask";
import ViewClass from "./components/objects/classes/ViewClass";
import ViewTask from "./components/objects/tasks/ViewTask";
import EditTask from "./components/objects/tasks/EditTask";
import EditClass from "./components/objects/classes/EditClass";

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
    sideDrawerOpen: false,
    posts: []
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
      backdrop = <Backdrop click={this.backdropClickHandler}/>
    }
    return (
      <div style={{height: '100%'}}>
        <NavBar drawerClickHandler={this.drawerToggleClickHandler}/>
        {/* <SideDrawer show={this.state.sideDrawerOpen}/> */}
       <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Landing} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/about-schooly" component={About} />
            {/* <Route exact path="/setting" component={Setting}/> */}
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />

              {/* Route Class */}
              <PrivateRoute exact path="/createclass" component={CreateClass}/>
              <PrivateRoute exact path="/viewclass" component={ViewClass}/>
              <PrivateRoute exact path="/class/:id" component={EditClass}/>
              <PrivateRoute exact path="/deleteclass/:id" component={ViewClass}/>

              {/* Route Task  */}
              <PrivateRoute exact path="/createtask" component={CreateTask}/>
              <PrivateRoute exact path="/viewtask" component={ViewTask}/>
              <PrivateRoute exact path="/deletetask/:id" component={ViewTask}/>
              <PrivateRoute exact path="/task/:id" component={EditTask}/>
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
