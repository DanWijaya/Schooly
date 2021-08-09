import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Provider } from "react-redux"; //provide state from Store to the component
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import store from "./Store";
import Error from "./prototypes/Error";
import { ThemeProvider } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
//Routing and Actions
import {
  setCurrentUser,
  logoutUser,
  // setDropboxToken,
} from "./actions/UserActions";
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
import ReportView from "./components/layout/profile/ReportView";
import Help from "./components/layout/help/Help";
import Policy from "./components/layout/policy/Policy";
import NotFound from "./components/layout/not-found/NotFound";
import ProblemEncountered from "./components/layout/problem-encountered/ProblemEncountered";
//Misc
import { globalStyles } from "./components/misc/global-styles/GlobalStyles";
import NavBar from "./components/misc/nav-bar/NavBar";
import SideDrawer from "./components/misc/side-drawer/SideDrawer";
import Footer from "./components/misc/footer/Footer";
import ProgressIndicator from "./components/misc/progress-indicator/ProgressIndicator";

//Class
import CreateClass from "./components/objects/classes/CreateClass";
import EditClass from "./components/objects/classes/EditClass";
import ViewClass from "./components/objects/classes/ViewClass";
import ViewSubject from "./components/objects/classes/ViewSubject";
import ClassList from "./components/objects/classes/ClassList";
//Material
import CreateMaterial from "./components/objects/material/CreateMaterial";
import EditMaterial from "./components/objects/material/EditMaterial";
import ViewMaterial from "./components/objects/material/ViewMaterial";
import MaterialList from "./components/objects/material/MaterialList";
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
import AssessmentList from "./components/objects/assessment/AssessmentQuizList";
import AssessmentTestList from "./components/objects/assessment/AssessmentExamList";
import CreateAssessment from "./components/objects/assessment/CreateAssessment";
import EditAssessment from "./components/objects/assessment/EditAssessment";
import ViewAssessmentTeacher from "./components/objects/assessment/ViewAssessmentTeacher";
import ViewAssessmentStudent from "./components/objects/assessment/ViewAssessmentStudent";
import SubmittedAssessmentList from "./components/objects/assessment/SubmittedAssessmentList";
import ViewAssessmentAnswer from "./components/objects/assessment/ViewAssessmentAnswer";

//Event
import Calendar from "./components/objects/events/Calendar";
//Admin Only
import ManageUsers from "./components/objects/admin-only/ManageUsers";
import ManagePendingUsers from "./components/objects/admin-only/ManagePendingUsers";
import SubjectList from "./components/objects/admin-only/SubjectList";
import EditClassTeacher from "./components/objects/classes/EditClassTeacher";
import TeacherList from "./components/objects/admin-only/TeacherList";

//Super Admin Only
import UnitList from "./components/objects/superadmin-only/UnitList";
import ManageAdmins from "./components/objects/superadmin-only/ManageAdmins"
import ManagePendingAdmins from "./components/objects/superadmin-only/ManagePendingAdmins"
import CreateUnit from "./components/objects/superadmin-only/CreateUnit";
import EditUnit from "./components/objects/superadmin-only/CreateUnit";


//Prototypes
import Tester from "./prototypes/Tester";
import CSV from "./prototypes/contoh-tugas/CSV";
import Graph from "./prototypes/Graph";
import Timer from "./prototypes/Timer";
import ScrollToTop from "./components/misc/scroll-to-top/ScrollToTop";
import { Fragment } from "react";
import ScheduleCalendar from "./prototypes/schedule-calendar/ScheduleCalendar";



//Dropbox
// import DropboxConnect from "./components/dropbox/DropboxConnect";
// import DropboxAuth from "./components/dropbox/DropboxAuth";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  try {
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
    // valid token format
  } catch (error) {
    console.log("Error in getting the token");
    // invalid token format
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      desktopOpen: false,
      loggedIn: false,
      showNavBar: true,
      marginTopValue: 20,
      posts: [],
      sideDrawerExist: true,
      showProgressIndicator: false,
      problemEncountered: false,
    };
  }

  componentDidCatch() {
    // this.setState({ problemEncountered: true });
  }

  handleLoading = (value) => {
    this.setState({ showProgressIndicator: value });
  };

  //Drawer at Mobile View Hooks
  handleDrawerMobile = () => {
    this.setState((prevState) => ({ mobileOpen: !prevState.mobileOpen }));
  };

  //Drawer at Desktop View Hooks
  handleDrawerDesktop = () => {
    this.setState((prevState) => ({ desktopOpen: !prevState.desktopOpen }));
  };

  handleMarginTopValue = (dataFromChild) => {
    this.setState({ marginTopValue: dataFromChild });
  };

  // Bascically run this whenever user logs in or logs out.
  setLoggedIn = (dataFromChild) => {
    this.setState({ loggedIn: dataFromChild });
  };

  handleSideDrawerExist = (dataFromChild) => {
    this.setState({ sideDrawerExist: dataFromChild });
  };

  handleNavbar = (showBool) => {
    this.setState({ showNavBar: showBool });
  };

  handleProblemEncountered = (dataFromChild) => {
    this.setState({ problemEncountered: dataFromChild });
  };


  render() {

    const Role = {
      SUPERADMIN: "SuperAdmin",
      ADMIN : "Admin",
      STUDENT : "Student",
      TEACHER : "Teacher"
    }

    console.log(localStorage.getItem(`status`));
    return (
      <div>
        <Provider store={store}>
          <ThemeProvider theme={globalStyles}>
            <Router>
              <ScrollToTop />
              <div style={{ display: "flex" }}>
                {this.state.showProgressIndicator ? (
                  <ProgressIndicator />
                ) : null}
                {this.state.showNavBar ? (
                  <NavBar
                    handleDrawerDesktop={this.handleDrawerDesktop}
                    handleDrawerMobile={this.handleDrawerMobile}
                    sideDrawerExist={this.state.sideDrawerExist}
                    assessmentState={localStorage.getItem(`status`)}
                  />
                ) : null}
                {this.state.sideDrawerExist &&
                localStorage.getItem(`status`) !== "ujian" ? (
                  <SideDrawer
                    mobileOpen={this.state.mobileOpen}
                    desktopOpen={this.state.desktopOpen}
                    handleDrawerMobile={this.handleDrawerMobile}
                  />
                ) : null}
                <div
                  style={{
                    flexGrow: "1",
                    overflowX: "hidden",
                    marginTop: `${this.state.marginTopValue}px`,
                  }}
                >
                  {this.state.showNavBar ? <Toolbar /> : null}
                  {this.state.problemEncountered ? (
                    <ProblemEncountered
                      handleProblemEncountered={this.handleProblemEncountered}
                    />
                  ) : (
                    <Switch>
                      <Route
                        exact
                        path="/"
                        render={(props) => (
                          <Landing
                            {...props}
                            handleMarginTopValue={(data) =>
                              this.handleMarginTopValue(data)
                            }
                          />
                        )}
                        // component={Tester}
                      />
                      <Route
                        exact
                        path="/bantuan"
                        render={(props) => (
                          <Help
                            {...props}
                            handleMarginTopValue={(data) =>
                              this.handleMarginTopValue(data)
                            }
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/tentang-schooly"
                        render={(props) => (
                          <About
                            {...props}
                            handleMarginTopValue={(data) =>
                              this.handleMarginTopValue(data)
                            }
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/kebijakan-penggunaan"
                        render={(props) => (
                          <Policy
                            {...props}
                            handleMarginTopValue={(data) =>
                              this.handleMarginTopValue(data)
                            }
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/daftar"
                        render={(props) => (
                          <Register
                            {...props}
                            handleNavbar={(data) => this.handleNavbar(data)}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/masuk"
                        render={(props) => (
                          <Login
                            {...props}
                            handleLoading={this.handleLoading}
                            handleNavbar={(data) => this.handleNavbar(data)}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/akun/lupa-katasandi"
                        render={(props) => (
                          <LoginForgot
                            {...props}
                            handleNavbar={(data) => this.handleNavbar(data)}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/akun/ubah-katasandi/:hash"
                        component={ResetPassword}
                      />
                      <PrivateRoute
                        exact
                        path="/beranda"
                        component={Dashboard}
                      />
                      <PrivateRoute exact path="/profil" component={Profile} />
                      <PrivateRoute
                        exact
                        path="/lihat-profil/:id"
                        component={ProfileView}
                      />
                      <PrivateRoute
                        exact
                        path="/lihat-rapor/:id"
                        component={ReportView}
                      />
                      {/* Route Class */}
                      <PrivateRoute
                        exact
                        access={[Role.ADMIN]}
                        path="/buat-kelas"
                        component={CreateClass}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.ADMIN]}
                        path="/sunting-kelas/:id"
                        component={EditClass}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT, Role.TEACHER, Role.ADMIN]}
                        path="/kelas/:id"
                        component={ViewClass}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT]}
                        path="/mata-pelajaran/:id"
                        component={ViewSubject}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER, Role.ADMIN]}
                        path="/daftar-kelas"
                        component={ClassList}
                      />
                      {/* Route Course Materials */}
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/buat-materi"
                        component={CreateMaterial}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/sunting-materi/:id"
                        component={EditMaterial}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT, Role.TEACHER]}
                        path="/materi/:id"
                        component={ViewMaterial}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT, Role.TEACHER]}
                        path="/daftar-materi"
                        component={MaterialList}
                      />
                      {/* Route Announcement */}
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT, Role.TEACHER, Role.ADMIN]}
                        path="/buat-pengumuman"
                        component={CreateAnnouncement}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT, Role.TEACHER, Role.ADMIN]}
                        path="/sunting-pengumuman/:id"
                        component={EditAnnouncement}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT, Role.TEACHER, Role.ADMIN]}
                        path="/pengumuman/:id"
                        component={ViewAnnouncement}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT, Role.TEACHER, Role.ADMIN]}
                        path="/daftar-pengumuman"
                        component={AnnouncementList}
                      />
                      {/* Route Task */}
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/buat-tugas"
                        component={CreateTask}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/sunting-tugas/:id"
                        component={EditTask}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT]}
                        path="/tugas-murid/:id"
                        component={ViewTaskStudent}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/tugas-guru/:id"
                        component={ViewTaskTeacher}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/daftar-tugas-terkumpul/:id"
                        component={SubmittedTaskList}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT, Role.TEACHER]}
                        path="/daftar-tugas"
                        component={TaskList}
                      />
                      {/* Route Assessment - Prototype */}
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT, Role.TEACHER]}
                        path="/buat-ujian"
                        handleSideDrawerExist={this.handleSideDrawerExist}
                        component={CreateAssessment}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT, Role.TEACHER]}
                        path="/buat-kuis"
                        handleSideDrawerExist={this.handleSideDrawerExist}
                        component={CreateAssessment}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT, Role.TEACHER]}
                        path="/daftar-kuis"
                        component={AssessmentList}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT, Role.TEACHER]}
                        path="/daftar-ujian"
                        component={AssessmentTestList}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/sunting-kuis/:id"
                        handleSideDrawerExist={this.handleSideDrawerExist}
                        component={EditAssessment}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/sunting-ujian/:id"
                        handleSideDrawerExist={this.handleSideDrawerExist}
                        component={EditAssessment}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT]}
                        path="/kuis-murid/:id"
                        component={ViewAssessmentStudent}
                        loginRedirect={true}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.STUDENT]}
                        path="/ujian-murid/:id"
                        component={ViewAssessmentStudent}
                        loginRedirect={true}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/kuis-guru/:id"
                        component={ViewAssessmentTeacher}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/ujian-guru/:id"
                        component={ViewAssessmentTeacher}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/daftar-kuis-terkumpul/:id"
                        component={SubmittedAssessmentList}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/daftar-ujian-terkumpul/:id"
                        component={SubmittedAssessmentList}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/lihat-jawaban-kuis/:id"
                        component={ViewAssessmentAnswer}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.TEACHER]}
                        path="/lihat-jawaban-ujian/:id"
                        component={ViewAssessmentAnswer}
                      />
                      {/* Route Admin-Only */}
                      <PrivateRoute
                        exact
                        access={[Role.ADMIN]}
                        path="/atur-pengguna"
                        component={ManageUsers}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.ADMIN]}
                        path="/pending-users"
                        component={ManagePendingUsers}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.ADMIN]}
                        path="/daftar-mata-pelajaran"
                        component={SubjectList}
                      />
                      <PrivateRoute
                        exact
                        access={[Role.ADMIN]}
                        path="/atur-walikelas"
                        component={EditClassTeacher}
                      />
                      {/* Route SuperAdmin-Only */}
                      <PrivateRoute 
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/pengelola-aktif"
                      component={ManageAdmins}
                      />
                       <PrivateRoute 
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/pengelola-tertunda"
                      component={ManagePendingAdmins}
                      />
                      <PrivateRoute
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/daftar-unit-sekolah"
                      component={UnitList}/>
                      <PrivateRoute
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/buat-unit"
                      handleSideDrawerExist={this.handleSideDrawerExist}
                      component={CreateUnit}
                      />
                      <PrivateRoute
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/sunting-unit"
                      handleSideDrawerExist={this.handleSideDrawerExist}
                      component={EditUnit}
                      />
                      <PrivateRoute
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/lihat-unit"
                      handleSideDrawerExist={this.handleSideDrawerExist}
                      component={CreateAssessment}
                      />
                      {/* Route Event */}
                      <PrivateRoute
                        exact
                        path="/kalender"
                        component={Calendar}
                      />
                      {/* Route Event Admin-Only*/}
                      <PrivateRoute
                        exact
                        access={[Role.ADMIN]}
                        path="/sunting-guru"
                        component={TeacherList}
                      />
                      <Route
                        exact
                        path="/tidak-ditemukan"
                        render={(props) => (
                          <NotFound
                            {...props}
                            handleMarginTopValue={(data) =>
                              this.handleMarginTopValue(data)
                            }
                          />
                        )}
                      />
                      <Redirect to="/tidak-ditemukan" />
                    </Switch>
                  )}
                  <Footer assessmentState={localStorage.getItem(`status`)} />
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
