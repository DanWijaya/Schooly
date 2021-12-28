import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TaskItem from "../item/TaskItem";
import AssessmentItem from "../item/AssessmentItem";
import Empty from "../../misc/empty/Empty";
import CustomLinkify from "../../misc/linkify/Linkify";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
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

const useStyles = makeStyles((theme) => ({
  welcomePaper: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: "url(/images/backgrounds/DashboardStudentBackground.png)",
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  notDoneList: {
    borderTop: `8px solid ${theme.palette.error.main}`,
  },
  incomingList: {
    borderTop: `8px solid ${theme.palette.warning.main}`,
  },
  recentResultsList: {
    borderTop: `8px solid ${theme.palette.success.main}`,
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
}));

function StudentDashboard(props) {
  const classes = useStyles();
  const { submittedTaskIds } = props;

  const { user } = props.auth;
  const { taskList, quizList, examList } = props.data;

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
      <Grid item xs={12} md={7} container direction="column" spacing={2}>
        <Grid item>
          <Card className={classes.notDoneList}>
            <CardContent>
              <Typography variant="h6">Belum Dikerjakan</Typography>
            </CardContent>
            <Divider />
            <CardContent>
              <Typography gutterBottom>Tugas</Typography>
              {taskList.length === 0 ? (
                <Empty />
              ) : (
                <Grid container direction="column" spacing={2}>
                  <TaskItem
                    data={taskList}
                    submittedIds={submittedTaskIds}
                    isHideOptionMenu={true}
                  />
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card className={classes.incomingList}>
            <CardContent>
              <Typography variant="h6">Akan Datang</Typography>
            </CardContent>
            <Divider />
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
        <Grid item>
          <Card className={classes.recentResultsList}>
            <CardContent>
              <Typography variant="h6">Baru Diperiksa</Typography>
            </CardContent>
            <Divider />
            <CardContent>
              Isi tugas, kuis, ujian yang baru diperiksa maks 5 paling recent
              dari atas ke bawah.
            </CardContent>
          </Card>
        </Grid>
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

StudentDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(StudentDashboard);
