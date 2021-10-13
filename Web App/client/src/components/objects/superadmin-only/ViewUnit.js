import React from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getOneUnit } from "../../../actions/UnitActions";
import { getAllClass, getSelectedClasses } from "../../../actions/ClassActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import {
  getStudents,
  getTeachers,
  getAdmins,
  getAllUsers,
} from "../../../actions/UserActions";
import { getMultipleFileAvatar } from "../../../actions/files/FileAvatarActions";
import ClassItem from "../../objects/item/ClassItem";
import SubjectItem from "../../objects/item/SubjectItem";
import UserItem from "../../objects/item/UserItem";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import CustomLinkify from "../../misc/linkify/Linkify";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { TabPanel, TabIndex } from "../../misc/tab-panel/TabPanel";
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
  Box,
} from "@material-ui/core";
import {
  DesktopWindows as DesktopWindowsIcon,
  LibraryBooks as LibraryBooksIcon,
  SupervisorAccount as SupervisorAccountIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { FaChalkboardTeacher } from "react-icons/fa";

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
  unitBackground: {
    padding: "75px 50px 25px 50px",
    background: `linear-gradient(${theme.palette.primary.main} 60%, transparent 30%)`,
    backgroundRepeat: "no-repeat",
    [theme.breakpoints.down("sm")]: {
      padding: "75px 15px 25px 15px",
    },
  },
  unitTitle: {
    padding: "30px 15px 0px 15px",
  },
  content: {
    padding: "15px",
  },
  unitMembersDivider: {
    marginTop: "5px",
    backgroundColor: theme.palette.primary.main,
  },
}));

function ViewUnit(props) {
  const classes = useStyles();
  const {
    getOneUnit,
    getAllClass,
    getAllSubjects,
    getStudents,
    getTeachers,
    getAdmins,
    getAllUsers,
    getMultipleFileAvatar,
  } = props;
  const { user, all_students, all_teachers, all_admins } = props.auth;
  const { selectedUnits } = props.unitsCollection;
  const { all_classes } = props.classesCollection;
  const { all_subjects } = props.subjectsCollection;
  const unitId = props.match.params.id;

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [tabValue, setTabValue] = React.useState(0);
  const [avatar, setAvatar] = React.useState({});
  const unitAuthorName = React.useRef(null);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const onDelete = (id) => {
    console.log(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  React.useEffect(() => {
    getOneUnit(unitId);
    getAllClass(unitId);
    getAllSubjects(unitId);
    getStudents(unitId);
    getTeachers(unitId);
    getAdmins(unitId);
  }, []);

  React.useEffect(() => {
    //Can only pass a normal function as argument to useEffect, and not an async function.
    // So to use async, have to do this:
    const fetchAvatar = async () => {
      try {
        const users = await getAllUsers(unitId);
        let id_list = users.map((u) => u._id);

        const avatars = await getMultipleFileAvatar(id_list);
        setAvatar(avatars);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAvatar();
  }, []);

  document.title = !selectedUnits.name
    ? "Schooly | Lihat Unit"
    : `Schooly | ${selectedUnits.name}`;

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <div className={classes.unitBackground}>
            <Paper className={classes.unitTitle}>
              <Typography variant="h4" align="center" gutterBottom>
                {selectedUnits.name}
              </Typography>
              <Typography
                color="textSecondary"
                align="center"
                style={{ marginBottom: "60px", wordBreak: "break-word", whiteSpace: "pre-wrap" }}
              >
                <CustomLinkify text={selectedUnits.description} />
              </Typography>
              <Tabs
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                value={tabValue}
                onChange={handleChangeTab}
              >
                <Tab
                  icon={<DesktopWindowsIcon />}
                  label={
                    <Typography variant="caption">Kelas</Typography>
                  }
                  {...TabIndex(0)}
                />
                <Tab
                  icon={<LibraryBooksIcon />}
                  label={
                    <Typography variant="caption">Mata Pelajaran</Typography>
                  }
                  {...TabIndex(1)}
                />
                <Tab
                  icon={<SupervisorAccountIcon />}
                  label={
                    <Typography variant="caption">Peserta</Typography>
                  }
                  {...TabIndex(2)}
                />
              </Tabs>
            </Paper>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.content}>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                <ClassItem data={all_classes} user={user} />
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={2} direction="column">
                <SubjectItem data={all_subjects} isEditable={false} />
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={10} direction="column">
                <Grid item>
                  <Typography variant="h4">
                    Pengelola
                  </Typography>
                  <List>
                    <Divider className={classes.unitMembersDivider} />
                    <UserItem data={all_admins} avatar_map={avatar} />
                  </List>
                </Grid>
                <Grid item>
                  <Typography variant="h4">
                    Guru
                  </Typography>
                  <List>
                    <Divider className={classes.unitMembersDivider} />
                    <UserItem data={all_teachers} avatar_map={avatar} />
                  </List>
                </Grid>
                <Grid item>
                  <Typography variant="h4">
                    Murid
                  </Typography>
                  <List>
                    <Divider className={classes.unitMembersDivider} />
                    <UserItem data={all_students} avatar_map={avatar} />
                  </List>
                </Grid>
              </Grid>
            </TabPanel>
          </div>
        </Grid>
      </Grid>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Materi"
        itemName={selectedUnits.name}
        deleteItem={() => {
          onDelete(unitId);
        }}
      />
    </div>
  );
}

ViewUnit.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
  getOneUnit: PropTypes.func.isRequired,
  getAllClass: PropTypes.func.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  unitsCollection: state.unitsCollection,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
});

export default connect(mapStateToProps, {
  getOneUnit,
  getAllClass,
  getAllSubjects,
  getTeachers,
  getStudents,
  getAdmins,
  getAllUsers,
  getMultipleFileAvatar,
})(ViewUnit);
