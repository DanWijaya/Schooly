import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import {
  getStudents,
  getStudentsByClass,
  getTeachers,
} from "../../../actions/UserActions";
import { getMaterialByClass } from "../../../actions/MaterialActions";
import { getTaskAtmpt, getTaskByClass } from "../../../actions/TaskActions";
import {
  getAllAssessments,
  getAssessmentsByClass,
} from "../../../actions/AssessmentActions";
import { getFileSubmitTasksByAuthor } from "../../../actions/files/FileSubmitTaskActions";
import { getMultipleFileAvatar } from "../../../actions/files/FileAvatarActions";
import AssessmentItem from "../item/AssessmentItem";
import TaskItem from "../item/TaskItem";
import MaterialItem from "../item/MaterialItem";
import UserItem from "../item/UserItem";
import Empty from "../../misc/empty/Empty";
import { TabPanel } from "../../utils/tab-panel/TabPanel";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  AssignmentOutlined as AssignmentIcon,
  DesktopWindows as DesktopWindowsIcon,
  ExpandMore as ExpandMoreIcon,
  LibraryBooks as LibraryBooksIcon,
  MenuBook as MenuBookIcon,
  Pageview as PageviewIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { BsClipboardData } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: "20px",
    paddingTop: "25px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  classWallpaper: {
    height: "250px",
    padding: "30px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: "url(/images/backgrounds/ViewClassPicture.png)",
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  classMembersDivider: {
    marginTop: "5px",
    backgroundColor: theme.palette.primary.main,
  },
  objectPanel: {
    display: "flex",
    alignItems: "center",
  },
  objectIcon: {
    color: "grey",
    fontSize: "22.5px",
    marginRight: "12.5px",
  },
  objectDetails: {
    padding: "30px",
    [theme.breakpoints.down("sm")]: {
      padding: "15px",
    },
  },
  listItemPaper: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  listItem: {
    minHeight: "70px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  material: {
    backgroundColor: theme.palette.primary.main,
  },
  assignmentLate: {
    backgroundColor: theme.palette.primary.main,
  },
  assignmentTurnedIn: {
    backgroundColor: theme.palette.success.main,
  },
  warningText: {
    color: theme.palette.warning.main,
  },
  errorIcon: {
    color: theme.palette.error.main,
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  checkIcon: {
    color: theme.palette.success.main,
  },
  viewUserButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
}));

function ViewClass(props) {
  const classes = useStyles();
  const {
    setCurrentClass,
    getStudentsByClass,
    getAllSubjects,
    getTeachers,
    getMaterialByClass,
    getTaskAtmpt,
    getAllAssessments,
    getAssessmentsByClass,
    getMultipleFileAvatar,
    getTaskByClass,
  } = props;
  const { students_by_class, user, all_roles } = props.auth;
  const { kelas } = props.classesCollection;
  const { all_subjects } = props.subjectsCollection;
  const { selectedMaterials } = props.materialsCollection;
  const { selectedAssessments } = props.assessmentsCollection;
  const classId = props.match.params.id;
  const { selectedTasks } = props.tasksCollection;
  const [walikelas, setWalikelas] = React.useState({});
  const [taskAtmpt, setTaskAtmpt] = React.useState([]);
  const [avatar, setAvatar] = React.useState({});
  const [submittedTaskIds, setSubmittedTaskIds] = React.useState(new Set());

  function listTasks(subjectId) {
    if (!Boolean(selectedTasks.length)) {
      return <Empty />;
    }
    let taskList = [];
    if (panel === 0) {
      // If panel is "Pekerjaan Kelas"
      taskList = selectedTasks.slice(0, 5);
    } else if (panel === 1) {
      // If panel is "Mata Pelajaran"
      taskList = selectedTasks
        .filter((task) => {
          let class_assigned = task.class_assigned;
          if (Array.isArray(class_assigned)) {
            return (
              class_assigned.indexOf(classId) !== -1 &&
              task.subject === subjectId
            );
          }
          return false;
        })
        .slice(0, 3);
    }
    return <TaskItem data={taskList} submittedIds={submittedTaskIds} />;
  }

  function listMaterials(subjectId) {
    if (!Boolean(selectedMaterials.length)) {
      return <Empty />;
    }
    let materialList = [];
    if (panel === 0) {
      // If panel is "Pekerjaan Kelas"
      materialList = selectedMaterials.slice(0, 5);
    } else if (panel === 1) {
      // If panel is "Mata Pelajaran"
      materialList = selectedMaterials
        .filter((material) => material.subject === subjectId)
        .slice(0, 3);
    }
    return <MaterialItem data={materialList} />;
  }

  function listAssessments(type = "", subjectId = "") {
    if (!Boolean(selectedAssessments.length)) {
      return <Empty />;
    }
    let assessmentList = [];
    if (panel === 0) {
      // If panel is "Pekerjaan Kelas"
      assessmentList = selectedAssessments
        .filter((assessment) => assessment.type === type)
        .slice(0, 5);
    } else if (panel === 1) {
      // If panel is "Mata Pelajaran"
      assessmentList = selectedAssessments
        .filter((assessment) => assessment.subject === subjectId)
        .slice(0, 3);
    }
    return <AssessmentItem data={assessmentList} />;
  }

  React.useEffect(() => {
    if (user.role === all_roles.STUDENT) {
      if (user.kelas && user.kelas === classId) {
        // If this student has been assigned to a class.
        // Clas id that is inserted as a parameter is the class id that is assigned to the student.
        getMaterialByClass(user.kelas);
        getTaskByClass(user.kelas);
        getAssessmentsByClass(user.kelas);
      } else {
        // If this student has not been assigned to any class or tried to open other class page,
        // then nothing will be loaded and will be redirected to the corresponding page (below).
        return;
      }
    }
    getStudentsByClass(props.match.params.id); // get the students_by_class
    if (user.role !== all_roles.SUPERADMIN) {
      // This request is for users that has non SUPERADMIN role.
      getAllSubjects(user.unit, "map"); // get the all_subjects_map in map
      getAllSubjects(user.unit); // get the all_subjects
      // getTeachers(user.unit, "map"); // dipindahkan
      getStudents(user.unit);

      getAllAssessments(user.unit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getTaskAtmpt(user._id).then((data) => {
      setTaskAtmpt(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id]);

  React.useEffect(() => {
    //Untuk mendapatkan kelas current, digunakan untuk:
    //  -> Dapatin id walikelas
    // -> pindahkan getTeachers(user.unit, "map") di sini karena mau execute setWalikelas hanya setelah itu selesai.
    if (classId) {
      setCurrentClass(classId).then((kelas) => {
        let listId = [];
        if (kelas.walikelas) {
          listId.push(kelas.walikelas);
        }
        students_by_class.forEach((s) => listId.push(s._id));
        getMultipleFileAvatar(listId).then((results) => {
          setAvatar(results);
        });
        getTeachers(kelas.unit, "map").then((results) =>
          setWalikelas(results.get(kelas.walikelas))
        );
        // setWalikelas(all_teachers_map.get(kelas.walikelas));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students_by_class.length, kelas.walikelas]);

  React.useEffect(() => {
    if (user.role === all_roles.STUDENT) {
      let submittedTaskIdSet = new Set();
      getFileSubmitTasksByAuthor(user._id)
        .then((data) => {
          for (let file of data) {
            submittedTaskIdSet.add(file.task_id);
          }
        })
        .finally(() => {
          // kalau dapat error 404 (files.length === 0), submittedTaskIds akan diisi Set kosong
          setSubmittedTaskIds(submittedTaskIdSet);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [panel, setPanel] = React.useState(0);
  const handleChange = (event, newValue) => {
    setPanel(newValue);
  };

  function isObjEmpty(obj) {
    // return false if obj !== undefined dan object's content is not empty.
    if (obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    } else {
      return true;
    }
  }

  if (user.role === all_roles.STUDENT) {
    if (user.kelas) {
      if (classId !== user.kelas || !classId) {
        // jika murid ini membuka halaman kelas lain,
        return <Redirect to="/tidak-ditemukan" />;
      }
      // If this student opens his/her own class, then load the page.
    } else {
      // If this student has not been assigned to any class.
      return (
        <div
          className={classes.root}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" color="textSecondary" align="center">
            Anda belum ditempatkan di kelas manapun
          </Typography>
        </div>
      );
    }
  }

  document.title = `Schooly | ${kelas.name}`;

  return (
    <div className={classes.root}>
      {user.role === all_roles.ADMIN ||
        user.role === all_roles.TEACHER ||
        user.role === all_roles.SUPERADMIN ? (
        <div>
          <Paper square>
            <div className={classes.classWallpaper}>
              <Typography variant="h3">{kelas.name}</Typography>
              <Typography variant="h6">
                {isObjEmpty(walikelas) ? null : walikelas.name}
              </Typography>
            </div>
          </Paper>
          <Grid
            container
            direction="column"
            spacing={10}
            style={{ padding: "15px", paddingTop: "25px" }}
          >
            <Grid item>
              <Typography variant="h4" gutterBottom>
                Wali Kelas
              </Typography>
              <Divider className={classes.classMembersDivider} />
              {isObjEmpty(walikelas) ? (
                <Typography
                  color="textSecondary"
                  align="center"
                  style={{ padding: "15px" }}
                >
                  Kosong
                </Typography>
              ) : (
                <UserItem data={[walikelas]} avatar_map={avatar} />
              )}
            </Grid>
            <Grid item>
              <Typography variant="h4">Murid</Typography>
              <Divider className={classes.classMembersDivider} />
              {students_by_class.length === 0 ? (
                <Typography
                  color="textSecondary"
                  align="center"
                  style={{ padding: "15px" }}
                >
                  Kosong
                </Typography>
              ) : (
                <UserItem data={students_by_class} avatar_map={avatar} />
              )}
            </Grid>
          </Grid>
        </div>
      ) : (
        <div>
          <Paper square>
            <div className={classes.classWallpaper}>
              <Typography variant="h3">{kelas.name}</Typography>
              <Typography variant="h6">
                {isObjEmpty(walikelas) ? null : walikelas.name}
              </Typography>
            </div>
            <Tabs
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              value={panel}
              onChange={handleChange}
            >
              <Tab icon={<DesktopWindowsIcon />} label="Pekerjaan Kelas" />
              <Tab icon={<LibraryBooksIcon />} label="Mata Pelajaran" />
              <Tab icon={<SupervisorAccountIcon />} label="Peserta" />
            </Tabs>
          </Paper>
          <TabPanel value={panel} index={0} style={{ paddingTop: "15px" }}>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs>
                    <div className={classes.objectPanel}>
                      <MenuBookIcon className={classes.objectIcon} />
                      <Typography variant="h6">Materi</Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Lihat Semua">
                      <Link to="/daftar-materi">
                        <IconButton>
                          <PageviewIcon fontSize="small" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails className={classes.objectDetails}>
                <Grid container direction="column" spacing={2}>
                  {listMaterials()}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs container alignItems="center">
                    <div className={classes.objectPanel}>
                      <AssignmentIcon className={classes.objectIcon} />
                      <Typography variant="h6">Tugas</Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Lihat Semua">
                      <Link to="/daftar-tugas">
                        <IconButton>
                          <PageviewIcon fontSize="small" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails className={classes.objectDetails}>
                <Grid container direction="column" spacing={2}>
                  {listTasks()}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs container alignItems="center">
                    <div className={classes.objectPanel}>
                      <FaClipboardList className={classes.objectIcon} />
                      <Typography variant="h6">Kuis</Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Lihat Semua">
                      <Link to="/daftar-kuis">
                        <IconButton>
                          <PageviewIcon fontSize="small" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails className={classes.objectDetails}>
                <Grid container direction="column" spacing={2}>
                  {listAssessments("Kuis")}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs container alignItems="center">
                    <div className={classes.objectPanel}>
                      <BsClipboardData className={classes.objectIcon} />
                      <Typography variant="h6">Ujian</Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Lihat Semua">
                      <Link to="/daftar-ujian">
                        <IconButton>
                          <PageviewIcon fontSize="small" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails className={classes.objectDetails}>
                <Grid container direction="column" spacing={2}>
                  {listAssessments("Ujian")}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </TabPanel>
          <TabPanel value={panel} index={1} style={{ paddingTop: "15px" }}>
            {all_subjects.length === 0
              ? null
              : all_subjects.map((subject) => {
                // let isEmpty = true
                if (
                  kelas.subject_assigned &&
                  kelas.subject_assigned.includes(subject._id)
                ) {
                  return (
                    <ExpansionPanel>
                      <ExpansionPanelSummary>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                        >
                          <Grid item>
                            <Typography variant="h6">
                              {subject.name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Tooltip title="Lihat Mata Pelajaran">
                              <Link to={`/mata-pelajaran/${subject._id}`}>
                                <IconButton>
                                  <PageviewIcon fontSize="small" />
                                </IconButton>
                              </Link>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </ExpansionPanelSummary>
                      <Divider />
                      <ExpansionPanelDetails
                        className={classes.objectDetails}
                      >
                        <Grid container direction="column" spacing={2}>
                          {listMaterials(subject._id)}
                          {listTasks(subject._id)}
                          {listAssessments("", subject._id)}
                        </Grid>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  );
                }
              })}
          </TabPanel>
          <TabPanel value={panel} index={2} style={{ paddingTop: "15px" }}>
            <Grid
              container
              direction="column"
              spacing={10}
              style={{ padding: "15px" }}
            >
              <Grid item>
                <Typography variant="h4" gutterBottom>
                  Wali Kelas
                </Typography>
                <Divider className={classes.classMembersDivider} />
                {isObjEmpty(walikelas) ? (
                  <Typography
                    color="textSecondary"
                    align="center"
                    style={{ padding: "15px" }}
                  >
                    Kosong
                  </Typography>
                ) : (
                  <UserItem data={[walikelas]} avatar_map={avatar} />
                )}
              </Grid>
              <Grid item>
                <Typography variant="h4">Murid</Typography>
                <Divider className={classes.classMembersDivider} />
                {students_by_class.length === 0 ? (
                  <Typography
                    color="textSecondary"
                    align="center"
                    style={{ padding: "15px" }}
                  >
                    Kosong
                  </Typography>
                ) : (
                  <UserItem data={students_by_class} avatar_map={avatar} />
                )}
              </Grid>
            </Grid>
          </TabPanel>
        </div>
      )}
    </div>
  );
}

ViewClass.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  materialsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  filesCollection: PropTypes.object.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  getTaskByClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  getMaterialByClass: PropTypes.func.isRequired,
  getAllAssessments: PropTypes.func.isRequired,
  getAssessmentsByClass: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
  tasksCollection: state.tasksCollection,
  materialsCollection: state.materialsCollection,
  filesCollection: state.filesCollection,
  assessmentsCollection: state.assessmentsCollection,
});

export default connect(mapStateToProps, {
  setCurrentClass,
  getStudentsByClass,
  getAllSubjects,
  getTeachers,
  getMaterialByClass,
  getAllAssessments,
  getAssessmentsByClass,
  getStudents,
  getTaskAtmpt,
  getMultipleFileAvatar,
  getTaskByClass,
})(ViewClass);
