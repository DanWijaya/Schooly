import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Avatar,
  Button,
  Grid,
  Hidden,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  Assignment as AssignmentIcon,
  Announcement as AnnouncementIcon,
  Assessment as AssessmentIcon,
  EventNote as EventNoteIcon,
  Face as FaceIcon,
  LooksOne as LooksOneIcon,
  LooksTwo as LooksTwoIcon,
  Looks3 as Looks3Icon,
  Mail as MailIcon,
  MenuBook as MenuBookIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { AiFillNotification } from "react-icons/ai";
import { BsClipboardData } from "react-icons/bs";
import { FaChalkboard, FaSchool, FaUserCog } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  schoolyIntroductionBackground: {
    backgroundColor: theme.palette.primary.light,
  },
  schoolyIntroduction: {
    display: "flex",
    justifyContent: "center",
    margin: "auto",
    padding: "20px",
    color: "white",
    maxWidth: "80%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
  schoolyAccess: {
    margin: "auto",
    marginTop: "50px",
    marginBottom: "50px",
    padding: "20px",
    maxWidth: "80%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
  schoolyFeaturesBackground: {
    backgroundColor: theme.palette.primary.fade,
  },
  schoolyFeatures: {
    margin: "auto",
    marginTop: "50px",
    marginBottom: "50px",
    padding: "20px",
    maxWidth: "80%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
  featuresPaperDesktop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "300px",
    padding: "20px",
    "&:focus, &:hover": {
      boxShadow: "1px 3px 5px 2px rgba(0, 0, 0, 0.2)",
    },
  },
  featuresAvatarDesktop: {
    width: "120px",
    height: "120px",
    marginBottom: "5px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
  },
  featuresIconDesktop: {
    width: "80px",
    height: "80px",
  },
  featuresAvatarMobile: {
    backgroundColor: theme.palette.primary.main,
  },
  useSchooly: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    marginTop: "50px",
    padding: "20px",
    maxWidth: "80%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
  trySchoolyBackground: {
    backgroundColor: "#64B5F6",
  },
  trySchooly: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
  trySchoolyItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    padding: "50px 30px 50px 30px",
  },
  trySchoolyItemMiddle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#61ADEB",
    color: "white",
    padding: "50px 30px 50px 30px",
  },
  trySchoolyStepIcon: {
    width: "30px",
    height: "30px",
    marginBottom: "20px",
  },
  contactSchooly: {
    margin: "auto",
    marginTop: "25px",
    padding: "20px",
    maxWidth: "80%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
  contactSchoolyButtonsContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  sendMessageButton: {
    width: "160px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  copyLinkButton: {
    width: "160px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
});

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/beranda");
    }
  }

  copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    // To avoid breaking orgain page when copying more words
    // Cant copy when adding below this code
    // Dummy.style.display = "none"
    document.body.appendChild(dummy);
    // Be careful if you use texarea. setAttribute("value", value), which works with "input" but does not work with "textarea".
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  render() {
    const { classes } = this.props;

    document.title = "Schooly | Sistem Manajamen Persekolahan Indonesia";

    return (
      <div className={classes.root}>
        <div className={classes.schoolyIntroductionBackground}>
          <div className={classes.schoolyIntroduction}>
            <Grid container justify="center" alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="h4" gutterBottom>
                  Schooly membuat pekerjaan sekolahmu lebih mudah.
                </Typography>
                <Typography variant="h6">
                  Tidak pernah lupa lagi dengan tugas sekolah yang ada. Berikan
                  materi dan pekerjaan sekolah dengan mudah. Periksa hasil kuis
                  dan ujian secara otomatis.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} container justify="flex-end">
                <img
                  alt="Schooly Introduction"
                  src="/images/illustrations/SchoolyIntroduction.png"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </Grid>
            </Grid>
          </div>
        </div>
        <div className={classes.schoolyAccess}>
          <Grid item container direction="column" alignItems="center">
            <Grid item>
              <img
                alt="Schooly Access"
                src="/images/illustrations/SchoolyAccess.png"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                color="primary"
                align="center"
                gutterBottom
              >
                Akses dengan mudah di mana saja.
              </Typography>
              <Typography align="center">
                Buka dan gunakan Schooly dengan mudah pada browser Anda di
                perangkat apa saja, dimana saja, dan kapan saja.
              </Typography>
            </Grid>
          </Grid>
        </div>
        <div className={classes.schoolyFeaturesBackground}>
          <div className={classes.schoolyFeatures}>
            <Grid container justify="center" alignItems="stretch" spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  color="textSecondary"
                  align="center"
                  paragraph
                >
                  Schooly selalu berkembang
                </Typography>
                <Typography color="textSecondary" align="center">
                  Schooly memudahkan pekerjaan hampir semua pihak dalam kegiatan
                  belajar mengajar, baik dari pihak <b>sekolah</b>, <b>guru</b>,
                  maupun <b>murid</b>.
                </Typography>
                <Typography color="textSecondary" align="center" paragraph>
                  Fitur yang kami sediakan pun selalu <u>bertambah</u> dan{" "}
                  <u>berkembang</u> dari waktu ke waktu.
                </Typography>
              </Grid>
              <Hidden smDown>
                <Grid item xs={4} lg={3}>
                  <Paper
                    variant="outlined"
                    className={classes.featuresPaperDesktop}
                  >
                    <Avatar className={classes.featuresAvatarDesktop}>
                      <FaUserCog className={classes.featuresIconDesktop} />
                    </Avatar>
                    <Typography align="center" paragraph>
                      Akun Pengelola
                    </Typography>
                    <Typography variant="body2" align="center">
                      Atur dan kelola pengguna yang ada dengan mudah dan
                      terstruktur.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <Paper
                    variant="outlined"
                    className={classes.featuresPaperDesktop}
                  >
                    <Avatar className={classes.featuresAvatarDesktop}>
                      <FaceIcon className={classes.featuresIconDesktop} />
                    </Avatar>
                    <Typography align="center" paragraph>
                      Pendataan Pengguna
                    </Typography>
                    <Typography variant="body2" align="center">
                      Temukan kontak orang sepersekolahanmu. Perbarui pendataan
                      data pribadi kepada sekolah dengan mudah.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <Paper
                    variant="outlined"
                    className={classes.featuresPaperDesktop}
                  >
                    <Avatar className={classes.featuresAvatarDesktop}>
                      <FaSchool className={classes.featuresIconDesktop} />
                    </Avatar>
                    <Typography align="center" paragraph>
                      Unit
                    </Typography>
                    <Typography variant="body2" align="center">
                      Atur pengguna yang ada sesuai dengan unit-unit sekolahmu.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <Paper
                    variant="outlined"
                    className={classes.featuresPaperDesktop}
                  >
                    <Avatar className={classes.featuresAvatarDesktop}>
                      <FaChalkboard className={classes.featuresIconDesktop} />
                    </Avatar>
                    <Typography align="center" paragraph>
                      Kelas
                    </Typography>
                    <Typography variant="body2" align="center">
                      Kelompokkan murid-murid yang ada sesuai dengan kelas dan
                      mata pelajaran masing-masing.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <Paper
                    variant="outlined"
                    className={classes.featuresPaperDesktop}
                  >
                    <Avatar className={classes.featuresAvatarDesktop}>
                      <EventNoteIcon className={classes.featuresIconDesktop} />
                    </Avatar>
                    <Typography align="center" paragraph>
                      Kalender
                    </Typography>
                    <Typography variant="body2" align="center">
                      Jadwal persekolahanmu terangkum secara otomatis, mulai
                      dari tugas, ujian, hingga kegiatan lainnya.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <Paper
                    variant="outlined"
                    className={classes.featuresPaperDesktop}
                  >
                    <Avatar className={classes.featuresAvatarDesktop}>
                      <AiFillNotification
                        className={classes.featuresIconDesktop}
                      />
                    </Avatar>
                    <Typography align="center" paragraph>
                      Kegiatan
                    </Typography>
                    <Typography variant="body2" align="center">
                      Umumkan kegiatan akademik dan non-akademik baik ke pihak
                      Guru, Murid, ataupun keduanya.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <Paper
                    variant="outlined"
                    className={classes.featuresPaperDesktop}
                  >
                    <Avatar className={classes.featuresAvatarDesktop}>
                      <AnnouncementIcon
                        className={classes.featuresIconDesktop}
                      />
                    </Avatar>
                    <Typography align="center" paragraph>
                      Pengumuman
                    </Typography>
                    <Typography variant="body2" align="center">
                      Sebarkan informasi persekolahan dengan mudah dan cepat.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <Paper
                    variant="outlined"
                    className={classes.featuresPaperDesktop}
                  >
                    <Avatar className={classes.featuresAvatarDesktop}>
                      <QuestionAnswerIcon
                        className={classes.featuresIconDesktop}
                      />
                    </Avatar>
                    <Typography align="center" paragraph>
                      Komentar
                    </Typography>
                    <Typography variant="body2" align="center">
                      Diskusikan tugasmu baik bersama teman-teman sekelas
                      ataupun sang guru pemberi tugas.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <Paper
                    variant="outlined"
                    className={classes.featuresPaperDesktop}
                  >
                    <Avatar className={classes.featuresAvatarDesktop}>
                      <MenuBookIcon className={classes.featuresIconDesktop} />
                    </Avatar>
                    <Typography align="center" paragraph>
                      Materi
                    </Typography>
                    <Typography variant="body2" align="center">
                      Kertas tidak ada, tas pun jadi ringan. Berikan materi
                      kepada murid dengan beberapa ketuk saja, tanpa harus
                      dicetak.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <Paper
                    variant="outlined"
                    className={classes.featuresPaperDesktop}
                  >
                    <Avatar className={classes.featuresAvatarDesktop}>
                      <AssignmentIcon className={classes.featuresIconDesktop} />
                    </Avatar>
                    <Typography align="center" paragraph>
                      Tugas
                    </Typography>
                    <Typography variant="body2" align="center">
                      Tidak perlu lupa akan tugas-tugas yang ada dan kumpulkan
                      dengan mudah.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <Paper
                    variant="outlined"
                    className={classes.featuresPaperDesktop}
                  >
                    <Avatar className={classes.featuresAvatarDesktop}>
                      <BsClipboardData
                        className={classes.featuresIconDesktop}
                      />
                    </Avatar>
                    <Typography align="center" paragraph>
                      Kuis & Ujian
                    </Typography>
                    <Typography variant="body2" align="center">
                      Buat kuis atau ujian dengan berbagai jenis tipe soal,
                      hasilnya pun dapat diperiksa secara otomatis.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4} lg={3}>
                  <Paper
                    variant="outlined"
                    className={classes.featuresPaperDesktop}
                  >
                    <Avatar className={classes.featuresAvatarDesktop}>
                      <AssessmentIcon className={classes.featuresIconDesktop} />
                    </Avatar>
                    <Typography align="center" paragraph>
                      Rapor
                    </Typography>
                    <Typography variant="body2" align="center">
                      Pantau perubahan nilai-nilai yang ada secara cepat dan
                      dinamis dalam bentuk tabel ataupun grafik.
                    </Typography>
                  </Paper>
                </Grid>
              </Hidden>
              <Hidden mdUp>
                <Grid item xs={12} container spacing={1}>
                  <Grid item xs={12}>
                    <Paper>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.featuresAvatarMobile}>
                            <FaUserCog />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography>Akun Pengelola</Typography>}
                          secondary={
                            <Typography variant="body2">
                              Atur dan kelola pengguna yang ada dengan mudah dan
                              terstruktur.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.featuresAvatarMobile}>
                            <FaceIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography>Pendataan Pengguna</Typography>}
                          secondary={
                            <Typography variant="body2">
                              Temukan kontak orang sepersekolahanmu. Perbarui
                              pendataan data pribadi kepada sekolah dengan
                              mudah.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.featuresAvatarMobile}>
                            <FaSchool />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography>Unit</Typography>}
                          secondary={
                            <Typography variant="body2">
                              Atur pengguna yang ada sesuai dengan unit-unit
                              sekolahmu.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.featuresAvatarMobile}>
                            <FaChalkboard />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography>Kelas</Typography>}
                          secondary={
                            <Typography variant="body2">
                              Kelompokkan murid-murid yang ada sesuai dengan
                              kelas dan mata pelajaran masing-masing.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.featuresAvatarMobile}>
                            <EventNoteIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography>Kalender</Typography>}
                          secondary={
                            <Typography variant="body2">
                              Jadwal persekolahanmu terangkum secara otomatis,
                              mulai dari tugas, ujian, hingga kegiatan lainnya.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.featuresAvatarMobile}>
                            <AiFillNotification />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography>Kegiatan</Typography>}
                          secondary={
                            <Typography variant="body2">
                              Umumkan kegiatan akademik dan non-akademik baik ke
                              pihak Guru, Murid, ataupun keduanya.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.featuresAvatarMobile}>
                            <AnnouncementIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography>Pengumuman</Typography>}
                          secondary={
                            <Typography variant="body2">
                              Sebarkan informasi persekolahan dengan mudah dan
                              cepat.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.featuresAvatarMobile}>
                            <QuestionAnswerIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography>Komentar</Typography>}
                          secondary={
                            <Typography variant="body2">
                              Diskusikan tugasmu baik bersama teman-teman
                              sekelas ataupun sang guru pemberi tugas.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.featuresAvatarMobile}>
                            <MenuBookIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography>Materi</Typography>}
                          secondary={
                            <Typography variant="body2">
                              Kertas tidak ada, tas pun jadi ringan. Berikan
                              materi kepada murid dengan beberapa ketuk saja,
                              tanpa harus dicetak.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.featuresAvatarMobile}>
                            <AssignmentIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography>Tugas</Typography>}
                          secondary={
                            <Typography variant="body2">
                              Tidak perlu lupa akan tugas-tugas yang ada dan
                              kumpulkan dengan mudah.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.featuresAvatarMobile}>
                            <BsClipboardData />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography>Kuis & Ujian</Typography>}
                          secondary={
                            <Typography variant="body2">
                              Buat kuis atau ujian dengan berbagai jenis tipe
                              soal, hasilnya pun dapat diperiksa secara
                              otomatis.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.featuresAvatarMobile}>
                            <AssessmentIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography>Rapor</Typography>}
                          secondary={
                            <Typography variant="body2">
                              Pantau perubahan nilai-nilai yang ada secara cepat
                              dan dinamis dalam bentuk tabel ataupun grafik.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </Grid>
                </Grid>
              </Hidden>
            </Grid>
          </div>
        </div>
        <div className={classes.useSchooly}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Siap untuk masuk ke era baru belajar mengajar?
          </Typography>
          <Typography align="center" paragraph>
            Ayo kenali Schooly lebih lanjut dengan tiga langkah mudah ini.
          </Typography>
        </div>
        <div className={classes.trySchoolyBackground}>
          <Grid container className={classes.trySchooly}>
            <Grid item xs={12} md={4} className={classes.trySchoolyItem}>
              <LooksOneIcon className={classes.trySchoolyStepIcon} />
              <Typography variant="h6" align="center" gutterBottom>
                Pengenalan
              </Typography>
              <Typography variant="body2" align="center">
                Kunjungi halaman{" "}
                <Link to="/tentang-schooly" style={{ color: "white" }}>
                  <u>Tentang Schooly</u>
                </Link>{" "}
                dan hubungi kami untuk mendapatkan penjelasan lebih lanjut
                tentang Schooly.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} className={classes.trySchoolyItemMiddle}>
              <LooksTwoIcon className={classes.trySchoolyStepIcon} />
              <Typography variant="h6" align="center" gutterBottom>
                Simulasi Penggunaan
              </Typography>
              <Typography variant="body2" align="center">
                Coba pakai kepada beberapa kelas dan guru terlebih dahulu.
                Tentunya akan kami dampingi dalam penggunaannya.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} className={classes.trySchoolyItem}>
              <Looks3Icon className={classes.trySchoolyStepIcon} />
              <Typography variant="h6" align="center" gutterBottom>
                Pemakaian
              </Typography>
              <Typography variant="body2" align="center">
                Setelah semua dokumen administrasi sudah dilengkapi, maka
                Schooly siap dipakai di sekolah Anda.
              </Typography>
            </Grid>
          </Grid>
        </div>
        <div className={classes.contactSchooly}>
          <Typography variant="h6" align="center">
            Mulai coba Schooly sekarang!
          </Typography>
          <Typography color="textSecondary" align="center" paragraph>
            Tekan tombol "Kirim Pesan" untuk menghubungi kami atau tombol "Salin
            Tautan" untuk mengirim tautan ini ke sekolah Anda.
          </Typography>
          <Grid
            container
            spacing={2}
            className={classes.contactSchoolyButtonsContainer}
          >
            <Grid item>
              <Button
                variant="contained"
                href="mailto:schoolysystem@gmail.com"
                startIcon={<MailIcon />}
                className={classes.sendMessageButton}
              >
                Kirim Pesan
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<MdContentCopy />}
                className={classes.copyLinkButton}
                onClick={() =>
                  this.copyToClipboard("http://www.schoolysystem.com")
                }
              >
                Salin Tautan
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(Landing))
);
