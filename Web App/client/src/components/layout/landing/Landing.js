import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import schoolyIntroduction from "./SchoolyIntroduction.png";
import schoolyAccess from "./SchoolyAccess.png";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssessmentIcon from "@material-ui/icons/Assessment";
import EventNoteIcon from "@material-ui/icons/EventNote";
import FaceIcon from "@material-ui/icons/Face";
import LooksOneIcon from "@material-ui/icons/LooksOne";
import LooksTwoIcon from "@material-ui/icons/LooksTwo";
import Looks3Icon from "@material-ui/icons/Looks3";
import MailIcon from "@material-ui/icons/Mail";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { AiFillNotification } from "react-icons/ai";
import { BsClipboardData } from "react-icons/bs";
import { FaChalkboardTeacher, FaSchool, FaUserCog } from "react-icons/fa";
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
    textAlign: "center",
    margin: "auto",
    marginTop: "50px",
    marginBottom: "50px",
    padding: "20px",
    maxWidth: "80%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
  featuresPaper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "300px",
    padding: "20px",
    "&:focus, &:hover": {
      boxShadow: "1px 3px 5px 2px rgba(0, 0, 0, 0.2)",
    },
  },
  featuresAvatar: {
    width: "120px",
    height: "120px",
    marginBottom: "5px",
    backgroundColor: "white",
    color: theme.palette.primary.main,
  },
  featuresIcon: {
    width: "80px",
    height: "80px",
    color: theme.palette.primary.main,
  },
  featuresText: {
    fontSize: "12px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "11px",
    },
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
    padding: "20px",
    paddingTop: "50px",
    paddingBottom: "50px",
  },
  trySchoolyItemMiddle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#61ADEB",
    color: "white",
    padding: "20px",
    paddingTop: "50px",
    paddingBottom: "50px",
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
    // Be careful if you use texarea. setAttribute("value", value), which works with "input" does not work with "textarea".
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
                  Tidak pernah lupa lagi dengan tugas sekolah yang ada.
                  Berikan materi dan pekerjaan sekolah dengan mudah.
                  Periksa hasil kuis dan ujian secara otomatis.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} container justify="flex-end">
                <img
                  alt="Schooly Introduction"
                  src={schoolyIntroduction}
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
                src={schoolyAccess}
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </Grid>
            <Grid item>
              <Typography variant="h4" color="primary" align="center" gutterBottom>
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
            <Grid container spacing={3} justify="center" alignItems="stretch">
              <Grid item xs={12}>
                <Typography variant="h4" color="textSecondary" paragraph>
                  Schooly selalu berkembang
                </Typography>
                <Typography color="textSecondary">
                  Schooly memudahkan pekerjaan hampir semua pihak dalam kegiatan belajar mengajar,
                  baik dari pihak <b>sekolah</b>, <b>guru</b>, maupun <b>murid</b>.
                </Typography>
                <Typography color="textSecondary" paragraph>
                  Fitur yang kami sediakan pun selalu <u>bertambah</u> dan <u>berkembang</u> dari waktu ke waktu.
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} lg={3}>
                <Paper variant="outlined" className={classes.featuresPaper}>
                  <Avatar className={classes.featuresAvatar}>
                    <FaUserCog className={classes.featuresIcon} />
                  </Avatar>
                  <Typography paragraph>Akun Pengelola</Typography>
                  <Typography className={classes.featuresText}>
                    Atur dan kelola pengguna yang ada dengan mudah dan terstruktur.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} lg={3}>
                <Paper variant="outlined" className={classes.featuresPaper}>
                  <Avatar className={classes.featuresAvatar}>
                    <FaceIcon className={classes.featuresIcon} />
                  </Avatar>
                  <Typography paragraph>Pendataan Pengguna</Typography>
                  <Typography className={classes.featuresText}>
                    Temukan kontak orang sepersekolahanmu. Perbarui pendataan
                    data pribadi kepada sekolah dengan mudah.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} lg={3}>
                <Paper variant="outlined" className={classes.featuresPaper}>
                  <Avatar className={classes.featuresAvatar}>
                    <FaSchool className={classes.featuresIcon} />
                  </Avatar>
                  <Typography paragraph>Unit</Typography>
                  <Typography className={classes.featuresText}>
                    Atur pengguna yang ada sesuai dengan unit-unit sekolahmu.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} lg={3}>
                <Paper variant="outlined" className={classes.featuresPaper}>
                  <Avatar className={classes.featuresAvatar}>
                    <FaChalkboardTeacher className={classes.featuresIcon} />
                  </Avatar>
                  <Typography paragraph>Kelas</Typography>
                  <Typography className={classes.featuresText}>
                    Kelompokkan murid-murid yang ada sesuai dengan kelas
                    dan mata pelajaran masing-masing.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} lg={3}>
                <Paper variant="outlined" className={classes.featuresPaper}>
                  <Avatar className={classes.featuresAvatar}>
                    <EventNoteIcon className={classes.featuresIcon} />
                  </Avatar>
                  <Typography paragraph>Kalender</Typography>
                  <Typography className={classes.featuresText}>
                    Jadwal persekolahanmu terangkum secara otomatis, mulai dari
                    tugas, ujian, hingga kegiatan lainnya.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} lg={3}>
                <Paper variant="outlined" className={classes.featuresPaper}>
                  <Avatar className={classes.featuresAvatar}>
                    <AiFillNotification className={classes.featuresIcon} />
                  </Avatar>
                  <Typography paragraph>Kegiatan</Typography>
                  <Typography className={classes.featuresText}>
                    Umumkan kegiatan akademik dan non-akademik baik ke pihak
                    Guru, Murid, ataupun keduanya.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} lg={3}>
                <Paper variant="outlined" className={classes.featuresPaper}>
                  <Avatar className={classes.featuresAvatar}>
                    <AnnouncementIcon className={classes.featuresIcon} />
                  </Avatar>
                  <Typography paragraph>Pengumuman</Typography>
                  <Typography className={classes.featuresText}>
                    Sebarkan informasi persekolahan dengan mudah dan cepat.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} lg={3}>
                <Paper variant="outlined" className={classes.featuresPaper}>
                  <Avatar className={classes.featuresAvatar}>
                    <QuestionAnswerIcon className={classes.featuresIcon} />
                  </Avatar>
                  <Typography paragraph>Komentar</Typography>
                  <Typography className={classes.featuresText}>
                    Diskusikan tugasmu baik bersama teman-teman sekelas ataupun
                    sang guru pemberi tugas.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} lg={3}>
                <Paper variant="outlined" className={classes.featuresPaper}>
                  <Avatar className={classes.featuresAvatar}>
                    <MenuBookIcon className={classes.featuresIcon} />
                  </Avatar>
                  <Typography paragraph>Materi</Typography>
                  <Typography className={classes.featuresText}>
                    Kertas tidak ada, tas pun jadi ringan. Berikan materi kepada murid dengan beberapa
                    ketuk saja, tanpa harus dicetak.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} lg={3}>
                <Paper variant="outlined" className={classes.featuresPaper}>
                  <Avatar className={classes.featuresAvatar}>
                    <AssignmentIcon className={classes.featuresIcon} />
                  </Avatar>
                  <Typography paragraph>Tugas</Typography>
                  <Typography className={classes.featuresText}>
                    Tidak perlu lupa akan tugas-tugas yang ada dan kumpulkan
                    dengan mudah.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} lg={3}>
                <Paper variant="outlined" className={classes.featuresPaper}>
                  <Avatar className={classes.featuresAvatar}>
                    <BsClipboardData className={classes.featuresIcon} />
                  </Avatar>
                  <Typography paragraph>Kuis & Ujian</Typography>
                  <Typography className={classes.featuresText}>
                    Buat kuis atau ujian dengan berbagai jenis tipe soal,
                    hasilnya pun dapat diperiksa secara otomatis.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} lg={3}>
                <Paper variant="outlined" className={classes.featuresPaper}>
                  <Avatar className={classes.featuresAvatar}>
                    <AssessmentIcon className={classes.featuresIcon} />
                  </Avatar>
                  <Typography paragraph>Rapor</Typography>
                  <Typography className={classes.featuresText}>
                    Pantau perubahan nilai-nilai yang ada secara cepat dan
                    dinamis dalam bentuk tabel ataupun grafik.
                  </Typography>
                </Paper>
              </Grid>
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
              <Typography align="center" gutterBottom>
                Pengenalan dan Penjelasan
              </Typography>
              <Typography variant="body2" align="center">
                Kunjungi halaman <Link to="/tentang-schooly" style={{ color: "white" }}><u>Tentang Schooly</u></Link> dan
                hubungi kami untuk mendapatkan penjelasan lebih lanjut tentang Schooly.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} className={classes.trySchoolyItemMiddle}>
              <LooksTwoIcon className={classes.trySchoolyStepIcon} />
              <Typography align="center" gutterBottom>
                Simulasi Penggunaan
              </Typography>
              <Typography variant="body2" align="center">
                Coba pakai kepada beberapa kelas dan guru terlebih dahulu.
                Tentunya akan kami dampingi dalam penggunaannya.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} className={classes.trySchoolyItem}>
              <Looks3Icon className={classes.trySchoolyStepIcon} />
              <Typography align="center" gutterBottom>
                Pemakaian
              </Typography>
              <Typography variant="body2" align="center">
                Setelah dokumen administrasi dan penggunaan sudah dilengkapi,
                maka Schooly siap dipakai di sekolah Anda.
              </Typography>
            </Grid>
          </Grid>
        </div>
        <div className={classes.contactSchooly}>
          <Typography variant="h6" align="center">
            Hanya satu ketukan lagi untuk mulai mencoba Schooly!
          </Typography>
          <Typography align="center" paragraph>
            Klik tombol "Kirim Pesan" untuk menghubungi kami atau tombol "Salin
            Tautan" untuk mengirim tautan ini ke sekolah Anda.
          </Typography>
          <Grid container spacing={2} className={classes.contactSchoolyButtonsContainer}>
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
