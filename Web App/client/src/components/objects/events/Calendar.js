import React from "react";
import "./Calendar.css"
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import lokal from "date-fns/locale/id";
import DateFnsUtils from "@date-io/date-fns";
import { Calendar as ReactCalendar } from "react-calendar";
import {
  Button,
  IconButton,
  Fab,
  Grid,
  Hidden,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Divider,
  Badge,
  Dialog,
  TextField,
  Menu,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  Input,
  Snackbar,
  useMediaQuery,
  CircularProgress,
  Fade,
  InputBase
} from "@material-ui/core/";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import EventNoteIcon from '@material-ui/icons/EventNote';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import TimerIcon from '@material-ui/icons/Timer';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import SubjectIcon from '@material-ui/icons/Subject';
import DeleteIcon from "@material-ui/icons/Delete";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from "@material-ui/icons/Edit";
import PageviewIcon from "@material-ui/icons/Pageview";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import WarningIcon from "@material-ui/icons/Warning";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import CloseIcon from '@material-ui/icons/Close';
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { FaClipboardList } from "react-icons/fa";
import { BsClipboardData } from "react-icons/bs";
import {
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";
import { getSelectedClasses, getAllClass } from "../../../actions/ClassActions";
import {
  createEvent,
  updateEvent,
  getAllEvents,
  getOneEvent,
  deleteEvent
} from "../../../actions/EventActions";
import {
  downloadFileEvent,
  viewFileEvent,
  getFileEvents
} from "../../../actions/files/FileEventActions";
import { getAllSubjects } from "../../../actions/SubjectActions";
import { getStudents, getStudentsByClass, getTeachers } from "../../../actions/UserActions";
import { getTasks, getAllTask } from "../../../actions/TaskActions";
import {
  getAssessments,
  getAllAssessments,
} from "../../../actions/AssessmentActions";
import { getAllTaskFilesByUser } from "../../../actions/UploadActions";
import moment from "moment";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Draggable from 'react-draggable';
import Path from "path";
import CustomLinkify from "../../misc/linkify/Linkify";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%"
    },
    padding: "10px",
    display: "flex",
    flexDirection: "row"
  },
  newEventButton: {
    marginRight: "10px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white"
    },
  },
  newEventIconDesktop: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px",
  },
  newEventIconMobile: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  viewEventButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  deleteEventButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  agendaContainer: {
    width: "80%",
    marginRight: "15px",
    overflow: "none",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginRight: 0
    },
  },
  calendarContainer: {
    marginLeft: "15px",
    width: "200px"
  },
  calendar: {
    border: "none",
  },
  dayAgendaContainer: {
    display: "flex", 
    flexDirection: "column", 
    // marginTop: "10px",
    height: "600px",
    overflow: "auto",
    flex: 1,
    overflow: "hidden"
  },
  dayTableCell: {
    display: "flex", 
    flexDirection: "row", 
    alignItems: "center", 
    borderBottom: "none", 
    overflow: "none"
  },
  // todayTile: {
  //   textAlign: "center!important",
  //   borderRadius: "100%",
  //   background: "#195DE5",
  //   color: "white",
  //   maxWidth: "12%!important",
  //   margin: ".5% 1.14285%!important",
  //   padding: "3% 0%",
  //   "&:focus, &:hover, &:active": {
  //     background: "#195DE5",
  //     backgroundColor: "#195DE5",
  //     color: "white",
  //     opacity: 0.8
  //   },
  // },
  // activeTile: {
  //   textAlign: "center!important",
  //   maxWidth: "12%!important",
  //   margin: ".5% 1.14285%!important",
  //   padding: "3% 0%",
  //   "&:active": {
  //     background: "#C9DCFD",
  //     opacity: 0.8
  //   },
  // },
  todayTile: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderRadius: "50%",
    width: "1.9rem",
    height: "1.9rem",
    backgroundColor: "#195DE5",
    color: "white",
    [theme.breakpoints.down("sm")] :{
      width: "1.6rem",
      height: "1.6rem",
    }
  },
  selectedTile: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "1.9rem",
    height: "1.9rem",
    backgroundColor: "#C9DCFD",
    [theme.breakpoints.down("sm")]: {
      width: "1.6rem",
      height: "1.6rem",
    }
  },
  notSelectedTile: {
    "&:hover": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      width: "1.9rem",
      height: "1.9rem",
      backgroundColor: "#EFEFEF",
      [theme.breakpoints.down("sm")]: {
        width: "1.6rem",
        height: "1.6rem",
      }
    }
  },
  calendarTile: {
    borderRadius: "100%",
    backgroundColor: theme.palette.primary.light
  },
  monthDateTile: {
    padding: "2px 5px",
    "&:focus, &:hover, &:active": {
      background: "#e6e6e6",
      cursor: "pointer"
    },
  },
  selectedMonthDateTile: {
    padding: "2px 5px",
    background: "#C9DCFD",
    "&:focus, &:hover, &:active": {
      background: "#e6e6e6",
      cursor: "pointer"
    },
  },
  todayMonthDateTile: {
    borderRadius: "100%",
    background: "#195DE5",
    color: "white",
    "&:focus, &:hover, &:active": {
      background: "#e6e6e6",
      cursor: "pointer"
    },
    marginBlockStart: 0,
    marginBlockEnd: 0,
    padding: "2px 4px"
  },
  monthAgendaCell: {
    width: "14.2875%",
    maxWidth: "14.2875%",
    minWidth: "14.2875%",
    border: "1px solid rgba(224, 224, 224, 1)", 
    verticalAlign: "top", 
    padding: "10px 3px"
  },
  monthAgendaChip: {
    background: theme.palette.primary.main,
    color: "white",
    padding: "2px 3px",
    borderRadius: "4px",
    margin: "2px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    "&:focus, &:hover, &:active": {
      cursor: "pointer"
    },
  },
  monthAgendaChipAdmin: {
    background: theme.palette.primary.main,
    color: "white",
    padding: "2px 3px",
    borderRadius: "4px",
    margin: "2px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },
  moreMonthAgendaChip: {
    background: "#e6e6e6",
    padding: "2px 3px",
    borderRadius: "4px",
    margin: "2px 0",
    "&:focus, &:hover, &:active": {
      cursor: "pointer"
    },
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleDivider: {
    backgroundColor: theme.palette.primary.main,
    marginTop: "15px",
    marginBottom: "15px",
  },
  titleIcon: {
    fontSize: "28px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    marginRight: "10px",
  },
  listItem: {
    padding: "6px 16px"
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
  listIcon: {
    backgroundColor: theme.palette.primary.main,
  },
  holidayContainer: {
    marginBottom: "10px"
  },
  staticBlueChip: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "3px",
    flexGrow: 1,
    // overflow: "none",
    overflow: "hidden",
    marginBottom: "2px",
    marginLeft: "58px",
    padding: "2px",
    marginRight: "32px"
  },
  blueChip: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "3px",
    // width: "100%",
    position: "absolute",
    // overflow: "none",
    overflow: "hidden",
    padding: "8px 12px",
    color: "white",
    zIndex: 2,
  },
  // invisibleChip: {
  //   width: "100%",
  //   position: "absolute",
  //   overflow: "none",
  //   padding: "2px",
  // },
  blueChipHover: {
    "&:focus, &:hover": {
      cursor: "pointer"
    },
  },
  horizontalLine: {
    border: "rgba(224, 224, 224, 1) .25px solid",
    position: "relative",
    "&:after": {
      content: "",
      position: "absolute",
      borderRight: "2px green solid",
      transform: "translateX(-50%)"
    },
    "&:before": {
      content: "",
      position: "absolute",
      borderRight: "2px green solid",
      transform: "translateY(-50%)"
    },
    flexGrow: 1,
    marginLeft: "10px",
    overflow: "none"
  },
  greenFab: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  },
  table: {
    tableLayout: "fixed",
    overflow: "hidden"
  },
  chevronButton: {
    "&:focus, &:hover": {
      cursor: "pointer"
    },
  },
  selectRoot: {
    display: "flex",
    alignItems: "center",
    height: "40px",
    paddingTop: "0!important",
    paddingBottom: "0!important"
  },
}));
// ANCHOR STYLE

function CalendarListToolbar(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    handleOpenFormDialog,
    searchFilter,
    updateSearchFilter,
    setSearchBarFocus,
    searchBarFocus,
    role,
    type
  } = props;

  let toolbarTitle = "";
  let toolbarIcon = null;

  if(type === "Event") {
    toolbarTitle = "Daftar Kegiatan";
    toolbarIcon = <EventNoteIcon className={classes.titleIcon} fontSize="large" />;
  }
  else if(type === "Task") {
    toolbarTitle = "Daftar Tugas";
    toolbarIcon = <AssignmentIcon className={classes.titleIcon} fontSize="large" />;
  }
  else if(type === "Quiz") {
    toolbarTitle = "Daftar Kuis";
    toolbarIcon = <FaClipboardList className={classes.titleIcon} fontSize="large" />;
  }
  else {
    toolbarTitle = "Daftar Ujian";
    toolbarIcon = <BsClipboardData className={classes.titleIcon} fontSize="large" />;
  }

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  // const headCells = [
  //   {
  //     id: "name",
  //     numeric: false,
  //     disablePadding: false,
  //     label: "Mata Pelajaran",
  //   },
  // ];

  // // Sort Menu
  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const handleOpenSortMenu = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleCloseSortMenu = () => {
  //   setAnchorEl(null);
  // };

  // const onChange = (e) => {
  //   updateSearchFilter(e.target.value);
  // };

  // const onClear = (e, id) => {
  //   updateSearchFilter("");
  //   document.getElementById(id).focus();
  // };

  return (
    <div className={classes.toolbar}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Hidden mdUp implementation="css">
          {searchBarFocus ? null : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {toolbarIcon}
              <Typography variant="h4">{toolbarTitle}</Typography>
            </div>
          )}
        </Hidden>
        <Hidden smDown implementation="css">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {toolbarIcon}
            <Typography variant="h4">{toolbarTitle}</Typography>
          </div>
        </Hidden>
        {/* <Hidden mdUp implementation="css">
          {searchBarFocus ? (
            <div style={{ display: "flex" }}>
              <IconButton
                onClick={() => {
                  setSearchBarFocus(false);
                  updateSearchFilter("");
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <TextField
                fullWidth
                variant="outlined"
                id="searchFilterMobile"
                value={searchFilter}
                onChange={onChange}
                autoFocus
                onClick={(e) => setSearchBarFocus(true)}
                placeholder="Cari Mata Pelajaran"
                style={{
                  maxWidth: "200px",
                  marginLeft: "10px",
                }}
                InputProps={{
                  startAdornment: searchBarFocus ? null : (
                    <InputAdornment
                      position="start"
                      style={{ marginLeft: "-5px", marginRight: "-5px" }}
                    >
                      <IconButton size="small">
                        <GoSearch />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      style={{ marginLeft: "-10px", marginRight: "-10px" }}
                    >
                      <IconButton
                        size="small"
                        id="searchFilterMobile"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClear(e, "searchFilterMobile");
                        }}
                        style={{
                          opacity: 0.5,
                          visibility: !searchFilter ? "hidden" : "visible",
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: "22.5px",
                  },
                }}
              />
            </div>
          ) : (
            <LightTooltip title="Search" style={{ marginLeft: "10px" }}>
              <IconButton
                className={classes.goSearchButton}
                onClick={() => setSearchBarFocus(true)}
              >
                <GoSearch className={classes.goSearchIconMobile} />
              </IconButton>
            </LightTooltip>
          )}
        </Hidden> */}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* <Hidden smDown implementation="css">
          <TextField
            variant="outlined"
            id="searchFilterDesktop"
            value={searchFilter}
            onChange={onChange}
            onClick={() => setSearchBarFocus(true)}
            onBlur={() => setSearchBarFocus(false)}
            placeholder="Cari Mata Pelajaran"
            style={{
              maxWidth: "250px",
              marginRight: "10px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  style={{ marginLeft: "-5px", marginRight: "-5px" }}
                >
                  <IconButton size="small">
                    <GoSearch />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{ marginLeft: "-10px", marginRight: "-10px" }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClear(e, "searchFilterDesktop");
                    }}
                    style={{
                      opacity: 0.5,
                      visibility: !searchFilter ? "hidden" : "visible",
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              style: {
                borderRadius: "22.5px",
              },
            }}
          />
        </Hidden> */}
        <Hidden mdUp implementation="css">
          {role !== "Admin" ? null : (
            <LightTooltip title="Buat Kegiatan">
              <Link to="/buat-kegiatan">
                <Fab size="small" className={classes.newEventButton}>
                  <EventNoteIcon className={classes.newEventIconMobile} />
                </Fab>
              </Link>
            </LightTooltip>
          )}
        </Hidden>
        <Hidden smDown implementation="css">
          {role !== "Admin" ? null : (
            <Link to="/buat-kegiatan">
              <Fab
                size="medium"
                variant="extended"
                className={classes.newEventButton}
              >
                <EventNoteIcon className={classes.newEventIconDesktop} />
                Buat Kegiatan
            </Fab>
            </Link>
          )}
        </Hidden>
        {/* <LightTooltip title="Urutkan Mata Pelajaran">
          <IconButton
            onClick={handleOpenSortMenu}
            className={classes.sortButton}
          >
            <SortIcon />
          </IconButton>
        </LightTooltip>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseSortMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {headCells.map((headCell, i) => (
            <MenuItem
              key={headCell.id}
              sortDirection={orderBy === headCell.id ? order : false}
              onClick={createSortHandler(headCell.id)}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            </MenuItem>
          ))}
        </Menu> */}
      </div>
    </div>
  );
}

function AgendaToolbar(props) {
  const {
    classes,
    mode,
    handleChangeMode,
    handleOpenCreateDialog,
    currentDate,
    setCurrentDate,
    role
  } = props;

  let monthNames = [
    "Januari", "Februari", "Maret", "April",
    "Mei", "Juni", "Juli", "Agustus",
    "September", "Oktober", "November", "Desember"
  ];

  let stringDateDayMode = monthNames[currentDate.getMonth()] + " " + currentDate.getDate() + ", " + currentDate.getFullYear();
  let stringDateMonthMode = monthNames[currentDate.getMonth()] + " " + currentDate.getFullYear();

  const handleChangeMonth = (direction) => {
    if(direction === "now") {
      // let nowMonthDate;
      // let tempMonthDate = new Date();
      // nowMonthDate = new Date(tempMonthDate.getFullYear(), tempMonthDate.getMonth(), 1)
      // setCurrentDateMonthMode(nowMonthDate);
      setCurrentDate(new Date());
    }
    else if(direction === "next") {
      let nextMonthDate;
      if (currentDate.getMonth() == 11) {
        // nextMonthDate = new Date(currentDate.getFullYear() + 1, 0, 1);
        nextMonthDate = new Date(currentDate.getFullYear() + 1, 0, currentDate.getDate());
      } 
      else {
        // nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
      }
      // setCurrentDateMonthMode(nextMonthDate);
      setCurrentDate(nextMonthDate);
    }
    else {
      let prevMonthDate;
      if (currentDate.getMonth() == 0) {
        // prevMonthDate = new Date(currentDate.getFullYear() - 1, 11, 1);
        prevMonthDate = new Date(currentDate.getFullYear() - 1, 11, currentDate.getDate());
      } 
      else {
        // prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
      }
      // setCurrentDateMonthMode(prevMonthDate);
      setCurrentDate(prevMonthDate);
    }
  }

  const handleChangeDay = (direction) => {
    if (direction === "now") {
      // setCurrentDateDayMode(getDayStart(new Date()));
      setCurrentDate(new Date());
    } else if (direction === "next") {
      // setCurrentDateDayMode(new Date(currentDate.getTime() + 1000 * 60 * 60 * 24));
      setCurrentDate(new Date(currentDate.getTime() + 1000 * 60 * 60 * 24));
    } else {
      // setCurrentDateDayMode(new Date(currentDate.getTime() - 1000 * 60 * 60 * 24));
      setCurrentDate(new Date(currentDate.getTime() - 1000 * 60 * 60 * 24));
    }
  }

  return (
    <div className={classes.toolbar}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Hidden xsDown>
          {mode === "Day" ?
            <Button style={{ height: "40px" }} variant="outlined" onClick={() => handleChangeDay("now")}> Hari ini</Button>
          :
            <Button style={{ height: "40px" }} variant="outlined" onClick={() => handleChangeMonth("now")}>Hari ini</Button>
          }
          {mode === "Day" ?
            <>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: "0 5px"}}>
                <ChevronLeftIcon onClick={() => handleChangeDay("prev")} className={classes.chevronButton}/>
                <ChevronRightIcon onClick={() => handleChangeDay("next")} className={classes.chevronButton}/>
              </div>
              <Typography>{stringDateDayMode}</Typography>
            </>
          :
            <>
              <div style={{display: "flex", flexDirection: "row", alignItems: "center", margin: "0 5px"}}>
                <ChevronLeftIcon onClick={() => handleChangeMonth("prev")} className={classes.chevronButton}/>
                <ChevronRightIcon onClick={() => handleChangeMonth("next")} className={classes.chevronButton}/>
              </div>
              <Typography>{stringDateMonthMode}</Typography>
            </>
          }
        </Hidden>
        <Hidden smUp>
          {mode === "Day" ?
            <>
              <Typography>{stringDateDayMode}</Typography>
              <div style={{margin: "0 5px"}}>
                <ChevronLeftIcon className={classes.chevronButton}/>
                <ChevronRightIcon className={classes.chevronButton}/>
              </div>
            </>
          :
            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
              <Typography>{stringDateMonthMode}</Typography>
              <div style={{display: "flex", flexDirection: "row", alignItems: "center", margin: "0 5px"}}>
                <ChevronLeftIcon onClick={() => handleChangeMonth("prev")} className={classes.chevronButton}/>
                <ChevronRightIcon onClick={() => handleChangeMonth("next")} className={classes.chevronButton}/>
              </div>
            </div>
          }
        </Hidden>
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {
          role === "Admin" 
          ? 
            <Fab className={classes.greenFab} aria-label="add" size="small" onClick={() => { handleOpenCreateDialog() }}>
              <AddIcon fontSize="small"/>
            </Fab>
          : null
        }
        <IconButton>
          <SearchIcon/>
        </IconButton>
        <FormControl variant="outlined">
          <Select
            defaultValue="Day"
            value={mode}
            onChange={handleChangeMode}
            classes={{ root: classes.selectRoot }}
          >
            <MenuItem value="Day">
              Hari
            </MenuItem>
            <MenuItem value="Week">Minggu</MenuItem>
            <MenuItem value="Month">Bulan</MenuItem>
            <MenuItem value="Year">Tahun</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

function TaskListItem(props) {
  const { classes } = props;

  return (
    <Grid item>
      <Link to={props.work_link}>
        <Paper variant="outlined" button className={classes.listItemPaper}>
          <Badge
            style={{ display: "flex", flexDirection: "row" }}
            badgeContent={<ErrorIcon className={classes.errorIcon} />}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <ListItem button className={classes.listItem}>
              <Hidden xsDown>
                <ListItemAvatar>
                  <Avatar className={classes.listIcon}>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
              </Hidden>
              <ListItemText
                primary={
                  <Typography variant="h6">
                    {props.work_title}
                  </Typography>
                }
                secondary={props.work_sender}
              />
              <ListItemText
                align="right"
                primary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.work_dateposted)
                      .locale("id")
                      .format("DD MMM YYYY")}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.work_dateposted).locale("id").format("HH.mm")}
                  </Typography>
                }
              />
            </ListItem>
          </Badge>
        </Paper>
      </Link>
    </Grid>
  );
}

function ListAssessments(props) {
  const {
    category,
    subject,
    type,
    // tab,
    all_assessments,
    classId,
    classes,
    all_subjects_map,
    all_teachers,
    getSelectedDate,
    date,
    mainCounter,
    handleChangeCounter,
    mode,
    handleChangeList
  } = props;

  let localCounter = mainCounter;

  function AssessmentListItem(props) {
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
      <>
        <Typography 
          variant="body2" 
          className={classes.monthAgendaChip} 
          align="left"
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
          {props.work_title}
        </Typography>
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
      </>
    );
  }

  let AssessmentsList = [];
  let TeacherList = []
  let result = [];

  let tempSelectedDate = new Date(date);
      
  if (Boolean(all_assessments.length)) {
    var i;
    for (i = all_assessments.length - 1; i >= 0; i--) {
      let assessment = all_assessments[i];
      let tempDeadlineDate = new Date(moment(assessment.start_date)
      .locale("id"));
      let class_assigned = assessment.class_assigned;

      if (tempSelectedDate.getDate() === tempDeadlineDate.getDate() && 
      tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
      tempSelectedDate.getYear() === tempDeadlineDate.getYear() &&
      class_assigned.indexOf(classId) !== -1) {
        for (let j = 0; j < all_teachers.length; j++) {
          if (all_teachers[j]._id === assessment.author_id) {
            TeacherList.push(all_teachers[j].name);
            break;
          }
        }
        AssessmentsList.push(assessment);
      }
      // if(i === all_assessments.length - 5){ // item terakhir harus pas index ke 4.
      //   break;
      // }
    }
    for (i = 0; i < AssessmentsList.length; i++) {
      let assessment = AssessmentsList[i];
      let teacher_name = TeacherList[i];
      let workCategoryAvatar =
        type === "Kuis" ? (
          <Avatar className={classes.listIcon}>
            <FaClipboardList />
          </Avatar>
        ) : (
          <Avatar className={classes.listIcon}>
            <BsClipboardData />
          </Avatar>
        );
      // let workStatus = "Belum Ditempuh"
      if (type === "Kuis") {
        if (
          (!category ||
            (category === "subject" && assessment.subject === subject._id)) &&
          
          assessment.type === "Kuis" &&
          assessment.posted
        ) {
          if(mode === "Month") {
            if(localCounter < 3) {
              result.push({
                name: assessment.name,
                workCategoryAvatar: workCategoryAvatar,
                subject: assessment.subject,
                teacher_name: teacher_name,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                createdAt: assessment.createdAt,
                finished: assessment.submissions
              });
            }
            localCounter ++;
          }
          else {
            result.push({
              start_date: assessment.start_date,
              end_date: assessment.end_date,
              type: type,
              data: assessment,
            });
          }
        }
      }
      if (type === "Ujian") {
        if (
          (!category ||
            (category === "subject" && assessment.subject === subject._id)) &&
          
          assessment.type === "Ujian" &&
          assessment.posted
        ) {
          if(mode === "Month") {
            if(localCounter < 3) {
              result.push({
                name: assessment.name,
                workCategoryAvatar: workCategoryAvatar,
                subject: assessment.subject,
                teacher_name: teacher_name,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                createdAt: assessment.createdAt,
                finished: assessment.submissions
              });
            }
            localCounter ++;
          }
          else {
            result.push({
              start_date: assessment.start_date,
              end_date: assessment.end_date,
              type: type,
              data: assessment,
            });
          }
        }
      }
    }
  }
  if(mode === "Month") {
    handleChangeCounter(localCounter);
    return result.map((row) => (
      <AssessmentListItem
        work_title={row.name}
        work_category_avatar={row.workCategoryAvatar}
        work_subject={
          category === "subject" ? null : all_subjects_map.get(row.subject)
        }
        work_teacher_name={row.teacher_name}
        // work_status={workStatus}
        work_starttime={moment(row.start_date)
          .locale("id")
          .format("DD MMM YYYY, HH:mm")}
        work_endtime={moment(row.end_date)
          .locale("id")
          .format("DD MMM YYYY, HH:mm")}
        work_dateposted={row.createdAt}
        work_finished={row.finished}
      />
    ));
  }
  else {
    console.log(result);
    handleChangeList(result);
    return;
  }
}

function AssessmentListItemTeacher(props) {
  const { classes } = props;

  return (
    <Grid item>
      <Link to={props.link}>
        <Paper variant="outlined" button className={classes.listItemPaper}>
          <Badge
            style={{ display: "flex", flexDirection: "row" }}
            badgeContent={<WarningIcon className={classes.warningIcon} />}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <ListItem button className={classes.listItem}>
              <Hidden xsDown>
                <ListItemAvatar>
                  <Avatar className={classes.assignmentLate}>
                    {props.type === "Kuis" ? (
                      <FaClipboardList />
                    ) : (
                      <BsClipboardData />
                    )}
                  </Avatar>
                </ListItemAvatar>
              </Hidden>
              <ListItemText primary={props.title} secondary={props.subject} />
              <ListItemText
                align="right"
                primary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.createdAt).locale("id").format("DD MMM YYYY")}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {moment(props.createdAt).locale("id").format("HH.mm")}
                  </Typography>
                }
              />
            </ListItem>
          </Badge>
        </Paper>
      </Link>
    </Grid>
  );
}

function EventDialog(props) {
  const useStyles = makeStyles((theme) => ({
    formIcons: {
      width: "1rem",
      height: "1rem",
      marginRight: "7.5px",
      color: theme.palette.text.secondary
    },
    formLabels: {
      display: "flex",
      alignItems: "center"
    },
    zeroHeightHelperText: {
      height: "0",
      display: "flex" // untuk men-disable "collapsing margin"
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    chip: {
      marginRight: 2,
    },
    viewDialogChip: {
      backgroundColor: theme.palette.primary.main,
      color: "white"
    },
    dummyInput: {
      height: "fit-content!important"
    },
    create_edit_dialogTopDiv: {
      backgroundColor: theme.palette.action.selected,
      display: "flex",
      justifyContent: "space-between",
      padding: "0 24px",
      [theme.breakpoints.up("md")]: {
        "&:hover": {
          cursor: "move"
        }
      },
      [theme.breakpoints.down("sm")]: {
        justifyContent: "flex-end",
        backgroundColor: "transparent"
      }
    },
    view_dialogTopDiv: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "0 24px"
    },
    dialogTopIcons: {
      width: "20px",
      height: "20px",
      color: theme.palette.text.secondary
    },
    addFileButton: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      "&:focus, &:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
      },
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
    deleteIconButton: {
      marginLeft: "7.5px",
      backgroundColor: theme.palette.error.dark,
      color: "white",
      "&:focus, &:hover": {
        backgroundColor: "white",
        color: theme.palette.error.dark,
      },
    },
    mdUpZeroTopPadding: {
      [theme.breakpoints.up("md")]: {
        paddingTop: "0!important"
      }
    },
    mdUpZeroBottomPadding: {
      [theme.breakpoints.up("md")]: {
        paddingBottom: "0!important"
      }
    },
    smDownZeroTopPadding: {
      [theme.breakpoints.down("sm")]: {
        paddingTop: "0!important"
      }
    },
    smDownZeroBottomPadding: {
      [theme.breakpoints.down("sm")]: {
        paddingBottom: "0!important"
      }
    },
    dialogTopIconButtons: {
      padding: "8px",
      "&focus, &:hover": {
        backgroundColor: theme.palette.action.hover
      }
    },
    dialogContent: {
      display: "flex",
      padding: "0",
      flexDirection: "column",
      position: "relative"
    },
    createEditDialogScrollableDiv: {
      display: "flex",
      flexGrow: "1",
      overflowY: "auto",
      overflowX: "hidden",
      padding: "16px 24px",
      flexDirection: "column"
    },
    viewDialogScrollableDiv: {
      flexGrow: "1",
      overflowY: "auto",
      overflowX: "hidden",
      padding: "16px 24px"
    },
    viewDialogBottomDiv: {
      flex: "1 1 auto",
      overflowY: "hidden",
      position: "relative",
      display: "flex",
      flexDirection: "column"
    },
    createEventButton: {
      backgroundColor: theme.palette.success.main,
      color: "white",
      "&:focus, &:hover": {
        backgroundColor: theme.palette.success.main,
        color: "white"
      }
    },
    editEventButton: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      "&:focus, &:hover": {
        backgroundColor: "white",
        color: theme.palette.primary.main,
      },
    },
    dialogPaper: {
      minHeight: "calc(100% - 64px)"
    },
    listItem: {
      "&:focus, &:hover": {
        backgroundColor: theme.palette.primary.fade,
      },
    }
  }));
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    selectedEventInfo,
    openEventDialog,
    handleCloseEventDialog,
    handleOpenEditDialog,
    showSnackbar,
    handleSetUnmountEventDialog,
    eventDialogMode,
    getAllEvents,
    downloadFileEvent,
    viewFileEvent,
  } = props;
  const roleConverter = {
    Admin: "Pengelola",
    Teacher: "Guru",
    Student: "Murid"
  };
  const [errors, setErrors] = React.useState({});

  // FORM
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [start_date, setStartDate] = React.useState(null);
  const [end_date, setEndDate] = React.useState(null);
  const [target_role, setTargetRole] = React.useState([]);
  const [description, setDescription] = React.useState("");
  const [isAllDay, setAllDay] = React.useState(false);

  // LAMPIRAN
  const [fileLampiran, setFileLampiran] = React.useState([]);
  const [fileLampiranToAdd, setFileLampiranToAdd] = React.useState([]); 
  const [fileLampiranToDelete, setFileLampiranToDelete] = React.useState([]);
  const [originalFileLampiran, setOriginalFileLampiran] = React.useState([]);
  const lampiranUploader = React.useRef(null);

  // DATETIME PICKER
  const [openStartDatePicker, setOpenStartDatePicker] = React.useState(false);
  const [openStartDateTimePicker, setOpenStartDateTimePicker] = React.useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = React.useState(false);
  const [openEndDateTimePicker, setOpenEndDateTimePicker] = React.useState(false);
  const startDatePicker = React.useRef(null);
  const endDatePicker = React.useRef(null);

  // ref ini berfungsi untuk menyimpan waktu agar ketika pengguna mencentang kembali checkbox (mengubah jadi tidak sepanjang hari),
  // waktu yang pernah dimasukkan sebelumnya bisa ditampilkan kembali
  const lastSelectedTime = React.useRef(null);

  // UPLOAD DIALOG
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  // const [uploadDialogScrollPosition, setUploadDialogScrollPosition] = React.useState(0);
  // const [uploadDialogScrollElement, setUploadDialogScrollElement] = React.useState(null);

  // DELETE DIALOG
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  // const [deleteDialogScrollPosition, setDeleteDialogScrollPosition] = React.useState(0);
  // const [deleteDialogScrollElement, setDeleteDialogScrollElement] = React.useState(null);

  // OTHER
  const [changeDialog, setChangeDialog] = React.useState(false);

  React.useEffect(() => {
    if (eventDialogMode === "view") {
      if (Object.keys(selectedEventInfo).length !== 0) {
        let { _id, name, location, start_date, end_date, to, description } = selectedEventInfo;
        start_date = new Date(start_date);
        end_date = new Date(end_date);
        setName(name);
        setLocation(location);
        // setLocation("");
        setStartDate(start_date);
        setEndDate(end_date);
        setTargetRole(to);
        setDescription(description);
        // setDescription(Array(100).fill("deskripsi").join(" "));
        getFileEvents(_id).then((result) => {
          setFileLampiran(result);
          setOriginalFileLampiran(result)
        });
        // setFileLampiran([{ _id: "123", filename: `${Array(100).fill("namafile").join(" ")}.txt` }]);
        // setOriginalFileLampiran([{ _id: "123", filename: `${Array(100).fill("namafile").join(" ")}.txt` }])
  
        // pada datetime picker, pengguna tidak bisa menset detik. jadi, pukul 23:59:59 hanya dapat 
        // diset dengan menyentang checkbox sepanjang hari
        if (end_date.getHours() === 23 && end_date.getMinutes() === 59 && end_date.getSeconds() === 59) {
          setAllDay(true);
        }
      }
    }
  }, [selectedEventInfo]);


  // FORM
  const handleCreateEvent = () => {
    let formData = new FormData();
    if (fileLampiran) {
      for (let i = 0; i < fileLampiran.length; i++) {
        formData.append("lampiran_event", fileLampiran[i]);
      }
    }

    let invert = {
      Pengelola: "Admin",
      Guru: "Teacher",
      Murid: "Student"
    };
    let temp = target_role.map((elm) => roleConverter[elm]);
    temp.sort();
    let to = temp.map((elm) => invert[elm]);

    let eventData = {
      name,
      location,
      start_date,
      end_date,
      to,
      description
    };
    setOpenUploadDialog(true);
    // new Promise((resolve) => {
    //   setTimeout(() => {
    //     console.log("hello");
    //     resolve();
    //   }, 4000);
    // })
    createEvent(formData, eventData)
      .then(() => {
        setUploadSuccess(true);
        getAllEvents();
      })
      .catch((err) => {
        setOpenUploadDialog(false);
        setErrors(err);
      });
  };

  const handleUpdateEvent = () => {
    let formData = new FormData();
    if (fileLampiranToAdd) {
      for (let i = 0; i < fileLampiranToAdd.length; i++) {
        formData.append("lampiran_event", fileLampiranToAdd[i]);
      }
    }

    let invert = {
      Pengelola: "Admin",
      Guru: "Teacher",
      Murid: "Student"
    };
    let temp = target_role.map((elm) => roleConverter[elm]);
    temp.sort();
    let to = temp.map((elm) => invert[elm]);

    let eventData = {
      name,
      location,
      start_date,
      end_date,
      to,
      description
    };
    setOpenUploadDialog(true);
    // new Promise((resolve) => {
    //   setTimeout(() => {
    //     console.log("hello");
    //     resolve();
    //   }, 4000);
    // })
    updateEvent(formData, fileLampiranToDelete, eventData, selectedEventInfo._id)
      .then(() => {
        setUploadSuccess(true);
        getAllEvents();
      })
      .catch((err) => {
        setOpenUploadDialog(false);
        setFileLampiran([...originalFileLampiran, ...fileLampiranToAdd]);
        setFileLampiranToDelete([]);
        setErrors(err);
      });
  };

  // DATETIME PICKER
  const isValidDateTime = (d) => {
    return d instanceof Date && !isNaN(d);
  };

  const handleCheckAllDay = () => {
    let newStatus = !isAllDay;
    if (newStatus) {
      // jika diset ke sepanjang hari, ...
      
      setErrors({ ...errors, start_date_submission: undefined, end_date_submission: undefined });

      // di mode sepanjang hari, hanya tanggal yang ditampilkan di datetime picker. 
      // waktu tidak ditampilkan dan akan diset menjadi 00:00 (untuk start date) - 23:59 (untuk end date)

      lastSelectedTime.current = {};
      if (isValidDateTime(start_date)) {
        // jika tanggal dan waktu valid

        // set waktu mulai ke 00:00:00. tanggal tidak diubah 
        // let start = new Date(start_date.getTime()); // membuat salinan
        // start.setHours(0, 0, 0);
        // setStartDate(start);
        setStartDate(getDayStart(start_date));

        // simpan waktu
        lastSelectedTime.current.start_date = {
          hour: start_date.getHours(),
          minute: start_date.getMinutes()
        };
      } else {
        // jika tanggal atau waktu tidak valid,

        if (startDatePicker.current.getAttribute("value")) {
          // jika isi textfield picker ada,

          // dapatkan string yang ditampilkan di textfield datetime picker.
          // string ini akan memiliki format yang sama seperti format yang sedang digunakan pada datetime picker: "dd/MM/yyyy - HH:mm"
          let [dateStr, separator, timeStr] = startDatePicker.current.getAttribute("value").split(" ");
  
          // mencoba mem-parse tanggal
          let [day, month, year] = dateStr.split("/");
  
          // menyusun ulang tanggal karena parser js akan memparse tanggal dalam format "dd/MM/yyyy" menjadi "MM/dd/yyyy".
          // ga pakai new Date(int year, int month, int day) karena nilai month > 11, month < 0, day < 1, dan day > 31 atau 30 masih
          // diterima dan menghasilkan Date yang valid
          let parsedDate = new Date(`${year}-${month}-${day}`);
          // let parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

          // jika tanggal tidak valid, set tanggal mulai menjadi tanggal sekarang 
          setStartDate(isValidDateTime(parsedDate) ? parsedDate : new Date());

          // mencoba mem-parse waktu
          let [hour, minute] = timeStr.split(":");
          let parsedTime = new Date(0, 0, 0, Number(hour), Number(minute), 0);

          if (isValidDateTime(parsedTime)) {
            // simpan waktu
            lastSelectedTime.current.start_date = {
              hour: parsedTime.getHours(),
              minute: parsedTime.getMinutes()
            };
          } else {
            // simpan nilai null (saat waktu simpanan ini digunakan, nilai null ini akan dikonversi menjadi 00:00)
            lastSelectedTime.current.start_date = null;
          }

        } else {
          // jika isi textfield picker kosong,
          // let start = new Date();
          // start.setHours(0, 0, 0);
          // setStartDate(start);
          setStartDate(getDayStart(new Date()));

          lastSelectedTime.current.start_date = null;
        }
      }

      if (isValidDateTime(end_date)) {
        // jika tanggal dan waktu valid

        // set waktu selesai ke 23:59:59. tanggal tidak diubah 
        // let end = new Date(end_date.getTime()); // membuat salinan
        // end.setHours(23, 59, 59);
        // setEndDate(end);
        setEndDate(getDayEnd(end_date));

        // simpan waktu
        lastSelectedTime.current.end_date = {
          hour: end_date.getHours(),
          minute: end_date.getMinutes()
        };
      } else {
        // jika tanggal atau waktu tidak valid,

        if (endDatePicker.current.getAttribute("value")) {
          // jika isi textfield picker ada,

          // dapatkan string yang ditampilkan di textfield datetime picker.
          // string ini akan memiliki format yang sama seperti format yang sedang digunakan pada datetime picker: "dd/MM/yyyy - HH:mm"
          let [dateStr, separator, timeStr] = endDatePicker.current.getAttribute("value").split(" ");

          // mencoba mem-parse tanggal
          let [day, month, year] = dateStr.split("/");

          // menyusun ulang tanggal karena parser js akan memparse tanggal dalam format "dd/MM/yyyy" menjadi "MM/dd/yyyy".
          // ga pakai new Date(int year, int month, int day) karena nilai month > 11, month < 0, day < 1, dan day > 31 atau 30 masih
          // diterima dan menghasilkan Date yang valid
          let parsedDate = new Date(`${year}-${month}-${day}`);
          // let parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

          // jika tanggal tidak valid, set tanggal mulai menjadi tanggal sekarang 
          setEndDate(isValidDateTime(parsedDate) ? parsedDate : new Date());

          // mencoba mem-parse waktu
          let [hour, minute] = timeStr.split(":");
          let parsedTime = new Date(0, 0, 0, Number(hour), Number(minute), 0);
  
          if (isValidDateTime(parsedTime)) {
            // simpan waktu
            lastSelectedTime.current.end_date = {
              hour: parsedTime.getHours(),
              minute: parsedTime.getMinutes()
            };
          } else {
            // simpan nilai null (saat waktu simpanan ini digunakan, nilai null ini akan dikonversi menjadi 00:00)
            lastSelectedTime.current.end_date = null;
          }
        } else {
          // jika isi textfield picker kosong,

          // let end = new Date();
          // end.setHours(23, 59, 59);
          // setEndDate(end);
          setEndDate(getDayEnd(new Date()));

          lastSelectedTime.current.end_date = null;
        }
      }
    } else {
      // jika diset ke tidak sepanjang hari

      if (isValidDateTime(start_date)) {
        // pada mode sepanjang hari, waktu mulai sudah dibuat agar tetap berisi 00:00:00 sehingga nilai waktu mulai pasti valid.
        // jika tanggal mulai juga valid, 

        let start = new Date(start_date.getTime()); // membuat salinan

        if (lastSelectedTime.current !== null) { 
          // lastSelectedTime.current === null ketika form ini dimuat untuk mode edit

          let startDate = lastSelectedTime.current.start_date;
          if (startDate === null) {
            // jika waktu simpanan null, berarti waktu yang sebelumnya akan disimpan itu tidak valid.
            // reset waktu jadi 00:00:00
            start.setHours(0, 0, 0, 0);
          } else {
            // jika waktu simpanan ada, set waktu mulai jadi sesuai dengan waktu yang disimpan tersebut
            start.setHours(
              startDate.hour,
              startDate.minute
            );
          }
        }
        setStartDate(start);
      } else {
        // jika tanggal mulai tidak valid, set tanggal dan waktu mulai jadi tanggal dan waktu sekarang 
        // (belum ada alasan khusus kenapa waktunya tidak diset menjadi 00:00:00)
        setStartDate(new Date());
      }

      if (isValidDateTime(end_date)) {
        // pada mode sepanjang hari, waktu selesai sudah dibuat agar tetap berisi 23:59:59 sehingga nilai waktu selesai pasti valid. 
        // jika tanggal selesai juga valid,

        let end = new Date(end_date.getTime()); // membuat salinan

        if (lastSelectedTime.current !== null) {
          // lastSelectedTime.current === null ketika form ini dimuat untuk mode edit

          let endDate = lastSelectedTime.current.end_date;
          if (endDate === null) {
            // jika waktu simpanan null, berarti waktu yang sebelumnya akan disimpan itu tidak valid.
            // reset waktu jadi 23:59:00 
            // (tidak diset jadi 23:59:59 karena 23:59:59 digunakan sebagai kriteria untuk menentukan apakah event yang diretrieve dari db itu   
            // all day apa tidak / ada kode ky gini saat load form edit: if (time === 23:59:59) {all_day = true})
            end.setHours(23, 59, 0);
          } else {
            // jika waktu simpanan ada, set waktu selesai jadi sesuai dengan waktu yang disimpan tersebut
            end.setHours(
              endDate.hour,
              endDate.minute
            );
          }
        }
        setEndDate(end);
      } else {
        // jika tanggal selesai tidak valid, set tanggal dan waktu selesai jadi tanggal dan waktu sekarang
        // (belum ada alasan khusus kenapa waktunya tidak diset menjadi 23:59:59)
        setEndDate(new Date());
      }
    }

    setAllDay(newStatus);
  };

  const handleStartDateChange = (date) => {
    setErrors({ ...errors, start_date_submission: undefined });
    
    let startDate = date;
    if (isAllDay) {
      // ini perlu ditambahkan karena onchange pada date picker dapat mengubah nilai waktu (ga ngerti kenapa)
      startDate.setHours(0, 0, 0);
    }
    setStartDate(startDate);
  };

  const handleEndDateChange = (date) => {
    setErrors({ ...errors, end_date_submission: undefined });

    let endDate = date;
    if (isAllDay) {
      // ini perlu ditambahkan karena onchange pada date picker dapat mengubah nilai waktu (ga ngerti kenapa)
      endDate.setHours(23, 59, 59, 999);
    }
    setEndDate(endDate);
  };

  const handleOpenStartPicker = (isAllDay) => {
    if (isAllDay) {
      setOpenStartDatePicker(true);
    } else {
      setOpenStartDateTimePicker(true);
    }
  };

  const handleCloseStartPicker = (isAllDay) => {
    if (isAllDay) {
      setOpenStartDatePicker(false);
    } else {
      setOpenStartDateTimePicker(false);
    }
  };

  const handleOpenEndPicker = (isAllDay) => {
    if (isAllDay) {
      setOpenEndDatePicker(true);
    } else {
      setOpenEndDateTimePicker(true);
    }
  };

  const handleCloseEndPicker = (isAllDay) => {
    if (isAllDay) {
      setOpenEndDatePicker(false);
    } else {
      setOpenEndDateTimePicker(false);
    }
  };

  // FORM
  const handleChangeName = (e) => {
    setErrors({ ...errors, name: undefined });
    setName(e.target.value);
  };

  const handleChangeTargetRole = (e) => {
    setErrors({ ...errors, to: undefined });
    setTargetRole(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setErrors({ ...errors, description: undefined });
    setDescription(e.target.value)
  };

  const fileType = (filename) => {
    let ext_file = Path.extname(filename);
    switch (ext_file) {
      case ".docx":
        return "Word";
      case ".xlsx":
      case ".csv":
        return "Excel";

      case ".png":
      case ".jpg":
      case ".jpeg":
        return "Gambar";

      case ".pdf":
        return "PDF";

      case ".txt":
      case ".rtf":
        return "Teks";

      case ".ppt":
      case ".pptx":
        return "Presentasi";

      default:
        return "File Lainnya";
    }
  };

  // LAMPIRAN
  const handleLampiranUpload = (e) => {
    if (eventDialogMode === "create") {
      const files = e.target.files;
      let temp = [...Array.from(fileLampiran), ...Array.from(files)];
      let over_limit = temp.filter((file) => file.size / Math.pow(10, 6) > 10);
      let file_to_upload = temp.filter(
        (file) => file.size / Math.pow(10, 6) <= 10
      );
  
      if (errors.lampiran_materi) {
        // karena errornya ini berupa lampiran_materi
        setErrors({ ...errors, lampiran_materi: null });
      }
      setFileLampiran(file_to_upload);
  
      if (over_limit.length > 0) {
        showSnackbar("error", over_limit.length + " file melebihi batas 10MB!");
      }

      document.getElementById("file_control").value = null;
    } else if (eventDialogMode === "edit") {
      const files = Array.from(e.target.files);
      if (fileLampiran.length === 0) {
        let over_limit = files.filter((file) => file.size / Math.pow(10, 6) > 10);
        let allowed_file = files.filter(
          (file) => file.size / Math.pow(10, 6) <= 10
        );
        setFileLampiran(allowed_file);
        setFileLampiranToAdd(allowed_file);

        if (over_limit.length > 0) {
          showSnackbar("error", over_limit.length + " file melebihi batas 10MB!");
        }

        document.getElementById("file_control").value = null;
      } else {
        if (files.length !== 0) {
          let allowed_file = files.filter(
            (file) => file.size / Math.pow(10, 6) <= 10
          );
          let over_limit = files.filter(
            (file) => file.size / Math.pow(10, 6) > 10
          );

          let temp = [...fileLampiran, ...allowed_file];
          let file_to_upload = [...fileLampiranToAdd, ...allowed_file];
          allowed_file = temp;

          setFileLampiran(allowed_file);
          setFileLampiranToAdd(file_to_upload);

          if (over_limit.length > 0) {
            showSnackbar("error", over_limit.length + " file melebihi batas 10MB!");
          }
        }
        document.getElementById("file_control").value = null;
      }
    }
  };

  const handleLampiranDelete = (e, i) => {
    e.preventDefault();
    if (eventDialogMode === "create") {
      let temp = Array.from(fileLampiran);
      temp.splice(i, 1);
      setFileLampiran(temp);
    } else if (eventDialogMode === "edit") {
      let temp = Array.from(fileLampiran);
      let tempToDelete = fileLampiranToDelete;
      let tempToAdd = fileLampiranToAdd;
      // For the one that has already been uploaded, there will be a filename field (yang belum adanya name)
      // For the one that has already in DB
      if (fileLampiran[i].filename !== undefined) {
        // Remove the file in fileLampiranToDelete
        tempToDelete.push(temp[i]);
      } else {
        // For the one that"s not yet in DB
        // Remove the file in fileLampiranToAdd
        for (var j = 0; j < tempToAdd.length; j++) {
          if (tempToAdd[j].name === temp[i].name) {
            tempToAdd.splice(j, 1);
          }
        }
      }
      temp.splice(i, 1);

      setFileLampiran(temp);
      setFileLampiranToAdd(tempToAdd);
      setFileLampiranToDelete(tempToDelete);
    }
  };

  /*
  // UPLOAD DIALOG
  const uploadDialogScrollRef = React.useCallback((node) => {
    if (node !== null) {
      setUploadDialogScrollElement(node);
    }
  }, []);

  React.useEffect(() => {
    if (uploadDialogScrollElement) {
      uploadDialogScrollElement.scrollTo({
        left: 0,
        top: uploadDialogScrollPosition,
        behavior: "smooth"
      });
    }
  }, [uploadDialogScrollPosition]);

  const handleUploadDialogWheel = (e) => {
    e.preventDefault();
    let lowestScrollPosition = uploadDialogScrollElement.scrollHeight - uploadDialogScrollElement.offsetHeight;
    let nextScrollPosition = (uploadDialogScrollElement.scrollTop !== uploadDialogScrollPosition ? uploadDialogScrollElement.scrollTop : uploadDialogScrollPosition) + e.deltaY;
    if (nextScrollPosition > lowestScrollPosition) {
      setUploadDialogScrollPosition(lowestScrollPosition);
    } else if (nextScrollPosition < 0) {
      setUploadDialogScrollPosition(0);
    } else {
      setUploadDialogScrollPosition(nextScrollPosition);
    }
  };

  // DELETE DIALOG
  const deleteDialogScrollRef = React.useCallback((node) => {
    if (node !== null) {
      setDeleteDialogScrollElement(node);
    }
  }, []);

  React.useEffect(() => {
    if (deleteDialogScrollElement) {
      deleteDialogScrollElement.scrollTo({
        left: 0,
        top: deleteDialogScrollPosition,
        behavior: "smooth"
      });
    }
  }, [deleteDialogScrollPosition]);

  const handleDeleteDialogWheel = (e) => {
    e.preventDefault();
    let lowestScrollPosition = deleteDialogScrollElement.scrollHeight - deleteDialogScrollElement.offsetHeight;
    let nextScrollPosition = (deleteDialogScrollElement.scrollTop !== deleteDialogScrollPosition ? deleteDialogScrollElement.scrollTop : deleteDialogScrollPosition) + e.deltaY;
    if (nextScrollPosition > lowestScrollPosition) {
      setDeleteDialogScrollPosition(lowestScrollPosition);
    } else if (nextScrollPosition < 0) {
      setDeleteDialogScrollPosition(0);
    } else {
      setDeleteDialogScrollPosition(nextScrollPosition);
    }
  };
  */

  const handleDelete = (eventId) => {
    deleteEvent(eventId).then(() => {
      getAllEvents();
      handleCloseEventDialog();
      showSnackbar("success", "Kegiatan berhasil dihapus");
    })

  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // OTHER
  const handleClickEdit = () => {
    handleCloseEventDialog();
    setChangeDialog(true);
  };

  const handleClosingCheck = () => {
    if (!(openUploadDialog && !uploadSuccess)) {
      handleCloseEventDialog();
    }
  };

  return (
    <Dialog
      onExited={() => { 
        if (changeDialog) {
          // open edit dialog
          setChangeDialog(false);
          handleOpenEditDialog();
        } else {
          // agar state komponen ini di-reset saat dialog ditutup
          handleSetUnmountEventDialog();
        }
      }}
      open={openEventDialog}
      onClose={() => { handleClosingCheck() }}
      PaperComponent={fullScreen ? undefined : PaperComponent}
      maxWidth="sm"
      fullScreen={fullScreen}
      fullWidth
      BackdropProps={{
        style: { backgroundColor: "transparent" }
      }}
      classes={{ paper: classes.dialogPaper }}
    >
      {eventDialogMode === "view"
        ?
        <>
          <div className={classes.view_dialogTopDiv}>
            <LightTooltip title="Sunting">
              <IconButton 
                className={classes.dialogTopIconButtons}
                onClick={() => { handleClickEdit() }}
              >
                <EditOutlinedIcon className={classes.dialogTopIcons} />
              </IconButton>
            </LightTooltip>
            <LightTooltip title="Hapus" style={{ marginRight: "24px" }}>
              <IconButton 
                className={classes.dialogTopIconButtons}
                onClick={() => { handleOpenDeleteDialog() }}
              >
                <DeleteOutlinedIcon className={classes.dialogTopIcons} />
              </IconButton>
            </LightTooltip>
            <IconButton 
              edge="end" 
              className={classes.dialogTopIconButtons} 
              onClick={() => { handleCloseEventDialog() }}
            >
              <CloseIcon className={classes.dialogTopIcons} />
            </IconButton>
          </div>
          <div className={classes.viewDialogBottomDiv}>
            <CustomDeleteDialog
              // handleWheel={handleDeleteDialogWheel}
              openDeleteDialog={openDeleteDialog}
              handleCloseDeleteDialog={handleCloseDeleteDialog}
              eventName={name}
              handleDelete={() => { handleDelete(selectedEventInfo._id) }}
            />
            <div /* ref={deleteDialogScrollRef} */ className={classes.viewDialogScrollableDiv}>
                
              <Grid container direction="column" spacing="4" style={{ marginTop: "0", marginBottom: "0" }}>
                <Grid item xs={12} style={{ paddingTop: "0", paddingBottom: "0" }}>
                  <Typography variant="h5" gutterBottom style={{ wordBreak: "break-word" }}>
                    <b>{name}</b>
                  </Typography>
                </Grid>
                {location.length === 0
                  ? null
                  :
                  <Grid item xs={12} style={{ paddingTop: "0" }}>
                    <Typography className={classes.formLabels} style={{ wordBreak: "break-word" }}>
                      <LocationOnIcon className={classes.formIcons} />
                      {location}
                    </Typography>
                  </Grid>
                }
                <Grid item>
                  <Typography className={classes.formLabels}>
                    <TimerIcon className={classes.formIcons} />
                    {moment(start_date)
                      .locale("id")
                      .format("dddd, DD MMMM YYYY  ∙  HH:mm")}
                  </Typography>
                  <Typography className={classes.formLabels} style={{ marginTop: "8px" }}>
                    <TimerOffIcon className={classes.formIcons} />
                    {moment(end_date)
                      .locale("id")
                      .format("dddd, DD MMMM YYYY  ∙  HH:mm")}
                  </Typography>
                </Grid>
                <Grid container item direction="row" alignItems="center">
                  <SupervisorAccountIcon className={classes.formIcons} />
                  <div className={classes.chips}>
                    {target_role.map((role) => (
                      <Chip
                        key={role}
                        className={`${classes.chip} ${classes.viewDialogChip}`}
                        label={roleConverter[role]}
                      />
                    ))}
                  </div>
                </Grid>
                <Grid item>
                  <Typography
                    align="justify"
                    style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                  >
                    <CustomLinkify text={description} />
                  </Typography>
                </Grid>
                <Grid item container spacing={1}>
                  {
                    fileLampiran.length === 0
                      ? null
                      :
                      fileLampiran.map((lampiran) => (
                        <LampiranFile
                          classes={classes}
                          file_id={lampiran._id}
                          onPreviewFile={viewFileEvent}
                          onDownloadFile={downloadFileEvent}
                          filename={lampiran.filename}
                          filetype={fileType(lampiran.filename)}
                          eventDialogMode={eventDialogMode}
                        />
                      ))
                  }
                </Grid>
              </Grid>
            </div>
          </div>
        </>
        :
        <>
          <div className={classes.create_edit_dialogTopDiv} id="drag-handle">
            <Hidden smDown>
              <IconButton
                edge="start"
                className={classes.dialogTopIconButtons}
              >
                <DragHandleIcon className={classes.dialogTopIcons} />
              </IconButton>
            </Hidden>
            <IconButton 
              edge="end"
              className={classes.dialogTopIconButtons}
              style={(openUploadDialog && !uploadSuccess) ? { visibility: "hidden" } : undefined}
              onClick={() => { if (!(openUploadDialog && !uploadSuccess)) { handleCloseEventDialog() } }}
            >
              <CloseIcon className={classes.dialogTopIcons} />
            </IconButton>
          </div>
          <DialogTitle disableTypography>
            <Typography variant="h5" gutterBottom>
              <b>{eventDialogMode === "create" ? "Buat Kegiatan" : "Sunting Kegiatan"}</b>
            </Typography>
            <Typography color="textSecondary">
              {eventDialogMode === "create"
                ? "Tambahkan keterangan untuk membuat kegiatan." 
                : "Ganti keterangan untuk menyunting kegiatan."}
            </Typography>
          </DialogTitle>
          <DialogContent
            dividers
            className={classes.dialogContent}
          >
            <CustomUploadDialog 
              // handleWheel={handleUploadDialogWheel} 
              openUploadDialog={openUploadDialog}
              handleUploadSuccess={handleCloseEventDialog}
              uploadSuccess={uploadSuccess}
              messageUploading={eventDialogMode === "create" ? "Kegiatan sedang dibuat" : "Kegiatan sedang disunting"}
              messageSuccess={eventDialogMode === "create" ? "Kegiatan telah dibuat" : "Kegiatan telah disunting"}
            />
            <div /* ref={uploadDialogScrollRef} */ className={classes.createEditDialogScrollableDiv}>
              <Grid container direction="column" spacing={4}>
                {/* <Grid item>
                  <Button
                    color="primary"
                    onClick={() => {
                      if (errors.name) {
                        setErrors({ ...errors, name: undefined, description: undefined, target_role: undefined })
                      } else {
                        setErrors({ ...errors, name: "error error error error error error error error error error error error error error error ", description: "error", target_role: "error" })
                      }
                    }}>SHOW ERROR</Button>
                </Grid> */}

                <Grid item>
                  <Typography component="label" for="name" color="primary" className={classes.formLabels}>
                    <EventNoteIcon className={classes.formIcons} />
                    Judul
                  </Typography>
                  <TextField
                    id="name"
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Isi Judul"
                    value={name}
                    error={errors.name}
                    onChange={(e) => { handleChangeName(e) }}
                  />
                  {errors.name
                    ?
                    <div className={classes.zeroHeightHelperText}>
                      <FormHelperText variant="outlined" error>{errors.name}</FormHelperText>
                    </div>
                    : null}
                </Grid>

                <Grid item>
                  <Typography component="label" for="location" color="primary" className={classes.formLabels}>
                    <LocationOnIcon className={classes.formIcons} />
                    Lokasi
                  </Typography>
                  <TextField
                    id="location"
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Isi Lokasi"
                    value={location}
                    onChange={(e) => { setLocation(e.target.value) }}
                  />
                </Grid>

                <Grid item container spacing={2} className={classes.mdUpZeroBottomPadding}>
                  <Grid item xs={12} md={6} className={classes.smDownZeroBottomPadding}>
                    <Typography
                      component="label"
                      for="eventStart"
                      color="primary"
                      className={classes.formLabels}
                    >
                      <TimerIcon className={classes.formIcons} />
                      Waktu Mulai
                    </Typography>
                    <MuiPickersUtilsProvider
                      locale={lokal}
                      utils={DateFnsUtils}
                    >
                      <KeyboardDatePicker
                        okLabel="Simpan"
                        cancelLabel="Batal"
                        disablePast
                        onChange={(date) => { handleStartDateChange(date) }}
                        open={openStartDatePicker}
                        onClose={() => { setOpenStartDatePicker(false) }}
                        style={{ display: "none" }}
                      />
                      <KeyboardDateTimePicker
                        id="eventStart"
                        inputRef={startDatePicker}
                        fullWidth
                        disablePast
                        inputVariant="outlined"
                        format={isAllDay ? "dd/MM/yyyy" : "dd/MM/yyyy - HH:mm"}
                        ampm={false}
                        okLabel="Simpan"
                        cancelLabel="Batal"
                        minDateMessage="Batas waktu harus waktu yang akan datang"
                        invalidDateMessage="Format tanggal tidak benar"
                        value={start_date}
                        placeholder="Isi Waktu Mulai"
                        onChange={(date) => { handleStartDateChange(date) }}
                        helperText={null}
                        onError={(err) => {
                          if (errors.start_date_picker !== err) {
                            setErrors({ ...errors, start_date_picker: err });
                          }
                        }}
                        open={openStartDateTimePicker}
                        onOpen={() => { handleOpenStartPicker(isAllDay) }}
                        onClose={() => { handleCloseStartPicker(isAllDay) }}
                      />
                      <div className={classes.zeroHeightHelperText} style={{ flexDirection: "column" }}>
                        {errors.start_date_submission
                          ? <FormHelperText variant="outlined" error>{errors.start_date_submission}</FormHelperText>
                          : errors.start_date_picker
                            ? <FormHelperText variant="outlined" error>{errors.start_date_picker}</FormHelperText>
                            : null}
                        {/* checkbox ini dimasukkan ke div zero height ini agar dapat berpindah ke bawah (untuk memberikan ruang 
                          untuk menampilkan helper text error) tanpa memindahkan dua item-item di bawahnya*/}
                        <FormGroup style={{ width: "fit-content" }}>
                          <FormControlLabel
                            label={
                              <Typography color="textSecondary">
                                Sepanjang Hari
                              </Typography>
                            }
                            control={
                              <Checkbox
                                onChange={() => { handleCheckAllDay() }}
                                color="primary"
                                size="small"
                                checked={isAllDay}
                              />
                            }
                          />
                        </FormGroup>
                      </div>
                      <Grid item style={{ padding: "0", width: "0", visibility: "hidden" }}>
                        <FormHelperText variant="outlined">{"\u200B"}</FormHelperText>
                        <Checkbox size="small" disabled />
                      </Grid>
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} md={6} className={classes.smDownZeroTopPadding}>
                    <Typography
                      component="label"
                      for="eventEnd"
                      color="primary"
                      className={classes.formLabels}
                    >
                      <TimerOffIcon className={classes.formIcons} />
                      Waktu Selesai
                    </Typography>
                    <MuiPickersUtilsProvider
                      locale={lokal}
                      utils={DateFnsUtils}
                    >
                      <KeyboardDatePicker
                        okLabel="Simpan"
                        cancelLabel="Batal"
                        disablePast
                        minDate={start_date}
                        onChange={(date) => { handleEndDateChange(date) }}
                        open={openEndDatePicker}
                        onClose={() => setOpenEndDatePicker(false)}
                        style={{ display: "none" }}
                      />
                      <KeyboardDateTimePicker
                        id="eventEnd"
                        inputRef={endDatePicker}
                        fullWidth
                        disablePast
                        inputVariant="outlined"
                        format={isAllDay ? "dd/MM/yyyy" : "dd/MM/yyyy - HH:mm"}
                        ampm={false}
                        okLabel="Simpan"
                        cancelLabel="Batal"
                        minDate={start_date}
                        minDateMessage="Batas waktu harus setelah Waktu Mulai"
                        invalidDateMessage="Format tanggal tidak benar"
                        value={end_date}
                        placeholder="Isi Waktu Selesai"
                        onChange={(date) => { handleEndDateChange(date) }}
                        helperText={null}
                        onError={(err) => {
                          if (errors.end_date_picker !== err) {
                            setErrors({ ...errors, end_date_picker: err });
                          }
                        }}
                        open={openEndDateTimePicker}
                        onOpen={() => { handleOpenEndPicker(isAllDay) }}
                        onClose={() => { handleCloseEndPicker(isAllDay) }}
                      />
                      <div className={classes.zeroHeightHelperText} style={{ flexDirection: "column" }}>
                        {errors.end_date_submission
                          ? <FormHelperText variant="outlined" error>{errors.end_date_submission}</FormHelperText>
                          : errors.end_date_picker
                            ? <FormHelperText variant="outlined" error>{errors.end_date_picker}</FormHelperText>
                            : null}
                      </div>
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>

                <Grid item className={classes.mdUpZeroTopPadding} >
                  <Typography
                    component="label"
                    for="target_role"
                    color="primary"
                    className={classes.formLabels}
                  >
                    <SupervisorAccountIcon className={classes.formIcons} />
                    Pihak Penerima
                  </Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    error={errors.to}
                  >
                    <Select
                      id="target_role"
                      multiple
                      displayEmpty
                      value={target_role}
                      onChange={(e) => { handleChangeTargetRole(e) }}
                      renderValue={(selected) => (
                        <div className={classes.chips}>
                          {selected.length === 0
                            ? 
                            // input ini hanya digunakan sebagai placeholder
                            <Input
                              disableUnderline
                              placeholder="Pilih Pihak Penerima"
                              readOnly
                              classes={{ input: classes.dummyInput }}
                            />
                            : 
                            selected.map((role) => {
                              return (
                                <Chip
                                  key={role}
                                  className={classes.chip}
                                  label={roleConverter[role]}
                                />
                              )
                            })}
                        </div>
                      )}
                    >
                      {["Student", "Teacher", "Admin"].map((role) => (
                        <MenuItem key={role} value={role}>
                          <Checkbox checked={target_role.includes(role)} color="primary"/>
                          <ListItemText primary={roleConverter[role]} />
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.to
                      ?
                      <div className={classes.zeroHeightHelperText}>
                        <FormHelperText variant="outlined" error>{errors.to}</FormHelperText>
                      </div>
                      : null}
                  </FormControl>
                </Grid>

                <Grid item>
                  <Typography component="label" for="description" color="primary" className={classes.formLabels}>
                    <SubjectIcon className={classes.formIcons} />
                    Deskripsi
                  </Typography>
                  <TextField
                    id="description"
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Isi Deskripsi"
                    multiline
                    value={description}
                    error={errors.description}
                    onChange={(e) => { handleChangeDescription(e) }}
                  />
                  {errors.description
                    ?
                    <div className={classes.zeroHeightHelperText}>
                      <FormHelperText variant="outlined" error>{errors.description}</FormHelperText>
                    </div>
                    : null}
                </Grid>

                <Grid item>
                  <input
                    id="file_control"
                    name="lampiran"
                    type="file"
                    accept="file/*"
                    multiple={true}
                    ref={lampiranUploader}
                    onChange={handleLampiranUpload}
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AttachFileIcon />}
                    onClick={() => { lampiranUploader.current.click() }}
                    className={classes.addFileButton}
                  >
                    Tambah Lampiran Berkas
                  </Button>
                  <Grid container spacing={1} style={{ marginTop: "10px" }}>
                    {fileLampiran.length === 0
                      ? null
                      :
                      fileLampiran.map((lampiran, index) => (
                        <LampiranFile
                          classes={classes}
                          filename={lampiran.name ?? lampiran.filename}
                          filetype={fileType(lampiran.name ?? lampiran.filename)}
                          handleLampiranDelete={handleLampiranDelete}
                          i={index}
                          eventDialogMode={eventDialogMode}
                        />
                      ))
                    }
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions style={{ padding: "16px 24px" }}>
            <Button
              variant="contained"
              className={eventDialogMode === "create" ? classes.createEventButton : classes.editEventButton}
              disabled={openUploadDialog}
              onClick={() => { eventDialogMode === "create" ? handleCreateEvent() : handleUpdateEvent() }}
            >
              {eventDialogMode === "create" ? "Buat" : "Sunting"}
            </Button>
          </DialogActions>
        </>
      }
    </Dialog>
  );
}

function CustomUploadDialog(props) {
  const useStyles = makeStyles((theme) => ({
    paper: {
      width: "300px",
      maxWidth: "100%",
      minHeight: "175px",
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center"
    },
    backdrop: {
      backgroundColor: "rgba(0,0,0,0.5)",
      position: "absolute",
      zIndex: "1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      width: "100%", 
      height: "100%"
    },
    uploadSuccessIcon: {
      color: "green",
      height: "45px",
      width: "45px",
    },
    uploadFinishButton: {
      width: "100%",
      marginTop: "10px",
      backgroundColor: theme.palette.success.main,
      color: "white",
      "&:focus, &:hover": {
        backgroundColor: theme.palette.success.dark,
        color: "white",
      },
    },
  }));
  const classes = useStyles();
  const { 
    // handleWheel,
    openUploadDialog,
    messageUploading,
    messageSuccess,
    uploadSuccess,
    handleUploadSuccess
  } = props;

  return (
    <Fade in={openUploadDialog} /* ini sebenarnya ga terpakai karena upload dialog dibuat tutup bersamaan dengan parent dialognya */>
      <div
        className={classes.backdrop}
        // onWheel={(event) => { handleWheel(event) }}
      >
        <Paper className={`${classes.paper} MuiPaper-elevation24`}>
          <Grid item>
            <Typography variant="h6" align="center" gutterBottom>
              {!uploadSuccess ? messageUploading : messageSuccess}
            </Typography>
          </Grid>
          <Grid item>
            {!uploadSuccess ? (
              <CircularProgress />
            ) : (
              <CheckCircleIcon className={classes.uploadSuccessIcon} />
            )}
          </Grid>
          <Grid item>
            {!uploadSuccess ? (
              <Typography variant="body2" align="center" gutterBottom>
                <b>Mohon tunggu sebentar</b>
              </Typography>
            ) : (
              <Button
                variant="contained"
                className={classes.uploadFinishButton}
                onClick={() => { handleUploadSuccess() }}
              >
                Selesai
              </Button>
            )}
          </Grid>
        </Paper>
      </div>
    </Fade>
  );
}

function CustomDeleteDialog(props) {
  const useStyles = makeStyles((theme) => ({
    paper: {
      width: "300px",
      maxWidth: "100%",
      minHeight: "175px",
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center"
    },
    backdrop: {
      backgroundColor: "rgba(0,0,0,0.5)",
      position: "absolute",
      zIndex: "1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      width: "100%",
      height: "100%"
    },
    dialogDeleteButton: {
      width: "125px",
      backgroundColor: theme.palette.error.main,
      color: "white",
      border: `1px solid ${theme.palette.error.main}`,
      "&:focus, &:hover": {
        backgroundColor: theme.palette.error.dark,
        color: "white",
        border: `1px solid ${theme.palette.error.dark}`,
      },
    },
    dialogCancelButton: {
      width: "125px",
      backgroundColor: "white",
      color: theme.palette.error.main,
      border: `1px solid ${theme.palette.error.main}`,
      "&:focus, &:hover": {
        backgroundColor: "white",
        color: theme.palette.error.dark,
        border: `1px solid ${theme.palette.error.dark}`,
      },
    },
  }));
  const classes = useStyles();
  const {
    // handleWheel,
    openDeleteDialog,
    handleCloseDeleteDialog,
    handleDelete,
    eventName
  } = props;

  return (
    <Fade in={openDeleteDialog}>
      <div
        className={classes.backdrop}
        // onWheel={(event) => { handleWheel(event) }}
      >
        <Paper className={`${classes.paper} MuiPaper-elevation24`}>
          <Grid item>
            <Typography variant="h6" align="center" gutterBottom>
              Hapus Kegiatan berikut?
            </Typography>
          </Grid>
          <Grid item container direction="column" alignItems="center">
            <Typography align="center" gutterBottom>
              <b>{eventName}</b>
            </Typography>
          </Grid>
          <Grid container spacing={2} justify="center" alignItems="center">
            <Grid item>
              <Button
                onClick={() => { handleDelete() }}
                startIcon={<DeleteOutlinedIcon />}
                className={classes.dialogDeleteButton}
              >
                Iya
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => { handleCloseDeleteDialog() }}
                startIcon={<CancelIcon />}
                className={classes.dialogCancelButton}
              >
                Tidak
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </Fade>
  );
}

function PaperComponent(props) {
  return (
    <Draggable handle="#drag-handle" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function LampiranFile(props) {
  const { file_id, filename, filetype, i, handleLampiranDelete, onPreviewFile, classes, eventDialogMode } = props;

  return (
    <Grid item xs={12}>
      <Paper variant="outlined">
        <ListItem 
          button={eventDialogMode === "view"}
          disableRipple
          className={classes.listItem}
          onClick={() => {
            if (eventDialogMode === "view") {
              onPreviewFile(file_id);
            }
          }}
        >
          <ListItemAvatar>
            {filetype === "Word" ? (
              <Avatar className={classes.wordFileTypeIcon}>
                <FaFileWord />
              </Avatar>
            ) : filetype === "Excel" ? (
              <Avatar className={classes.excelFileTypeIcon}>
                <FaFileExcel />
              </Avatar>
            ) : filetype === "Gambar" ? (
              <Avatar className={classes.imageFileTypeIcon}>
                <FaFileImage />
              </Avatar>
            ) : filetype === "PDF" ? (
              <Avatar className={classes.pdfFileTypeIcon}>
                <FaFilePdf />
              </Avatar>
            ) : filetype === "Teks" ? (
              <Avatar className={classes.textFileTypeIcon}>
                <FaFileAlt />
              </Avatar>
            ) : filetype === "Presentasi" ? (
              <Avatar className={classes.presentationFileTypeIcon}>
                <FaFilePowerpoint />
              </Avatar>
            ) : filetype === "File Lainnya" ? (
              <Avatar className={classes.otherFileTypeIcon}>
                <FaFile />
              </Avatar>
            ) : null}
          </ListItemAvatar>
          <ListItemText
            primary={
              <LightTooltip title={filename} placement="top">
                <div style={{ display: "flex" }}>
                  <Typography noWrap>
                    {filename.replace(Path.extname(filename), "")}
                  </Typography>
                  <Typography>
                    {Path.extname(filename)}
                  </Typography>
                </div>
              </LightTooltip>
            }
            secondary={filetype}
          />
          {eventDialogMode === "view"
            ? null
            :
            <LightTooltip title="Hapus Lampiran">
              <IconButton
                size="small"
                className={classes.deleteIconButton}
                onClick={(e) => {
                  handleLampiranDelete(e, i);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </LightTooltip>
          }
        </ListItem>
      </Paper>
    </Grid>
  );
}

const MINIMUM_DURATION_MILLISECOND = 30 * 60 * 1000;
const TASK_DURATION_MILLISECOND = 30 * 60 * 1000;
const ROW_HEIGHT = 90;

function Calendar(props) {
  document.title = "Schooly | Kalender";

  const classes = useStyles();

  const {
    getSelectedClasses,
    getAllClass,
    getAllEvents,
    getAllTask,
    getAllTaskFilesByUser,
    getAllSubjects,
    getAllAssessments,
    getStudentsByClass,
    getStudents,
    setCurrentClass,
    getTeachers,
    tasksCollection,
  } = props;

  const { user, all_students, all_teachers } = props.auth;
  const role = props.auth.user.role;
  const classId = user.kelas;

  const { all_user_files } = props.filesCollection;
  const { all_subjects_map, all_subjects } = props.subjectsCollection;
  const { all_assessments } = props.assessmentsCollection;
  const { selectedClasses, all_classes } = props.classesCollection;
  const { allEvents } = props.eventsCollection;
  // console.log(all_classes)

  // ANCHOR STATES
  const [activeStartDate, setActiveStartDate] = React.useState(new Date(new Date().getFullYear(), new Date().getMonth())); // set ke awal bulan sekarang 

  // EVENT DIALOG
  const [selectedEventInfo, setSelectedEventInfo] = React.useState({});
  const [openEventDialog, setOpenEventDialog] = React.useState(false);
  const [eventDialogMode, setEventDialogMode] = React.useState("");
  const [unmountEventDialog, setUnmountEventDialog] = React.useState(false);

  // state ini akan bernilai null jika dan hanya jika pengguna belum mengklik tile kalender (belum memilih tanggal)
  const [selectedDate, setSelectedDate] = React.useState(null);
  // const [rows, setRows] = React.useState([]);

  // SNACKBAR
  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  // Calendar
  const today = new Date()
  const [mode, setMode] = React.useState("Day");
  // const [currentDateDayMode, setCurrentDateDayMode] = React.useState(today);
  // const [currentDateMonthMode, setCurrentDateMonthMode] = React.useState(today);
  const [currentDate, setCurrentDate] = React.useState(today);
  const [selectedDateMonthMode, setSelectedDateMonthMode] = React.useState(today);

  const [tileRows, setTileRows] = React.useState([]);

  React.useEffect(() => {
    getSelectedClasses(user.class_teached);
    getAllClass();
    getAllEvents();
    getAllTask();
    getAllAssessments();
    getStudents();
    getTeachers();
    getAllTaskFilesByUser(user._id);
    getAllSubjects("map");
  }, []);

  // React.useEffect(() => {
    // mencari event yang berlangsung hari ini.
    // event yang sudah lewat jamnya, sedang berlangsung, atau belum berlangsung akan ditampilkan.
    // let now = (selectedDate === null) ? (new Date()).getDate() : selectedDate.getDate();
    // let filteredEvents = props.eventsCollection.allEvents.filter((eventInfo) => {
    //   let start_date = (new Date(eventInfo.start_date)).getDate();
    //   let end_date = (new Date(eventInfo.end_date)).getDate();
    //   return (start_date <= now && now <= end_date);
    // });
    // setRows([...props.eventsCollection.allEvents]);
  // }, [props.eventsCollection.allEvents]);

  React.useEffect(() => {
    // test data
    // let testdata = [
    //   [1, 0, 3, 0],
    //   [1, 20, 2, 0],
    //   [1, 40, 2, 20],
    //   [2, 0, 6, 0],
    //   [2, 20, 4, 0],
    //   [5, 40, 6, 40],
    //   [6, 30, 6, 50],
    //   [6, 35, 7, 50],
    // ].map((elm, index) => {
    //   return {
    //     _id: index,
    //     type: "Event",
    //     start_date: new Date(2021, 6,16, elm[0], elm[1]).toLocaleString(),
    //     end_date: new Date(2021, 6, 16, elm[2], elm[3]).toLocaleString(),
    //     data: {
    //       start_date: new Date(2021, 6, 16, elm[0], elm[1]).toLocaleString(),
    //       end_date: new Date(2021, 6, 16, elm[2], elm[3]).toLocaleString(),
    //       name: index + 1
    //     }
    //   }
    // });

    if (mode === "Day") {
      // setTileRows(placeDayModeTiles(testdata, currentDate));
      setTileRows(placeDayModeTiles(generateDayModeList(currentDate), currentDate));
    }
  }, [currentDate, mode]);

  React.useEffect(() => {
    if (tasksCollection && all_assessments && allEvents) {
      setTileRows(placeDayModeTiles(generateDayModeList(currentDate), currentDate));
    }
  }, [tasksCollection, all_assessments, allEvents]);

  function placeDayModeTiles(arrayOfObject, currentDate) {
    let data = arrayOfObject.map((elm) => {
      let start_date;
      let end_date;

      if (elm.type === "Tugas") {
        // karena tugas tidak memiliki durasi, 
        let offset = TASK_DURATION_MILLISECOND / 2;
        start_date = substractTime(new Date(elm.deadline), offset);
        end_date = addTime(new Date(elm.deadline), offset);
      } else {
        start_date = new Date(elm.start_date);
        end_date = new Date(elm.end_date);
      }

      // hide overflow durasi dari assessment atau event yang berada pada > 1 hari
      let start_at_current = isSameDate(start_date, currentDate);
      let end_at_current = isSameDate(end_date, currentDate);
      let currentDayStart = getDayStart(currentDate);
      let currentDayEnd = getDayEnd(currentDate);
      if (elm.type !== "Tugas") {
        if (!end_at_current && !start_at_current) {
          start_date = currentDayStart;
          end_date = currentDayEnd;
        } else if (!end_at_current && start_at_current) {
          end_date = currentDayEnd;

          if (getMillisecondDiff(start_date, currentDayEnd) < MINIMUM_DURATION_MILLISECOND) {
            end_date = addTime(start_date, MINIMUM_DURATION_MILLISECOND);
            // titik paling bawah tile ini akan ada di bawah 23:59
          }
        } else if (end_at_current && !start_at_current) {
          start_date = currentDayStart;

          if (getMillisecondDiff(currentDayStart, end_date) < MINIMUM_DURATION_MILLISECOND) {
            start_date = substractTime(end_date, MINIMUM_DURATION_MILLISECOND);
            // titik paling atas tile ini akan ada di atas 00:00
          }
        } else {
          if (getMillisecondDiff(start_date, end_date) < MINIMUM_DURATION_MILLISECOND) {
            end_date = addTime(start_date, MINIMUM_DURATION_MILLISECOND);
          }
        }
      } // tugas akan dibiarkan overflow ke atas 00:00 atau ke bawah 23:59

      return { ...elm, start_date, end_date, start_date_epoch: start_date.getTime(), end_date_epoch: end_date.getTime() }
    });

    // sort data. data yang start date-nya lebih dulu akan ditempatkan di awal array (epoch asc)
    data.sort((a, b) => {
      return a.start_date_epoch - b.start_date_epoch;
    });

    // menempatkan setiap tile di posisi paling kiri yang masih bisa ditempati.
    // pada proses ini, lebar setiap tile diasumsikan 1/4 (lebar tile ketika 4 tile intersect). penentuan lebar akan dilakukan setelah bagian ini.
    let lastColElement = []; // menyimpan salinan data terbawah yang ditempatkan di tiap kolom.
    // traverse semua data/tile
    for (let i = 0; i <= data.length - 1; i++) {
      let currentData = data[i];
      let foundSpace = false;
      let col = 0;

      // loop hingga tile sudah ditempatkan / startColumn sudah diset
      while (!foundSpace) {
        if (col > lastColElement.length - 1) {
          // jika kolom ini tidak ada

          // tambah kolom baru
          lastColElement.push(currentData);
          // menempatkan data di kolom ini
          data[i].startColumn = col;
          // untuk mengakhiri while loop
          foundSpace = true;
        } else {
          // jika sudah ada minimal 1 tile yang menempati kolom ini

          if (!isIntersectExclusive(lastColElement[col].start_date_epoch, lastColElement[col].end_date_epoch, currentData.start_date_epoch, currentData.end_date_epoch)) {
            // jika tile ini tidak intersect dengan tile terakhir pada kolom ini
            // letakan tile di kolom ini
            lastColElement[col] = currentData;
            data[i].startColumn = col;
            foundSpace = true;
          } else {
            // jika intersect, cek kolom selanjutnya (kolom di kanan kolom ini)  
            col++;
          }
        }
      }
    }

    let columns = [];
    /* 
    akan berisi: 
      [
        [{ tile pertama pada kolom 1 }, { tile kedua dari atas pada kolom 1 }],
        [{ tile pertama pada kolom 2 }],
        [{ tile pertama pada kolom 3 }, { tile kedua dari atas pada kolom 3 }, { tile ketiga dari atas pada kolom 3 }],
        [{ tile pertama pada kolom 4 }, { tile kedua dari atas  pada kolom 4 }]
      ]
    */
    for (let d of data) {
      if (columns[d.startColumn]) {
        columns[d.startColumn].push(d);
      } else {
        columns[d.startColumn] = [d];
      }
    }

    /* 
      menentukan lebar setiap tile. ide:
      - tile = node pada tree
      - setiap tile paling kiri = root sebuah tree
      - definisi height yang digunakan: misal ada 1 root dengan 1 child node. height tree ini adalah 1
      - lebar tile = lebar layar / (height + 1)
    */
    let firstRoot = true;
    // traverse semua data/tile
    for (let i = 0; i <= data.length - 1; i++) {
      if (data[i].startColumn === 0) {
        // jika tile ini adalah root

        // cek apakah root ini intersect dengan salah satu node dari tree sebelumnya,
        let width = null;
        if (firstRoot === false) {
          for (let column of columns.slice(1)) {
            for (let tile of column) {
              // jika tile yang sedang dicek sudah sepenuhnya berada di bawah titik terbawah dari tile root, 
              // akhiri loop karena tile-tile ini dan seterusnya pasti tidak intersect dengan tile root
              if (tile.start_date_epoch >= data[i].end_date_epoch) {
                break;
              }

              if (isIntersectExclusive(tile.start_date_epoch, tile.end_date_epoch, data[i].start_date_epoch, data[i].end_date_epoch) && tile.width) {
                // jika root ini intersect dengan salah satu node dari tree sebelumnya, gunakan lebar tile pada tree tersebut 
                width = tile.width;
                break;
              }
            }
          }
        }

        // jika root ini tidak intersect dengan salah satu node dari tree sebelumnya
        let treeHeight = null;
        if (width === null) {
          treeHeight = getTreeHeight(data, columns, 0, data[i]);
          // jika height > 3, set jadi 3 karena lebar terkecil untuk suatu tile adalah 1/4 dari layar
          if (treeHeight > 3) {
            treeHeight = 3;
          }
        }

        // set lebar semua tile di tree ini
        let subtree = new Set(getTree(data, columns, 0, data[i]));
        subtree.forEach((value) => {
          for (let j = 0; j <= data.length - 1; j++) {
            if (data[j]._id === value) {
              data[j].width = width ?? (100 / (treeHeight + 1));
              break;
            }
          }
        });

        firstRoot = false;
      }
    }

    let tileRows = [];
    for (let d of data) {
      if (isSameDate(d.start_date, currentDate)) {
        if (tileRows[d.start_date.getHours()]) {
          tileRows[d.start_date.getHours()].push(d);
        } else {
          tileRows[d.start_date.getHours()] = [d];
        }
      } else {
        if (tileRows[0]) {
          tileRows[0].push(d);
        } else {
          tileRows[0] = [d];
        }
      }
    }
    return tileRows;
  }
  
  function getTreeHeight(data, columns, currentCol, currentNode) {
    if (currentCol === columns.length - 1) {
      return currentCol;
    }

    let rightTiles = columns[currentCol + 1];
    let intersectNodes = [];
    for (let i = 0; i <= rightTiles.length - 1; i++) {
      if (rightTiles[i].start_date_epoch >= currentNode.end_date_epoch) {
        break;
      }

      if (isIntersectExclusive(rightTiles[i].start_date_epoch, rightTiles[i].end_date_epoch, currentNode.start_date_epoch, currentNode.end_date_epoch)) {
        intersectNodes.push(rightTiles[i]);
      }
    }
    if (intersectNodes.length === 0) {
      return currentCol;
    }
    let findMax = intersectNodes.map((node) => getTreeHeight(data, columns, currentCol + 1, node))
    return Math.max(...findMax);
  }

  function getTree(data, columns, currentCol, currentNode) {
    if (currentCol === columns.length - 1) {
      return [currentNode._id];
    }

    let rightTiles = columns[currentCol + 1];
    let intersectNodes = [];
    for (let i = 0; i <= rightTiles.length - 1; i++) {
      if (rightTiles[i].start_date_epoch >= currentNode.end_date_epoch) {
        break;
      }

      if (isIntersectExclusive(rightTiles[i].start_date_epoch, rightTiles[i].end_date_epoch, currentNode.start_date_epoch, currentNode.end_date_epoch)) {
        intersectNodes.push(rightTiles[i]);
      }
    }
    if (intersectNodes.length === 0) {
      return [currentNode._id];
    }
    let arrayOfIdsArray = intersectNodes.map((node) => getTree(data, columns, currentCol + 1, node))
    let res = [currentNode._id];
    for (let arrayOfId of arrayOfIdsArray) {
      res = res.concat(arrayOfId);
    }
    return res;
  }

  function isIntersectExclusive(start1, end1, start2, end2) {
    return end2 > start1 && start2 < end1;
  }
  function isIntersectInclusive(start1, end1, start2, end2) {
    return end2 >= start1 && start2 <= end1;
  }

  const handleNextMonth = () => {
    setActiveStartDate(new Date(activeStartDate.setMonth(activeStartDate.getMonth() + 1)));
  };

  const handlePreviousMonth = () => {
    setActiveStartDate(new Date(activeStartDate.setMonth(activeStartDate.getMonth() - 1)));
  };

  const handleTileContent = (selectedDate) => {
    // untuk mengurangi jumlah pengecekan now === selectedDate, 
    // pengecekan ini hanya dilakukan ketika selectedDate ada 
    if (selectedDate) {
      return function ({ activeStartDate, date, view }) {
        if (view === 'month') {

          // jika tanggal yang sedang dicek adalah tanggal hari ini
          if (isSameDate(new Date(), date)) {
            return (
              <div className={classes.todayTile}>
                <abbr>
                  {date.getDate()}
                </abbr>
              </div>
            );
          }
          
          // jika tanggal yang sedang dicek adalah tanggal yang pernah terakhir diklik oleh pengguna
          if (isSameDate(selectedDate, date)) {
            return (
              <div className={classes.selectedTile}>
                <abbr>
                  {date.getDate()}
                </abbr>
              </div>
            );
          }
        
        }
        return (
          <div className={classes.notSelectedTile}>
            <abbr>
              {date.getDate()}
            </abbr>
          </div>
        );
      }
    } else {
      return function ({ activeStartDate, date, view }) {
        if (view === 'month') {

          // jika tanggal yang sedang dicek adalah tanggal hari ini
          if (isSameDate(new Date(), date)) {
            return (
              <div className={classes.todayTile}>
                <abbr>
                  {date.getDate()}
                </abbr>
              </div>
            );
          }

          // tidak mengecek now === selectedDate

        }
        // return null;
        return (
          <div className={classes.notSelectedTile}>
            <abbr>
              {date.getDate()}
            </abbr>
          </div>
        );
      }
    }
  };


  // SNACKBAR
  const showSnackbar = (severity, snackbarContent) => {
    setOpenSnackbar(true);
    setSeverity(severity);
    setSnackbarContent(snackbarContent);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // EVENT DIALOG
  const handleOpenCreateDialog = () => {
    setEventDialogMode("create");
    handleUnsetUnmountEventDialog();
    setOpenEventDialog(true);
  }
  const handleOpenEditDialog = () => {
    setEventDialogMode("edit");
    setOpenEventDialog(true);
  }

  const handleOpenViewDialog = (eventInfo) => {
    setEventDialogMode("view");
    handleUnsetUnmountEventDialog();
    setOpenEventDialog(true);
    setSelectedEventInfo(eventInfo);
  }

  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
  }

  const handleSetUnmountEventDialog = () => {
    setUnmountEventDialog(true);
  }

  const handleUnsetUnmountEventDialog = () => {
    setUnmountEventDialog(false);
  }

  function getSelectedDate() {
    return selectedDate;
  }

  function listTasks(date, mainCounter=null, handleChangeCounter=null) {
    let result = [];
    let localCounter = mainCounter;
    let tasksByClass = [];
    if (Boolean(tasksCollection.length)) {
      if (user.role === "Student") {
        tasksCollection.map((task) => {
          if(localCounter < 3) {
            let class_assigned = task.class_assigned;
            for (var i = 0; i < class_assigned.length; i++) {
              if (class_assigned[i] === user.kelas) {
                tasksByClass.push(task);
              }
            }
          }
          return tasksByClass;
        });
      } else if (user.role === "Teacher") {
        
      }
    }

    tasksByClass.forEach((task) => {
      let tempSelectedDate = new Date(moment(date)
      .locale("id"));
      let tempDeadlineDate = new Date(moment(task.deadline)
      .locale("id")
      );

      let flag = true;
      let teacher_name;

      // Untuk sekarang yang ditampilkan adalah tugas dengan deadline pada tanggal yang sama
      // dengan selectedDate (tidak memperhitungkan jam, menit, detik)
      if(tempSelectedDate.getDate() === tempDeadlineDate.getDate() && 
      tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
      tempSelectedDate.getYear() === tempDeadlineDate.getYear()) {
        if(mode === "Month") {
          if(localCounter < 3) {
            for (var i = 0; i < all_user_files.length; i++) {
              if (all_user_files[i].for_task_object === task._id) {
                flag = false;
                break;
              }
            }
            for (var i = 0; i < all_teachers.length; i++) {
              if (all_teachers[i]._id == task.person_in_charge_id) {
                teacher_name = all_teachers[i].name;
              }
            }
            if (!all_subjects_map.get(task.subject)) {
              flag = false;
            }
            if (flag) {
              result.push({
                _id: task._id,
                name: task.name,
                teacher_name: teacher_name,
                subject: task.subject,
                deadline: task.deadline,
                createdAt: task.createdAt,
              });
            }
          }
          localCounter ++;
        }
        else {
          for (var i = 0; i < all_user_files.length; i++) {
            if (all_user_files[i].for_task_object === task._id) {
              flag = false;
              break;
            }
          }
          for (var i = 0; i < all_teachers.length; i++) {
            if (all_teachers[i]._id == task.person_in_charge_id) {
              teacher_name = all_teachers[i].name;
            }
          }
          if (!all_subjects_map.get(task.subject)) {
            flag = false;
          }
          if (flag) {
            result.push({
              _id: task._id,
              deadline: task.deadline,
              type: "Tugas",
              data: task,
            });
          }
        }
      }
    });
  
    if (mode === "Month") {
      handleChangeCounter(localCounter);  
    }
    return result;
  }

  function listTasksTeacher(date, mainCounter=null, handleChangeCounter=null) {
    if(classCheckboxState) {
      let tempSelectedDate = date;
      let localCounter = mainCounter;
      let result = [];
      let classCheckList = Object.entries(classCheckboxState)
      let selectedClassCheckList = []
      for (let classItem of classCheckList) {
        if(classItem[1]) {
          selectedClassCheckList.push(classItem[0]);
        }
      }
      for (let i = 0; i < tasksCollection.length; i++) {
        let tempDeadlineDate = new Date(moment(tasksCollection[i].deadline).locale("id"));
        let classFound = false;
        for(let classId of tasksCollection[i].class_assigned) {
          if(selectedClassCheckList.includes(classId)) {
            classFound = true;
            break;
          }
        }
        if (tasksCollection[i].person_in_charge_id === user._id &&
          tempSelectedDate.getDate() === tempDeadlineDate.getDate() && 
          tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
          tempSelectedDate.getYear() === tempDeadlineDate.getYear() &&
          classFound) {
          let number_students_assigned = 0;
          for (let j = 0; j < all_students.length; j++) {
            if (
              tasksCollection[i].class_assigned.includes(all_students[j].kelas)
            ) {
              number_students_assigned = number_students_assigned + 1;
            }
          }
          if (
            Object.values(tasksCollection[i].grades).length !==
            number_students_assigned
          ) {
            if(mode === "Month") {
              if(localCounter < 3) {
                let task = tasksCollection[i];
                result.push({
                  _id: task._id,
                  name: task.name,
                  subject: task.subject,
                  deadline: task.deadline,
                  createdAt: task.createdAt,
                });
              }
              localCounter ++;
            }
            else {
              let task = tasksCollection[i];
              result.push({
                _id: task._id,
                deadline: task.deadline,
                type: "Tugas",
                data: task,
              });
            }
          }
        }
      }
      if (mode === "Month") {
        handleChangeCounter(localCounter);
      }
      return result;
    }
  }

  function listTasksAdmin(date, mainCounter=null, handleChangeCounter=null) {
    if(classCheckboxState) {
      let tempSelectedDate = date;
      let localCounter = mainCounter;
      let result = [];
      let classCheckList = Object.entries(classCheckboxState)
      let selectedClassCheckList = []
      for (let classItem of classCheckList) {
        if(classItem[1]) {
          selectedClassCheckList.push(classItem[0]);
        }
      }
      for (let i = 0; i < tasksCollection.length; i++) {
        let tempDeadlineDate = new Date(moment(tasksCollection[i].deadline).locale("id"));
        let classFound = false;
        for(let classId of tasksCollection[i].class_assigned) {
          if(selectedClassCheckList.includes(classId)) {
            classFound = true;
            break;
          }
        }
        if (
          tempSelectedDate.getDate() === tempDeadlineDate.getDate() && 
          tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
          tempSelectedDate.getYear() === tempDeadlineDate.getYear() &&
          classFound) {
          let number_students_assigned = 0;
          for (let j = 0; j < all_students.length; j++) {
            if (
              tasksCollection[i].class_assigned.includes(all_students[j].kelas)
            ) {
              number_students_assigned = number_students_assigned + 1;
            }
          }
          if (
            Object.values(tasksCollection[i].grades).length !==
            number_students_assigned
          ) {
            if(mode === "Month") {
              if(localCounter < 3) {
                let task = tasksCollection[i];
                result.push({
                  _id: task._id,
                  name: task.name,
                  subject: task.subject,
                  deadline: task.deadline,
                  createdAt: task.createdAt,
                });
              }
              localCounter ++;
            }
            else {
              let task = tasksCollection[i];
              result.push({
                _id: task._id,
                deadline: task.deadline,
                type: "Tugas",
                data: task,
              });
            }
          }
        }
      }
      if (mode === "Month") {
        handleChangeCounter(localCounter);
      }
      return result;
    }
  }

  function listAssessmentsStudentMonth(tempSelectedDate, type) {
    // menampilkan assessment jika ada submission yang belum selesai dinilai
    let category = null;
    let subject = {};
    let AssessmentsList = [];
    let TeacherList = []
    let result = [];
        
    if (Boolean(all_assessments.length)) {
      var i;
      for (i = all_assessments.length - 1; i >= 0; i--) {
        let assessment = all_assessments[i];
        // let tempDeadlineDate = new Date(moment(assessment.start_date)
        // .locale("id"));
        let class_assigned = assessment.class_assigned;

        if (
          isIntersectInclusive(
            new Date(assessment.start_date).getTime(), 
            new Date(assessment.end_date).getTime(), 
            getDayStart(tempSelectedDate).getTime(), 
            getDayEnd(tempSelectedDate).getTime()
          ) &&
        // tempSelectedDate.getDate() === tempDeadlineDate.getDate() && 
        // tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
        // tempSelectedDate.getYear() === tempDeadlineDate.getYear() &&
        class_assigned.indexOf(classId) !== -1) {
          for (let j = 0; j < all_teachers.length; j++) {
            if (all_teachers[j]._id === assessment.author_id) {
              TeacherList.push(all_teachers[j].name);
              break;
            }
          }
          AssessmentsList.push(assessment);
        }
      }
      for (i = 0; i < AssessmentsList.length; i++) {
        let assessment = AssessmentsList[i];
        // let workStatus = "Belum Ditempuh"
        if (type === "Kuis") {
          if (
            (!category ||
              (category === "subject" && assessment.subject === subject._id)) &&
            
            assessment.type === "Kuis" &&
            assessment.posted
          ) {
              result.push({
                _id: assessment._id,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                type: type,
                data: assessment,
              });  
          }
        }
        if (type === "Ujian") {
          if (
            (!category ||
              (category === "subject" && assessment.subject === subject._id)) &&
            
            assessment.type === "Ujian" &&
            assessment.posted
          ) {
              result.push({
                _id: assessment._id,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                type: type,
                data: assessment,
              });
          }
        }
      }
    }
    return result;
  }

  function listAssessmentsTeacher(tempSelectedDate, assessmentType, mainCounter=null, handleChangeCounter=null) {
    // menampilkan assessment jika ada submission yang belum selesai dinilai
    if(classCheckboxState) {
      let result = [];
      let lowerCaseType = assessmentType === "Kuis" ? "kuis" : "ujian";
      let localCounter = mainCounter;
      let classCheckList = Object.entries(classCheckboxState)
      let selectedClassCheckList = []
      for (let classItem of classCheckList) {
        if(classItem[1]) {
          selectedClassCheckList.push(classItem[0]);
        }
      }

      for (let i = 0; i < all_assessments.length; i++) {
        let assessment = all_assessments[i];
        // let tempDeadlineDate = new Date(moment(assessment.start_date).locale("id"));
        let classFound = false;
        if (assessment.type === assessmentType) {
          for(let classId of all_assessments[i].class_assigned) {
            if(selectedClassCheckList.includes(classId)) {
              classFound = true;
              break;
            }
          }
          if (
            isIntersectInclusive(
              new Date(assessment.start_date).getTime(),
              new Date(assessment.end_date).getTime(),
              getDayStart(tempSelectedDate).getTime(),
              getDayEnd(tempSelectedDate).getTime()
            ) &&
          // tempSelectedDate.getDate() === tempDeadlineDate.getDate() && 
          // tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
          // tempSelectedDate.getYear() === tempDeadlineDate.getYear() &&
          classFound) {
            if(mode === "Month") {
              if(localCounter < 3) {
                result.push({
                  _id: assessment._id,
                  title: assessment.name,
                  subject: assessment.subject,
                  createdAt: assessment.createdAt,
                  type: assessment.type,
                  start_date: assessment.start_date,
                  end_date: assessment.end_date,
                });
              }
              localCounter ++;
            }
            else {
              result.push({
                _id: assessment._id,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                type: assessmentType,
                data: assessment,
              });
            }
          }
        }
      }
      if(mode === "Month") {
        handleChangeCounter(localCounter);
        return result.map((row) => {
          return (
            <Link to={`/daftar-${lowerCaseType}-terkumpul/${row._id}`}>
              <Typography 
                variant="body2" 
                className={classes.monthAgendaChip} 
                align="left"
              >
                {row.title}
              </Typography>
            </Link>
          );
        });
      }
      else return result;
    }
  }

  function listAssessmentsAdmin(tempSelectedDate, assessmentType, mainCounter, handleChangeCounter) {
    // menampilkan assessment jika ada submission yang belum selesai dinilai
    if(classCheckboxState) {
      let result = [];
      let lowerCaseType = assessmentType === "Kuis" ? "kuis" : "ujian";
      let localCounter = mainCounter;
      let classCheckList = Object.entries(classCheckboxState)
      let selectedClassCheckList = []
      for (let classItem of classCheckList) {
        if(classItem[1]) {
          selectedClassCheckList.push(classItem[0]);
        }
      }

      for (let i = 0; i < all_assessments.length; i++) {
        let assessment = all_assessments[i];
        // let tempDeadlineDate = new Date(moment(assessment.start_date).locale("id"));
        let classFound = false;
        if (assessment.type === assessmentType) {
          for(let classId of all_assessments[i].class_assigned) {
            if(selectedClassCheckList.includes(classId)) {
              classFound = true;
              break;
            }
          }
          if (
            isIntersectInclusive(
              new Date(assessment.start_date).getTime(),
              new Date(assessment.end_date).getTime(),
              getDayStart(tempSelectedDate).getTime(),
              getDayEnd(tempSelectedDate).getTime()
            ) &&
          // tempSelectedDate.getDate() === tempDeadlineDate.getDate() &&
          // tempSelectedDate.getMonth() === tempDeadlineDate.getMonth() &&
          // tempSelectedDate.getYear() === tempDeadlineDate.getYear() &&
          classFound) {
            if(mode === "Month") {
              if(localCounter < 3) {
                result.push({
                  _id: assessment._id,
                  title: assessment.name,
                  subject: assessment.subject,
                  createdAt: assessment.createdAt,
                  type: assessment.type,
                  start_date: assessment.start_date,
                  end_date: assessment.end_date,
                });
              }
              localCounter ++;
            }
            else {
              result.push({
                _id: assessment._id,
                start_date: assessment.start_date,
                end_date: assessment.end_date,
                type: assessmentType,
                data: assessment,
              });
            }
          }
        }
      }
      if(mode === "Month") {
        handleChangeCounter(localCounter);
        return result.map((row) => {
          return (
            <Link to={`/daftar-${lowerCaseType}-terkumpul/${row._id}`}>
              <Typography 
                variant="body2" 
                className={classes.monthAgendaChip} 
                align="left"
              >
                {row.title}
              </Typography>
            </Link>
          );
        });
      }
      else return result;
    }
  }

  const listEvent = (date, mainCounter, handleChangeCounter) => {
    // function EventItem(props) {
    //   const { eventInfo } = props;
    //   const [openDialog, setOpenDialog] = React.useState(false);
    //   const [currentDialogInfo, setCurrentDialogInfo] = React.useState({});
  
    //   const handleOpenDialog = (title, subject, teacher_name, start_date, end_date) => {
    //     setCurrentDialogInfo({ title, subject, teacher_name, start_date, end_date });
    //     setOpenDialog(true);
    //   };
  
    //   const handleCloseDialog = () => {
    //     setOpenDialog(false);
    //   };

    //   return (
    //     <>
    //         <Typography 
    //           variant="body2" 
    //           className={classes.monthAgendaChip} 
    //           align="left"
    //           onClick={() =>
    //             handleOpenDialog(
    //               eventInfo.name,
    //               eventInfo.location,
    //               eventInfo.description,
    //               eventInfo.start_date,
    //               eventInfo.end_date
    //             )
    //           }
    //         >
    //           {eventInfo.name}
    //         </Typography>
    //         <Dialog
    //           fullScreen={false}
    //           open={openDialog}
    //           onClose={handleCloseDialog}
    //           fullWidth={true}
    //           maxWidth="sm"
    //         >
    //           <div style={{ padding: "20px" }}>
    //             <Typography variant="h4" align="center">
    //               {eventInfo.name}
    //             </Typography>
    //             <Typography variant="h5" align="center" color="primary">
    //               Lokasi: {eventInfo.location}
    //             </Typography>
    //             <Typography
    //               variant="subtitle1"
    //               align="center"
    //               style={{ marginTop: "25px" }}
    //             >
    //               Deskripsi: {eventInfo.description}
    //             </Typography>
    //             <Typography
    //               variant="subtitle1"
    //               align="center"
    //             >
    //               Mulai: {moment(eventInfo.start_date).locale("id").format("DD MMM YYYY, HH:mm")}
    //             </Typography>
    //             <Typography variant="subtitle1" align="center">
    //               Selesai: {moment(eventInfo.end_date).locale("id").format("DD MMM YYYY, HH:mm")}
    //             </Typography>
    //           </div>
    //         </Dialog> */}
    //       </>
    //   )
    // }

    let result = []
    let filteredEvents = allEvents.filter((eventInfo) => {
    // let filteredEvents = rows.filter((eventInfo) => {
      let start_date = new Date(eventInfo.start_date);
      let end_date = new Date(eventInfo.end_date);
      // return (isSameDate(start_date, date) || isSameDate(end_date, date)) && eventInfo.to.includes(role);
      return (
        isIntersectInclusive(
          start_date.getTime(),
          end_date.getTime(),
          getDayStart(date).getTime(),
          getDayEnd(date).getTime()
        ) && 
        eventInfo.to.includes(role)
      );
    });
    let localCounter = mainCounter;
    filteredEvents.forEach((eventInfo) => {
      if(mode === "Month") {
        if(localCounter < 3) {
          result.push(
            <Typography 
              variant="body2" 
              className={classes.monthAgendaChip} 
              align="left"
              onClick={() => {
                handleOpenViewDialog(eventInfo)
              }}
            >
              {eventInfo.name}
            </Typography>
          )
          // result.push(
          //  <EventItem eventInfo={eventInfo}/>
          // )
        }
        localCounter ++;
      }
      else {
        result.push({
          _id: eventInfo._id,
          start_date: eventInfo.start_date,
          end_date: eventInfo.end_date,
          type: "Event",
          data: eventInfo,
        })
      }
    })
    if(mode === "Month") {
      handleChangeCounter(localCounter);
      return {result, count: result.length};
    }
    else return result;
  }

  const handleChangeMode = (event) => {
    setMode(event.target.value);
  }

  const handleOpenDayMode = (date, changeSelectedDate) => {
    if (changeSelectedDate === true) {
      setSelectedDateMonthMode(date);
    }
    setCurrentDate(date);
    setMode("Day");
  }

  const isSameDate = (date_1, date_2) => {
    return date_1.getDate() === date_2.getDate() && date_1.getMonth() === date_2.getMonth() && date_1.getYear() === date_2.getYear()
  }

  // const renderCalendarTile = ({ activeStartDate, date, view }) => {
  //   var today = new Date()
  //   if(isSameDate(today, date)) {
  //     return classes.todayTile
  //   }
  //   return classes.activeTile
  // }

  const timeRows = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', 
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', 
    '20:00', '21:00', '22:00', '23:00'
  ]

  // const timeRowsDummy = [
  //   [{start: 10, title: "Tugas Matematika", duration: 130, visible: true}, {start: 10, title: "Tugas Biologi", duration: 70, visible: true}, {start: 10, title: "Tugas Kimia", duration: 20, visible: true}, {start: 10, title: "Tugas Biologi", duration: 70, visible: true}, {start: 10, title: "Tugas Kimia", duration: 20, visible: true}], 
  //   [{start: 0, title: "Tugas Matematika", duration: 80, visible: false}, {start: 0, title: "Tugas Biologi", duration: 20, visible: false}, {start: 10, title: "Tugas Fisika", duration: 70, visible: true}, {start: 10, title: "Tugas Biologi", duration: 20, visible: false}, {start: 0, title: "Tugas Matematika", duration: 80, visible: false}], 
  //   [{start: 0, title: "Tugas Matematika", duration: 20, visible: false}], 
  //   [], 
  //   [{start: 0, title: "Ujian Biologi", duration: 30, visible: true}], 
  //   [], [], [], [], [], [], 
  //   [{start: 20, title: "Kuis Kimia", duration: 10, visible: true}, 
  //   {start: 50, title: "Ujian Musik", duration: 10, visible: true}], 
  //   [], [], [], [], [], [], [], [],
  //   [], [], [], []
  // ]

  const dayNames = [
    'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'
  ]

  function getMaxDate(month, year) {
    // Index dimulai dari 1
    // 1: Januari
    let months_31 = [1, 3, 5, 7, 8, 10, 12];
    let months_30 = [4, 6, 9, 11];
    if(months_31.includes(month)) {
      return 31;
    }
    else if(months_30.includes(month)) {
      return 30;
    }
    else {
      if(((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
        return 29;
      }
      else {
        return 28;
      }
    }
  }

  function isValidDate(year, month, day) {
    var d = new Date(year, month, day);
    if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
        return true;
    }
    return false;
}

  const generateMonthDates = () => {
    let result = [];
    let firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0);
    let count = 1;
    let i = 1;
    if(count > firstDate.getDay()) {
      count = count - 7;
      i = i - 7;
    }
    while(count <= firstDate.getDay()) {
      let tempDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 0);
      tempDate.setDate(tempDate.getDate() - (firstDate.getDay()-i) + 1);
      result.push(tempDate);
      count ++;
      i ++;
    }

    count = 1;
    i = 1;
    let isMaxDateFound = false;
    while(count <= 35-firstDate.getDay()) {
      let tempDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
      tempDate.setDate(tempDate.getDate()+i);
      result.push(tempDate);
      count ++;
      i ++;
      if(!isMaxDateFound && tempDate.getDate() === getMaxDate(tempDate.getMonth() + 1, tempDate.getYear())) {
        isMaxDateFound = true;
      }
      if(count === 35-firstDate.getDay() && !isMaxDateFound) {
        count = count - 7;
      }
      if(isMaxDateFound && 35-firstDate.getDay() - count === 6) {
        break;
      }
    }
    return result;
  }

  const generateDates = () => {
    let currentMonthDates = generateMonthDates();
    if(currentMonthDates.length !== 0) {
      let result = [];
      let temp_row = [];
      for(let date of currentMonthDates) {
        temp_row.push(date);
        if(temp_row.length === 7) {
          result.push(temp_row);
          temp_row = [];
        }
      }
      return result;
    }
    else {
      return [[]];
    }
  }

  let agendaStates = {}
  if(role !== "Admin") {
    agendaStates = {
      checkedTask: true,
      checkedQuiz: true,
      checkedExam: true,
      checkedEvent: true,
    }
  }
  else {
    agendaStates = {
      checkedTask: false,
      checkedQuiz: false,
      checkedExam: false,
      checkedEvent: true,
    }
  }

  const [agendaCheckboxState, setAgendaCheckboxState] = React.useState(agendaStates);

  const handleChange = (event) => {
    setAgendaCheckboxState({ ...agendaCheckboxState, [event.target.name]: event.target.checked });
  };

  let classStates = {}
  if(role === "Teacher") {
    classStates = Object.assign({}, ...user.class_teached.map((class_id) => ({[class_id]: true})))
  }

  React.useEffect(() => {
    if(role === "Admin" && all_classes.length !== 0) {
      classStates = Object.assign({}, ...all_classes.map((kelas) => ({[kelas._id]: true})))
      setClassCheckboxState(classStates)
    }
  }, [all_classes])

  const [classCheckboxState, setClassCheckboxState] = React.useState(classStates);
  // console.log(classCheckboxState)

  const handleChangeClassStates = (event) => {
    setClassCheckboxState({ ...classCheckboxState, [event.target.name]: event.target.checked });
  };

  // ANCHOR generateDayModeList
  const generateDayModeList = (date) => {
    let result = []
    if(mode === "Day") {
      if(
        tasksCollection && 
        all_assessments && 
        allEvents
        // tasksCollection.length !== 0 && 
        // all_assessments.length !== 0 && 
        // allEvents.length !== 0
        ) {
        // rows.length !== 0) {
        if(role === "Student") {
          let taskList = listTasks(new Date(date));
          let quizList = listAssessmentsStudentMonth(new Date(date), "Kuis");
          let examList = listAssessmentsStudentMonth(new Date(date), "Ujian");
          let eventList = listEvent(new Date(date));
          result = [...taskList, ...quizList, ...examList, ...eventList];
        }
        else if(role === "Teacher" && classCheckboxState) {
          let taskList = listTasksTeacher(new Date(date));
          let quizList = listAssessmentsTeacher(new Date(date), "Kuis");
          let examList = listAssessmentsTeacher(new Date(date), "Ujian");
          let eventList = listEvent(new Date(date));
          result = [...taskList, ...quizList, ...examList, ...eventList];
        }
        else {
          if(classCheckboxState) {
            let taskList = listTasksAdmin(new Date(date));
            let quizList = listAssessmentsAdmin(new Date(date), "Kuis");
            let examList = listAssessmentsAdmin(new Date(date), "Ujian");
            let eventList = listEvent(new Date(date));
            result = [...taskList, ...quizList, ...examList, ...eventList];
          }
        }
      }
    }
    return result;
  }
  
  // if(mode === "Day") {
  //   console.log(generateDayModeList(new Date(2021, 5, 3)));
  // }

  // ANCHOR generateDayModeCalendar
  const generateDayModeCalendar = () => {
    let rowHeight = 90;
    return (
      <div className={classes.dayAgendaContainer}>
        <div className={classes.holidayContainer}>
          <div className={classes.staticBlueChip}>
            <Typography style={{color: "white"}} variant="body2">
              Natal/Christmas (Contoh)
            </Typography>
          </div>
          <div className={classes.staticBlueChip}>
            <Typography style={{color: "white"}} variant="body2">
              Idul Adha
            </Typography>
          </div>
        </div>
        <TableContainer>
          <Table>
            <TableBody>
              {timeRows.map((row, index) => {
                let verticalPadding = 8;
                return (
                  <TableRow key={row.name} style={{height: `${ROW_HEIGHT}px`, border: "none"}}>
                    <TableCell component="th" scope="row" className={classes.dayTableCell}>
                      <Typography color="textSecondary" variant="body2" style={{width: "32px"}}>{row}</Typography>
                      <div className={classes.horizontalLine}>
                        {
                          tileRows[index] ?
                            tileRows[index].map((obj, idx) => {
                              let widthPadding = 0;
                              let i = Math.floor(100/obj.width);
                              if(i > 1) {
                                widthPadding = 10 * (i-1) / i;
                              }
                              let height = (((obj.end_date_epoch - obj.start_date_epoch) / (1000 * 60)) / 60 * ROW_HEIGHT) - 2;
                              let minHeight = ((MINIMUM_DURATION_MILLISECOND) / (1000 * 60)) / 60 * ROW_HEIGHT;
                              if (height < minHeight + verticalPadding) {
                                verticalPadding = 2;
                              }

                              return (
                                <div
                                  onClick={obj.type === "Event" ? () => { handleOpenViewDialog(obj.data) } : undefined}
                                  className={obj.type === "Event" ? `${classes.blueChipHover} ${classes.blueChip}` : classes.blueChip}
                                  style={{
                                    transform: 
                                      `translate(calc(100% * ${obj.startColumn} + ${obj.startColumn} * 10px), ${!isSameDate(obj.start_date, currentDate) && isSameDate(obj.end_date, currentDate)
                                        ? (-1 * getMillisecondDiff(obj.start_date, getDayStart(obj.end_date)) / (1000 * 60)) / 60 * ROW_HEIGHT
                                        : obj.start_date.getMinutes() / 60 * ROW_HEIGHT
                                      }px)`,
                                    height: `${height}px`,
                                    width: `calc(${obj.width}% - ${widthPadding}px)`,
                                    padding: `${verticalPadding}px 12px`
                                  }}
                                >
                                  <Typography noWrap variant="body2">
                                    {obj.data.name}
                                  </Typography>
                                  <Typography variant="body2">
                                    {`${moment(obj.data.start_date).locale("id").format("HH:mm")} – ${moment(obj.data.end_date).locale("id").format("HH:mm")}`}
                                  </Typography>
                                </div>
                              )
                            }) : null
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }

  const generateMonthModeCalendar = () => {
    let monthDates = generateDates();
    return (
      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <TableContainer component={Grid}>
          <Table className={classes.table}>
            <TableBody>
              <Hidden smUp>
                <TableRow style={{verticalAlign: "bottom"}}>
                  {
                    dayNames.map((day) => {
                      return (
                        <TableCell style={{paddingBottom: "5px"}}>
                          <Typography align="center" variant="body2">
                            {day[0]}
                          </Typography>
                        </TableCell>
                      )
                    })
                  }
                </TableRow>
              </Hidden>
            {monthDates.map((row, index) => (
              generateDateAgenda(row, index)
            ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }

  const generateDateAgenda = (date, index) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    // if(all_assessments && tasksCollection && rows) {
    if (all_assessments && tasksCollection && allEvents) {
      return (
        <TableRow style={{height: "150px"}}>
          {date.map((column, columnIndex) => {
            let temp_date = new Date(column).getDate();
            let temp_date_withoutMonthNames = temp_date
            if(temp_date == 1) {
              temp_date = temp_date + " " + monthNames[new Date(column).getMonth()];
            }
            let mainCounter = 0;
            const handleChangeCounter = (count) => {mainCounter = count}

            let today = new Date();
            
            let taskList = null;
            if(agendaCheckboxState.checkedTask) {
              if(role === "Student") {
                taskList = listTasks(new Date(column), mainCounter, handleChangeCounter);
              }
              if(role === "Teacher") {
                taskList = listTasksTeacher(new Date(column), mainCounter, handleChangeCounter);
              }
              if(role === "Admin") {
                taskList = listTasksAdmin(new Date(column), mainCounter, handleChangeCounter);
              }
            }

            let quizList = null;
            if(agendaCheckboxState.checkedQuiz) {
              if(role === "Student") {
                quizList = 
                  <ListAssessments
                    category={null}
                    subject={{}}
                    type="Kuis"
                    tab="pekerjaan-kelas"
                    all_assessments={all_assessments}
                    classId={classId}
                    classes={classes}
                    all_subjects_map={all_subjects_map}
                    all_teachers={all_teachers}
                    getSelectedDate={getSelectedDate}
                    date={new Date(column)}
                    mainCounter={mainCounter}
                    handleChangeCounter={handleChangeCounter}
                    mode={mode}
                  />
              }
              if(role === "Teacher") {
                quizList = listAssessmentsTeacher(new Date(column), "Kuis", mainCounter, handleChangeCounter)
              }
              if(role === "Admin") {
                quizList = listAssessmentsAdmin(new Date(column), "Kuis", mainCounter, handleChangeCounter)
              }
            }
            
            let examList = null;
            if(agendaCheckboxState.checkedExam) {
              if(role === "Student") {
                examList = 
                  <ListAssessments
                    category={null}
                    subject={{}}
                    type="Ujian"
                    tab="pekerjaan-kelas"
                    all_assessments={all_assessments}
                    classId={classId}
                    classes={classes}
                    all_subjects_map={all_subjects_map}
                    all_teachers={all_teachers}
                    getSelectedDate={getSelectedDate}
                    date={new Date(column)}
                    mainCounter={mainCounter}
                    handleChangeCounter={handleChangeCounter}
                    mode={mode}
                  />
              }
              if(role === "Teacher") {
                examList = listAssessmentsTeacher(new Date(column), "Ujian", mainCounter, handleChangeCounter)
              }
              if(role === "Admin") {
                examList = listAssessmentsAdmin(new Date(column), "Ujian", mainCounter, handleChangeCounter)
              }
            }
            

            let eventList = {result: null}
            if(agendaCheckboxState.checkedEvent) {
              eventList = listEvent(new Date(column), mainCounter, handleChangeCounter);
            }
            
            return (
              <TableCell className={classes.monthAgendaCell}>
                {(index === 0) ?
                  <Hidden xsDown>
                    <Typography color="textSecondary" variant="body2" align="center">{dayNames[columnIndex]}</Typography>
                  </Hidden>
                : null}
                <div style={{display: "flex", justifyContent: "center", marginBottom: "5px"}}>
                  {isSameDate(today, column) ?
                    <>
                      <Hidden xsDown>
                        <Typography color="textSecondary" variant="body2" className={classes.todayMonthDateTile} align="center" onClick={() => { handleOpenDayMode(new Date(column), true) }}>{temp_date}</Typography>
                      </Hidden>
                      <Hidden smUp>
                        <Typography color="textSecondary" variant="body2" className={classes.todayMonthDateTile} align="center" onClick={() => { handleOpenDayMode(new Date(column), true) }}>{temp_date_withoutMonthNames}</Typography>
                      </Hidden>
                    </>
                    : isSameDate(selectedDateMonthMode, column) ?
                      <>
                        <Hidden xsDown>
                          <Typography color="textSecondary" variant="body2" className={classes.selectedMonthDateTile} align="center" onClick={() => { handleOpenDayMode(new Date(column), true) }}>{temp_date}</Typography>
                        </Hidden>
                        <Hidden smUp>
                          <Typography color="textSecondary" variant="body2" className={classes.selectedMonthDateTile} align="center" onClick={() => { handleOpenDayMode(new Date(column), true) }}>{temp_date_withoutMonthNames}</Typography>
                        </Hidden>
                      </>
                      :
                      <>
                        <Hidden xsDown>
                          <Typography color="textSecondary" variant="body2" className={classes.monthDateTile} align="center" onClick={() => { handleOpenDayMode(new Date(column), true) }}>{temp_date}</Typography>
                        </Hidden>
                        <Hidden smUp>
                          <Typography color="textSecondary" variant="body2" className={classes.monthDateTile} align="center" onClick={() => { handleOpenDayMode(new Date(column), true) }}>{temp_date_withoutMonthNames}</Typography>
                        </Hidden>
                      </>
                  }
                </div>
                {
                  agendaCheckboxState.checkedTask && taskList !== null ?
                  taskList.map((row) => {
                    if(role !== "Admin") {
                      return  (
                        <Link to={(role === "Student") ? `/tugas-murid/${row._id}` : `/tugas-guru/${row._id}`}>
                          <Typography variant="body2" className={classes.monthAgendaChip} align="left">
                            {row.name}
                          </Typography>
                        </Link>
                      )
                    }
                    else {
                      return  (
                        <Typography variant="body2" className={classes.monthAgendaChipAdmin} align="left">
                          {row.name}
                        </Typography>
                      )
                    }
                  })
                  : null
                }
                {agendaCheckboxState.checkedQuiz ? quizList : null}
                {agendaCheckboxState.checkedExam ? examList : null}
                {agendaCheckboxState.checkedEvent ? eventList.result : null}
                {
                  (mainCounter > 3) ?
                    <Typography 
                      variant="body2"
                      className={classes.moreMonthAgendaChip}
                      align="left"
                      onClick={() => { handleOpenDayMode(new Date(column), false) }}
                    >
                      {mainCounter - 3} lagi
                    </Typography>
                  : null
                }
              </TableCell>
            )
          })}
        </TableRow>
      )
    }
  }

  // ANCHOR ELEMENT
  return (
    <div className={classes.root}>
      {
        unmountEventDialog
          ? null
          :
          <EventDialog
            downloadFileEvent={downloadFileEvent}
            selectedEventInfo={selectedEventInfo}
            getAllEvents={getAllEvents}
            eventDialogMode={eventDialogMode}
            openEventDialog={openEventDialog}
            handleCloseEventDialog={handleCloseEventDialog}
            handleOpenEditDialog={handleOpenEditDialog}
            handleSetUnmountEventDialog={handleSetUnmountEventDialog}
            viewFileEvent={viewFileEvent}
            showSnackbar={showSnackbar}
          />
      }

      <div className={classes.agendaContainer}>
        <AgendaToolbar
          role={role}
          classes={classes}
          mode={mode}
          handleChangeMode={handleChangeMode}
          handleOpenCreateDialog={handleOpenCreateDialog}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
        <Divider style={{marginTop: "10px"}}/>
        {
          mode === "Day"
            ?
            <div style={{ display: "flex", justifyContent: "flex-start", margin: "16px 0 16px 64px"}}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="body2">
                  {moment(currentDate).locale("id").format("dddd").slice(0, 3).toUpperCase()}
                </Typography>
                <Typography variant="h5">
                  {moment(currentDate).locale("id").format("DD")}
                </Typography>
              </div>
            </div>
            : null
        }
        {mode === "Day" ? generateDayModeCalendar() : generateMonthModeCalendar()}
      </div>
      <Hidden xsDown>
        <div className={classes.calendarContainer}>
          <Grid container alignItems="center" justify="space-between">
            <Grid item style={{ paddingLeft: "0.6em" }}>
              <Typography>
                {moment(activeStartDate)
                  .locale("id")
                  .format("MMMM YYYY")}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                size="small"
                onClick={() => {
                  handlePreviousMonth();
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  handleNextMonth();
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Grid>
          </Grid>
          <ReactCalendar
            locale="id-ID"
            onChange={setSelectedDate}
            value={selectedDate}
            // tileClassName={renderCalendarTile}
            className={classes.calendar}
            showNavigation={false}
            activeStartDate={activeStartDate}
            tileContent={handleTileContent(selectedDate)}
            formatShortWeekday={(locale, date) => {
              // mengubah nama hari dalam satu minggu jadi satu huruf 
              return new Date(date).toLocaleDateString(locale, { weekday: 'long' })[0];
            }}
            view="month"
          />
          <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
            <Typography style={{marginTop: "15px"}}>Agenda</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox checked={agendaCheckboxState.checkedTask}
                    onChange={handleChange}
                    name="checkedTask"
                    color="primary"
                  />
                }
                label="Tugas"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={agendaCheckboxState.checkedQuiz}
                    onChange={handleChange}
                    name="checkedQuiz"
                    color="primary"
                  />
                }
                label="Kuis"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={agendaCheckboxState.checkedExam}
                    onChange={handleChange}
                    name="checkedExam"
                    color="primary"
                  />
                }
                label="Ujian"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={agendaCheckboxState.checkedEvent}
                    onChange={handleChange}
                    name="checkedEvent"
                    color="primary"
                  />
                }
                label="Kegiatan"
              />
            </FormGroup>
          </div>
          {(role === "Teacher" && selectedClasses !== null) ?
            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
              <Typography style={{marginTop: "15px"}}>Kelas</Typography>
              <FormGroup>
                {
                  user.class_teached.map((class_id) => {
                    let temp = new Map(selectedClasses);
                    let kelas = temp.get(class_id);
                    let class_name = ""
                    if(kelas) {
                      class_name = kelas.name
                    }
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox checked={classCheckboxState[class_id]}
                            onChange={handleChangeClassStates}
                            name={class_id}
                            color="primary"
                          />
                        }
                        label={class_name}
                      />
                    )
                  })
                }
              </FormGroup>
            </div>
          : null}
          {(role === "Admin" && all_classes !== null) ?
            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
              <Typography style={{marginTop: "15px"}}>Kelas</Typography>
              <FormGroup>
                {
                  all_classes.map((kelas) => {
                    let class_id = kelas._id;
                    let class_name = kelas.name
                    if(Object.keys(classCheckboxState).length !== 0) {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox checked={classCheckboxState[class_id]}
                              onChange={handleChangeClassStates}
                              name={class_id}
                              color="primary"
                            />
                          }
                          label={class_name}
                        />
                      )
                    }
                  })
                }
              </FormGroup>
            </div>
          : null}
        </div>
      </Hidden>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => { handleCloseSnackbar() }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={severity}
          onClose={() => { handleCloseSnackbar() }}
        >
          {snackbarContent}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

function getMillisecondDiff(past, future) {
  return future.getTime() - past.getTime();
}

function getDayEnd(date) {
  let temp = new Date(date.getTime());
  temp.setHours(23, 59, 59, 999);
  return temp;
}

function getDayStart(date) {
  let temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  return temp;
}

function addTime(date, millisecond) {
  return new Date(date.getTime() + millisecond);
}

function substractTime(date, millisecond) {
  return new Date(date.getTime() - millisecond);
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  eventsCollection: state.eventsCollection,
  tasksCollection: state.tasksCollection,
  subjectsCollection: state.subjectsCollection,
  classesCollection: state.classesCollection,
  filesCollection: state.filesCollection,
  assessmentsCollection: state.assessmentsCollection,
});

export default connect(mapStateToProps, {
  getSelectedClasses,
  getAllClass,
  getAllEvents,
  getAllTask,
  getAllSubjects,
  getAllTaskFilesByUser,
  getAllAssessments,
  getTasks,
  getAssessments,
  getStudents,
  getTeachers,
  getAllEvents,
  getOneEvent,
  viewFileEvent
})(Calendar)