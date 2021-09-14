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
  }
}));

function ViewUnit(props) {
  const classes = useStyles();

  const { user } = props.auth;
  const { selectedUnits } = props.unitsCollection;
  // const { all_classes } = props.classesCollection;
  const unit_id = props.match.params.id;
  
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [unitClass, setUnitClass] = React.useState([]); 
  const [tabValue, setTabValue] = React.useState(0);
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
        const { getOneUnit, getAllClass } = props;
        const {id} = props.match.params;
        console.log(id);
        getOneUnit(id);
        getAllClass(id).then((res) => {
          setUnitClass(res);
        })

    }, []);

    console.log(selectedUnits);
    console.log(user);
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
                {/* <Typography variant="body2" color="textSecondary">
                  Oleh: <b>{unitAuthorName.current}</b>
                </Typography> */}
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
          {unitClass.map((cl, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            let viewpage = `/kelas/${clearInterval._id}`;
          return (
            <Grid item xs={12} sm={6} md={4}>
            <Link to={viewpage} onClick={(e) => e.stopPropagation()}>
              <Paper button className={classes.classPaper}>
                <Avatar
                  variant="square"
                  style={{
                    // backgroundColor: colorMap.get(cl._id),
                    width: "100%",
                    height: "120px",
                    borderRadius: "3px 3px 0px 0px",
                  }}
                >
                  <FaChalkboardTeacher
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                  />
                </Avatar>
                <Divider />
                <div style={{ padding: "10px 20px 20px 10px" }}>
                  <Typography id={labelId} variant="h5" align="center">
                    {cl.name}
                  </Typography>
                  {cl.homeroomTeacher && cl.homeroomTeacher !== "" ? (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="center"
                      style={{ marginTop: "5px" }}
                    >
                      Wali Kelas: {cl.homeroomTeacher}
                    </Typography>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "5px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        align="center"
                      >
                        Wali Kelas:
                      </Typography>
                      <Paper className={classes.emptyClass}>
                        <Typography variant="body2">KOSONG</Typography>
                      </Paper>
                    </div>
                  )}
                </div>
                <Divider />
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  className={classes.classActionContainer}
                >
                  {user.role === "Admin" ? (
                    <Grid
                      item
                      xs
                      container
                      spacing={1}
                      justify="flex-end"
                      alignItems="center"
                    >
                      <Grid item>
                        <LightTooltip title="Jumlah Murid">
                          <Badge
                            badgeContent={cl.size}
                            color="secondary"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            showZero
                          >
                            <IconButton size="small" disabled>
                              <SupervisorAccountIcon
                                className={classes.classPersonIcon}
                              />
                            </IconButton>
                          </Badge>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      container
                      direction="row"
                      justify="flex-end"g31
                      alignItems="center"
                    >
                      <Grid item>
                        <LightTooltip title="Jumlah Murid">
                          <Badge
                            badgeContent={cl.size}
                            color="secondary"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            showZero
                          >
                            <IconButton size="small" disabled>
                              <SupervisorAccountIcon
                                className={classes.classPersonIcon}
                              />
                            </IconButton>
                          </Badge>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Link>
          </Grid>
          )})}
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
    getAllSubjects
})(ViewUnit);
