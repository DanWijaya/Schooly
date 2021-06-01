import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
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
  Divider
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";

import EventNoteIcon from '@material-ui/icons/EventNote';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PageviewIcon from "@material-ui/icons/Pageview";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import {
  getAllEvents,
  deleteEvent
} from "../../../actions/EventActions";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%"
    },
    padding: "10px",
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
  editEventButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
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
  calendarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px"
  },
  calendar: {
    width: "100%"
  },
  calendarTile: {
    // minWidth: "100px"
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
}));

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
    role
  } = props;

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
              <LibraryBooksIcon
                className={classes.titleIcon}
                fontSize="large"
              />
              <Typography variant="h4">Daftar Agenda</Typography>
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
            <LibraryBooksIcon className={classes.titleIcon} fontSize="large" />
            <Typography variant="h4">Daftar Agenda</Typography>
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

function Calendar(props) {
  document.title = "Schooly | Kalender";

  const classes = useStyles();

  const {
    getAllEvents
  } = props;
  const role = props.auth.user.role;

  // state ini akan bernilai null jika dan hanya jika pengguna belum mengklik tile kalender (belum memilih tanggal)
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    getAllEvents();
  }, []);

  React.useEffect(() => {
    // mencari event yang berlangsung hari ini.
    // event yang sudah lewat jamnya, sedang berlangsung, atau belum berlangsung akan ditampilkan.
    let now = (selectedDate === null) ? (new Date()).getDate() : selectedDate.getDate();
    let filteredEvents = props.eventsCollection.allEvents.filter((eventInfo) => {
      let start_date = (new Date(eventInfo.start_date)).getDate();
      let end_date = (new Date(eventInfo.end_date)).getDate();
      return (start_date <= now && now <= end_date);
    });
    setRows(filteredEvents);
  }, [props.eventsCollection.allEvents, selectedDate]);

  return (
    <div className={classes.root}>
      <div className={classes.calendarContainer}>
        <ReactCalendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={classes.calendarTile}
          className={classes.calendar}
        />
      </div>
      <CalendarListToolbar
        classes={classes}
        role={role}
      />
      <Divider variant="inset" className={classes.titleDivider} />
      {/* <Hidden mdUp implementation="css">
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
      </Hidden> */}

      <Grid container direction="column" spacing={2}>
        {rows.length === 0 ? (
          <Typography variant="subtitle1" align="center" color="textSecondary">
            Kosong
          </Typography>
        ) : 
          rows.map((eventInfo) => {
            return (
              <Grid item>
                <Paper variant="outlined">
                  <ListItem className={classes.listItem}>
                    {/* Isi ListItem Mobile = nama event*/}
                    <Hidden smUp implementation="css">
                      <ListItemText
                        style={{ margin: "6px 0" }}
                        primary={
                          <Grid container alignItems="center">
                            <Typography variant="subtitle1" color="textPrimary">
                              {eventInfo.name}
                            </Typography>

                            {/* bagian ini ditambahkan agar tinggi listitemnya sama seperti listitem yang ada props secondarynya */}
                            <Grid item style={{ visibility: "hidden" }}>
                              <Typography variant="subtitle1">
                                {"\u200B"}
                              </Typography>
                              <Typography variant="caption">
                                {"\u200B"}
                              </Typography>
                            </Grid>
                          </Grid>
                        }
                      />
                    </Hidden>

                    {/* Isi ListItem Desktop = nama dan icon event*/}
                    <Hidden xsDown implementation="css">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar className={classes.listAvatar}>
                            <EventNoteIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          style={{ margin: "6px 0" }}
                          primary={
                            <Grid container alignItems="center">
                              <Typography variant="h6" color="textPrimary">
                                {eventInfo.name}
                              </Typography>

                              {/* bagian ini ditambahkan agar tinggi listitemnya sama seperti listitem yang ada props secondarynya */}
                              <Grid item style={{ visibility: "hidden" }}>
                                <Grid container direction="column">
                                  <Typography variant="h6">
                                    {"\u200B"}
                                  </Typography>
                                  <Typography variant="body2">
                                    {"\u200B"}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          }
                        />
                      </div>
                    </Hidden>

                    {/* IconButton lihat, sunting, hapus */}
                    <ListItemText
                      align="right"
                      primary={
                        <Grid container spacing={1} justify="flex-end">
                          {/* IconButton - lihat */}
                          <Grid item>
                            <LightTooltip title="Lihat Lebih Lanjut">
                              <Link to={`/kegiatan/${eventInfo._id}`}>
                                <IconButton
                                  size="small"
                                  className={classes.viewEventButton}
                                >
                                  <PageviewIcon fontSize="small" />
                                </IconButton>
                              </Link>
                            </LightTooltip>
                          </Grid>

                          {/* IconButton - sunting */}
                          <Grid item>
                            <LightTooltip title="Sunting">
                              <Link to={`/sunting-kegiatan/${eventInfo._id}`}>
                                <IconButton
                                  size="small"
                                  className={classes.editEventButton}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Link>
                            </LightTooltip>
                          </Grid>

                          {/* IconButton - hapus */}
                          <Grid item>
                            <LightTooltip title="Hapus">
                              <IconButton
                                size="small"
                                className={classes.deleteEventButton}
                                onClick={() => {
                                  deleteEvent(eventInfo._id).then(() => {
                                    getAllEvents();
                                  })
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </Grid>

                        </Grid>
                      }
                    />
                  </ListItem>
                </Paper>
              </Grid>
            );
          })
        }
      </Grid>

    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  eventsCollection: state.eventsCollection
});

export default connect(mapStateToProps, {
  getAllEvents
})(Calendar)