import React from "react";
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
}));

function TeacherDashboard(props) {
  const classes = useStyles();

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
            <Typography variant="h6">
              Akses dengan Cepat
            </Typography>
            <Typography color="textSecondary" paragraph>
              Berikut adalah jumlah pemberitahuan dan pekerjaan yang telah ada berikan.
            </Typography>
            <Grid container direction="column" spacing={2}>
              <Grid item container spacing={4}>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <AnnouncementIcon style={{ color: "grey", marginRight: "10px", fontSize: "25px" }} />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Pengumuman</Hidden>
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <MenuBookIcon style={{ color: "grey", marginRight: "10px", fontSize: "25px" }} />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Materi</Hidden>
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <AssignmentIcon style={{ color: "grey", marginRight: "10px", fontSize: "25px" }} />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Tugas</Hidden>
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <FaClipboardList style={{ color: "grey", marginRight: "10px", fontSize: "25px" }} />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Kuis</Hidden>
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <BsClipboardData style={{ color: "grey", marginRight: "10px", fontSize: "25px" }} />
                  <Typography color="primary" display="inline">
                    1 <Hidden smUp>Ujian</Hidden>
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container justify="flex-end">
                <Fab
                  size="medium"
                  className={classes.createButton}
                  onClick={(event) => this.handleMenuOpen(event)}
                >
                  <AddIcon />
                </Fab>
                <Menu
                  keepMounted
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleMenuClose}
                  anchorEl={this.state.anchorEl}
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
                        primary={
                          <Typography className={classes.menuItemText}>
                            Buat Pengumuman
                          </Typography>
                        }
                      />
                    </MenuItem>
                  </Link>
                  <Link to="/buat-materi">
                    <MenuItem className={classes.menuItem}>
                      <ListItemIcon>
                        <MenuBookIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography className={classes.menuItemText}>
                            Buat Materi
                          </Typography>
                        }
                      />
                    </MenuItem>
                  </Link>
                  <Link to="/buat-tugas">
                    <MenuItem className={classes.menuItem}>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography className={classes.menuItemText}>
                            Buat Tugas
                          </Typography>
                        }
                      />
                    </MenuItem>
                  </Link>
                  <Link to="/buat-kuis">
                    <MenuItem className={classes.menuItem}>
                      <ListItemIcon>
                        <FaClipboardList />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography className={classes.menuItemText}>
                            Buat Kuis
                          </Typography>
                        }
                      />
                    </MenuItem>
                  </Link>
                  <Link to="/buat-ujian">
                    <MenuItem className={classes.menuItem}>
                      <ListItemIcon>
                        <BsClipboardData />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography className={classes.menuItemText}>
                            Buat Ujian
                          </Typography>
                        }
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
            <Typography variant="h6">
              Belum Diperiksa
            </Typography>
          </CardContent>
          <Divider />
          <CardContent>
            <Typography gutterBottom>
              Tugas
            </Typography>
            {listTasksTeacher()}
          </CardContent>
          <CardContent>
            <Typography gutterBottom>
              Kuis
            </Typography>
            {listAssessmentsTeacher("Kuis")}
          </CardContent>
          <CardContent>
            <Typography gutterBottom>
              Ujian
            </Typography>
            {listAssessmentsTeacher("Ujian")}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h6">
              Kegiatan Minggu Ini
            </Typography>
          </CardContent>
          <CardContent>
            Vertical stepper isi yang kayak punya admin.
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

export default TeacherDashboard;
