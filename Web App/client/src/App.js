import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux"; //provide state from Store to the component
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import store from "./Store";
import { ThemeProvider } from "@material-ui/core/styles";
import Toolbar from '@material-ui/core/Toolbar';
//Routing and Actions
import { setCurrentUser, logoutUser } from "./actions/UserActions";
import PrivateRoute from "./components/private-route/PrivateRoute";
//Auth
import Register from "./components/auth/register/Register";
import Login from "./components/auth/login/Login";
import LoginForgot from "./components/auth/login/LoginForgot";
import ResetPassword from "./components/auth/reset-password/ResetPassword";
//Layout
import About from "./components/layout/about/About";
import Dashboard from "./components/layout/dashboard/Dashboard";
import Landing from "./components/layout/landing/Landing";
import Profile from "./components/layout/profile/Profile";
import Notifications from "./components/layout/notifications/Notifications";
import Help from "./components/layout/help/Help";
import Policy from "./components/layout/policy/Policy";
import NotFound from "./components/layout/not-found/NotFound";
//Misc
import { globalStyles } from "./components/misc/global-styles/GlobalStyles";
import { drawerWidth } from "./components/misc/nav-bar/NavBar";
import NavBar from "./components/misc/nav-bar/NavBar";
import SideDrawer from "./components/misc/side-drawer/SideDrawer";
import Footer from "./components/misc/footer/Footer";
//Class
import CreateClass from "./components/objects/classes/CreateClass"
import EditClass from "./components/objects/classes/EditClass";
import ViewClass from "./components/objects/classes/ViewClass";
import ViewSubject from "./components/objects/classes/ViewSubject";
//Task
import CreateTask from "./components/objects/tasks/CreateTask";
import EditTask from "./components/objects/tasks/EditTask";
import ViewTask from "./components/objects/tasks/ViewTask";
import ViewTaskTeacher from "./components/objects/tasks/ViewTaskTeacher";
import ViewTaskListTeacher from "./components/objects/tasks/ViewTaskListTeacher";
import NewTaskList from "./components/objects/tasks/NewTaskList";
//Admin Only
import ClassList from "./components/objects/admin-only/ClassList";
//Prototypes
import NewTask from "./components/objects/tasks/NewTask";
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
    mobileOpen: false,
    desktopOpen: false,
    loggedIn: false,
    marginTopValue: 20,
    posts: [],
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

  render() {
    return (
      <div>
        <Provider store={store}>
          <ThemeProvider theme={globalStyles}>
            <Router>
              <div style={{display: "flex"}}>
                <NavBar
                  handleDrawerDesktop={this.handleDrawerDesktop}
                  handleDrawerMobile={this.handleDrawerMobile}
                />
                <SideDrawer
                  mobileOpen={this.state.mobileOpen}
                  desktopOpen={this.state.desktopOpen}
                  handleDrawerMobile={this.handleDrawerMobile}
                />
                <div style={{marginTop: `${this.state.marginTopValue}px`, flexGrow: "1"}}>
                  <Toolbar />
                  <Switch>
                    <Route exact path="/"
                      render={(props) => (
                        <Landing {...props} handleMarginTopValue={(data) => this.handleMarginTopValue(data)} />
                      )}
                    />
                    <Route exact path="/bantuan"
                      render={(props) => (
                        <Help {...props} handleMarginTopValue={(data) => this.handleMarginTopValue(data)} />
                      )}
                     />
                     <Route exact path="/tentang-schooly"
                       render={(props) => (
                         <About {...props} handleMarginTopValue={(data) => this.handleMarginTopValue(data)} />
                       )}
                     />
                    <Route exact path="/kebijakan-penggunaan"
                      render={(props) => (
                        <Policy {...props} handleMarginTopValue={(data) => this.handleMarginTopValue(data)} />
                      )}
                    />
                    <Route exact path="/daftar" component={Register} />
                    <Route exact path="/masuk" component={Login} />
                    <Route exact path="/akun/lupa-katasandi" component={LoginForgot} />
                    <Route exact path="/akun/ubah-katasandi/:hash" component={ResetPassword}/>
                    <Route exact path="/tester" component={Tester} /> {/*prototype*/}
                    <PrivateRoute exact path="/dashboard" component={Dashboard} />
                    <PrivateRoute exact path="/profil" component={Profile} />
                    <PrivateRoute exact path="/notifikasi" component={Notifications} />
                    {/* Route Class */}
                    <PrivateRoute exact path="/createclass" component={CreateClass} />
                    <PrivateRoute exact path="/viewclass/:id" component={ViewClass} />
                    <PrivateRoute exact path="/editclass/:id" component={EditClass} />
                    <PrivateRoute exact path="/deleteclass/:id" component={ViewClass} />
                    <PrivateRoute exact path="/viewsubject/:subject_name" component={ViewSubject} />
                    {/* Route Task  */}
                    <PrivateRoute exact path="/createtask" component={CreateTask} />
                    <PrivateRoute exact path="/viewtask" component={ViewTask} />
                    <PrivateRoute exact path="/viewtaskteacher" component={ViewTaskTeacher} /> {/*prototype*/}
                    <PrivateRoute exact path="/viewtasklistteacher" component={ViewTaskListTeacher} /> {/*prototype*/}
                    <PrivateRoute exact path="/deletetask/:id" component={ViewTask} />
                    <PrivateRoute exact path="/task/:id" component={EditTask} />
                    <PrivateRoute exact path="/new-task/:id" component={NewTask} /> {/*prototype*/}
                    <PrivateRoute exact path="/newtasklist" component={NewTaskList} /> {/*prototype*/}
                    {/* Route Admin-Only  */}
                    <PrivateRoute exact path="/classlist" component={ClassList} /> {/*prototype*/}
                    <PrivateRoute exact path="/newclasslist" component={NewClassList} /> {/*prototype*/}
                    <Route
                      render={(props) => (
                        <NotFound {...props} handleMarginTopValue={(data) => this.handleMarginTopValue(data)} />
                      )}
                    />
                  </Switch>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      marginTop: "150px",
                    }}
                  >
                    <Footer/>
                  </div>
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
