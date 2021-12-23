import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Doughnut } from "react-chartjs-2";
import PropTypes from "prop-types";
import CustomLinkify from "../../misc/linkify/Linkify";
import dashboardAdminBackground from "./DashboardAdminBackground.png";
import {
  Avatar,
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
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import {
  Add as AddIcon,
  LocationOn as LocationOnIcon,
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
    backgroundImage: `url(${dashboardAdminBackground})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
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
}));

function AdminDashboard(props) {
  const classes = useStyles();
  const { user } = props.auth;

  // Doughnut Chart
  const data = {
    labels: ["Guru", "Murid", "Pengguna Tidak Aktif"],
    datasets: [
      {
        label: "Jumlah Pengguna",
        data: [12, 19, 3,],
        backgroundColor: [
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235)",
          "rgba(255, 206, 86)",
        ],
        borderColor: [
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235)",
          "rgba(255, 206, 86)",
        ],
        borderWidth: 1,
      },
    ],
  }

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
            <Typography variant="h6" paragraph>
              Akses dengan Cepat
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container direction="column" spacing={4}>
                      <Grid item>
                        <Typography>Kelas dan Mata Pelajaran</Typography>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                          spacing={1}
                        >
                          <Grid item>
                            <Typography color="textSecondary">
                              Terdapat {5} kelas di unit Anda.
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Link to="/buat-kelas">
                              <Button variant="contained" className={classes.addButton}>
                                <AddIcon />
                              </Button>
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        {/* Dua item dibawah di hide kalau emang tak ada apa2*/}
                        <Typography color="textSecondary" gutterBottom>
                          Beberapa Murid berikut belum ditempatkan di kelas
                          manapun.
                        </Typography>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                          spacing={1}
                        >
                          <Grid item>
                            <AvatarGroup max={3}>
                              <Avatar />
                              <Avatar />
                              <Avatar />
                              <Avatar />
                            </AvatarGroup>
                          </Grid>
                          <Grid item>
                            <Link to="/daftar-kelas">
                              <Button variant="outlined" color="primary">
                                Atur
                              </Button>
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography color="textSecondary" gutterBottom>
                          Beberapa Guru berikut belum ditetapkan kelas atau mata
                          pelajaran yang diajarnya.
                        </Typography>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                          spacing={1}
                        >
                          <Grid item>
                            <AvatarGroup max={3}>
                              <Avatar />
                              <Avatar />
                              <Avatar />
                              <Avatar />
                              <Avatar />
                            </AvatarGroup>
                          </Grid>
                          <Grid item>
                            <Link to="/data-ajar-guru">
                              <Button variant="outlined" color="primary">
                                Atur
                              </Button>
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container direction="column" spacing={4}>
                      <Grid item>
                        <Typography>Pengumuman</Typography>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                          spacing={1}
                        >
                          <Grid item>
                            <Typography color="textSecondary">
                              Terdapat {5} kelas di unit Anda.
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Link to="/buat-pengumuman">
                              <Button variant="contained" className={classes.addButton}>
                                <AddIcon />
                              </Button>
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>List pengumuman maks 5 buah recently</Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <CardContent style={{ display: "flex", justifyContent: "center" }}>
                    <Link to="/daftar-pengumuman">
                      <Button color="primary">
                        Lihat Semua
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Typography variant="h6">Jumlah Pengguna</Typography>
          </CardContent>
          <CardContent>
            <Doughnut data={data} />
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
          <CardContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Link to="/kalender">
                <Button color="primary">
                  Lihat Semua
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

AdminDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(AdminDashboard);
