import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TaskItem from "../item/TaskItem";
import AssessmentItem from "../item/AssessmentItem";
import Empty from "../../misc/empty/Empty";
import CustomLinkify from "../../misc/linkify/Linkify";
import dashboardTeacherBackground from "./DashboardTeacherBackground.png";
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
} from "@material-ui/core";
import {
  Add as AddIcon,
  Announcement as AnnouncementIcon,
  AssignmentOutlined as AssignmentIcon,
  LocationOn as LocationOnIcon,
  MenuBook as MenuBookIcon,
  Timer as TimerIcon,
  TimerOff as TimerOffIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";
import { FaClipboardList } from "react-icons/fa";
import { BsClipboardData } from "react-icons/bs";

const useStyles = makeStyles((theme) => ({
  welcomePaper: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${dashboardTeacherBackground})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  quickAccessIcon: {
    color: "grey",
    marginRight: "10px",
    fontSize: "25px",
  },
  createButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.success.main,
    },
  },
  createMenuItem: {
    color: "black",
    "&:hover": {
      backgroundColor: theme.palette.success.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-root": {
        color: "white",
      },
    },
  },
  addButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  label: {
    display: "flex",
    alignItems: "center",
  },
  labelIcon: {
    width: "1rem",
    height: "1rem",
    marginRight: "10px",
    color: "grey",
  },
  notCheckedList: {
    borderTop: `8px solid ${theme.palette.error.main}`,
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

  // Daily Event Stepper
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ["Select campaign settings", "Create an ad group", "Create an ad"];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <Typography
              className={classes.label}
              style={{ wordBreak: "break-word" }}
            >
              <LocationOnIcon className={classes.labelIcon} />
              Nama Lokasi
            </Typography>
            <Typography className={classes.label}>
              <TimerIcon className={classes.labelIcon} />
              Waktu Mulai
            </Typography>
            <Typography className={classes.label}>
              <TimerOffIcon className={classes.labelIcon} />
              Waktu Selesai
            </Typography>
            <Typography
              style={{
                marginTop: "10px",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              <CustomLinkify text="deskripsi" />
            </Typography>
          </div>
        );
      case 1:
        return (
          <div />
        );
      case 2:
        return (
          <div />
        );
      default:
        return "Tidak ada kegiatan untuk hari ini";
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={0} className={classes.welcomePaper}>
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
                  <AnnouncementIcon className={classes.quickAccessIcon} />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Pengumuman</Hidden>
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <MenuBookIcon className={classes.quickAccessIcon} />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Materi</Hidden>
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <AssignmentIcon className={classes.quickAccessIcon} />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Tugas</Hidden>
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <FaClipboardList className={classes.quickAccessIcon} />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Kuis</Hidden>
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <BsClipboardData className={classes.quickAccessIcon} />
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
                    <MenuItem className={classes.createMenuItem}>
                      <ListItemIcon>
                        <AnnouncementIcon style={{ fontSize: "20px" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography>Buat Pengumuman</Typography>}
                      />
                    </MenuItem>
                  </Link>
                  <Link to="/buat-materi">
                    <MenuItem className={classes.createMenuItem}>
                      <ListItemIcon>
                        <MenuBookIcon style={{ fontSize: "20px" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography>Buat Materi</Typography>}
                      />
                    </MenuItem>
                  </Link>
                  <Link to="/buat-tugas">
                    <MenuItem className={classes.createMenuItem}>
                      <ListItemIcon>
                        <AssignmentIcon style={{ fontSize: "20px" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography>Buat Tugas</Typography>}
                      />
                    </MenuItem>
                  </Link>
                  <Link to="/buat-kuis">
                    <MenuItem className={classes.createMenuItem}>
                      <ListItemIcon>
                        <FaClipboardList style={{ fontSize: "20px" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography>Buat Kuis</Typography>}
                      />
                    </MenuItem>
                  </Link>
                  <Link to="/buat-ujian">
                    <MenuItem className={classes.createMenuItem}>
                      <ListItemIcon>
                        <BsClipboardData style={{ fontSize: "20px" }} />
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
        <Card className={classes.notCheckedList}>
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
          <Stepper orientation="vertical" activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index)}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          <Divider />
          <CardContent style={{ display: "flex", justifyContent: "center" }}>
            <Link to="/kalender">
              <Button color="primary">Lihat Semua</Button>
            </Link>
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
