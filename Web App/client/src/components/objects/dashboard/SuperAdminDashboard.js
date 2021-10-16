import React from "react";
import dashboardAdminBackground from "./DashboardAdminBackground.png";

const useStyles = makeStyles((theme) => ({
  welcomePaperAdmin: {
    height: "250px",
    padding: "20px",
    color: "white",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${dashboardAdminBackground})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
}));

function SuperAdminDashboard(props) {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={0} className={classes.welcomePaperAdmin}>
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
                <Typography>
                  Jumlah Pengguna
                </Typography>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary">
                  Lihat Semua
                </Button>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar variant="rounded">
                  <WebIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography noWrap>
                    Nama Unit
                  </Typography>
                }
                secondary={
                  <Grid container justify="flex-end" alignItems="center" spacing={1}>
                    <Grid item xs>
                      <LinearProgress
                        //Ini bakal relatif valuenya dengan unit dengan jumlah terbanyak, yang terbanyak barnya full
                        variant="determinate"
                        value={70}
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
            <Typography>
              Pengelola Tidak Aktif
            </Typography>
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
                    <Typography noWrap>
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
          <CardContent style={{ padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button color="primary">
                Lihat Semua Pengelola
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
};

export default SuperAdminDashboard;
