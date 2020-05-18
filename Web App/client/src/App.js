import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/AuthActions";
import { Provider } from "react-redux"; //provide state from Store to the component
import store from "./Store";
import {drawerWidth}  from "./components/misc/nav-bar/NavBar";
import Profile from "./components/layout/profile/Profile";
import About from "./components/layout/about/About";
import Landing from "./components/layout/landing/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/layout/dashboard/Dashboard.js";
import NavBar from "./components/misc/nav-bar/NavBar";
import Backdrop from "../src/components/misc/back-drop/Backdrop";
import CreateClass from "./components/objects/classes/CreateClass"
import CreateTask from "./components/objects/tasks/CreateTask";
import ViewClass from "./components/objects/classes/ViewClass";
import ViewTask from "./components/objects/tasks/ViewTask";
import EditTask from "./components/objects/tasks/EditTask";
import EditClass from "./components/objects/classes/EditClass";
import NewTask from "./prototypes/NewTask";
import ClassSubjectList from "./prototypes/ClassSubjectList";
import UploadImageTest from './prototypes/UploadImageTest';
import Notifications from './prototypes/Notifications';

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
    loggedIn: false,
    posts: []
  };

  myCallback = (dataFromChild) => {
    this.setState({ sideDrawerOpen: dataFromChild, firstTimeRendered: false})
  }

  // Bascically run this whenever user logs in or logs out.
  setLoggedIn = (dataFromChild) => {
    this.setState({ loggedIn : dataFromChild})
  }

  //38:55
  backdropClickHandler = () => {
    this.setState({sideDrawerOpen: false});
  }

  render() {
    console.log(drawerWidth)
    // let sideDrawer;
    console.log(this.state.sideDrawerOpen)
    let backdrop;
    let translateXValue

    if(this.state.sideDrawerOpen){
      // sideDrawer = <SideDrawer/>
      backdrop = <Backdrop click={this.backdropClickHandler}/>
    }

    return (
      <div>
       <Provider store={store}>
        <Router>
          <NavBar callbackFromParent={(data) => this.myCallback(data)}/>
          {(this.state.sideDrawerOpen ) ? translateXValue = `${drawerWidth}px` : translateXValue = "0px"}
          <div className="App" style={{ marginLeft: `${translateXValue}` }}>
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/about-schooly" component={About} />
            <Route exact path="/new-task" component={NewTask} /> {/*prototypetest*/}
            <Route exact path="/class-subject-list" component={ClassSubjectList} /> {/*prototypetest*/}
            <Route exact path="/profile/:id" component={Profile} /> {/*Delete later, enable private routing*/}
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/notifications" component={Notifications}/>
            {/* <Route exact path="/setting" component={Setting}/> */}

            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/image-upload" component={UploadImageTest}/>
              {/*<PrivateRoute exact path="/profile" component={Profile} />*/}

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
      </div>
    );
  }
}
export default App;
