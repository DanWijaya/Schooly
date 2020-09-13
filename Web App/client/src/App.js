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
import About from "./components/layout/about/About";
import Dashboard from "./components/layout/dashboard/Dashboard";
import Landing from "./components/layout/landing/Landing";
import ProfileView from "./components/layout/profile/ProfileView";
import Profile from "./components/layout/profile/Profile";
import Help from "./components/layout/help/Help";
import Policy from "./components/layout/policy/Policy";
import NotFound from "./components/layout/not-found/NotFound";
import ScheduleCalendar from "./components/layout/schedule-calendar/ScheduleCalendar";
//Misc
import { globalStyles } from "./components/misc/global-styles/GlobalStyles";
import NavBar from "./components/misc/nav-bar/NavBar";
import SideDrawer from "./components/misc/side-drawer/SideDrawer";
import Footer from "./components/misc/footer/Footer";
//Class
import CreateClass from "./components/objects/classes/CreateClass";
import EditClass from "./components/objects/classes/EditClass";
import ViewClass from "./components/objects/classes/ViewClass";
import ViewSubject from "./components/objects/classes/ViewSubject";
import ClassList from "./components/objects/classes/ClassList";
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
//Assessment
import CreateAssessment from "./components/objects/assessment/CreateAssessment";
import EditAssessment from "./components/objects/assessment/EditAssessment";
import AssessmentList from "./components/objects/assessment/AssessmentList";
import ViewAssessmentTeacher from "./components/objects/assessment/ViewAssessmentTeacher";
import ViewAssessmentStudent from "./components/objects/assessment/ViewAssessmentStudent";
//Admin Only
import ManageUsers from "./components/objects/admin-only/ManageUsers";
import ManagePendingUsers from "./components/objects/admin-only/ManagePendingUsers";
import SubjectList from "./components/objects/admin-only/SubjectList";
//Prototypes
import Tester from "./prototypes/Tester";
import Graph from "./prototypes/Graph";
import Timer from "./prototypes/Timer";
//Dropbox
import DropboxConnect from "./components/dropbox/DropboxConnect";
import DropboxAuth from "./components/dropbox/DropboxAuth";

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
                />
                {this.state.sideDrawerExist ?
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
                    <Route exact path="/dropbox-auth" component={DropboxAuth}/>
                    <Route exact path="/dropbox-connect" component={DropboxConnect}/>
                    <Route exact path="/daftar" component={Register} />
                    <Route exact path="/masuk" component={Login} />
                    <Route exact path="/akun/lupa-katasandi" component={LoginForgot} />
                    <Route exact path="/akun/ubah-katasandi/:hash" component={ResetPassword}/>
                    <Route exact path="/tester" component={Tester} /> {/*prototype*/}
                    <Route exact path="/timer" component={Timer} /> {/*prototype*/}
                    <PrivateRoute exact path="/beranda" component={Dashboard} />
                    <PrivateRoute exact path="/profil" component={Profile} />
                    <PrivateRoute exact path="/kalender" component={ScheduleCalendar} />
                    <PrivateRoute exact path="/lihat-profil" component={ProfileView} />
                    <PrivateRoute exact path="/lihat-rapor" component={ReportView} />
                    {/* Route Class */}
                    <PrivateRoute exact access={["Admin"]} path="/buat-kelas" component={CreateClass} />
                    <PrivateRoute exact access={["Admin"]} path="/sunting-kelas/:id" component={EditClass} />
                    <PrivateRoute exact access={["Student", "Teacher", "Admin"]} path="/kelas/:id" component={ViewClass} />
                    <PrivateRoute exact access={["Student"]} path="/mata-pelajaran/:id" component={ViewSubject} />
                    <PrivateRoute exact access={["Teacher", "Admin"]} path="/daftar-kelas" component={ClassList} />
                    {/* Route Course Materials */}
                    <PrivateRoute exact access={["Teacher"]} path="/buat-materi" component={CreateMaterial} />
                    <PrivateRoute exact access={["Teacher"]} path="/sunting-materi/:id" component={EditMaterial} />
                    <PrivateRoute exact access={["Student", "Teacher"]} path="/materi/:id" component={ViewMaterial} />
                    <PrivateRoute exact access={["Student", "Teacher"]} path="/daftar-materi" component={MaterialList} />
                    {/* Route Announcement */}
                    <PrivateRoute exact access={["Student", "Teacher"]} path="/buat-pengumuman" component={CreateAnnouncement} />
                    <PrivateRoute exact access={["Student", "Teacher"]} path="/sunting-pengumuman/:id" component={EditAnnouncement} />
                    <PrivateRoute exact access={["Student", "Teacher"]} path="/pengumuman/:id" component={ViewAnnouncement} />
                    <PrivateRoute exact access={["Student", "Teacher"]} path="/daftar-pengumuman" component={AnnouncementList} />
                    {/* Route Task */}
                    <PrivateRoute exact access={["Teacher"]} path="/buat-tugas" component={CreateTask} />
                    <PrivateRoute exact access={["Teacher"]} path="/sunting-tugas/:id" component={EditTask} />
                    <PrivateRoute exact access={["Student"]} path="/tugas-murid/:id" component={ViewTaskStudent} />
                    <PrivateRoute exact access={["Teacher"]} path="/tugas-guru/:id" component={ViewTaskTeacher} />
                    <PrivateRoute exact access={["Teacher"]} path="/daftar-tugas-terkumpul/:id" component={SubmittedTaskList} />
                    <PrivateRoute exact access={["Student", "Teacher"]} path="/daftar-tugas" component={TaskList} />
                    {/* Route Assessment - Prototype */}
                    <PrivateRoute exact access={["Student", "Teacher"]} path="/kuis" handleSideDrawerExist={this.handleSideDrawerExist} component={CreateAssessment} />
                    <PrivateRoute exact access={["Student", "Teacher"]} path="/daftar-kuis" component={AssessmentList} />
                    <PrivateRoute exact access={["Teacher"]} path="/sunting-kuis/:id" handleSideDrawerExist={this.handleSideDrawerExist} component={EditAssessment} />
                    <PrivateRoute exact access={["Student"]} path="/kuis-murid/:id" component={ViewAssessmentStudent} />
                    <PrivateRoute exact access={["Teacher"]} path="/kuis-guru/:id" component={ViewAssessmentTeacher} />
                    {/* Route Admin-Only */}
                    <PrivateRoute exact access={["Admin"]} path="/atur-pengguna" component={ManageUsers} />
                    <PrivateRoute exact access={["Admin"]} path="/pending-users" component={ManagePendingUsers} />
                    <PrivateRoute exact access={["Admin"]} path="/daftar-mata-pelajaran" component={SubjectList} />
                    {/* Not Found */}
                    <Route
                      exact path="/tidak-ditemukan"
                      render={(props) => (
                        <NotFound {...props} handleMarginTopValue={(data) => this.handleMarginTopValue(data)} />
                      )}
                    />
                    <Redirect to="/tidak-ditemukan"/>
                  </Switch>
                  <Footer />
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
