import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import dashboardStudentBackground from "./DashboardStudentBackground.png";
import TaskItem from "../item/TaskItem";
import AssessmentItem from "../item/AssessmentItem";
import Empty from "../../misc/empty/Empty";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  welcomePaperStudent: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${dashboardStudentBackground})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
}));

function StudentDashboard(props) {
  const classes = useStyles();
  const { user } = props.auth;
  const { taskList, quizList, examList } = props.data;
  const { submittedTaskIds } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={0} className={classes.welcomePaperStudent}>
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
          <Card style={{ borderTop: "8px solid red" }}>
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
          <Card style={{ borderTop: "8px solid yellow" }}>
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
          <Card style={{ borderTop: "8px solid green" }}>
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

StudentDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(StudentDashboard);
