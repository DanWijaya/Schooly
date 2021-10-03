import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import {
  getStudents,
  getStudentsByClass,
  getTeachers,
} from "../../../actions/UserActions";
import { getMaterial } from "../../../actions/MaterialActions";
import {
  getAllTask,
  getSubmittedTasks,
  getTaskAtmpt,
  getTaskByClass,
} from "../../../actions/TaskActions";
import { getAllAssessments } from "../../../actions/AssessmentActions";
import { getFileSubmitTasksByAuthor } from "../../../actions/files/FileSubmitTaskActions";
import {
  getFileAvatar,
  getMultipleFileAvatar,
} from "../../../actions/files/FileAvatarActions";
import viewClassPicture from "./ViewClassPicture.png";
import AssessmentItem from "../item/AssessmentItem";
import TaskItem from "../item/TaskItem";
import MaterialItem from "../item/MaterialItem";
import UserItem from "../item/UserItem";
import Empty from "../../misc/empty/Empty";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
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
  Typography
} from "@material-ui/core";
import {
  AssignmentOutlined as AssignmentIcon,
  Ballot as BallotIcon,
  CheckCircle as CheckCircleIcon,
  DesktopWindows as DesktopWindowsIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  MenuBook as MenuBookIcon,
  Pageview as PageviewIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Warning as WarningIcon
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
}));

const TASK_STATUS = {
  SUBMITTED : "Sudah Dikumpulkan",
  NOT_SUBMITTED : "Belum Dikumpulkan"
}

const ASSESSMENT_STATUS = {
  SUBMITTED : "Sudah Ditempuh",
  NOT_SUBMITTED: "Belum Ditempuh"
}

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

  const handleOpenDialog = (title, subject, teacher_name, start_date, end_date) => {
    setCurrentDialogInfo({ title, subject, teacher_name, start_date, end_date });
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
              props.work_endtime,
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
              props.work_endtime,
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
              {/* <ListItemText
                align="right"
                primary={
                  <Typography variant="body2" color="textSecondary">
                    Mulai: {props.work_starttime}
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
          <Typography
            variant="subtitle1"
            align="center"
          >
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
        <Avatar src={props.person_avatar} />
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
    getMaterial,
    getAllTaskFilesByUser,
    getAllTask,
    getTaskAtmpt,
    getAllAssessments,
    assessmentsCollection,
    getFileAvatar,
    getMultipleFileAvatar,
    getTaskByClass
  } = props;
  const { students_by_class, all_teachers_map, user } = props.auth;
  const { kelas } = props.classesCollection;
  const { all_subjects, all_subjects_map } = props.subjectsCollection;
  const { selectedMaterials } = props.materialsCollection;
  const classId = props.match.params.id;
  // const { all_user_files } = props.filesCollection;

  const [walikelas, setWalikelas] = React.useState({});
  const [taskAtmpt, setTaskAtmpt] = React.useState([]);
  const [avatar, setAvatar] = React.useState({});
  const [submittedTaskIds, setSubmittedTaskIds] = React.useState(new Set());

  const all_assessments = assessmentsCollection.all_assessments;

  function showTasks(data) {
    if (data.length === 0) {
      return <Empty />;
    } else {
      return sortAscByCreatedAt(data).map((row) => (
        <AssignmentListItem
          work_title={row.name}
          work_category_avatar={row.workCategoryAvatar}
          work_subject={
            row.category === "subject"
              ? null
              : all_subjects_map.get(row.subject)
          }
          work_status={row.workStatus}
          work_dateposted={row.createdAt}
          work_link={`/tugas-murid/${row._id}`}
        />
      ));
    }
  }

  function showAssessments(data) {
    if (data.length === 0) {
      return <Empty />;
    } else {
      return sortAscByCreatedAt(data).map((row) => (
        <AssessmentListItem
          work_title={row.name}
          work_category_avatar={row.workCategoryAvatar}
          work_subject={
            row.category === "subject"
              ? null
              : all_subjects_map.get(row.subject)
          }
          work_status={row.workStatus}
          work_teacher_name={row.teacher_name}
          work_starttime={moment(row.start_date)
            .locale("id")
            .format("DD MMM YYYY, HH:mm")}
          work_endtime={moment(row.end_date)
            .locale("id")
            .format("DD MMM YYYY, HH:mm")}
          work_dateposted={row.createdAt}
        />
      ));
    }
  }

  function showMaterials(data) {
    if (data.length === 0) {
      return <Empty />;
    } else {
      return sortAscByCreatedAt(data).map((row) => (
        <MaterialListitem
          work_title={row.name}
          work_category_avatar={row.workCategoryAvatar}
          work_subject={all_subjects_map.get(row.subject)}
          work_link={`/materi/${row._id}`}
          work_dateposted={row.createdAt}
        />
      ));
    }
  }

  function showAllbySubject(data) {
    if (data.length === 0) {
      return <Empty />;
    } else {
      return sortAscByCreatedAt(data).map((row) => {
        if (row.objectType === "Tugas") {
          return (
            <AssignmentListItem
              work_title={row.name}
              work_category_avatar={row.workCategoryAvatar}
              work_subject={
                row.category === "subject"
                  ? null
                  : all_subjects_map.get(row.subject)
              }
              work_status={row.workStatus}
              work_dateposted={row.createdAt}
              work_link={`/tugas-murid/${row._id}`}
            />
          );
        } else if (row.objectType === "Material") {
          return (
            <MaterialListitem
              work_title={row.name}
              work_category_avatar={row.workCategoryAvatar}
              work_subject={all_subjects_map.get(row.subject)}
              work_link={`/materi/${row._id}`}
              work_dateposted={row.createdAt}
            />
          );
        } else {
          return (
            <AssessmentListItem
              work_title={row.name}
              work_category_avatar={row.workCategoryAvatar}
              work_subject={
                row.category === "subject"
                  ? null
                  : all_subjects_map.get(row.subject)
              }
              work_status={row.workStatus}
              work_teacher_name={row.teacher_name}
              work_starttime={moment(row.start_date)
                .locale("id")
                .format("DD MMM YYYY, HH:mm")}
              work_endtime={moment(row.end_date)
                .locale("id")
                .format("DD MMM YYYY, HH:mm")}
              work_dateposted={row.createdAt}
            />
          );
        }
      });
    }
  }

  function listTasks(category = null, subject = {}, tab = "pekerjaan_kelas") {
    let tasksList = [];
    let result = [];
    if (Boolean(tasksCollection.length)) {
      var i;
      for (i = tasksCollection.length - 1; i >= 0; i--) {
        if (taskAtmpt.indexOf(tasksCollection[i]._id) === -1) {
          // Get the not attempted task.
          tasksList.push(tasksCollection[i]);
        }
        // if(i === tasksCollection.length - 5){ // Last item must be at 4th index.
        //   break;
        // }
      }

      for (i = 0; i < tasksList.length; i++) {
        let task = tasksList[i];
        let workCategoryAvatar = (
          <Avatar className={classes.assignmentLate}>
            <AssignmentIcon />
          </Avatar>
        );

        let workStatus;
        if(submittedTaskIds.has(task._id)){
          workStatus = TASK_STATUS.SUBMITTED;
        } else {
          workStatus = TASK_STATUS.NOT_SUBMITTED;
        }

        if (tab === "pekerjaan_kelas") {
          if (
            (!category ||
              (category === "subject" && task.subject === subject._id)) &&
            (workStatus && workStatus === TASK_STATUS.NOT_SUBMITTED)
          ) {
            result.push({
              _id: task._id,
              name: task.name,
              workCategoryAvatar: workCategoryAvatar,
              subject: task.subject,
              workStatus: workStatus,
              createdAt: task.createdAt,
              objectType: "Tugas",
              category: category,
            });
            if (!category && result.length === 5) break;

            if (category === "subject" && result.length === 3) break;
          }
        } else if (tab === "mata_pelajaran") {
          if (
            !category ||
            (category === "subject" && task.subject === subject._id)
          ) {
            result.push({
              _id: task._id,
              name: task.name,
              workCategoryAvatar: workCategoryAvatar,
              subject: task.subject,
              workStatus: workStatus,
              createdAt: task.createdAt,
              objectType: "Task",
              category: category,
            });
          }
        }
      }
    }
    return result;
  }

  function listAssessments(
    category = null,
    subject = {},
    type,
    tab = "pekerjaan_kelas"
  ) {
    let AssessmentsList = [];
    let result = [];
    if (Boolean(all_assessments.length)) {
      var i;
      for (i = all_assessments.length - 1; i >= 0; i--) {
        let assessment = all_assessments[i];
        let class_assigned = assessment.class_assigned;
        if (class_assigned.indexOf(classId) !== -1) {
          AssessmentsList.push(assessment);
        }
      }

      for (i = 0; i < AssessmentsList.length; i++) {
        let assessment = AssessmentsList[i];
        let workCategoryAvatar =
          type === "Kuis" ? (
            <Avatar className={classes.assignmentLate}>
              <FaClipboardList />
            </Avatar>
          ) : (
            <Avatar className={classes.assignmentLate}>
              <BsClipboardData />
            </Avatar>
          );

        if (tab === "pekerjaan_kelas") {
          let workStatus = ASSESSMENT_STATUS.SUBMITTED;
          if (type === "Kuis") {
            if (
              (!category ||
                (category === "subject" &&
                  assessment.subject === subject._id)) &&
              !assessment.submissions &&
              assessment.type === "Kuis" &&
              assessment.posted
            ) {
              result.push({
                name: assessment.name,
                workCategoryAvatar: workCategoryAvatar,
                subject: assessment.subject,
                workStatus: workStatus,
                teacher_name: (all_teachers_map instanceof Map && all_teachers_map.get(assessment.author_id)) ? all_teachers_map.get(assessment.author_id).name : null,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                createdAt: assessment.createdAt,
                objectType: "Kuis",
                category: category,
              });
            }
          }
          if (type === "Ujian") {
            if (
              (!category ||
                (category === "subject" &&
                  assessment.subject === subject._id)) &&
              !assessment.submissions &&
              assessment.type === "Ujian" &&
              assessment.posted
            ) {
              result.push({
                name: assessment.name,
                workCategoryAvatar: workCategoryAvatar,
                subject: assessment.subject,
                workStatus: workStatus,
                teacher_name: (all_teachers_map instanceof Map && all_teachers_map.get(assessment.author_id)) ? all_teachers_map.get(assessment.author_id).name : null,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                createdAt: assessment.createdAt,
                objectType: "Ujian",
                category: category,
              });
            }
          }
          if (!category && result.length === 5) break;
          if (category === "subject" && result.length === 3) break;
        } else if (tab === "mata_pelajaran") {
          let workStatus = !assessment.submissions
            ? ASSESSMENT_STATUS.SUBMITTED
            : ASSESSMENT_STATUS.SUBMITTED;
          if (type === "Kuis") {
            if (
              (!category ||
                (category === "subject" &&
                  assessment.subject === subject._id)) &&
              assessment.type === "Kuis" &&
              assessment.posted
            ) {
              result.push({
                name: assessment.name,
                workCategoryAvatar: workCategoryAvatar,
                subject: assessment.subject,
                workStatus: workStatus,
                teacher_name: (all_teachers_map instanceof Map && all_teachers_map.get(assessment.author_id)) ? all_teachers_map.get(assessment.author_id).name : null,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                createdAt: assessment.createdAt,
                objectType: "Kuis",
                category: category,
              });
            }
          }
          if (type === "Ujian") {
            if (
              (!category ||
                (category === "subject" &&
                  assessment.subject === subject._id)) &&
              assessment.type === "Ujian" &&
              assessment.posted
            ) {
              result.push({
                name: assessment.name,
                workCategoryAvatar: workCategoryAvatar,
                subject: assessment.subject,
                workStatus: workStatus,
                teacher_name: (all_teachers_map instanceof Map && all_teachers_map.get(assessment.author_id)) ? all_teachers_map.get(assessment.author_id).name : null,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                createdAt: assessment.createdAt,
                objectType: "Ujian",
                category: category,
              });
            }
          }
        }
      }
    }
    return result;
  }

  function listMaterials(
    category = null,
    subject = {},
    tab = "pekerjaan_kelas"
  ) {
    let materialList = [];

    if (Boolean(selectedMaterials.length)) {
      let workCategoryAvatar = (
        <Avatar className={classes.material}>
          <MenuBookIcon />
        </Avatar>
      );
      for (var i = selectedMaterials.length - 1; i >= 0; i--) {
        let material = selectedMaterials[i];
        if (
          !category ||
          (category === "subject" && material.subject === subject._id)
        ) {
          materialList.push({
            _id: material._id,
            name: material.name,
            workCategoryAvatar: workCategoryAvatar,
            subject: material.subject,
            createdAt: material.createdAt,
            objectType: "Material",
          });
        }
        if (tab === "pekerjaan_kelas") {
          if (!category && materialList.length === 5)
            // Number of item to the index, so that it has to be index = selectedMaterials.length - 5.
            break;
          if (category === "subject" && materialList.length === 3)
            // Number of item to the index, so that it has to be index = selectedMaterials.length - 5.
            break;
        }
      }
    }
    return materialList;
  }

  React.useEffect(() => {
    if (user.role === "Student") {
      if (user.kelas && user.kelas === classId) {
        // If this student has been assigned to a class.
        // Clas id that is inserted as a parameter is the class id that is assigned to the student.
        getMaterial(user.kelas, "by_class");
        getTaskByClass(user.kelas)
        //getAllTask(); // get the tasksCollection
      } else {
        // If this student has not been assigned to any class or tried to open other class page,
        // then nothing will be loaded and will be redirected to the corresponding page (below).
        return;
      }
    }
    getAllSubjects("map"); // get the all_subjects_map in map
    getAllSubjects(); // get the all_subjects
    getStudentsByClass(props.match.params.id); // get the students_by_class
    // getTeachers("map"); // Moved
    getStudents();

    getAllTaskFilesByUser(user._id); // get the all_user_files
    getAllAssessments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getTaskAtmpt(user._id).then((data) => {
      setTaskAtmpt(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id]);

  React.useEffect(() => {
    // To get the current class, then
    // get the homeroom teacher id
    // move getTeachers("map") here because wants to execute setWalikelas, only after that finish.
    var id_list;
    setCurrentClass(classId).then((kelas) => {
      if (kelas) {
        id_list = [kelas.walikelas];
        students_by_class.forEach((s) => id_list.push(s._id));
        getMultipleFileAvatar(id_list).then((results) => {
          setAvatar(results);
        });
        getTeachers("map").then((results) =>
          setWalikelas(results.get(kelas.walikelas))
        );
      }
      // setWalikelas(all_teachers_map.get(kelas.walikelas));
    });
  }, [students_by_class.length, kelas.walikelas]);

  React.useEffect(() => {
    if(user.role === "Student"){
      let submittedTaskIdSet = new Set();
      getFileSubmitTasksByAuthor(user._id).then((response) => {
        for (let file of response.data) {
          submittedTaskIdSet.add(file.task_id);
        }
      }).finally(() => {
        // If there is error 404 (files.length === 0), submittedTaskIds will be filled with empty set.
        setSubmittedTaskIds(submittedTaskIdSet);
      });
    }
  }, [])

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  if (user.role === "Student") {
    if (user.kelas) {
      if (classId !== user.kelas) {
        // If this student open other class page,
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

  document.title = !kelas.name
    ? "Schooly | Lihat Kelas"
    : `Schooly | ${kelas.name}`;

  return (
    <div className={classes.root}>
      {user.role === "Admin" || user.role === "Teacher" ? (
        <div>
          <Paper square>
            <div className={classes.classWallpaper}>
              <Typography variant="h3">
                {kelas.name}
              </Typography>
              <Typography variant="h6">
                {isObjEmpty(walikelas) ? null : walikelas.name}
              </Typography>
            </div>
          </Paper>
          <Grid container direction="column" spacing={10} style={{ padding: "15px" }}>
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
                          <LightTooltip title="Lihat Profil">
                            <Link
                              to={{
                                pathname: `/lihat-profil/${walikelas._id}`,
                              }}
                            >
                              <IconButton
                                size="small"
                                className={classes.viewMaterialButton}
                              >
                                <PageviewIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </LightTooltip>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </div>
              ) : (
                <Typography color="textSecondary" align="center" style={{ padding: "15px" }}>
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
                <Typography color="textSecondary" align="center" style={{ padding: "15px" }}>
                  Kosong
                </Typography>
              ) : (
                <List>
                  {students_by_class.map((student) => (
                    /* satu grid ini mau diganti dengan useritem gak cuma personlist aja */
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <PersonListItem
                          // person_avatar={`/api/upload/avatar/${student.avatar}`}
                          person_avatar={avatar[student._id]}
                          person_name={student.name}
                          person_id={student._id}
                          person_role={student_role(student._id)}
                        />
                      </Grid>
                      <Grid item xs container justify="flex-end">
                        <Grid item>
                          <LightTooltip title="Lihat Profil">
                            <Link
                              to={{
                                pathname: `/lihat-profil/${student._id}`,
                              }}
                            >
                              <IconButton
                                size="small"
                                className={classes.viewMaterialButton}
                              >
                                <PageviewIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </LightTooltip>
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
              <Typography variant="h3">
                {kelas.name}
              </Typography>
              <Typography variant="h6">
                {isObjEmpty(walikelas) ? null : walikelas.name}
              </Typography>
            </div>
            <Tabs
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              value={value}
              onChange={handleChange}
            >
              <Tab
                icon={<DesktopWindowsIcon />}
                label="Pekerjaan Kelas"
              />
              <Tab
                icon={<BallotIcon />}
                label="Mata Pelajaran"
              />
              <Tab
                icon={<SupervisorAccountIcon />}
                label="Peserta"
              />
            </Tabs>
          </Paper>
          <TabPanel value={value} index={0} style={{ paddingTop: "15px" }}>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs>
                    <div className={classes.objectPanel}>
                      <MenuBookIcon className={classes.objectIcon} />
                      <Typography variant="h6">
                        Materi
                      </Typography>
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
                <div style={{ width: "100%" }}>
                  {showMaterials(listMaterials())}
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs container alignItems="center">
                    <div className={classes.objectPanel}>
                      <AssignmentIcon className={classes.objectIcon} />
                      <Typography variant="h6">
                        Tugas
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Lihat Semua" >
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
                <div style={{ width: "100%" }}>
                  {showTasks(listTasks())}
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs container alignItems="center">
                    <div className={classes.objectPanel}>
                      <FaClipboardList className={classes.objectIcon} />
                      <Typography variant="h6">
                        Kuis
                      </Typography>
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
                <div style={{ width: "100%" }}>
                  {showAssessments(listAssessments(null, {}, "Kuis"))}
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs container alignItems="center">
                    <div className={classes.objectPanel}>
                      <BsClipboardData className={classes.objectIcon} />
                      <Typography variant="h6">
                        Ujian
                      </Typography>
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
                <div style={{ width: "100%" }}>
                  {showAssessments(listAssessments(null, {}, "Ujian"))}
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </TabPanel>
          <TabPanel value={value} index={1} style={{ paddingTop: "15px" }}>
            {all_subjects.length === 0
              ? null
              : all_subjects.map((subject) => {
                  if (kelas.subject_assigned && kelas.subject_assigned.includes(subject._id)) {
                    return (
                      <ExpansionPanel>
                        <ExpansionPanelSummary>
                          <Grid container justify="space-between" alignItems="center">
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
                        <ExpansionPanelDetails className={classes.objectDetails}>
                          <div style={{ width: "100%" }}>
                            {showAllbySubject(
                              listMaterials("subject", subject, "mata_pelajaran").concat(
                              listTasks("subject", subject, "mata_pelajaran")).concat(
                              listAssessments("subject", subject, "Kuis", "mata_pelajaran")).concat(
                              listAssessments("subject", subject, "Ujian", "mata_pelajaran"))
                            )}
                          </div>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    );
                  }
                })}
          </TabPanel>
          <TabPanel value={value} index={2} style={{ paddingTop: "15px" }}>
            <Grid container direction="column" spacing={10} style={{ padding: "15px" }}>
              <Grid item>
                <Typography variant="h4" gutterBottom>
                  Wali Kelas
                </Typography>
                <Divider className={classes.classMembersDivider} />
                {isObjEmpty(walikelas) ? (
                  <Typography color="textSecondary" align="center" style={{ padding: "15px" }}>
                    Kosong
                  </Typography>
                ) : (
                  <div style={{ padding: "8px 0px" }}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <PersonListItem
                          person_avatar={`/api/upload/avatar/${walikelas.avatar}`}
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
                          <LightTooltip title="Lihat Profil">
                            <Link
                              to={{
                                pathname: `/lihat-profil/${walikelas._id}`,
                              }}
                            >
                              <IconButton
                                size="small"
                                className={classes.viewMaterialButton}
                              >
                                <PageviewIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </LightTooltip>
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
                    <Typography color="textSecondary" align="center" style={{ padding: "15px" }}>
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
                                person_avatar={avatar[walikelas._id]}
                                person_name={student.name}
                                person_role={student_role(student._id)}
                              />
                            </Grid>,
                            user.email === student.email ? null : (
                              <Grid item xs container justify="flex-end">
                                <Grid item>
                                  <LightTooltip title="Lihat Profil">
                                    <Link
                                      to={{
                                        pathname: `/lihat-profil/${student._id}`,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        className={classes.viewMaterialButton}
                                      >
                                        <PageviewIcon fontSize="small" />
                                      </IconButton>
                                    </Link>
                                  </LightTooltip>
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
  getAllTask: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  getMaterial: PropTypes.func.isRequired,
  getAllTaskFilesByUser: PropTypes.func.isRequired,
  getAllAssessments: PropTypes.func.isRequired,
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
  getAllTask,
  getTeachers,
  getMaterial,
  getAllTaskFilesByUser,
  getAllAssessments,
  getStudents,
  getTaskAtmpt,
  getFileAvatar,
  getMultipleFileAvatar,
  getTaskByClass
})(ViewClass);
