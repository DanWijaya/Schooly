import React from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import CustomLinkify from "../../misc/linkify/Linkify";
import {
  getOneUnit,
} from "../../../actions/UnitActions";
import { getAllClass, getSelectedClasses } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Badge,
  CircularProgress,
  Fab,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  Typography,
  Divider,
  Hidden,
  TextField,
  Button,
  Snackbar,
  Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BallotIcon from "@material-ui/icons/Ballot";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { FaChalkboardTeacher } from "react-icons/fa";
import { TabPanel, TabIndex } from "../../misc/tab-panel/TabPanel";
import ClassItem from "../../objects/item/ClassItem";
import SubjectItem from "../../objects/item/SubjectItem";
import { getStudents, getTeachers, getAdmins, getAllUsers } from "../../../actions/UserActions"
import UserItem from "../../objects/item/UserItem";
import { getMultipleFileAvatar } from "../../../actions/files/FileAvatarActions";
const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "10px",
  },
  paperBox: {
    padding: "20px",
    // marginBottom: "10px",
  },
  deadlineWarningText: {
    color: theme.palette.warning.main,
  },
  seeAllTaskButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
    },
  },
  editButton: {
    marginRight: "10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  listItemPaper: {
    marginBottom: "10px",
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  downloadIconButton: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  downloadIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  wordFileTypeIcon: {
    backgroundColor: "#16B0DD",
  },
  excelFileTypeIcon: {
    backgroundColor: "#68C74F",
  },
  imageFileTypeIcon: {
    backgroundColor: "#974994",
  },
  pdfFileTypeIcon: {
    backgroundColor: "#E43B37",
  },
  textFileTypeIcon: {
    backgroundColor: "#F7BC24",
  },
  presentationFileTypeIcon: {
    backgroundColor: "#FD931D",
  },
  otherFileTypeIcon: {
    backgroundColor: "#808080",
  },
  dividerColor: {
    backgroundColor: theme.palette.primary.main,
  },
  commentLittleIcon: {
    color: theme.palette.text.disabled,
    opacity: 0.5,
    "&:focus, &:hover": {
      opacity: 1,
      cursor: "pointer"
    },
  },
  sendIcon: {
    color: theme.palette.text.disabled,
    "&:focus, &:hover": {
      cursor: "pointer"
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "15px"
    },
    marginLeft: "20px"
  },
  marginMobile: {
    [theme.breakpoints.down("sm")]: {
      marginRight: "14px",
      marginLeft: "7.6px"
    },
  },
  mobileName: {
    marginRight: "7px", 
    whiteSpace: "nowrap", 
    textOverflow: "ellipsis", 
    overflow: "hidden",
    maxWidth: "50px",
  },
  smAvatar: {
    [theme.breakpoints.down("xs")]: {
      marginRight: "15px"
    },
    marginRight: "20px"
  },
  textField: {
    // [theme.breakpoints.down("md")]: {
    //   minWidth: "110%"
    // },
    // [theme.breakpoints.down("sm")]: {
    //   maxWidth: "90%"
    // },
  },
  checkButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    marginTop: "6px",
    marginRight: "3px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.dark
    },
  },
  cancelButton: {
    backgroundColor: theme.palette.error.main,
    color: "white",
    marginTop: "6px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark
    },
  },
  classPaper: {
    borderRadius: "3px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    "&:focus, &:hover": {
      boxShadow: "0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.15)",
      cursor: "pointer",
    },
  },
  classActionContainer: {
    padding: "20px 10px 20px 10px",
  },
  classPersonIcon: {
    color: theme.palette.text.disabled,
  },
  editClassButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteClassButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  emptyClass: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "150px",
    padding: "2px",
    paddingLeft: "6px",
    paddingRight: "6px",
    backgroundColor: theme.palette.error.main,
    color: "white",
    marginLeft: "5px",
  },
  dialogPaper: {
    maxHeight: "70vh",
  },
  personListDivider: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function ViewUnit(props) {
  const classes = useStyles();

  const { user, all_students, all_teachers, all_admins } = props.auth;
  const { selectedUnits } = props.unitsCollection;
  const { all_subjects } = props.subjectsCollection;
  const { all_classes } = props.classesCollection;
  const unit_id = props.match.params.id;
  
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [tabValue, setTabValue] = React.useState(0);
  const [avatar, setAvatar] = React.useState({});

  const { getOneUnit, getAllClass, getAllSubjects, 
    getStudents, getTeachers, getAdmins, getAllUsers,
    getMultipleFileAvatar } = props;


  const unitAuthorName = React.useRef(null);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  document.title = !selectedUnits.name
    ? "Schooly | Lihat Materi"
    : `Schooly | ${selectedUnits.name}`;

    const onDelete = (id) => {
        console.log(id);
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }   

    React.useEffect(() => {
        getOneUnit(unit_id);
        getAllClass(unit_id);
        getAllSubjects(unit_id);
        getStudents(unit_id);
        getTeachers(unit_id);
        getAdmins(unit_id);
    }, []);

  React.useEffect(() => {
    //Can only pass a normal function as argument to useEffect, and not an async function.
    // So to use async, have to do this: 
    const fetchAvatar = async () => {
      try{
        const users = await getAllUsers(unit_id);
        let id_list = users.map((u) => u._id);
  
        const avatars = await getMultipleFileAvatar(id_list);
        setAvatar(avatars);
      } catch(err) {
        console.log(err);
      }
    }
    fetchAvatar()
  }, [])

  return (
    <div className={classes.root}>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Materi"
        itemName={selectedUnits.name}
        deleteItem={() => {
          onDelete(unit_id);
        }}
      />
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Paper className={classes.paperBox}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4">{selectedUnits.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Waktu Dibuat:{" "}
                  {moment(selectedUnits.createdAt)
                    .locale("id")
                    .format("DD MMM YYYY, HH.mm")}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider className={classes.dividerColor} />
              </Grid>
            {/* Munculin Kelas kelas yang ada di unit ini */}
            {/* Munculin Matpel yang ada di unit ini  */}
              <Grid item xs={12} style={{ marginTop: "15px" }}>
                <Typography color="textSecondary" gutterBottom>
                  Deskripsi Unit:
                </Typography>
                <Typography
                  variant="body1"
                  align="justify"
                  style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                  <CustomLinkify text={selectedUnits.description} />
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
        <Paper className={classes.paperBox}>
        <Tabs
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          value={tabValue}
          onChange={handleChangeTab}>
          <Tab
            icon={<DesktopWindowsIcon />}
            label="Kelas"
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
        <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          <ClassItem 
            data={all_classes}
            user={user}
            />
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2} direction="column">
            <SubjectItem 
              data={all_subjects}
              isEditable={false}
              />
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={2} direction="column">
            <>
              <Typography variant="h4" gutterButtom>
                Pengelola
              </Typography>
              <Divider className={classes.personListDivider} />
              <Grid item>
                <List>
                  <UserItem 
                    data={all_admins}
                    avatar_map={avatar}/>
                </List>
              </Grid>
            </>
            <>
              <Typography variant="h4" gutterButtom>
                Guru
              </Typography>
              <Divider className={classes.personListDivider} />
              <Grid item>
                <List>
                  <UserItem 
                    data={all_teachers}
                    avatar_map={avatar}/>
                </List>
              </Grid>
            </>
            <>
              <Typography variant="h4" gutterButtom>
                Murid
              </Typography>
              <Divider className={classes.personListDivider} />
              <Grid item>
                <List>
                  <UserItem 
                    data={all_students}
                    avatar_map={avatar}/>
                </List>
              </Grid>
            </>
          </Grid>
        </TabPanel>
        </Paper>
        </Grid>
        </Grid>
    </div>
  );
}

ViewUnit.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  getOneUnit: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  unitsCollection: state.unitsCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection
});

export default connect(mapStateToProps, {
    getOneUnit,
    getAllClass,
    getAllSubjects,
    getTeachers,
    getStudents,
    getAdmins,
    getAllUsers,
    getMultipleFileAvatar
})(ViewUnit);
