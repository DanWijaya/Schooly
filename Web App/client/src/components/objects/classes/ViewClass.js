import React from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/id";
import { setCurrentClass } from "../../../actions/ClassActions";
import {
  getStudents,
  getStudentsByClass,
  getTeachers,
} from "../../../actions/UserActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import {
  getAllTask,
  getTaskAtmpt,
  getTaskByClass,
} from "../../../actions/TaskActions";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import {
  getFileAvatar,
  getMultipleFileAvatar,
} from "../../../actions/files/FileAvatarActions";
import { getMaterial } from "../../../actions/MaterialActions";
import { getAllAssessments } from "../../../actions/AssessmentActions";
import viewClassPicture from "./ViewClassPicture.png";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";

import {
  Avatar,
  Box,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  Grid,
  Hidden,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab,
  Typography,
  Dialog,
  Badge,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import BallotIcon from "@material-ui/icons/Ballot";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import PageviewIcon from "@material-ui/icons/Pageview";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import { FaClipboardList } from "react-icons/fa";
import { BsClipboardData } from "react-icons/bs";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    padding: "10px",
  },
  viewMaterialButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  classPaper: {
    height: "250px",
    padding: "30px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${viewClassPicture})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  expansionPanelList: {
    margin: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
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
  viewSubjectButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
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
  personListDivider: {
    backgroundColor: theme.palette.primary.main,
  },
  itemIcon: {
    marginRight: "10px",
    fontSize: "22px",
    color: "grey",
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function TabIndex(index) {
  return {
    id: `simple-tab-${index}`,
  };
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
                props.work_status === "Belum Dikumpulkan" ? (
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
                props.work_status === "Belum Dikumpulkan" ? (
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

  const handleOpenDialog = (title, subject, start_date, end_date) => {
    setCurrentDialogInfo({ title, subject, start_date, end_date });
    setOpenDialog(true);
    console.log(title);
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
              props.work_starttime,
              props.work_endtime
            )
          }
        >
          <Badge
            style={{ display: "flex", flexDirection: "row" }}
            badgeContent={
              props.work_status === "Belum Ditempuh" ? (
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
              props.work_starttime,
              props.work_endtime
            )
          }
        >
          <Badge
            badgeContent={
              props.work_status === "Belum Ditempuh" ? (
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
            color="textSecondary"
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
        />
        <ListItemText
          primary={
            <Typography variant="caption" color="textSecondary">
              {props.person_role}
            </Typography>
          }
        />
      </Hidden>
      <Hidden xsDown implementation="css">
        <ListItemText
          primary={<Typography variant="h6">{props.person_name}</Typography>}
        />
        <ListItemText
          primary={
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
  } = props;
  // const { all_user_files } = props.filesCollection;
  const { all_subjects, all_subjects_map } = props.subjectsCollection;
  const { selectedMaterials } = props.materialsCollection;
  const { kelas } = props.classesCollection;
  const { students_by_class, all_teachers_map, user } = props.auth;
  const classId = props.match.params.id;

  const [walikelas, setWalikelas] = React.useState({});
  const [taskAtmpt, setTaskAtmpt] = React.useState([]);
  const [avatar, setAvatar] = React.useState({});

  const all_assessments = assessmentsCollection.all_assessments;

  // All actions to retrive datas from Database

  function showTasks(data) {
    if (data.length === 0) {
      return (
        <Typography variant="subtitle1" align="center" color="textSecondary">
          Kosong
        </Typography>
      );
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
      return (
        <Typography variant="subtitle1" align="center" color="textSecondary">
          Kosong
        </Typography>
      );
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
      return (
        <Typography variant="subtitle1" align="center" color="textSecondary">
          Kosong
        </Typography>
      );
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
      return (
        <Typography variant="subtitle1" align="center" color="textSecondary">
          Kosong
        </Typography>
      );
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

  console.log("Avatar retrieved: ", avatar);
  function listTasks(category = null, subject = {}, tab = "pekerjaan_kelas") {
    let tasksList = [];
    let result = [];
    if (Boolean(tasksCollection.length)) {
      var i;
      for (i = tasksCollection.length - 1; i >= 0; i--) {
        if (taskAtmpt.indexOf(tasksCollection[i]._id) === -1) {
          // get the not attempted task.
          tasksList.push(tasksCollection[i]);
        }
        // if(i === tasksCollection.length - 5){ // item terakhir harus pas index ke 4.
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

        let workStatus = "Belum Dikumpulkan";
        for (let i = 0; i < user.tugas.length; i++) {
          if (user.tugas[i].for_task_object === task._id) {
            workStatus = "Sudah Dikumpulkan";
            break;
          }
        }

        // console.log(all_user_files)
        // for (var j = 0; j < all_user_files.length; j++){
        //     if(all_user_files[j].for_task_object === task._id){
        //     workStatus = "Telah Dikumpulkan"
        //     workCategoryAvatar = (
        //       <Avatar className={classes.assignmentTurnedIn}>
        //         <AssignmentTurnedInIcon/>
        //       </Avatar>
        //     )
        //     break;
        //   }
        // }
        if (tab === "pekerjaan_kelas") {
          if (
            (!category ||
              (category === "subject" && task.subject === subject._id)) &&
            workStatus === "Belum Dikumpulkan"
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

        // console.log(all_user_files)
        // for (var j = 0; j < all_user_files.length; j++){
        //     if(all_user_files[j].for_task_object === task._id){
        //     workStatus = "Telah Dikumpulkan"
        //     workCategoryAvatar = (
        //       <Avatar className={classes.assignmentTurnedIn}>
        //         <AssignmentTurnedInIcon/>
        //       </Avatar>
        //     )
        //     break;
        //   }
        // }
        // console.log(Object.values(assessment.submissions)[0])
        if (tab === "pekerjaan_kelas") {
          let workStatus = "Belum Ditempuh";
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
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                createdAt: assessment.createdAt,
                objectType: "Kuis",
                category: category,
              });
              // result.push(
              //   <AssessmentListItem
              //     work_title={assessment.name}
              //     work_category_avatar={workCategoryAvatar}
              //     work_subject={
              //       category === "subject"
              //         ? null
              //         : all_subjects_map.get(assessment.subject)
              //     }
              //     work_status={workStatus}
              //     work_starttime={moment(assessment.start_date)
              //       .locale("id")
              //       .format("DD MMM YYYY, HH:mm")}
              //     work_endtime={moment(assessment.end_date)
              //       .locale("id")
              //       .format("DD MMM YYYY, HH:mm")}
              //     work_dateposted={assessment.createdAt}
              //   />
              // );
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
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                createdAt: assessment.createdAt,
                objectType: "Ujian",
                category: category,
              });
              // result.push(
              //   <AssessmentListItem
              //     work_title={assessment.name}
              //     work_category_avatar={workCategoryAvatar}
              //     work_subject={
              //       category === "subject"
              //         ? null
              //         : all_subjects_map.get(assessment.subject)
              //     }
              //     work_status={workStatus}
              //     work_starttime={moment(assessment.start_date)
              //       .locale("id")
              //       .format("DD MMM YYYY, HH:mm")}
              //     work_endtime={moment(assessment.end_date)
              //       .locale("id")
              //       .format("DD MMM YYYY, HH:mm")}
              //     work_dateposted={assessment.createdAt}
              //   />
              // );
            }
          }
          if (!category && result.length === 5) break;
          if (category === "subject" && result.length === 3) break;
        } else if (tab === "mata_pelajaran") {
          let workStatus = !assessment.submissions
            ? "Belum Ditempuh"
            : "Sudah Ditempuh";
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
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                createdAt: assessment.createdAt,
                objectType: "Kuis",
                category: category,
              });
              // result.push(
              //   <AssessmentListItem
              //     work_title={assessment.name}
              //     work_category_avatar={workCategoryAvatar}
              //     work_subject={
              //       category === "subject"
              //         ? null
              //         : all_subjects_map.get(assessment.subject)
              //     }
              //     work_status={workStatus}
              //     work_starttime={moment(assessment.start_date)
              //       .locale("id")
              //       .format("DD MMM YYYY, HH:mm")}
              //     work_endtime={moment(assessment.end_date)
              //       .locale("id")
              //       .format("DD MMM YYYY, HH:mm")}
              //     work_dateposted={assessment.createdAt}
              //   />
              // );
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
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                createdAt: assessment.createdAt,
                objectType: "Ujian",
                category: category,
              });
              // result.push(
              //   <AssessmentListItem
              //     work_title={assessment.name}
              //     work_category_avatar={workCategoryAvatar}
              //     work_subject={
              //       category === "subject"
              //         ? null
              //         : all_subjects_map.get(assessment.subject)
              //     }
              //     work_status={workStatus}
              //     work_starttime={moment(assessment.start_date)
              //       .locale("id")
              //       .format("DD MMM YYYY, HH:mm")}
              //     work_endtime={moment(assessment.end_date)
              //       .locale("id")
              //       .format("DD MMM YYYY, HH:mm")}
              //     work_dateposted={assessment.createdAt}
              //   />
              // );
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
            // item ke index tsb, brarti harus harus pas index ke selectedMaterials.length - 5.
            break;
          if (category === "subject" && materialList.length === 3)
            // item ke index tsb, brarti harus harus pas index ke selectedMaterials.length - 5.
            break;
        }
      }
    }
    return materialList;
  }

  React.useEffect(() => {
    if (user.role === "Student") {
      if (user.kelas && user.kelas === classId) {
        // jika murid ini sudah ditempatkan ke suatu kelas dan
        // id kelas yang dimasukan sebagai parameter adalah id milik kelas yang ditempati murid ini,
        getMaterial(user.kelas, "by_class");
        getAllTask(); // get the tasksCollection
      } else {
        // jika murid ini belum ditempatkan di kelas manapun atau mencoba membuka halaman untuk kelas lain,
        // tidak load data apa-apa dan langsung redirect ke halaman yang sesuai (di bawah)
        return;
      }
    }
    getAllSubjects("map"); // get the all_subjects_map in map
    getAllSubjects(); // get the all_subjects
    getStudentsByClass(props.match.params.id); // get the students_by_class
    // getTeachers("map"); // dipindahkan
    getStudents();

    getAllTaskFilesByUser(user._id); // get the all_user_files
    getAllAssessments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    console.log("ID User", user._id, user._id);
    getTaskAtmpt(user._id).then((data) => {
      setTaskAtmpt(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id]);

  React.useEffect(() => {
    //Untuk mendapatkan kelas current, digunakan untuk:
    //  -> Dapatin id walikelas
    // -> pindahkan getTeachers("map") di sini karena mau execute setWalikelas hanya setelah itu selesai.
    var id_list;
    setCurrentClass(classId).then((kelas) => {
      if(kelas){
        id_list = [kelas.walikelas];
        console.log("ID LIST: ", id_list);
        students_by_class.forEach((s) => id_list.push(s._id));
        getMultipleFileAvatar(id_list).then((results) => {
          console.log(results);
          setAvatar(results);
        });
        getTeachers("map").then((results) =>
          setWalikelas(results.get(kelas.walikelas))
        );
      }
        // setWalikelas(all_teachers_map.get(kelas.walikelas));
      });
  }, [students_by_class.length, kelas.walikelas]);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // console.log(selectedMaterials)
  console.log("Avatars: ", avatar, user._id);
  document.title = !kelas.name
    ? "Schooly | Lihat Kelas"
    : `Schooly | ${kelas.name}`;

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
    // return false jika obj !== undefined dan isi object tidak kosong
    if (obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    } else {
      return true;
    }
  }

  if (user.role === "Student") {
    if (user.kelas) {
      if (classId !== user.kelas) {
        // jika murid ini membuka halaman kelas lain,
        return <Redirect to="/tidak-ditemukan" />;
      }
      // jika murid ini membuka kelas sendiri, muat halaman
    } else {
      // jika murid ini belum ditempatkan di kelas manapun,
      return (
        <div
          className={classes.root}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "48vh",
          }}
        >
          <Typography variant="h5" color="textSecondary">
            Anda belum ditempatkan di kelas manapun
          </Typography>
        </div>
      );
    }
  }

  return (
    <div className={classes.root}>
      {user.role === "Admin" || user.role === "Teacher" ? (
        <div>
          <Paper className={classes.classPaper}>
            <Typography variant="h3">{kelas.name}</Typography>
            <Typography variant="h6">
              {isObjEmpty(walikelas) ? null : walikelas.name}
            </Typography>
          </Paper>
          <div style={{ padding: "20px", marginBottom: "40px" }}>
            <Typography variant="h4" gutterBottom>
              Wali Kelas
            </Typography>
            <Divider className={classes.personListDivider} />
            <List className={classes.listContainer}>
              {!isObjEmpty(walikelas) ? (
                <Grid container justify="space-between" alignItems="center">
                  {[
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
                    </Grid>,
                    user.email === walikelas.email ? null : ( // menghilangkan tombol lihat profil di diri sendiri
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
                    ),
                  ]}
                </Grid>
              ) : (
                <Typography
                  variant="subtitle1"
                  align="center"
                  color="textSecondary"
                >
                  Kosong
                </Typography>
              )}
            </List>
          </div>
          <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
              Murid
            </Typography>
            <Divider className={classes.personListDivider} />
            <List className={classes.listContainer}>
              {students_by_class.length === 0 ? (
                <Typography
                  variant="subtitle1"
                  align="center"
                  color="textSecondary"
                >
                  Kosong
                </Typography>
              ) : (
                students_by_class.map((student) => (
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
                ))
              )}
            </List>
          </div>
        </div>
      ) : (
        <div>
          <Paper square>
            <div className={classes.classPaper}>
              <Typography variant="h3">{kelas.name}</Typography>
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
                {...TabIndex(0)}
              />
              <Tab
                icon={<BallotIcon />}
                label="Mata Pelajaran"
                {...TabIndex(1)}
              />
              <Tab
                icon={<SupervisorAccountIcon />}
                label="Peserta"
                {...TabIndex(2)}
              />
            </Tabs>
          </Paper>
          <TabPanel value={value} index={0}>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary>
                <Grid container justify="space-between" alignItems="center">
                  <Grid
                    item
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <MenuBookIcon className={classes.itemIcon} />
                    <Typography variant="h6">Materi</Typography>
                  </Grid>
                  <Grid item>
                    <LightTooltip title="Lihat Semua" placement="right">
                      <Link to="/daftar-materi">
                        <IconButton
                          size="small"
                          className={classes.viewSubjectButton}
                        >
                          <PageviewIcon fontSize="small" />
                        </IconButton>
                      </Link>
                    </LightTooltip>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <Divider />
              <List className={classes.expansionPanelList}>
                {showMaterials(listMaterials())}
              </List>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary>
                <Grid container justify="space-between" alignItems="center">
                  <Grid
                    item
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <AssignmentIcon className={classes.itemIcon} />
                    <Typography variant="h6">Tugas</Typography>
                  </Grid>
                  <Grid item>
                    <LightTooltip title="Lihat Semua" placement="right">
                      <Link to="/daftar-tugas">
                        <IconButton
                          size="small"
                          className={classes.viewSubjectButton}
                        >
                          <PageviewIcon fontSize="small" />
                        </IconButton>
                      </Link>
                    </LightTooltip>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <Divider />
              <List className={classes.expansionPanelList}>
                {showTasks(listTasks())}
              </List>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary>
                <Grid container justify="space-between" alignItems="center">
                  <Grid
                    item
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <FaClipboardList className={classes.itemIcon} />
                    <Typography variant="h6">Kuis</Typography>
                  </Grid>
                  <Grid item>
                    <LightTooltip title="Lihat Semua" placement="right">
                      <Link to="/daftar-kuis">
                        <IconButton
                          size="small"
                          className={classes.viewSubjectButton}
                        >
                          <PageviewIcon fontSize="small" />
                        </IconButton>
                      </Link>
                    </LightTooltip>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <Divider />
              <List className={classes.expansionPanelList}>
                {showAssessments(listAssessments(null, {}, "Kuis"))}
              </List>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary>
                <Grid container justify="space-between" alignItems="center">
                  <Grid
                    item
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <BsClipboardData className={classes.itemIcon} />
                    <Typography variant="h6">Ujian</Typography>
                  </Grid>
                  <Grid item>
                    <LightTooltip title="Lihat Semua" placement="right">
                      <Link to="/daftar-ujian">
                        <IconButton
                          size="small"
                          className={classes.viewSubjectButton}
                        >
                          <PageviewIcon fontSize="small" />
                        </IconButton>
                      </Link>
                    </LightTooltip>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <Divider />
              <List className={classes.expansionPanelList}>
                {showAssessments(listAssessments(null, {}, "Ujian"))}
              </List>
            </ExpansionPanel>
          </TabPanel>
          <TabPanel value={value} index={1}>
            {all_subjects.length === 0
              ? null
              : all_subjects.map((subject) => {
                  // let isEmpty = true
                  return (
                    <ExpansionPanel>
                      <ExpansionPanelSummary>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                        >
                          <Typography variant="h6">{subject.name}</Typography>
                          <LightTooltip title="Lihat Profil" placement="right">
                            <Link to={`/mata-pelajaran/${subject._id}`}>
                              <IconButton
                                size="small"
                                className={classes.viewSubjectButton}
                              >
                                <PageviewIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </LightTooltip>
                        </Grid>
                      </ExpansionPanelSummary>
                      <Divider />
                      <List className={classes.expansionPanelList}>
                        {showAllbySubject(
                          listMaterials("subject", subject, "mata_pelajaran")
                            .concat(
                              listTasks("subject", subject, "mata_pelajaran")
                            )
                            .concat(
                              listAssessments(
                                "subject",
                                subject,
                                "Kuis",
                                "mata_pelajaran"
                              )
                            )
                            .concat(
                              listAssessments(
                                "subject",
                                subject,
                                "Ujian",
                                "mata_pelajaran"
                              )
                            )
                        )}
                      </List>
                    </ExpansionPanel>
                  );
                })}
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Paper>
              <div style={{ padding: "20px", marginBottom: "40px" }}>
                <Typography variant="h4" gutterBottom>
                  Wali Kelas
                </Typography>
                <Divider className={classes.personListDivider} />
                <List className={classes.listContainer}>
                  {isObjEmpty(walikelas) ? (
                    <Typography
                      variant="subtitle1"
                      align="center"
                      color="textSecondary"
                    >
                      Kosong
                    </Typography>
                  ) : (
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
                  )}
                </List>
              </div>
              <div style={{ padding: "20px" }}>
                <Typography variant="h4" gutterBottom>
                  Murid
                </Typography>
                <Divider className={classes.personListDivider} />
                <List className={classes.listContainer}>
                  {students_by_class.length === 0 ? (
                    <Typography
                      variant="subtitle1"
                      align="center"
                      color="textSecondary"
                    >
                      Kosong
                    </Typography>
                  ) : (
                    students_by_class.map((student) => (
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
                    ))
                  )}
                </List>
              </div>
            </Paper>
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
})(ViewClass);
