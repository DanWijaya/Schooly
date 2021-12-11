import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import TaskItem from "../item/TaskItem";
import AssessmentItem from "../item/AssessmentItem";
import Empty from "../../misc/empty/Empty";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Fab,
  Grid,
  Hidden,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  Add as AddIcon,
  Announcement as AnnouncementIcon,
  AssignmentOutlined as AssignmentIcon,
  MenuBook as MenuBookIcon,
} from "@material-ui/icons";
import { FaClipboardList } from "react-icons/fa";
import { BsClipboardData } from "react-icons/bs";
import dashboardTeacherBackground from "./DashboardTeacherBackground.png";

const useStyles = makeStyles((theme) => ({
  welcomePaperTeacher: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${dashboardTeacherBackground})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  createButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
    },
  },
  menuItem: {
    color: "black",
    "&:hover": {
      backgroundColor: theme.palette.success.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-root": {
        color: "white",
      },
    },
  },
}));

function TeacherDashboard(props) {
  const classes = useStyles();
  const { user } = props.auth;
  const { taskList, quizList, examList } = props.data;
  const [anchorEl, setAnchorEl] = React.useState(false);
  // Create Button Menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={0} className={classes.welcomePaperTeacher}>
          <Typography variant="h4" gutterBottom>
            Selamat Datang, {user.name}
          </Typography>
          <Typography variant="h6">
            Apa yang ingin Anda kerjakan hari ini?
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Akses dengan Cepat</Typography>
            <Typography color="textSecondary" paragraph>
              Berikut adalah jumlah pemberitahuan dan pekerjaan yang telah anda
              berikan.
            </Typography>
            <Grid container direction="column" spacing={2}>
              <Grid item container spacing={4}>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <AnnouncementIcon
                    style={{
                      color: "grey",
                      marginRight: "10px",
                      fontSize: "25px",
                    }}
                  />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Pengumuman</Hidden>
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <MenuBookIcon
                    style={{
                      color: "grey",
                      marginRight: "10px",
                      fontSize: "25px",
                    }}
                  />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Materi</Hidden>
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <AssignmentIcon
                    style={{
                      color: "grey",
                      marginRight: "10px",
                      fontSize: "25px",
                    }}
                  />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Tugas</Hidden>
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <FaClipboardList
                    style={{
                      color: "grey",
                      marginRight: "10px",
                      fontSize: "25px",
                    }}
                  />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Kuis</Hidden>
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <BsClipboardData
                    style={{
                      color: "grey",
                      marginRight: "10px",
                      fontSize: "25px",
                    }}
                  />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Ujian</Hidden>
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container justify="flex-end">
                <Fab
                  size="medium"
                  className={classes.createButton}
                  onClick={handleMenuOpen}
                >
                  <AddIcon />
                </Fab>
                <Menu
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorEl={anchorEl}
                  getContentAnchorEl={null}
                  style={{ marginTop: "10px" }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Link to="/buat-pengumuman">
                    <MenuItem className={classes.menuItem}>
                      <ListItemIcon>
                        <AnnouncementIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography>Buat Pengumuman</Typography>}
                      />
                    </MenuItem>
                  </Link>
                  <Link to="/buat-materi">
                    <MenuItem className={classes.menuItem}>
                      <ListItemIcon>
                        <MenuBookIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography>Buat Materi</Typography>}
                      />
                    </MenuItem>
                  </Link>
                  <Link to="/buat-tugas">
                    <MenuItem className={classes.menuItem}>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography>Buat Tugas</Typography>}
                      />
                    </MenuItem>
                  </Link>
                  <Link to="/buat-kuis">
                    <MenuItem className={classes.menuItem}>
                      <ListItemIcon>
                        <FaClipboardList />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography>Buat Kuis</Typography>}
                      />
                    </MenuItem>
                  </Link>
                  <Link to="/buat-ujian">
                    <MenuItem className={classes.menuItem}>
                      <ListItemIcon>
                        <BsClipboardData />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography>Buat Ujian</Typography>}
                      />
                    </MenuItem>
                  </Link>
                </Menu>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={7}>
        <Card style={{ borderTop: "8px solid red" }}>
          <CardContent>
            <Typography variant="h6">Belum Diperiksa</Typography>
          </CardContent>
          <Divider />
          <CardContent>
            <Typography gutterBottom>Tugas</Typography>
            {taskList.length === 0 ? (
              <Empty />
            ) : (
              <Grid container direction="column" spacing={2}>
                <TaskItem data={taskList} isHideOptionMenu={true} />
              </Grid>
            )}
          </CardContent>
          <CardContent>
            <Typography gutterBottom>Kuis</Typography>
            {quizList.length === 0 ? (
              <Empty />
            ) : (
              <Grid container direction="column" spacing={2}>
                <AssessmentItem data={quizList} isHideOptionMenu={true} />
              </Grid>
            )}
          </CardContent>
          <CardContent>
            <Typography gutterBottom>Ujian</Typography>
            {examList.length === 0 ? (
              <Empty />
            ) : (
              <Grid container direction="column" spacing={2}>
                <AssessmentItem data={examList} isHideOptionMenu={true} />
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h6">Kegiatan Minggu Ini</Typography>
          </CardContent>
          <CardContent>
            Vertical stepper isi yang kayak punya admin.
          </CardContent>
          <Divider />
          <CardContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button color="primary">Lihat Semua</Button>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

TeacherDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(TeacherDashboard);
