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
import LoginForgot from "./components/auth/login/LoginForgot";
//Layout
import About from "./components/layout/about/About";
import Dashboard from "./components/layout/dashboard/Dashboard";
import Landing from "./components/layout/landing/Landing";
import Notifications from "./components/layout/notifications/Notifications";
import Help from "./components/layout/help/Help";
import Profile from "./components/layout/profile/Profile";
//Misc
import { globalStyles } from "./components/misc/global-styles/GlobalStyles";
import { drawerWidth } from "./components/misc/nav-bar/NavBar";
import NavBar from "./components/misc/nav-bar/NavBar";
//Class
import CreateClass from "./components/objects/classes/CreateClass"
import EditClass from "./components/objects/classes/EditClass";
import ViewClass from "./components/objects/classes/ViewClass";
import ViewSubject from "./components/objects/classes/ViewSubject";
//Task
import CreateTask from "./components/objects/tasks/CreateTask";
import EditTask from "./components/objects/tasks/EditTask";
import ViewTask from "./components/objects/tasks/ViewTask";
//Admin Only
import ClassList from "./components/objects/admin-only/ClassList";
//Prototypes
import NewTask from "./prototypes/NewTask";
import NewClassList from "./components/objects/admin-only/NewClassList";
import Tester from "./prototypes/Tester";

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
          <ThemeProvider theme={globalStyles}>
            <Router>
              <NavBar callbackFromParent={(data) => this.myCallback(data)} />
              <div style={{marginTop: "30px", marginLeft: `${translateXValue}`}}>
                <Route exact path="/" component={Landing} />
                <Route exact path="/daftar" component={Register} />
                <Route exact path="/masuk" component={Login} />
                <Route exact path="/lupa-katasandi" component={LoginForgot} />
                <Route exact path="/bantuan" component={Help} />
                <Route exact path="/new-task" component={NewTask} /> {/*prototypetest*/}
                <Route exact path="/newclasslist" component={NewClassList} /> {/*prototypetest*/}
                <Route exact path="/tester" component={Tester} /> {/*prototypetest*/}
                <Switch>
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
                  <PrivateRoute exact path="/profil" component={Profile} />
                  <PrivateRoute exact path="/notifikasi" component={Notifications} />
                  <PrivateRoute exact path="/tentang-schooly" component={About} />
                  {/* Route Class */}
                  <PrivateRoute exact path="/createclass" component={CreateClass} />
                  <PrivateRoute exact path="/viewclass" component={ViewClass} />
                  <PrivateRoute exact path="/class/:id" component={EditClass} />
                  <PrivateRoute exact path="/deleteclass/:id" component={ViewClass} />
                  <PrivateRoute exact path="/viewsubject" component={ViewSubject} />
                  {/* Route Task  */}
                  <PrivateRoute exact path="/createtask" component={CreateTask} />
                  <PrivateRoute exact path="/viewtask" component={ViewTask} />
                  <PrivateRoute exact path="/deletetask/:id" component={ViewTask} />
                  <PrivateRoute exact path="/task/:id" component={EditTask} />
                  {/* Route Task  */}
                  <PrivateRoute exact path="/classlist" component={ClassList} />
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
