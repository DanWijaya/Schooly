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

function AdminDashboard(props) {
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
                    <Grid container direction="column" spacing={3}>
                      <Grid item>
                        <Typography>
                          Kelas dan Mata Pelajaran
                        </Typography>
                        <Grid container justify="space-between" alignItems="center" spacing={1}>
                          <Grid item>
                            <Typography color="textSecondary">
                              Terdapat {5} kelas di unit Anda.
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Button variant="contained" color="secondary">
                              <AddIcon />
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        {/* Dua item dibawah di hide kalau emang tak ada apa2*/}
                        <Typography color="textSecondary" gutterBottom>
                          Beberapa Murid berikut belum ditempatkan di kelas manapun.
                        </Typography>
                        <Grid container justify="space-between" alignItems="center" spacing={1}>
                          <Grid item>
                            <AvatarGroup max={3}>
                              <Avatar />
                              <Avatar />
                              <Avatar />
                              <Avatar />
                            </AvatarGroup>
                          </Grid>
                          <Grid item>
                            <Button variant="outlined" color="primary">
                              Atur
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography color="textSecondary" gutterBottom>
                          Beberapa Guru berikut belum ditetapkan kelas atau mata pelajaran yang diajarnya.
                        </Typography>
                        <Grid container justify="space-between" alignItems="center" spacing={1}>
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
                            <Button variant="outlined" color="primary">
                              Atur
                            </Button>
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
                    <Grid container direction="column" spacing={3}>
                      <Grid item>
                        <Typography>
                          Pengumuman
                        </Typography>
                        <Grid container justify="space-between" alignItems="center" spacing={1}>
                          <Grid item>
                            <Typography color="textSecondary">
                              Terdapat {5} kelas di unit Anda.
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Button variant="contained" color="secondary">
                              <AddIcon />
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        //List pengumuman maks 5 buah recently
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <CardContent style={{ padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button color="primary">
                        Lihat Semua
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={7}>
        <Paper>
          Doughnut Chart isi jumlah murid guru, dan pengguna tidak aktif
        </Paper>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h6">
              Kegiatan Minggu Ini
            </Typography>
          </CardContent>
          <CardContent>
            Vertical stepper isi timeline kegiatan minggu ini.
            Hijau ceklis udah lewat, belum lewat warna biru.
          </CardContent>
          <Divider />
          <CardContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button color="primary">
                Lihat Semua
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
};

export default AdminDashboard;
