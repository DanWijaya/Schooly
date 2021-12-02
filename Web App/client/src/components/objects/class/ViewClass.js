import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import {
  getStudents,
  getStudentsByClass,
  getTeachers,
} from "../../../actions/UserActions";
import { getMaterialByClass } from "../../../actions/MaterialActions";
import {
  getSubmittedTasks,
  getTaskAtmpt,
  getTaskByClass,
} from "../../../actions/TaskActions";
import {
  getAllAssessments,
  getAssessmentsByClass,
} from "../../../actions/AssessmentActions";
import { getFileSubmitTasksByAuthor } from "../../../actions/files/FileSubmitTaskActions";
import { getMultipleFileAvatar } from "../../../actions/files/FileAvatarActions";
import viewClassPicture from "./ViewClassPicture.png";
import AssessmentItem from "../item/AssessmentItem";
import TaskItem from "../item/TaskItem";
import MaterialItem from "../item/MaterialItem";
import UserItem from "../item/UserItem";
import Empty from "../../misc/empty/Empty";
import { TabPanel, TabIndex } from "../../misc/tab-panel/TabPanel";
import {
  Avatar,
  Badge,
  Box,
  Dialog,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Hidden,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  AssignmentOutlined as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  DesktopWindows as DesktopWindowsIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  LibraryBooks as LibraryBooksIcon,
  MenuBook as MenuBookIcon,
  Pageview as PageviewIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Warning as WarningIcon,
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
    backgroundImage: `url(${viewClassPicture})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  classMembersDivider: {
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

const TASK_STATUS = {
  SUBMITTED: "Sudah Dikumpulkan",
  NOT_SUBMITTED: "Belum Dikumpulkan",
};

const ASSESSMENT_STATUS = {
  SUBMITTED: "Sudah Ditempuh",
  NOT_SUBMITTED: "Belum Ditempuh",
};

function sortAscByCreatedAt(rows) {
  const stabilizedThis = rows.map((el, index) => [el, index]);
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };
  const comparator = (a, b) => descendingComparator(a, b, "createdAt");
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function AssignmentListItem(props) {
  const classes = useStyles();

  return (
    <div>
      <Hidden smUp implementation="css">
        <Link to={props.work_link}>
          <Paper variant="outlined" className={classes.listItemPaper}>
            <Badge
              style={{ display: "flex", flexDirection: "row" }}
              badgeContent={
                props.work_status === TASK_STATUS.NOT_SUBMITTED ? (
                  <ErrorIcon className={classes.errorIcon} />
                ) : (
                  <CheckCircleIcon className={classes.checkIcon} />
                )
              }
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <ListItem button className={classes.listItem}>
                <Grid container alignItems="center">
                  <Grid item xs={7}>
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          {props.work_title}
                        </Typography>
                      }
                      secondary={props.work_subject}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <ListItemText
                      align="right"
                      primary={
                        <Typography variant="subtitle" color="textSecondary">
                          {moment(props.work_dateposted)
                            .locale("id")
                            .format("DD MMM YYYY")}
                        </Typography>
                      }
                      secondary={moment(props.work_dateposted)
                        .locale("id")
                        .format("HH.mm")}
                    />
                  </Grid>
                </Grid>
              </ListItem>
            </Badge>
          </Paper>
        </Link>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Link to={props.work_link}>
          <Paper variant="outlined" className={classes.listItemPaper}>
            <Badge
              style={{ display: "flex", flexDirection: "row" }}
              badgeContent={
                props.work_status === TASK_STATUS.NOT_SUBMITTED ? (
                  <ErrorIcon className={classes.errorIcon} />
                ) : (
                  <CheckCircleIcon className={classes.checkIcon} />
                )
              }
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <ListItem button className={classes.listItem}>
                <ListItemAvatar>{props.work_category_avatar}</ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1">{props.work_title}</Typography>
                  }
                  secondary={props.work_subject}
                />
                <ListItemText
                  align="right"
                  primary={
                    <Typography variant="subtitle" color="textSecondary">
                      {moment(props.work_dateposted)
                        .locale("id")
                        .format("DD MMM YYYY")}
                    </Typography>
                  }
                  secondary={moment(props.work_dateposted)
                    .locale("id")
                    .format("HH.mm")}
                />
              </ListItem>
            </Badge>
          </Paper>
        </Link>
      </Hidden>
    </div>
  );
}

function AssessmentListItem(props) {
  const classes = useStyles();

  // Dialog Kuis dan Ujian
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentDialogInfo, setCurrentDialogInfo] = React.useState({});

  const handleOpenDialog = (
    title,
    subject,
    teacher_name,
    start_date,
    end_date
  ) => {
    setCurrentDialogInfo({
      title,
      subject,
      teacher_name,
      start_date,
      end_date,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Hidden smUp implementation="css">
        <Paper
          variant="outlined"
          className={classes.listItemPaper}
          onClick={() =>
            handleOpenDialog(
              props.work_title,
              props.work_subject,
              props.work_teacher_name,
              props.work_starttime,
              props.work_endtime
            )
          }
        >
          <Badge
            style={{ display: "flex", flexDirection: "row" }}
            badgeContent={
              props.work_status === ASSESSMENT_STATUS.SUBMITTED ? (
                <WarningIcon className={classes.warningIcon} />
              ) : (
                <CheckCircleIcon className={classes.checkIcon} />
              )
            }
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <ListItem button className={classes.listItem}>
              <ListItemText
                primary={
                  <Typography variant="body1">{props.work_title}</Typography>
                }
                secondary={props.work_subject}
              />

              {/* <ListItemText
                align="right"
                primary={
                  <Typography variant="body2" color="textSecondary">
                    Mulai: <br /> {props.work_starttime}
                  </Typography>
                }
              /> */}
              <ListItemText
                align="right"
                primary={
                  <Typography variant="subtitle" color="textSecondary">
                    {moment(props.work_dateposted)
                      .locale("id")
                      .format("DD MMM YYYY")}
                  </Typography>
                }
                secondary={moment(props.work_dateposted)
                  .locale("id")
                  .format("HH.mm")}
              />
            </ListItem>
          </Badge>
        </Paper>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Paper
          variant="outlined"
          className={classes.listItemPaper}
          onClick={() =>
            handleOpenDialog(
              props.work_title,
              props.work_subject,
              props.work_teacher_name,
              props.work_starttime,
              props.work_endtime
            )
          }
        >
          <Badge
            badgeContent={
              props.work_status === ASSESSMENT_STATUS.SUBMITTED ? (
                <WarningIcon className={classes.warningIcon} />
              ) : (
                <CheckCircleIcon className={classes.checkIcon} />
              )
            }
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <ListItem button className={classes.listItem}>
              <ListItemAvatar>{props.work_category_avatar}</ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body1">{props.work_title}</Typography>
                }
                secondary={props.work_subject}
              />
              <ListItemText
                align="right"
                primary={
                  <Typography variant="subtitle" color="textSecondary">
                    {moment(props.work_dateposted)
                      .locale("id")
                      .format("DD MMM YYYY")}
                  </Typography>
                }
                secondary={moment(props.work_dateposted)
                  .locale("id")
                  .format("HH.mm")}
              />
            </ListItem>
          </Badge>
        </Paper>
      </Hidden>
      <Dialog
        fullScreen={false}
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth={true}
        maxWidth="sm"
      >
        <div style={{ padding: "20px" }}>
          <Typography variant="h4" align="center">
            {currentDialogInfo.title}
          </Typography>
          <Typography variant="h5" align="center" color="primary">
            {currentDialogInfo.subject}
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            style={{ marginTop: "25px" }}
          >
            Guru: {currentDialogInfo.teacher_name}
          </Typography>
          <Typography variant="subtitle1" align="center">
            Mulai: {currentDialogInfo.start_date}
          </Typography>
          <Typography variant="subtitle1" align="center">
            Selesai: {currentDialogInfo.end_date}
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            color="textSecondary"
            style={{ marginTop: "10px", textAlign: "center" }}
          >
            Tautan untuk Kuis atau Ujian anda akan diberikan oleh guru mata
            pelajaran terkait.
          </Typography>
        </div>
      </Dialog>
    </div>
  );
}

function MaterialListitem(props) {
  const classes = useStyles();

  return (
    <div>
      <Hidden smUp implementation="css">
        <Link to={props.work_link}>
          <Paper variant="outlined" className={classes.listItemPaper}>
            <ListItem button className={classes.listItem}>
              <ListItemText
                primary={
                  <Typography variant="body1">{props.work_title}</Typography>
                }
                secondary={!props.work_subject ? " " : props.work_subject}
              />
            </ListItem>
          </Paper>
        </Link>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Link to={props.work_link}>
          <Paper
            variant="outlined"
            className={classes.listItemPaper}
            style={{ display: "flex", alignItems: "center" }}
          >
            <ListItem button className={classes.listItem}>
              <ListItemAvatar>{props.work_category_avatar}</ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body1">{props.work_title}</Typography>
                }
                secondary={!props.work_subject ? " " : props.work_subject}
              />
              <ListItemText
                align="right"
                primary={
                  <Typography variant="subtitle" color="textSecondary">
                    {moment(props.work_dateposted)
                      .locale("id")
                      .format("DD MMM YYYY")}
                  </Typography>
                }
                secondary={moment(props.work_dateposted)
                  .locale("id")
                  .format("HH.mm")}
              />
            </ListItem>
          </Paper>
        </Link>
      </Hidden>
    </div>
  );
}

function PersonListItem(props) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={props.person_avatar ? props.person_avatar : null} />
      </ListItemAvatar>
      <Hidden smUp implementation="css">
        <ListItemText
          primary={
            <Typography variant="subtitle1">{props.person_name}</Typography>
          }
          secondary={
            <Typography variant="caption" color="textSecondary">
              {props.person_role}
            </Typography>
          }
        />
      </Hidden>
      <Hidden xsDown implementation="css">
        <ListItemText
          primary={<Typography variant="h6">{props.person_name}</Typography>}
          secondary={
            <Typography variant="body2" color="textSecondary">
              {props.person_role}
            </Typography>
          }
        />
      </Hidden>
    </ListItem>
  );
}

function ViewClass(props) {
  const classes = useStyles();
  const {
    setCurrentClass,
    getStudentsByClass,
    getAllSubjects,
    tasksCollection,
    getTeachers,
    getMaterialByClass,
    getTaskAtmpt,
    getAllAssessments,
    getAssessmentsByClass,
    getMultipleFileAvatar,
    getTaskByClass,
  } = props;
  const { students_by_class, all_teachers_map, user, all_roles } = props.auth;
  const { kelas } = props.classesCollection;
  const { all_subjects, all_subjects_map } = props.subjectsCollection;
  const { selectedMaterials } = props.materialsCollection;
  const classId = props.match.params.id;
  const { all_assessments, selectedAssessments } = props.assessmentsCollection;

  const [walikelas, setWalikelas] = React.useState({});
  const [taskAtmpt, setTaskAtmpt] = React.useState([]);
  const [avatar, setAvatar] = React.useState({});
  const [submittedTaskIds, setSubmittedTaskIds] = React.useState(new Set());

  function listTasks(subjectId) {
    if (!Boolean(tasksCollection.length)) {
      return <Empty />;
    }
    let taskList = [];
    if (panel === 0) {
      // If panel is "Pekerjaan Kelas"
      taskList = tasksCollection.slice(0, 5);
    } else if (panel === 1) {
      // If panel is "Mata Pelajaran"
      taskList = tasksCollection
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
    if (panel == 0) {
      // If panel is "Pekerjaan Kelas"
      materialList = selectedMaterials.slice(0, 5);
    } else if (panel == 1) {
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
    if (panel == 0) {
      // If panel is "Pekerjaan Kelas"
      assessmentList = selectedAssessments
        .filter((assessment) => assessment.type == type)
        .slice(0, 5);
    } else if (panel == 1) {
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
  }, [students_by_class.length, kelas.walikelas]);

  React.useEffect(() => {
    if (user.role === all_roles.STUDENT) {
      let submittedTaskIdSet = new Set();
      getFileSubmitTasksByAuthor(user._id)
        .then((response) => {
          for (let file of response.data) {
            submittedTaskIdSet.add(file.task_id);
          }
        })
        .finally(() => {
          // kalau dapat error 404 (files.length === 0), submittedTaskIds akan diisi Set kosong
          setSubmittedTaskIds(submittedTaskIdSet);
        });
    }
  }, []);

  const [panel, setPanel] = React.useState(0);
  const handleChange = (event, newValue) => {
    setPanel(newValue);
  };

  function student_role(id) {
    switch (id) {
      case kelas.ketua_kelas:
        return "Ketua Kelas";

      case kelas.bendahara:
        return "Bendahara";

      case kelas.sekretaris:
        return "Sekretaris";

      default:
        return null;
    }
  }

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
              {!isObjEmpty(walikelas) ? (
                <div style={{ padding: "8px 0px" }}>
                  {/* satu grid ini mau diganti dengan useritem gak cuma personlist aja */}
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <PersonListItem
                        person_avatar={avatar[walikelas._id]}
                        person_name={walikelas.name}
                        person_role={
                          all_subjects_map
                            ? all_subjects_map.get(walikelas.subject_teached)
                            : null
                        }
                      />
                    </Grid>
                    {user.email === walikelas.email ? null : ( // To disable profile view for the user's own profile
                      <Grid item xs container justify="flex-end">
                        <Grid item>
                          <Tooltip title="Lihat Profil">
                            <Link
                              to={{
                                pathname: `/lihat-profil/${walikelas._id}`,
                              }}
                            >
                              <IconButton
                                size="small"
                                className={classes.viewUserButton}
                              >
                                <PageviewIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </div>
              ) : (
                <Typography
                  color="textSecondary"
                  align="center"
                  style={{ padding: "15px" }}
                >
                  Kosong
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Typography variant="h4" gutterBottom>
                Murid
              </Typography>
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
                <List>
                  {students_by_class.map((student) => (
                    /* satu grid ini mau diganti dengan useritem gak cuma personlist aja */
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <PersonListItem
                          person_avatar={avatar[student._id]}
                          person_name={student.name}
                          person_id={student._id}
                          person_role={student_role(student._id)}
                        />
                      </Grid>
                      <Grid item xs container justify="flex-end">
                        <Grid item>
                          <Tooltip title="Lihat Profil">
                            <Link
                              to={{
                                pathname: `/lihat-profil/${student._id}`,
                              }}
                            >
                              <IconButton
                                size="small"
                                className={classes.viewUserButton}
                              >
                                <PageviewIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </List>
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
                  <div style={{ padding: "8px 0px" }}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <PersonListItem
                          person_avatar={
                            isObjEmpty(walikelas) ? null : avatar[walikelas._id]
                          }
                          person_name={walikelas.name}
                          person_role={
                            all_subjects_map
                              ? all_subjects_map.get(walikelas.subject_teached)
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs container justify="flex-end">
                        <Grid item>
                          <Tooltip title="Lihat Profil">
                            <Link
                              to={{
                                pathname: `/lihat-profil/${walikelas._id}`,
                              }}
                            >
                              <IconButton
                                size="small"
                                className={classes.viewUserButton}
                              >
                                <PageviewIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                )}
              </Grid>
              <Grid item>
                <Typography variant="h4" gutterBottom>
                  Murid
                </Typography>
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
                  <List>
                    {students_by_class.map((student) => (
                      <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                      >
                        {[
                          <Grid item>
                            <PersonListItem
                              person_avatar={avatar[student._id]}
                              person_name={student.name}
                              person_role={student_role(student._id)}
                            />
                          </Grid>,
                          user.email === student.email ? null : (
                            <Grid item xs container justify="flex-end">
                              <Grid item>
                                <Tooltip title="Lihat Profil">
                                  <Link
                                    to={{
                                      pathname: `/lihat-profil/${student._id}`,
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      className={classes.viewUserButton}
                                    >
                                      <PageviewIcon fontSize="small" />
                                    </IconButton>
                                  </Link>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          ),
                        ]}
                      </Grid>
                    ))}
                  </List>
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
