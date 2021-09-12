import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import store from "./Store";
import { setCurrentUser, logoutUser,
  // setDropboxToken,
} from "./actions/UserActions";
import PrivateRoute from "./components/private-route/PrivateRoute";
import { ThemeProvider } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
//Auth
import Register from "./components/auth/register/Register";
import Login from "./components/auth/login/Login";
import ForgotPassword from "./components/auth/reset-password/ForgotPassword";
import ResetPassword from "./components/auth/reset-password/ResetPassword";
//Layout
import About from "./components/layout/about/About";
import Dashboard from "./components/layout/dashboard/Dashboard";
import Landing from "./components/layout/landing/Landing";
import Profile from "./components/layout/profile/Profile";
import ProfileView from "./components/layout/profile/ProfileView";
import Help from "./components/layout/help/Help";
import TermsOfService from "./components/layout/legal/terms-of-service/TermsOfService";
import PrivacyPolicy from "./components/layout/legal/privacy-policy/PrivacyPolicy";
import NotFound from "./components/layout/error/error404/NotFound";
import ProblemEncountered from "./components/layout/error/error500/ProblemEncountered";
//Misc
import { globalStyles } from "./components/misc/global-styles/GlobalStyles";
import NavBar from "./components/misc/nav-bar/NavBar";
import SideDrawer from "./components/misc/side-drawer/SideDrawer";
import Footer from "./components/misc/footer/Footer";
import ProgressIndicator from "./components/misc/progress-indicator/ProgressIndicator";
import ScrollToTop from "./components/misc/scroll-to-top/ScrollToTop";
import Combined from "./components/misc/combined-navigation/Combined";
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
//Report
import Report from "./components/objects/report/Report";
//Event
import Calendar from "./components/objects/events/Calendar";
//Admin Only
import ManageUsers from "./components/objects/admin-only/ManageUsers";
import ManagePendingUsers from "./components/objects/admin-only/ManagePendingUsers";
import SubjectList from "./components/objects/admin-only/SubjectList";
import EditClassTeacher from "./components/objects/classes/EditClassTeacher";
import TeacherList from "./components/objects/admin-only/TeacherList";
//Prototypes
import CSV from "./prototypes/contoh-tugas/CSV";
import BulkRegister from "./prototypes/bulk-register/BulkRegister";
import Tester from "./prototypes/Tester";

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

// if (localStorage.dropbox_token) {
//   const dropbox_token = localStorage.dropbox_token;
//   console.log(dropbox_token);
//   store.dispatch(setDropboxToken(dropbox_token));
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      desktopOpen: false,
      loggedIn: false,
      showNavBar: true,
      posts: [],
      sideDrawerExist: true,
      showProgressIndicator: false,
      problemEncountered: false,
    };
  }

  componentDidCatch() {
    // this.setState({ problemEncountered: true });
  }

  handleNavbar = (showBool) => {
    this.setState({ showNavBar: showBool });
  };

  handleLoading = (value) => {
    this.setState({ showProgressIndicator: value });
  };

  handleSideDrawerExist = (dataFromChild) => {
    this.setState({ sideDrawerExist: dataFromChild });
  };

  handleDrawerMobile = () => {
    this.setState((prevState) => ({ mobileOpen: !prevState.mobileOpen }));
  };

  handleDrawerDesktop = () => {
    this.setState((prevState) => ({ desktopOpen: !prevState.desktopOpen }));
  };

  // Bascically run this whenever user logs in or logs out.
  setLoggedIn = (dataFromChild) => {
    this.setState({ loggedIn: dataFromChild });
  };

  handleProblemEncountered = (dataFromChild) => {
    this.setState({ problemEncountered: dataFromChild });
  };

  render() {
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
                <Combined
                  showNavBar={this.state.showNavBar}
                  sideDrawerExist={this.state.sideDrawerExist}/>
                {/* {this.state.showNavBar ? (
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
                ) : null} */}
                <div
                  style={{
                    flexGrow: "1",
                    overflowX: "hidden",
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
                        path="/tester"
                        render={(props) => (
                          <Tester
                            {...props}
                            />
                        )}/>
                      <Route
                        exact
                        path="/"
                        render={(props) => (
                          <Landing
                            {...props}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/bantuan"
                        render={(props) => (
                          <Help
                            {...props}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/tentang-schooly"
                        render={(props) => (
                          <About
                            {...props}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/legal/ketentuan-penggunaan"
                        render={(props) => (
                          <TermsOfService
                            {...props}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/legal/kebijakan-privasi"
                        render={(props) => (
                          <PrivacyPolicy
                            {...props}
                          />
                        )}
                      />
                      {/* <Route exact path="/dropbox-auth" component={DropboxAuth} />
                    <Route
                      exact
                      path="/dropbox-connect"
                      component={DropboxConnect}
                    /> */}
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
                          <ForgotPassword
                            {...props}
                            handleNavbar={(data) => this.handleNavbar(data)}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/akun/ubah-katasandi/:hash"
                        render={(props) => (
                          <ResetPassword
                            {...props}
                            handleNavbar={(data) => this.handleNavbar(data)}
                          />
                        )}
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
                        path="/rapor/:id"
                        component={Report}
                      />
                      {/* Route Class */}
                      <PrivateRoute
                        exact
                        access={["Admin"]}
                        path="/buat-kelas"
                        component={CreateClass}
                      />
                      <PrivateRoute
                        exact
                        access={["Admin"]}
                        path="/sunting-kelas/:id"
                        component={EditClass}
                      />
                      <PrivateRoute
                        exact
                        access={["Student", "Teacher", "Admin"]}
                        path="/kelas/:id"
                        component={ViewClass}
                      />
                      <PrivateRoute
                        exact
                        access={["Student"]}
                        path="/mata-pelajaran/:id"
                        component={ViewSubject}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher", "Admin"]}
                        path="/daftar-kelas"
                        component={ClassList}
                      />
                      {/* Route Materials */}
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/buat-materi"
                        component={CreateMaterial}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/sunting-materi/:id"
                        component={EditMaterial}
                      />
                      <PrivateRoute
                        exact
                        access={["Student", "Teacher"]}
                        path="/materi/:id"
                        component={ViewMaterial}
                      />
                      <PrivateRoute
                        exact
                        access={["Student", "Teacher"]}
                        path="/daftar-materi"
                        component={MaterialList}
                      />
                      {/* Route Announcement */}
                      <PrivateRoute
                        exact
                        access={["Student", "Teacher", "Admin"]}
                        path="/buat-pengumuman"
                        component={CreateAnnouncement}
                      />
                      <PrivateRoute
                        exact
                        access={["Student", "Teacher", "Admin"]}
                        path="/sunting-pengumuman/:id"
                        component={EditAnnouncement}
                      />
                      <PrivateRoute
                        exact
                        access={["Student", "Teacher", "Admin"]}
                        path="/pengumuman/:id"
                        component={ViewAnnouncement}
                      />
                      <PrivateRoute
                        exact
                        access={["Student", "Teacher", "Admin"]}
                        path="/daftar-pengumuman"
                        component={AnnouncementList}
                      />
                      {/* Route Task */}
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/buat-tugas"
                        component={CreateTask}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/sunting-tugas/:id"
                        component={EditTask}
                      />
                      <PrivateRoute
                        exact
                        access={["Student"]}
                        path="/tugas-murid/:id"
                        component={ViewTaskStudent}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/tugas-guru/:id"
                        component={ViewTaskTeacher}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/daftar-tugas-terkumpul/:id"
                        component={SubmittedTaskList}
                      />
                      <PrivateRoute
                        exact
                        access={["Student", "Teacher"]}
                        path="/daftar-tugas"
                        component={TaskList}
                      />
                      {/* Route Assessment */}
                      <PrivateRoute
                        exact
                        access={["Student", "Teacher"]}
                        path="/buat-kuis"
                        handleSideDrawerExist={this.handleSideDrawerExist}
                        component={CreateAssessment}
                      />
                      <PrivateRoute
                        exact
                        access={["Student", "Teacher"]}
                        path="/buat-ujian"
                        handleSideDrawerExist={this.handleSideDrawerExist}
                        component={CreateAssessment}
                      />
                      <PrivateRoute
                        exact
                        access={["Student", "Teacher"]}
                        path="/daftar-kuis"
                        component={AssessmentList}
                      />
                      <PrivateRoute
                        exact
                        access={["Student", "Teacher"]}
                        path="/daftar-ujian"
                        component={AssessmentTestList}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/sunting-kuis/:id"
                        handleSideDrawerExist={this.handleSideDrawerExist}
                        component={EditAssessment}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/sunting-ujian/:id"
                        handleSideDrawerExist={this.handleSideDrawerExist}
                        component={EditAssessment}
                      />
                      <PrivateRoute
                        exact
                        access={["Student"]}
                        path="/kuis-murid/:id"
                        component={ViewAssessmentStudent}
                        loginRedirect={true}
                      />
                      <PrivateRoute
                        exact
                        access={["Student"]}
                        path="/ujian-murid/:id"
                        component={ViewAssessmentStudent}
                        loginRedirect={true}
                        handleSideDrawerExist={this.handleSideDrawerExist}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/kuis-guru/:id"
                        component={ViewAssessmentTeacher}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/ujian-guru/:id"
                        component={ViewAssessmentTeacher}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/daftar-kuis-terkumpul/:id"
                        component={SubmittedAssessmentList}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/daftar-ujian-terkumpul/:id"
                        component={SubmittedAssessmentList}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/lihat-jawaban-kuis/:id"
                        component={ViewAssessmentAnswer}
                      />
                      <PrivateRoute
                        exact
                        access={["Teacher"]}
                        path="/lihat-jawaban-ujian/:id"
                        component={ViewAssessmentAnswer}
                      />
                      {/* Route Admin-Only */}
                      <PrivateRoute
                        exact
                        access={["Admin"]}
                        path="/atur-pengguna"
                        component={ManageUsers}
                      />
                      <PrivateRoute
                        exact
                        access={["Admin"]}
                        path="/pengguna-tidakaktif"
                        component={ManagePendingUsers}
                      />
                      <PrivateRoute
                        exact
                        access={["Admin"]}
                        path="/daftar-mata-pelajaran"
                        component={SubjectList}
                      />
                      <PrivateRoute
                        exact
                        access={["Admin"]}
                        path="/atur-walikelas"
                        component={EditClassTeacher}
                      />
                      {/*prototype*/}
                      {/*<Route exact path="/csv" component={CSV} />*/}
                      {/* Route Event */}
                      <PrivateRoute 
                      exact
                      access={["Admin"]}
                      path="/bulk-register"
                      component={BulkRegister}/>
                      <PrivateRoute
                        exact
                        path="/kalender"
                        component={Calendar}
                      />
                      {/* Route Event Admin-Only*/}
                      <PrivateRoute
                        exact
                        access={["Admin"]}
                        path="/sunting-guru"
                        component={TeacherList}
                      />
                      {/* Route Event */}
                      <PrivateRoute
                        exact
                        path="/kalender"
                        component={Calendar}
                      />
                      <Route
                        exact
                        path="/tidak-ditemukan"
                        render={(props) => (
                          <NotFound
                            {...props}
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
