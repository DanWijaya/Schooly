import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/id";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import PropTypes from "prop-types";
import {
  Avatar,
  Divider,
  Fab,
  Grid,
  Hidden,
  InputAdornment,
  IconButton,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TableSortLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  AccountCircle as AccountCircleIcon,
  Announcement as AnnouncementIcon,
  ArrowBack as ArrowBackIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pageview as PageviewIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@material-ui/icons";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Empty from "../../misc/empty/Empty";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  announcementIcon: {
    backgroundColor: theme.palette.primary.main,
  },
  listItem: {
    padding: "6px 16px",
  },
  viewAnnouncementButton: {
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  editMaterialButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteAnnouncementButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
}));

// function AnnouncementSubList(props) {
//   const {
//     retrieved_users,
//     selectedAnnouncements,
//     adminAnnouncements,
//     kelas,
//     classes,
//     user,
//     mine,
//     author_role,
//     handleOpenDeleteDialog,
//   } = props;
//   const [order, setOrder] = React.useState("asc");
//   const [orderBy, setOrderBy] = React.useState("subject");
//   const [searchFilter, updateSearchFilter] = React.useState("");
//   const [searchBarFocus, setSearchBarFocus] = React.useState(false);

//   const [rows, setRows] = React.useState([]);

//   const handleRequestSort = (event, property) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const announcementRowItem = (rows, data) => {
//     rows.push(
//       createData(
//         <AccountCircleIcon />,
//         !retrieved_users.get(data.author_id)
//           ? null
//           : retrieved_users.get(data.author_id).name,
//         data.title,
//         // `/pengumuman/${data._id}`,
//         data._id,
//         data.createdAt,
//         !retrieved_users.get(data.author_id)
//           ? null
//           : retrieved_users.get(data.author_id).name.toLowerCase()
//       )
//     );
//   };

//   React.useEffect(() => {
//     // If all_assessments is not undefined or an empty array
//     if (
//       Array.isArray(selectedAnnouncements) &&
//       retrieved_users &&
//       adminAnnouncements
//     ) {
//       let newRows = [];
//       if (mine) {
//         if (author_role === "Student") {
//           // untuk pengumuman yg dibuat oleh saya sebagai ketua kelas
//           selectedAnnouncements
//             .filter(
//               (item) =>
//                 item.author_id === kelas.ketua_kelas &&
//                 item.title.toLowerCase().includes(searchFilter.toLowerCase())
//             )
//             .forEach((data) => {
//               announcementRowItem(newRows, data);
//             });
//         } else if (author_role === "Teacher") {
//           // untuk pengumuman yg dibuat oleh saya sebagai guru
//           selectedAnnouncements
//             .filter(
//               (item) =>
//                 item.author_id !== kelas.ketua_kelas &&
//                 item.title.toLowerCase().includes(searchFilter.toLowerCase())
//             )
//             .forEach((data) => {
//               announcementRowItem(newRows, data);
//             });
//         } else if (author_role === "Admin") {
//           // untuk pengumuman yg dibuat oleh saya sebagai admin
//           selectedAnnouncements
//             .filter((item) =>
//               item.title.toLowerCase().includes(searchFilter.toLowerCase())
//             )
//             .forEach((data) => {
//               announcementRowItem(newRows, data);
//             });
//         }
//       } else {
//         if (author_role === "Student") {
//           // untuk pengumuman yg diberikan oleh ketua kelas kepada saya sebagai murid (saya bukan ketua kelas)
//           selectedAnnouncements
//             .filter(
//               (item) =>
//                 item.author_id === kelas.ketua_kelas &&
//                 item.title.toLowerCase().includes(searchFilter.toLowerCase())
//             )
//             .forEach((data) => {
//               announcementRowItem(newRows, data);
//             });
//         } else if (author_role === "Teacher") {
//           // untuk pengumuman yg diberikan oleh guru kepada saya sebagai murid
//           selectedAnnouncements
//             .filter(
//               (item) =>
//                 item.author_id !== kelas.ketua_kelas &&
//                 item.title.toLowerCase().includes(searchFilter.toLowerCase())
//             )
//             .forEach((data) => {
//               announcementRowItem(newRows, data);
//             });
//         } else if (author_role === "Admin") {
//           adminAnnouncements
//             .filter(
//               (item) =>
//                 item.to.includes(user.role) &&
//                 item.title.toLowerCase().includes(searchFilter.toLowerCase())
//             )
//             .forEach((data) => {
//               announcementRowItem(newRows, data);
//             });
//         }
//       }
//       setRows(newRows);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     adminAnnouncements,
//     retrieved_users,
//     selectedAnnouncements,
//     searchFilter,
//   ]);

//   return (
//     <>
//       <AnnouncementListSubToolbar
//         kelas={kelas}
//         user={user}
//         classes={classes}
//         order={order}
//         orderBy={orderBy}
//         onRequestSort={handleRequestSort}
//         searchFilter={searchFilter}
//         updateSearchFilter={updateSearchFilter}
//         setSearchBarFocus={setSearchBarFocus}
//         searchBarFocus={searchBarFocus}
//         mine={mine}
//         author_role={author_role}
//       />
//       <Divider variant="inset" className={classes.subTitleDivider} />
//       <AnnouncementListItems
//         order={order}
//         orderBy={orderBy}
//         rows={rows}
//         classes={classes}
//         mine={mine}
//         handleOpenDeleteDialog={handleOpenDeleteDialog}
//       />
//     </>
//   );
// }

function AnnouncementItem(props) {
  const classes = useStyles();
  // const {
  //   link,
  //   primaryText,
  //   subPrimaryText,
  //   secondaryText,
  //   subSecondaryText,
  // } = props;
  const { data, handleOpenDeleteDialog, mine, author_role } = props;
  const {
    selectedAnnouncements,
    adminAnnouncements,
  } = props.announcementsCollection;
  const { user } = props.auth;
  const { kelas } = props.classesCollection;
  const [rows, setRows] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("subject");
  const [searchFilter, updateSearchFilter] = React.useState("");
  const [searchBarFocus, setSearchBarFocus] = React.useState(false);
  console.log(data);
  React.useEffect(() => {
    if (Array.isArray(data)) {
      let filteredData = [];
      if (mine) {
        filteredData = data.filter(
          (item) =>
            item.announcementtitle
              .toLowerCase()
              .includes(searchFilter.toLowerCase()) &&
            item.author_id === user._id
        );
      } else {
        console.log(data);
        if (author_role === "Student" && kelas) {
          // untuk pengumuman yg diberikan oleh ketua kelas kepada saya sebagai murid (saya bukan ketua kelas)
          filteredData = data.filter(
            (item) =>
              item.author_id === kelas.ketua_kelas &&
              item.announcementtitle
                .toLowerCase()
                .includes(searchFilter.toLowerCase())
          );
          // .forEach((data) => {
          //   announcementRowItem(newRows, data);
          // });
        } else if (author_role === "Teacher" && kelas) {
          // untuk pengumuman yg diberikan oleh guru kepada saya sebagai murid
          filteredData = data.filter(
            (item) =>
              item.author_id !== kelas.ketua_kelas &&
              item.announcementtitle
                .toLowerCase()
                .includes(searchFilter.toLowerCase())
          );
        } else if (author_role === "Admin") {
          filteredData = data.filter(
            (item) =>
              item.to.includes(user.role) &&
              item.announcementtitle
                .toLowerCase()
                .includes(searchFilter.toLowerCase())
          );
        }
      }
      setRows(filteredData);
    }
  }, []);

  return (
    <Grid container direction="column" spacing={2}>
      {rows.map((row, index) => {
        let content = (
          <ListItem className={classes.listItem}>
            <Hidden smUp implementation="css">
              <ListItemText
                primary={
                  <Typography variant="subtitle1" color="textPrimary">
                    {row.announcementtitle}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="textSecondary">
                    {row.author_name}
                  </Typography>
                }
              />
            </Hidden>
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
                  <Avatar className={classes.announcementIcon}>
                    <AnnouncementIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="textPrimary">
                      {row.announcementtitle}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="textSecondary">
                      {row.author_name}
                    </Typography>
                  }
                />
              </div>
            </Hidden>
            <ListItemText
              align="right"
              primary={
                mine ? (
                  <Grid container spacing={1} justify="flex-end">
                    <Grid item>
                      <LightTooltip title="Lihat Lebih Lanjut">
                        <Link to={`/pengumuman/${row._id}`}>
                          <IconButton
                            size="small"
                            className={classes.viewAnnouncementButton}
                          >
                            <PageviewIcon fontSize="small" />
                          </IconButton>
                        </Link>
                      </LightTooltip>
                    </Grid>
                    <Grid item>
                      <LightTooltip title="Sunting">
                        <Link to={`/sunting-pengumuman/${row._id}`}>
                          <IconButton
                            size="small"
                            className={classes.editMaterialButton}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Link>
                      </LightTooltip>
                    </Grid>
                    <Grid item>
                      <LightTooltip title="Hapus">
                        <IconButton
                          size="small"
                          className={classes.deleteAnnouncementButton}
                          onClick={(e) => {
                            handleOpenDeleteDialog(
                              e,
                              row._id,
                              row.announcementtitle
                            );
                            console.log(row._id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </LightTooltip>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    {moment(row.createdAt).locale("id").format("DD MMM YYYY")}
                  </Typography>
                )
              }
              secondary={
                mine ? null : moment(row.createdAt).locale("id").format("HH.mm")
              }
            />
          </ListItem>
        );
        return (
          <Grid key={row.createdAt} item>
            <Paper variant="outlined">
              {mine ? (
                content
              ) : (
                <Link to={`/pengumuman/${row._id}`}>{content}</Link>
              )}
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
  // return (
  //   <Link to={link}>
  //     <Paper variant="outlined" className={classes.root}>
  //       <ListItem button>
  //         <ListItemAvatar>
  //           <Avatar className={classes.announcementIcon}>
  //             <AnnouncementIcon />
  //           </Avatar>
  //         </ListItemAvatar>
  //         <ListItemText
  //           primary={
  //             <Typography noWrap>
  //               {primaryText}
  //             </Typography>
  //           }
  //           secondary={
  //             <Typography variant="body2" color="textSecondary" noWrap>
  //               {subPrimaryText}
  //             </Typography>
  //           }
  //         />
  //         <ListItemText
  //           align="right"
  //           primary={
  //             <Typography variant="body2" color="textSecondary" noWrap>
  //               {secondaryText}
  //             </Typography>
  //           }
  //           secondary={
  //             <Typography variant="body2" color="textSecondary" noWrap>
  //               {subSecondaryText}
  //             </Typography>
  //           }
  //         />
  //       </ListItem>
  //     </Paper>
  //   </Link>
  // );
}

AnnouncementItem.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  announcementsCollection: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  announcementsCollection: state.announcementsCollection,
});

export default connect(mapStateToProps, {})(AnnouncementItem);
