import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { Web as WebIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  welcomePaper: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: "url(/images/backgrounds/DashboardAdminBackground.png)",
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  unitAvatar: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
  unitUserCount: {
    backgroundColor: "transparent",
  },
  unitUserCountBar: {
    borderRadius: "5px",
    backgroundColor: theme.palette.primary.main,
  },
}));

function SuperAdminDashboard(props) {
  const classes = useStyles();
  const { user } = props.auth;

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
      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography>Jumlah Pengguna</Typography>
              </Grid>
              <Grid item>
                <Link to="/daftar-unit">
                  <Button variant="outlined" color="primary">
                    Lihat Semua
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar variant="rounded" className={classes.unitAvatar}>
                  <WebIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography noWrap>Nama Unit</Typography>}
                secondary={
                  <Grid
                    container
                    justify="flex-end"
                    alignItems="center"
                    spacing={1}
                  >
                    <Grid item xs>
                      <LinearProgress
                        // Ini bakal relatif valuenya dengan unit dengan jumlah terbanyak, yang terbanyak barnya full
                        variant="determinate"
                        value={70}
                        classes={{
                          root: classes.unitUserCount,
                          bar: classes.unitUserCountBar,
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">100 orang</Typography>
                    </Grid>
                  </Grid>
                }
              />
            </ListItem>
          </List>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography>Pengelola Tidak Aktif</Typography>
          </CardContent>
          <Divider />
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography noWrap>
                    Nama
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary" noWrap>
                    Nama Unit
                  </Typography>
                }
              />
              <Button variant="outlined" color="primary">
                Profil
              </Button>
            </ListItem>
          </List>
          <Divider />
          <CardContent style={{ display: "flex", justifyContent: "center" }}>
            <Link to="/pengelola-tertunda">
              <Button color="primary">
                Lihat Semua
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

SuperAdminDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(SuperAdminDashboard);
