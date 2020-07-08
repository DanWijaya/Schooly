import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux"; //provide state from Store to the component
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import store from "./Store";
import { ThemeProvider } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
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
import Help from "./components/layout/help/Help";
import Policy from "./components/layout/policy/Policy";
import NotFound from "./components/layout/not-found/NotFound";
//Misc
import { globalStyles } from "./components/misc/global-styles/GlobalStyles";
import NavBar from "./components/misc/nav-bar/NavBar";
import SideDrawer from "./components/misc/side-drawer/SideDrawer";
import Footer from "./components/misc/footer/Footer";
//Class
import CreateClass from "./components/objects/classes/CreateClass"
import EditClass from "./components/objects/classes/EditClass";
import ViewClass from "./components/objects/classes/ViewClass";
import ViewSubject from "./components/objects/classes/ViewSubject";
//Material
import CreateMaterial from "./components/objects/course-materials/CreateMaterial";
import EditMaterial from "./components/objects/course-materials/EditMaterial";
import ViewMaterial from "./components/objects/course-materials/ViewMaterial";
import MaterialList from "./components/objects/course-materials/MaterialList";
//Announcement
import CreateAnnouncement from "./components/objects/announcement/CreateAnnouncement";
import EditAnnouncement from "./components/objects/announcement/EditAnnouncement";
import ViewAnnouncement from "./components/objects/announcement/ViewAnnouncement";
import AnnouncementList from "./components/objects/announcement/AnnouncementList";
//Task
import CreateTask from "./components/objects/tasks/CreateTask";
import EditTask from "./components/objects/tasks/EditTask";
import ViewTaskStudent from "./components/objects/tasks/ViewTaskStudent";
import ViewTaskTeacher from "./components/objects/tasks/ViewTaskTeacher";
import SubmittedTaskList from "./components/objects/tasks/SubmittedTaskList";
import TaskList from "./components/objects/tasks/TaskList";
//Admin Only
import ClassList from "./components/objects/admin-only/ClassList";
import ClassListV2 from "./components/objects/admin-only/ClassListV2";
import ManageUsers from "./components/objects/admin-only/ManageUsers";
//Prototypes
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
    return(
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
                <div
                  style={{
                    flexGrow: "1",
                    overflowX: "hidden",
                    marginTop: `${this.state.marginTopValue}px`}}>
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
                    <PrivateRoute exact path="/beranda" component={Dashboard} />
                    <PrivateRoute exact path="/profil" component={Profile} />
                    {/* Route Class */}
                    <PrivateRoute exact path="/buat-kelas" component={CreateClass} />
                    <PrivateRoute exact path="/sunting-kelas/:id" component={EditClass} />
                    <PrivateRoute exact path="/kelas/:id" component={ViewClass} />
                    <PrivateRoute exact path="/mata-pelajaran/:subject_name" component={ViewSubject} />
                    {/* Route Course Materials */}
                    <PrivateRoute exact path="/buat-materi" component={CreateMaterial} />
                    <PrivateRoute exact path="/sunting-materi/:id" component={EditMaterial} />
                    <PrivateRoute exact path="/materi/:id" component={ViewMaterial} />
                    <PrivateRoute exact path="/daftar-materi" component={MaterialList} />
                    {/* Route Announcement  */}
                    <PrivateRoute exact path="/buat-pengumuman" component={CreateAnnouncement} />
                    <PrivateRoute exact path="/sunting-pengumuman/:id" component={EditAnnouncement} />
                    <PrivateRoute exact path="/pengumuman/:id" component={ViewAnnouncement} />
                    <PrivateRoute exact path="/daftar-pengumuman" component={AnnouncementList} />
                    {/* Route Task  */}
                    <PrivateRoute exact path="/buat-tugas" component={CreateTask} />
                    <PrivateRoute exact path="/sunting-tugas/:id" component={EditTask} />
                    <PrivateRoute exact path="/tugas-murid/:id" component={ViewTaskStudent} />
                    <PrivateRoute exact path="/tugas-guru/:id" component={ViewTaskTeacher} />
                    <PrivateRoute exact path="/daftar-tugas-terkumpul/:id" component={SubmittedTaskList} />
                    <PrivateRoute exact path="/daftar-tugas" component={TaskList} />
                    {/* Route Admin-Only  */}
                    <PrivateRoute exact path="/daftar-kelas" component={ClassList} />
                    <PrivateRoute exact path="/classlistv2" component={ClassListV2} />
                    <PrivateRoute exact path="/atur-pengguna" component={ManageUsers} />
                    {/* Not Found  */}
                    <Route
                      render={(props) => (
                        <NotFound {...props} handleMarginTopValue={(data) => this.handleMarginTopValue(data)} />
                      )}
                    />
                  </Switch>
                  <div
                    style={{
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
