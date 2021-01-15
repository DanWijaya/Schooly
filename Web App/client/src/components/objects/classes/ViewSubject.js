import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/id";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getAllTask } from "../../../actions/TaskActions";
import { getMaterial } from "../../../actions/MaterialActions";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import { getAllAssessments } from "../../../actions/AssessmentActions";
import subjectBackground1 from "./SubjectBackground1.png";
import {
  Avatar,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  Hidden,
  Dialog,
  Badge,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { FaClipboardList } from "react-icons/fa";
import { BsClipboardData } from "react-icons/bs";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "20px",
  },
  workIconButton: {
    cursor: "default",
  },
  workIcon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    color: theme.palette.primary.main,
  },
  subjectCardPaper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "40px 0px 40px 30px",
    backgroundColor: "#5ec9cc",
    backgroundImage: `url(${subjectBackground1})`,
    backgroundPosition: "right bottom",
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
  assignmentLate: {
    backgroundColor: theme.palette.primary.main,
  },
  assignmentTurnedIn: {
    backgroundColor: theme.palette.success.main,
  },
  warningText: {
    color: theme.palette.warning.main,
  },
  material: {
    backgroundColor: theme.palette.primary.main,
  },
  listItem: {
    minHeight: "70px",
  },
  subtitleColor: {
    color: "rgba(255, 255, 255, 0.7)",
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
  itemIcon: {
    marginRight: "10px",
    fontSize: "22px",
    color: "grey",
  },
}));

function SubjectListitem(props) {
  const classes = useStyles();

  return (
    <Link to={props.work_link}>
      <ListItem button className={classes.listItem}>
        <ListItemAvatar>{props.work_category_avatar}</ListItemAvatar>
        <ListItemText
          primary={<Typography variant="h6">{props.work_title}</Typography>}
          secondary={!props.work_subject ? " " : props.work_subject}
        />
      </ListItem>
    </Link>
  );
}

function MaterialListitem(props) {
  const classes = useStyles();

  return (
    <div>
      <Hidden smUp implementation="css">
        <Link to={props.work_link}>
          <Paper
            variant="outlined"
            className={classes.listItemPaper}
            style={{ display: "flex", alignItems: "center" }}
          >
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
              ) : null
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
            style={{ display: "flex", flexDirection: "row" }}
            badgeContent={
              props.work_status === "Belum Ditempuh" ? (
                <WarningIcon className={classes.warningIcon} />
              ) : null
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

function ViewSubject(props) {
  const classes = useStyles();

  const { user } = props.auth;
  const id = props.match.params.id;
  const {
    setCurrentClass,
    getAllTask,
    getAllSubjects,
    tasksCollection,
    getAllTaskFilesByUser,
    getMaterial,
    getAllAssessments,
    assessmentsCollection,
  } = props;
  const all_assessments = assessmentsCollection.all_assessments;
  const { kelas } = props.classesCollection;
  // const {all_user_files} = props.filesCollection;
  const { all_subjects_map } = props.subjectsCollection;
  const { selectedMaterials } = props.materialsCollection;
  const classId = user.kelas;

  console.log(props.classesCollection);
  React.useEffect(() => {
    if (user.role === "Student") {
      getMaterial(user.kelas, "by_class");
    }
    setCurrentClass(user.kelas);
    getAllTask();
    getAllTaskFilesByUser(user.id);
    getAllSubjects("map");
    getAllAssessments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(all_subjects_map);
  let tasksByClass = []; // Tasks on specific class.

  console.log(selectedMaterials);
  // All actions to retrive datas from Database...
  if (tasksCollection.length !== undefined) {
    tasksCollection.map((task) => {
      let class_assigned = task.class_assigned;
      for (var i = 0; i < class_assigned.length; i++) {
        if (class_assigned[i] === user.kelas) tasksByClass.push(task);
      }
      return tasksByClass;
    });
  }

  // let tasksBySubjectClass = [];
  // const generateTaskBySubject = (target=null) => {
  //   tasksByClass.map((task) => {
  //     let workCategoryAvatar = (
  //       <Avatar className={classes.assignmentLate}>
  //         <AssignmentLateIcon/>
  //       </Avatar>
  //     )

  //     let workStatus = "Belum Dikumpulkan"
  //     // for (var i = 0; i < all_user_files.length; i++) {
  //     //   if (all_user_files[i].for_task_object === task._id) {
  //     //     workStatus = "Telah Dikumpulkan"
  //     //     workCategoryAvatar = (
  //     //       <Avatar className={classes.assignmentTurnedIn}>
  //     //         <AssignmentTurnedInIcon/>
  //     //       </Avatar>
  //     //     )
  //     //     break;
  //     //   }
  //     // }

  //     if (task.subject === id) {
  //     tasksBySubjectClass.push(
  //       <AssignmentListItem
  //         work_title={task.name}
  //         work_category_avatar={workCategoryAvatar}
  //         work_sender={`Mata Pelajaran: ${all_subjects_map.get(task.subject)}`}
  //         work_status={workStatus}
  //         work_deadline={moment(task.deadline).format("DD MMM YYYY")}
  //         work_link={`/tugas-murid/${task._id}`}
  //       />
  //     )
  //   }
  //   return tasksBySubjectClass
  // })

  // if (target === "length")
  //   return tasksBySubjectClass.length;

  // return tasksBySubjectClass.length === 0 ?
  // (<Typography variant="h5" align="center" gutterBottom>
  //   Kosong
  // </Typography>)
  // : tasksBySubjectClass

  // }

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
          (category === "subject" && material.subject === subject)
        ) {
          materialList.push(
            <MaterialListitem
              work_title={material.name}
              work_category_avatar={workCategoryAvatar}
              work_subject={
                category === "subject"
                  ? null
                  : all_subjects_map.get(material.subject)
              }
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

  function listTasks(category = null, subject = null, tab = "pekerjaan_kelas") {
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
              (category === "subject" && task.subject === subject)) &&
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
            (category === "subject" && task.subject === subject)
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
    subject = null,
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
          console.log("test");
          AssessmentsList.push(assessment);
        }
        // if(i === all_assessments.length - 5){ // item terakhir harus pas index ke 4.
        //   break;
        // }
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
                (category === "subject" && assessment.subject === subject)) &&
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
                (category === "subject" && assessment.subject === subject)) &&
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
          console.log(assessment.subject);
          console.log(subject);
          if (type === "Kuis") {
            if (
              (!category ||
                (category === "subject" && assessment.subject === subject)) &&
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
                (category === "subject" && assessment.subject === subject)) &&
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

  document.title = `Schooly | ${all_subjects_map.get(id)}`;

  return (
    <div className={classes.root}>
      <Paper className={classes.subjectCardPaper}>
        <Typography variant="h4" gutterBottom style={{ color: "white" }}>
          <b>{all_subjects_map.get(id)}</b>
        </Typography>
        <Typography variant="h5" className={classes.subtitleColor}>
          Kelas: {kelas.name}
        </Typography>
      </Paper>
      <div style={{ marginTop: "20px" }}>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
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
          </ExpansionPanelSummary>
          <Divider />
          <List className={classes.expansionPanelList}>
            {listMaterials("subject", id, "mata_pelajaran").length === 0 ? (
              <Typography
                variant="subtitle1"
                align="center"
                color="textSecondary"
              >
                Kosong
              </Typography>
            ) : (
              <>{listMaterials("subject", id, "mata_pelajaran")}</>
            )}
          </List>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
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
          </ExpansionPanelSummary>
          <Divider />
          <List className={classes.expansionPanelList}>
            {listTasks("subject", id, "mata_pelajaran").length === 0 ? (
              <Typography
                variant="subtitle1"
                align="center"
                color="textSecondary"
              >
                Kosong
              </Typography>
            ) : (
              <>{listTasks("subject", id, "mata_pelajaran")}</>
            )}
          </List>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
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
          </ExpansionPanelSummary>
          <Divider />
          <List className={classes.expansionPanelList}>
            {listAssessments("subject", id, "Kuis", "mata_pelajaran").length ===
            0 ? (
              <Typography
                variant="subtitle1"
                align="center"
                color="textSecondary"
              >
                Kosong
              </Typography>
            ) : (
              <>{listAssessments("subject", id, "Kuis", "mata_pelajaran")}</>
            )}
          </List>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
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
          </ExpansionPanelSummary>
          <Divider />
          <List className={classes.expansionPanelList}>
            {listAssessments("subject", id, "Ujian", "mata_pelajaran")
              .length === 0 ? (
              <Typography
                variant="subtitle1"
                align="center"
                color="textSecondary"
              >
                Kosong
              </Typography>
            ) : (
              <>{listAssessments("subject", id, "Ujian", "mata_pelajaran")}</>
            )}
          </List>
        </ExpansionPanel>
      </div>
    </div>
  );
}

ViewSubject.propTypes = {
  classesCollection: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  tasksCollection: PropTypes.object.isRequired,
  materialsCollection: PropTypes.object.isRequired,
  assessmentsCollection: PropTypes.object.isRequired,
  filesCollection: PropTypes.object.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getAllTask: PropTypes.func.isRequired,
  getAllTaskFilesByUser: PropTypes.func.isRequired,
  getMaterial: PropTypes.func.isRequired,
  getAllAssessments: PropTypes.func.isRequired,
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
  getAllSubjects,
  getAllTask,
  getAllTaskFilesByUser,
  getMaterial,
  getAllAssessments,
})(ViewSubject);
