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
import { getAllTask } from "../../../actions/TaskActions";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
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
    maxWidth: "1000px",
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
            Mulai : {currentDialogInfo.start_date}
          </Typography>
          <Typography variant="subtitle1" align="center">
            Selesai : {currentDialogInfo.end_date}
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            color="textSecondary"
            style={{ marginTop: "10px", textAlign: "center" }}
          >
            Link Untuk Kuis atau Ulangan Anda akan Diberikan Oleh Guru Mata
            Pelajaran Terkait
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
    getAllAssessments,
    assessmentsCollection,
  } = props;
  // const { all_user_files } = props.filesCollection;
  const { all_subjects, all_subjects_map } = props.subjectsCollection;
  const { selectedMaterials } = props.materialsCollection;
  const { kelas } = props.classesCollection;
  const { students_by_class, all_teachers, user } = props.auth;
  const classId = props.match.params.id;

  const [walikelas, setWalikelas] = React.useState({});
  const [firstAssign, setFirstAssign] = React.useState(true);
  const [allow, setAllow] = React.useState("empty");

  const all_assessments = assessmentsCollection.all_assessments;

  console.log(user.tugas);

  // All actions to retrive datas from Database

  function listTasks(category = null, subject = {}, tab = "pekerjaan_kelas") {
    let tasksList = [];
    let result = [];
    if (Boolean(tasksCollection.length)) {
      var i;
      for (i = tasksCollection.length - 1; i >= 0; i--) {
        let task = tasksCollection[i];
        let class_assigned = task.class_assigned;
        if (class_assigned.indexOf(classId) !== -1) {
          tasksList.push(task);
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
            result.push(
              <AssignmentListItem
                work_title={task.name}
                work_category_avatar={workCategoryAvatar}
                work_subject={
                  category === "subject"
                    ? null
                    : all_subjects_map.get(task.subject)
                }
                work_status={workStatus}
                // work_deadline={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                work_dateposted={task.createdAt}
                work_link={`/tugas-murid/${task._id}`}
              />
            );
            if (!category && result.length === 5) break;

            if (category === "subject" && result.length === 3) break;
          }
        } else if (tab === "mata_pelajaran") {
          if (
            !category ||
            (category === "subject" && task.subject === subject._id)
          ) {
            result.push(
              <AssignmentListItem
                work_title={task.name}
                work_category_avatar={workCategoryAvatar}
                work_subject={
                  category === "subject"
                    ? null
                    : all_subjects_map.get(task.subject)
                }
                work_status={workStatus}
                // work_deadline={moment(task.deadline).locale("id").format("DD MMM YYYY, HH:mm")}
                work_dateposted={task.createdAt}
                work_link={`/tugas-murid/${task._id}`}
              />
            );
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
              result.push(
                <AssessmentListItem
                  work_title={assessment.name}
                  work_category_avatar={workCategoryAvatar}
                  work_subject={
                    category === "subject"
                      ? null
                      : all_subjects_map.get(assessment.subject)
                  }
                  work_status={workStatus}
                  work_starttime={moment(assessment.start_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                  work_endtime={moment(assessment.end_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                  work_dateposted={assessment.createdAt}
                />
              );
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
              result.push(
                <AssessmentListItem
                  work_title={assessment.name}
                  work_category_avatar={workCategoryAvatar}
                  work_subject={
                    category === "subject"
                      ? null
                      : all_subjects_map.get(assessment.subject)
                  }
                  work_status={workStatus}
                  work_starttime={moment(assessment.start_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                  work_endtime={moment(assessment.end_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                  work_dateposted={assessment.createdAt}
                />
              );
            }
          }
          if (!category && result.length === 5) break;
          if (category === "subject" && result.length === 3) break;
        } else if (tab === "mata_pelajaran") {
          let workStatus = !assessment.submissions
            ? "Belum Ditempuh"
            : "Sudah Ditempuh";
          if (type === "Kuis") {
            console.log(assessment.type);
            if (
              (!category ||
                (category === "subject" &&
                  assessment.subject === subject._id)) &&
              assessment.type === "Kuis" &&
              assessment.posted
            ) {
              result.push(
                <AssessmentListItem
                  work_title={assessment.name}
                  work_category_avatar={workCategoryAvatar}
                  work_subject={
                    category === "subject"
                      ? null
                      : all_subjects_map.get(assessment.subject)
                  }
                  work_status={workStatus}
                  work_starttime={moment(assessment.start_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                  work_endtime={moment(assessment.end_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                  work_dateposted={assessment.createdAt}
                />
              );
            }
          }
          if (type === "Ujian") {
            console.log(assessment.type);
            if (
              (!category ||
                (category === "subject" &&
                  assessment.subject === subject._id)) &&
              assessment.type === "Ujian" &&
              assessment.posted
            ) {
              result.push(
                <AssessmentListItem
                  work_title={assessment.name}
                  work_category_avatar={workCategoryAvatar}
                  work_subject={
                    category === "subject"
                      ? null
                      : all_subjects_map.get(assessment.subject)
                  }
                  work_status={workStatus}
                  work_starttime={moment(assessment.start_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                  work_endtime={moment(assessment.end_date)
                    .locale("id")
                    .format("DD MMM YYYY, HH:mm")}
                  work_dateposted={assessment.createdAt}
                />
              );
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
        console.log(material);
        if (
          !category ||
          (category === "subject" && material.subject === subject._id)
        ) {
          materialList.push(
            <MaterialListitem
              work_title={material.name}
              work_category_avatar={workCategoryAvatar}
              work_subject={all_subjects_map.get(material.subject)}
              work_link={`/materi/${material._id}`}
              work_dateposted={material.createdAt}
            />
          );
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
      if (user.kelas) {
        getMaterial(user.kelas, "by_class");
        getAllTask(); // get the tasksCollection
      } else {
        return;
      }
    }
    setCurrentClass(classId);
    getAllSubjects("map"); // get the all_subjects_map in map
    getAllSubjects(); // get the all_subjects
    getStudentsByClass(props.match.params.id); // get the students_by_class
    getTeachers("map"); // get the all_teachers
    getStudents();

    getAllTaskFilesByUser(user._id); // get the all_user_files
    getAllAssessments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!Array.isArray(all_teachers)) {
      setWalikelas(all_teachers.get(kelas.walikelas));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all_teachers]);

  React.useEffect(() => {
    // nilai students_by_class yang diperlukan adalah nilai yang diassign ketika fungsi getStudentsByClass telah selesai,
    // bukan ketika komponen ini dimount
    if (firstAssign) {
      setFirstAssign(false);
    } else {
      // me-redirect murid yang memasukkan id kelas lain (bukan kelas murid tersebut) pada url
      if (
        user.role === "Student" &&
        !students_by_class
          .map((student) => {
            return student._id;
          })
          .includes(user._id)
      ) {
        setAllow("redirect");
      } else {
        setAllow("content");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students_by_class, user]);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // console.log(selectedMaterials)
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

  if ((user.role === "Student") && !user.kelas) {
    return (
      <div className={classes.root} style={{display: "flex", alignItems: "center", justifyContent: "center", height: "48vh"}}>
        <Typography variant="h5" color="textSecondary">
          Anda belum ditempatkan di kelas manapun
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {allow === "empty" ? null : allow === "content" ? (
        user.role === "Admin" || user.role === "Teacher" ? ( // ---------- jika halaman kelas dibuka oleh admin atau guru ----------
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
                          person_avatar={`/api/upload/avatar/${walikelas.avatar}`}
                          person_name={walikelas.name}
                          person_role={
                            all_subjects_map
                              ? all_subjects_map.get(walikelas.subject_teached)
                              : null
                          }
                        />
                      </Grid>,
                    ].concat(
                      user.email === walikelas.email ? null : ( // menghilangkan tombol lihat profil di diri sendiri
                        <Grid item xs container justify="flex-end">
                          <Grid item>
                            <LightTooltip title="Lihat Profil">
                              <Link
                                to={{
                                  pathname: "/lihat-profil",
                                  state: {
                                    avatar: walikelas.avatar,
                                    nama: walikelas.name,
                                    viewable_section: "no_karir",
                                    role: walikelas.role,
                                    jenis_kelamin: walikelas.jenis_kelamin,
                                    email: walikelas.email,
                                    phone: walikelas.phone,
                                    emergency_phone: walikelas.emergency_phone,
                                    admin: false,
                                    tanggal_lahir: walikelas.tanggal_lahir,
                                  },
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
                      )
                    )}
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
                          person_avatar={`/api/upload/avatar/${student.avatar}`}
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
                                pathname: "/lihat-profil",
                                state: {
                                  kelas: student.kelas,
                                  avatar: student.avatar,
                                  nama: student.name,
                                  viewable_section: "with_karir",
                                  role: student.role,
                                  jenis_kelamin: student.jenis_kelamin,
                                  email: student.email,
                                  phone: student.phone,
                                  emergency_phone: student.emergency_phone,
                                  hobi: student.hobi_minat,
                                  ket: student.ket_non_teknis,
                                  cita: student.cita_cita,
                                  uni: student.uni_impian,
                                  id: student._id,
                                  tanggal_lahir: student.tanggal_lahir,
                                },
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
          // ---------- jika halaman kelas dibuka oleh Murid ----------
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
                  {listMaterials().length === 0 ? (
                    <Typography
                      variant="subtitle1"
                      align="center"
                      color="textSecondary"
                    >
                      Kosong
                    </Typography>
                  ) : (
                    <>{listMaterials()}</>
                  )}
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
                  {listTasks().length === 0 ? (
                    <Typography
                      variant="subtitle1"
                      align="center"
                      color="textSecondary"
                    >
                      Kosong
                    </Typography>
                  ) : (
                    <>{listTasks()}</>
                  )}
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
                  {listAssessments(null, {}, "Kuis").length === 0 ? (
                    <Typography
                      variant="subtitle1"
                      align="center"
                      color="textSecondary"
                    >
                      Kosong
                    </Typography>
                  ) : (
                    <>{listAssessments(null, {}, "Kuis")}</>
                  )}
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
                  {listAssessments(null, {}, "Ujian").length === 0 ? (
                    <Typography
                      variant="subtitle1"
                      align="center"
                      color="textSecondary"
                    >
                      Kosong
                    </Typography>
                  ) : (
                    <>{listAssessments(null, {}, "Ujian")}</>
                  )}
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
                            <LightTooltip
                              title="Lihat Profil"
                              placement="right"
                            >
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
                          {listMaterials("subject", subject, "mata_pelajaran")}
                          {listTasks("subject", subject, "mata_pelajaran")}
                          {listAssessments(
                            "subject",
                            subject,
                            "Kuis",
                            "mata_pelajaran"
                          )}
                          {listAssessments(
                            "subject",
                            subject,
                            "Ujian",
                            "mata_pelajaran"
                          )}
                          {listMaterials("subject", subject, "mata_pelajaran")
                            .length === 0 &&
                          listTasks("subject", subject, "mata_pelajaran")
                            .length === 0 &&
                          listAssessments(
                            "subject",
                            subject,
                            "Kuis",
                            "mata_pelajaran"
                          ).length === 0 &&
                          listAssessments(
                            "subject",
                            subject,
                            "Ujian",
                            "mata_pelajaran"
                          ).length === 0 ? (
                            <Typography
                              color="textSecondary"
                              align="center"
                              variant="subtitle1"
                            >
                              Kosong
                            </Typography>
                          ) : null}
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
                      <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <PersonListItem
                            person_avatar={`/api/upload/avatar/${walikelas.avatar}`}
                            person_name={walikelas.name}
                            person_role={
                              all_subjects_map
                                ? all_subjects_map.get(
                                    walikelas.subject_teached
                                  )
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xs container justify="flex-end">
                          <Grid item>
                            <LightTooltip title="Lihat Profil">
                              <Link
                                to={{
                                  pathname: "/lihat-profil",
                                  state: {
                                    avatar: walikelas.avatar,
                                    nama: walikelas.name,
                                    viewable_section: "no_karir",
                                    role: walikelas.role,
                                    jenis_kelamin: walikelas.jenis_kelamin,
                                    email: walikelas.email,
                                    phone: walikelas.phone,
                                    emergency_phone: walikelas.emergency_phone,
                                    tanggal_lahir: walikelas.tanggal_lahir,
                                  },
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
                                person_avatar={`/api/upload/avatar/${student.avatar}`}
                                person_name={student.name}
                                person_role={student_role(student._id)}
                              />
                            </Grid>,
                          ].concat(
                            user.email === student.email ? null : (
                              <Grid item xs container justify="flex-end">
                                <Grid item>
                                  <LightTooltip title="Lihat Profil">
                                    <Link
                                      to={{
                                        pathname: "/lihat-profil",
                                        state: {
                                          kelas: student.kelas,
                                          avatar: student.avatar,
                                          nama: student.name,
                                          viewable_section: "no_karir",
                                          role: student.role,
                                          jenis_kelamin: student.jenis_kelamin,
                                          email: student.email,
                                          phone: student.phone,
                                          emergency_phone:
                                            student.emergency_phone,
                                          id: student._id,
                                          tanggal_lahir: student.tanggal_lahir,
                                        },
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
                            )
                          )}
                        </Grid>
                      ))
                    )}
                  </List>
                </div>
              </Paper>
            </TabPanel>
          </div>
        )
      ) : (
        <Redirect to="/tidak-ditemukan" />
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
})(ViewClass);
