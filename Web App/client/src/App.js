import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import store from "./Store";
import { setCurrentUser, logoutUser } from "./actions/UserActions";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import GlobalStyles from "./theme/globalStyles";
import theme from "./theme";
// Page Components
import Footer from "./Footer";
import Navigation from "./components/navigation/Navigation";
// Auth
import Register from "./components/auth/register/Register";
import Login from "./components/auth/login/Login";
import ForgotPassword from "./components/auth/reset-password/ForgotPassword";
import ResetPassword from "./components/auth/reset-password/ResetPassword";
// Layout
import About from "./components/layout/about/About";
import Landing from "./components/layout/landing/Landing";
import Profile from "./components/layout/profile/Profile";
import ProfileView from "./components/layout/profile/ProfileView";
import Help from "./components/layout/help/Help";
import TermsOfService from "./components/layout/legal/terms-of-service/TermsOfService";
import PrivacyPolicy from "./components/layout/legal/privacy-policy/PrivacyPolicy";
import NotFound from "./components/layout/error/error404/NotFound";
import ProblemEncountered from "./components/layout/error/error500/ProblemEncountered";
// Misc
import PrivateRoute from "./components/misc/private-route/PrivateRoute";
import ProgressIndicator from "./components/misc/progress-indicator/ProgressIndicator";
import ScrollToTop from "./components/misc/scroll-to-top/ScrollToTop";
// Dashboard
import Dashboard from "./components/objects/dashboard/Dashboard";
// Class
import CreateClass from "./components/objects/class/CreateClass";
import EditClass from "./components/objects/class/EditClass";
import EditHomeroomTeacher from "./components/objects/class/EditHomeroomTeacher";
import ViewClass from "./components/objects/class/ViewClass";
import ClassList from "./components/objects/class/ClassList";
// Subject
import ViewSubject from "./components/objects/subject/ViewSubject";
import SubjectList from "./components/objects/subject/SubjectList";
// Event
import Calendar from "./components/objects/event/Calendar";
// Announcement
import CreateAnnouncement from "./components/objects/announcement/CreateAnnouncement";
import EditAnnouncement from "./components/objects/announcement/EditAnnouncement";
import ViewAnnouncement from "./components/objects/announcement/ViewAnnouncement";
import AnnouncementList from "./components/objects/announcement/AnnouncementList";
// Material
import CreateMaterial from "./components/objects/material/CreateMaterial";
import EditMaterial from "./components/objects/material/EditMaterial";
import ViewMaterial from "./components/objects/material/ViewMaterial";
import MaterialList from "./components/objects/material/MaterialList";
// Task
import CreateTask from "./components/objects/task/CreateTask";
import EditTask from "./components/objects/task/EditTask";
import ViewTaskStudent from "./components/objects/task/ViewTaskStudent";
import ViewTaskTeacher from "./components/objects/task/ViewTaskTeacher";
import SubmittedTaskList from "./components/objects/task/SubmittedTaskList";
import TaskList from "./components/objects/task/TaskList";
// Assessment
import AssessmentList from "./components/objects/assessment/AssessmentQuizList";
import AssessmentTestList from "./components/objects/assessment/AssessmentExamList";
import CreateAssessment from "./components/objects/assessment/CreateAssessment";
import EditAssessment from "./components/objects/assessment/EditAssessment";
import ViewAssessmentTeacher from "./components/objects/assessment/ViewAssessmentTeacher";
import ViewAssessmentStudent from "./components/objects/assessment/ViewAssessmentStudent";
import SubmittedAssessmentList from "./components/objects/assessment/SubmittedAssessmentList";
import ViewAssessmentAnswer from "./components/objects/assessment/ViewAssessmentAnswer";
// Report
import Report from "./components/objects/report/Report";
// User
import ManageUsers from "./components/objects/user/ManageUsers";
import ManagePendingUsers from "./components/objects/user/ManagePendingUsers";
import TeacherList from "./components/objects/user/TeacherList";
// Settings
import Setting from "./components/objects/setting/Setting";
// Prototypes
import Tester from "./prototypes/Tester1";
import BulkRegister from "./prototypes/bulk-register/BulkRegister";
// Super Admin Only
import UnitList from "./components/objects/unit/UnitList";
import ManageAdmins from "./components/objects/user/ManageAdmins";
import ManagePendingAdmins from "./components/objects/user/ManagePendingAdmins";
import CreateUnit from "./components/objects/unit/CreateUnit";
import EditUnit from "./components/objects/unit/EditUnit";
import ViewUnit from "./components/objects/unit/ViewUnit";
import AdminList from "./components/objects/user/AdminList";

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
    // Valid token format
  } catch (error) {
    console.log("Error in getting the token");
    // Invalid token format
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
      posts: [],
      sideDrawerExist: true,
      footerExist: true,
      showProgressIndicator: false,
      problemEncountered: false,
    };
  }

  // componentDidCatch() {
  //   this.setState({ problemEncountered: true });
  // }

  handleNavbar = (showBool) => {
    this.setState({ showNavBar: showBool });
  };

  handleLoading = (value) => {
    this.setState({ showProgressIndicator: value });
  };

  handleSideDrawer = (dataFromChild) => {
    this.setState({ sideDrawerExist: dataFromChild });
  };

  handleFooter = (dataFromChild) => {
    this.setState({ footerExist: dataFromChild });
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
    const Role = {
      SUPERADMIN: "SuperAdmin",
      ADMIN: "Admin",
      STUDENT: "Student",
      TEACHER: "Teacher",
    };

    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {/*CssBaseline*/}
          <GlobalStyles />
          <Router>
            <ScrollToTop />
            <div style={{ display: "flex", minHeight: "100%" }}>
              {this.state.showProgressIndicator ? <ProgressIndicator /> : null}
              <Navigation
                showNavBar={this.state.showNavBar}
                sideDrawerExist={this.state.sideDrawerExist}
              />
              <div
                style={{
                  flexGrow: "1",
                  overflowX: "hidden",
                  minHeight: "100%",
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
                      render={(props) => <Tester {...props} />}
                    />
                    <Route
                      exact
                      path="/"
                      render={(props) => <Landing {...props} />}
                    />
                    <Route
                      exact
                      path="/bantuan"
                      render={(props) => <Help {...props} />}
                    />
                    <Route
                      exact
                      path="/tentang-schooly"
                      render={(props) => <About {...props} />}
                    />
                    <Route
                      exact
                      path="/legal/ketentuan-penggunaan"
                      render={(props) => <TermsOfService {...props} />}
                    />
                    <Route
                      exact
                      path="/legal/kebijakan-privasi"
                      render={(props) => <PrivacyPolicy {...props} />}
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
                    <PrivateRoute exact path="/beranda" component={Dashboard} />
                    <PrivateRoute exact path="/profil" component={Profile} />
                    <PrivateRoute
                      exact
                      path="/lihat-profil/:id"
                      component={ProfileView}
                    />

                    {/* Route Class */}
                    <PrivateRoute
                      exact
                      access={[Role.ADMIN]}
                      path="/buat-kelas"
                      component={CreateClass}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.ADMIN]}
                      path="/sunting-kelas/:id"
                      component={EditClass}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.ADMIN]}
                      path="/atur-walikelas"
                      component={EditHomeroomTeacher}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                    />
                    <PrivateRoute
                      exact
                      path="/kelas/:id"
                      component={ViewClass}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.TEACHER, Role.ADMIN]}
                      path="/daftar-kelas"
                      component={ClassList}
                    />
                    {/* Route Subject */}
                    <PrivateRoute
                      exact
                      access={[Role.STUDENT]}
                      path="/mata-pelajaran/:id"
                      component={ViewSubject}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.ADMIN]}
                      path="/daftar-mata-pelajaran"
                      component={SubjectList}
                    />
                    {/* Route Event */}
                    <PrivateRoute exact path="/kalender" component={Calendar} />

                    {/* Route Announcement */}
                    <PrivateRoute
                      exact
                      access={[Role.STUDENT, Role.TEACHER, Role.ADMIN]}
                      path="/buat-pengumuman"
                      component={CreateAnnouncement}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.STUDENT, Role.TEACHER, Role.ADMIN]}
                      path="/sunting-pengumuman/:id"
                      component={EditAnnouncement}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
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

                    {/* Route Material */}
                    <PrivateRoute
                      exact
                      access={[Role.TEACHER]}
                      path="/buat-materi"
                      component={CreateMaterial}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.TEACHER]}
                      path="/sunting-materi/:id"
                      component={EditMaterial}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
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

                    {/* Route Task */}
                    <PrivateRoute
                      exact
                      access={[Role.TEACHER]}
                      path="/buat-tugas"
                      component={CreateTask}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.TEACHER]}
                      path="/sunting-tugas/:id"
                      component={EditTask}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
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
                      access={[Role.STUDENT, Role.TEACHER]}
                      path="/daftar-tugas"
                      component={TaskList}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.TEACHER]}
                      path="/daftar-tugas-terkumpul/:id"
                      component={SubmittedTaskList}
                    />

                    {/* Route Assessment */}
                    <PrivateRoute
                      exact
                      access={[Role.STUDENT, Role.TEACHER]}
                      path="/buat-ujian"
                      component={CreateAssessment}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.STUDENT, Role.TEACHER]}
                      path="/buat-kuis"
                      component={CreateAssessment}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.TEACHER]}
                      path="/sunting-kuis/:id"
                      component={EditAssessment}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.TEACHER]}
                      path="/sunting-ujian/:id"
                      component={EditAssessment}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.STUDENT]}
                      path="/kuis-murid/:id"
                      component={ViewAssessmentStudent}
                      loginRedirect={true}
                      handleSideDrawer={this.handleSideDrawer}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.STUDENT]}
                      path="/ujian-murid/:id"
                      component={ViewAssessmentStudent}
                      loginRedirect={true}
                      handleSideDrawer={this.handleSideDrawer}
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

                    {/* Route Report */}
                    <PrivateRoute exact path="/rapor/:id" component={Report} />
                    {/* Route User */}
                    <PrivateRoute
                      exact
                      access={[Role.ADMIN]}
                      path="/pengguna-aktif"
                      component={ManageUsers}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.ADMIN]}
                      path="/pengguna-tidakaktif"
                      component={ManagePendingUsers}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.ADMIN]}
                      path="/data-ajar-guru"
                      component={TeacherList}
                    />

                    {/*  Route Settings */}
                    <PrivateRoute
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/pengaturan"
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                      component={Setting}
                    />

                    {/* Route SuperAdmin-Only */}
                    <PrivateRoute
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/data-unit-pengelola"
                      component={AdminList}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/pengelola-aktif"
                      component={ManageAdmins}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.SUPERADMIN]}
                      Hello
                      path="/pengelola-tertunda"
                      component={ManagePendingAdmins}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/daftar-unit"
                      component={UnitList}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/buat-unit"
                      component={CreateUnit}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/sunting-unit/:id"
                      component={EditUnit}
                      handleSideDrawer={this.handleSideDrawer}
                      handleFooter={this.handleFooter}
                      handleNavbar={(data) => this.handleNavbar(data)}
                    />
                    <PrivateRoute
                      exact
                      access={[Role.SUPERADMIN]}
                      path="/unit/:id"
                      handleSideDrawer={this.handleSideDrawer}
                      component={ViewUnit}
                    />

                    {/*  Route Prototypes */}
                    <PrivateRoute
                      exact
                      access={[Role.ADMIN]}
                      path="/bulk-register"
                      component={BulkRegister}
                    />

                    {/*  Route Not Found */}
                    <Route
                      exact
                      path="/tidak-ditemukan"
                      render={(props) => <NotFound {...props} />}
                    />
                    <Redirect to="/tidak-ditemukan" />
                  </Switch>
                )}
                {this.state.footerExist ? (
                  <Footer assessmentState={localStorage.getItem(`status`)} />
                ) : null}
              </div>
            </div>
          </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App;
