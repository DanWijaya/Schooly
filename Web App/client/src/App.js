import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux"; //provide state from Store to the component
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import store from "./Store";
import { ThemeProvider } from "@material-ui/core/styles";
//Routing and Actions
import { setCurrentUser, logoutUser } from "./actions/AuthActions";
import PrivateRoute from "./components/private-route/PrivateRoute";
//Auth
import Register from "./components/auth/register/Register";
import Login from "./components/auth/login/Login";
//Layout
import About from "./components/layout/about/About";
import Dashboard from "./components/layout/dashboard/Dashboard";
import Landing from "./components/layout/landing/Landing";
import NotificationsList from "./components/layout/notifications/NotificationsList";
import Profile from "./components/layout/profile/Profile";
//Misc
import { drawerWidth } from "./components/misc/nav-bar/NavBar";
import { colorPalette } from "./components/misc/color-palette/ColorPalette";
import NavBar from "./components/misc/nav-bar/NavBar";
//Class
import CreateClass from "./components/objects/classes/CreateClass"
import EditClass from "./components/objects/classes/EditClass";
import ViewClass from "./components/objects/classes/ViewClass";
import CreateTask from "./components/objects/tasks/CreateTask";
import EditTask from "./components/objects/tasks/EditTask";
import ViewTask from "./components/objects/tasks/ViewTask";
//Prototypes
import NewTask from "./prototypes/NewTask";
import ClassSubjectList from "./prototypes/ClassSubjectList";
import RegisterTest from "./components/auth/register/RegisterTest";

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

  render() {
    console.log(drawerWidth)
    // let sideDrawer;
    console.log(this.state.sideDrawerOpen)
    let translateXValue

    if(this.state.sideDrawerOpen) {
      translateXValue = drawerWidth
    } else{
      translateXValue = "0px"
    }

    return (
      <div>
       <Provider store={store}>
        <ThemeProvider theme={colorPalette}>
          <Router>
            <NavBar callbackFromParent={(data) => this.myCallback(data)}/>
            <div style={{marginLeft: `${translateXValue}`, marginTop: "30px"}}>
              <Route exact path="/" component={Landing} />
              <Route exact path="/daftar" component={Register} />
              <Route exact path="/masuk" component={Login} />
              <Route exact path="/tentang-schooly" component={About} />
              <Route exact path="/new-task" component={NewTask} /> {/*prototypetest*/}
              <Route exact path="/class-subject-list" component={ClassSubjectList} /> {/*prototypetest*/}
              <Route exact path="/register-test" component={RegisterTest} /> {/*prototypetest*/}
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/profil" component={Profile} />
                <PrivateRoute exact path="/notifikasi" component={NotificationsList} />
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
        </ThemeProvider>
      </Provider>
      </div>
    );
  }
}
export default App;
