import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { setCurrentClass } from "../../../actions/ClassActions";
import { getAllAnnouncements, getAnnouncement} from "../../../actions/AnnouncementActions"
import { getUsers } from "../../../actions/UserActions";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Divider, Fab, Grid, Hidden, ListItem, ListItemText, Paper, Typography, TextField, InputAdornment,
  IconButton, Menu, MenuItem, TableSortLabel} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import SortIcon from "@material-ui/icons/Sort";
import { GoSearch } from "react-icons/go";
import ClearIcon from '@material-ui/icons/Clear';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
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
  newAnnouncementButton: {
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.create.main,
      color: "white",
    },
  },
  newAnnouncementIconDesktop: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: "7.5px",
  },
  newAnnouncementIconMobile: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  }
}));

function createData(sender_icon, author_name, notification_title, notification_link, date, time, complete_date, name_lowcased) {
  return { sender_icon, author_name, notification_title, notification_link, date, time, complete_date, name_lowcased };
}
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function AnnouncementListToolbar(props) {
  const { kelas, user, classes, order, orderBy, onRequestSort, 
    role, searchFilter, updateSearchFilter, 
    setSearchBarFocus, searchBarFocus} = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "author_name", numeric: false, disablePadding: true, label: "Pemberi Tugas" },
    { id: "notification_title", numeric: false, disablePadding: false, label: "Nama Tugas" },
    { id: "name_lowcased", numeric: false, disablePadding: false, label: "Waktu Ditugaskan" },
  ];

  if (role === "Student") {
    // Don't include the class_assigned basically.
    headCells.pop()
  }

  // Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  // FOR SEARCH FILTER. 
  const onChange = (e) => {
    updateSearchFilter(e.target.value)
  }

  const onClear = (e, id) => {
    updateSearchFilter("");
    document.getElementById(id).focus();
  }

  const canAnnounce = () => {
    console.log(user.role)
    if (Object.keys(kelas).length > 0) {
      return user.id === kelas.ketua_kelas
    }
    return user.role === "Teacher"
  }

  return (
    // <div className={classes.toolbar}>
    <div className={classes.toolbar}>
      <div style={{display: "flex", alignItems: "center"}}>
        <Hidden smUp implementation="css">
          {searchBarFocus ?
            null 
            :
            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
              <Typography variant="h4">
                Daftar Pengumuman
              </Typography>
            </div>  
          }
        </Hidden>
        <Hidden xsDown implementation="css">
          <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <Typography variant="h4">
              Daftar Pengumuman
            </Typography>
          </div>  
        </Hidden>
        <Hidden smUp implementation="css">
          {searchBarFocus ? 
          <div style={{display: "flex"}}>
            <IconButton 
            onClick={() => {
            setSearchBarFocus(false)
            updateSearchFilter("")}}>
              <ArrowBackIcon/>
            </IconButton> 
            <TextField
                  fullWidth
                  variant="outlined"
                  id="searchFilterMobile"
                  value={searchFilter}
                  onChange={onChange}
                  autoFocus
                  onClick={(e) =>setSearchBarFocus(true)}
                  placeholder="Search Kuis"
                  // onBlur={() => setSearchBarFocus(false)}
                  style={{
                    maxWidth: "200px",
                    marginLeft: "10px"
                  }}
                  InputProps={{
                    startAdornment:(
                      searchBarFocus ? null :
                        <InputAdornment position="start" style={{marginLeft: "-5px", marginRight: "-5px"}}>
                          <IconButton size="small">
                            <GoSearch/>
                          </IconButton>
                        </InputAdornment>)
                      ,
                      endAdornment:( 
                      <InputAdornment position="end" style={{marginLeft: "-10px", marginRight: "-10px"}}>
                        <IconButton 
                          size="small" 
                          id="searchFilterMobile"
                          onClick={(e) => {
                            e.stopPropagation() 
                            onClear(e, "searchFilterMobile")}
                          } 
                          style={{ 
                            opacity: 0.5, 
                            visibility: !searchFilter ? "hidden" : "visible"
                          }}>
                          <ClearIcon/>
                        </IconButton>
                      </InputAdornment>)
                  }}
                />
              </div>
              :
            // <div style={{display: "flex"}}>
            <LightTooltip title="Search" style={{marginLeft: "10px"}}>
              <IconButton  className={classes.goSearchButton} onClick={() => setSearchBarFocus(true)}>
                <GoSearch className={classes.goSearchIconMobile} />
              </IconButton>
            </LightTooltip>
          // </div>
          }
        </Hidden>
      </div>
      <div style={{display: "flex"}}>
      <Hidden xsDown implementation="css">
            <TextField
              // fullWidth
              variant="outlined"
              id="searchFilterDesktop"
              value={searchFilter}
              onChange={onChange}
              onClick={() => setSearchBarFocus(true)}
              onBlur={() => setSearchBarFocus(false)}
              placeholder="Search Kuis"
              // onBlur={() => setSearchBarFocus(false)}
              style={{
                maxWidth: "250px",
                marginRight: "10px"
              }}
              InputProps={{
                startAdornment:(
                    <InputAdornment position="start" style={{marginLeft: "-5px", marginRight: "-5px"}}>
                      <IconButton size="small">
                        <GoSearch/>
                      </IconButton>
                    </InputAdornment>)
                  ,
                  endAdornment:( 
                  <InputAdornment position="end" style={{marginLeft: "-10px", marginRight: "-10px"}}>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation() 
                        onClear(e, "searchFilterDesktop")}
                      } 
                      style={{ 
                        opacity: 0.5, 
                        visibility: !searchFilter ? "hidden" : "visible"
                      }}>
                      <ClearIcon/>
                    </IconButton>
                  </InputAdornment>)
              }}
            />
        </Hidden>
        {canAnnounce() ?
            <div>
              <Hidden smUp implementation="css">
                <LightTooltip title="Buat Pengumuman">
                  <Link to="/buat-pengumuman">
                    <Fab size="small" className={classes.newAnnouncementButton}>
                      <AnnouncementIcon className={classes.newAnnouncementIconMobile} />
                    </Fab>
                  </Link>
                </LightTooltip>
              </Hidden>
              <Hidden xsDown implementation="css">
                <Link to="/buat-pengumuman">
                  <Fab variant="extended" size="medium" className={classes.newAnnouncementButton}>
                    <AnnouncementIcon className={classes.newAnnouncementIconDesktop} />
                    Buat Pengumuman
                  </Fab>
                </Link>
              </Hidden>
            </div>
          :
            null
          }
          <LightTooltip title="Urutkan Kuis">
            <IconButton onClick={handleOpenSortMenu} className={classes.sortButton}>
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
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ?
                  <span className={classes.visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </span>
                  : null
                }
              </TableSortLabel>
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
};

AnnouncementListToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function AnnouncementItemList(props) {
  const classes = useStyles();

  return (
    <Grid item>
      <Paper variant="outlined">
        <Link to={props.notification_link}>
        <ListItem button component="a" className={classes.listItem}>
          <ListItemText
            primary={
              <Typography>
                {props.notification_title}
              </Typography>
            }
            secondary={props.author_name}
          />
          <ListItemText
            align="right"
            primary={
              <Typography variant="subtitle" color="textSecondary">
                {props.date}
              </Typography>
            }
            secondary={`Pukul ${props.time}`}
          />
        </ListItem>
        </Link>
      </Paper>
    </Grid>
  )
}

function AnnouncementList(props) {
  document.title = "Schooly | Daftar Pengumuman"

  const classes = useStyles();
  const { selectedAnnouncements } = props.announcements;
  const { getAnnouncement, getUsers, setCurrentClass } = props;
  const { kelas } = props.classesCollection
  const { user, retrieved_users } = props.auth;
  const [annIsRetrieved, setAnnIsRetrieved] = React.useState(false)

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = React.useState(null);
  const [selectedAssessmentName, setSelectedAssessmentName] = React.useState(null);
  const [copySnackbarOpen, setOpenCopySnackBar] = React.useState(null);
  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);

 

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  var rows = []
  const announcementRowItem = (data) => {
    rows.push(
      createData(
        (<AccountCircleIcon />),
        (!retrieved_users.get(data.author_id) ? null: retrieved_users.get(data.author_id).name),
        (data.title),
        (`/pengumuman/${data._id}`),
        (moment(data.date_announced).locale("id").format("DD MMM YYYY")),
        (moment(data.date_announced).locale("id").format("HH.mm")),
        (moment(data.date_announced).locale("id")),
        (!retrieved_users.get(data.author_id) ? null: retrieved_users.get(data.author_id).name.toLowerCase())
      )
    )
  }

  const retrieveAnnouncements = () => {
    // If all_assessments is not undefined or an empty array
    if (selectedAnnouncements.length) {
      rows = []
      selectedAnnouncements.filter(item => item.title.toLowerCase().includes(searchFilter.toLowerCase()))
      .forEach((data) => {
        if(data){
          console.log(data)
        }
        announcementRowItem(data)
      })
    }
  }

 retrieveAnnouncements()

  // retrieved users ini bulk request, dapat data user"nya satu"
  React.useEffect(() => {
    if (user.role === "Teacher" && !annIsRetrieved) {
      getAnnouncement(user.id, "by_author")
      setAnnIsRetrieved(true)
    }
    else if (user.role === "Student" && !annIsRetrieved) {
      getAnnouncement(user.kelas, "by_class")
      setCurrentClass(user.kelas)
      setAnnIsRetrieved(true)
    }
    console.log(selectedAnnouncements.length)
    if (selectedAnnouncements.length) {
      let author_id_set = new Set();
      selectedAnnouncements.map(ann => author_id_set.add(ann.author_id))
      getUsers(Array.from(author_id_set))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnnouncements.length])

  // ini ntah kenapa kalo masukkin selectedAnnouncements di parameter kedua ada error..

  console.log(selectedAnnouncements)

  // const listAnnouncements = () => {
  //   let annList = [];
  //   console.log(selectedAnnouncements, retrieved_users)
  //   if(selectedAnnouncements.length && retrieved_users.size) {
  //     for (var i = selectedAnnouncements.length-1; i >= 0; i--) {
  //       // retrieved users ini bulk request, dapat data user"nya satu"
  //       annList.push(
  //         createData(
  //           (<AccountCircleIcon />),
  //           (!retrieved_users.get(selectedAnnouncements[i].author_id) ? null: retrieved_users.get(selectedAnnouncements[i].author_id).name),
  //           (selectedAnnouncements[i].title),
  //           (`/pengumuman/${selectedAnnouncements[i]._id}`),
  //           (moment(selectedAnnouncements[i].date_announced).locale("id").format("DD MMM YYYY")),
  //           (moment(selectedAnnouncements[i].date_announced).locale("id").format("HH.mm")),
  //         )
  //       )
  //     }
  //   }
  //   return annList;
  // }

  return (
    <div className={classes.root}>
      <AnnouncementListToolbar
        kelas={kelas}
        user={user}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={rows ? rows.length : 0}
        searchFilter={searchFilter}
        updateSearchFilter={updateSearchFilter}
        setSearchBarFocus={setSearchBarFocus}
        searchBarFocus={searchBarFocus}
      />
      <Divider variant="inset" className={classes.titleDivider} />
      <Grid container direction="column" spacing={2}>
        {stableSort(rows, getComparator(order, orderBy))
          .map((row, index) => {
            return (
              <AnnouncementItemList
                sender_icon={row.sender_icon}
                author_name={row.author_name}
                notification_title={row.notification_title}
                notification_link={row.notification_link}
                date={row.date}
                time={row.time}
              />
            )
        })}
      </Grid>
      </div>
  )
}

AnnouncementList.propTypes = {
  auth: PropTypes.object.isRequired,
  announcements: PropTypes.object.isRequired,
  getAnnouncement: PropTypes.func.isRequired,
  getAllAnnouncements: PropTypes.func.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  announcements: state.announcementsCollection,
  classesCollection: state.classesCollection,
});

export default connect(
  mapStateToProps, { getAnnouncement, getAllAnnouncements, getUsers, setCurrentClass }
) (AnnouncementList);
