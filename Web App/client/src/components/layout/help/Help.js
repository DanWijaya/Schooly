import React from "react";
import helpTopics from "./HelpTopics.png";
import moreHelpBackground from "./MoreHelpBackground.png";
import { Avatar, Button, Drawer, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Paper, Typography, List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import EmailIcon from "@material-ui/icons/Email";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import InstagramIcon from "@material-ui/icons/Instagram";
import MailIcon from "@material-ui/icons/Mail";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  helpTopicsBackground: {
    backgroundColor: "#38b6ff",
  },
  helpTopics: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: "auto",
    width: "1000px",
    height: "500px",
    color: "white",
    backgroundImage: `url(${helpTopics})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  content: {
    maxWidth: "1000px",
    margin: "auto",
    marginTop: "50px",
  },
  moreHelpText: {
    fontFamily: "Cambria",
  },
  moreHelp: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontFamily: "Cambria",
    maxWidth: "1000px",
    height: "200px",
    marginBottom: "30px",
    backgroundImage: `url(${moreHelpBackground})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  paperIcon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "250px",
    height: "300px",
    padding: "20px",
    "&:focus": {
      boxShadow: "1px 3px 5px 2px rgba(0, 0, 0, .3)",
    },
    "&:hover": {
      boxShadow: "1px 3px 5px 2px rgba(0, 0, 0, .3)",
    },
  },
  iconAvatar: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    width: "150px",
    height: "150px",
    marginBottom: "20px",
  },
  mailIcon: {
    width: "100px",
    height: "100px",
  },
  instagramIcon: {
    width: "100px",
    height: "100px",
  },
}));

function Help(props) {
  document.title="Schooly | Bantuan"

  const classes = useStyles();

  const [isFirsttimeRendered, setFirstTime] = React.useState(false)
  const { handleMarginTopValue } = props;
  if(!isFirsttimeRendered) {
    handleMarginTopValue(0);
    setFirstTime(true);
  }

  return (
    <div className={classes.root}>
      <div className={classes.helpTopicsBackground}>
        <div className={classes.helpTopics}>
          <Typography variant="h2">
            <b>CARI TOPIK BANTUAN</b>
          </Typography>
          <Typography variant="h6">
            Temukan solusi permasalahanmu dari topik-topik bantuan berikut.
          </Typography>
        </div>
      </div>
      <div className={classes.content}>
        <div style={{marginBottom: "100px"}}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <ExpansionPanel variant="outlined" defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5" color="primary">
                    Akun
                  </Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Ada berapa jenis akun dalam suatu lingkup sekolah?</b>
                      </Typography>
                      <Typography>
                        Tiga. Murid, Guru, dan Pengelola.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apakah keterangan akun bisa diubah?</b>
                      </Typography>
                      <Typography>
                        Bisa, keterangan akun dapat diubah dengan menekan tombol "Sunting Profil" pada halaman profil,
                        yang dapat diakses dengan menekan foto profil pada bagian kanan atas aplikasi.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apakah foto akun bisa diubah?</b>
                      </Typography>
                      <Typography>
                        Bisa, foto akun dapat diubah dengan menekan tombol dengan lambang "Kamera" pada halaman profil,
                        yang dapat diakses dengan menekan foto profil pada bagian kanan atas aplikasi.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apakah kata sandi bisa diubah?</b>
                      </Typography>
                      <Typography>
                        Bisa, kata sandi dapat diubah dengan menekan tombol "Ganti Kata Sandi" pada halaman profil,
                        yang dapat diakses dengan menekan foto profil pada bagian kanan atas aplikasi.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apakah kata sandi bisa diubah?</b>
                      </Typography>
                      <Typography>
                        Bisa, kata sandi dapat diubah dengan menekan tombol "Ganti Kata Sandi" pada halaman profil,
                        yang dapat diakses dengan menekan foto profil pada bagian kanan atas aplikasi.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apakah yang perlu dilakukan jika saya lupa email saya?</b>
                      </Typography>
                      <Typography>
                        Silahkan kontak pengelola Schooly pada sekolah anda untuk mendapatkan email akun anda.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apakah yang perlu dilakukan jika saya lupa kata sandi saya?</b>
                      </Typography>
                      <Typography>
                        Masuk ke halaman masuk schooly. Pada bagian bawah formulir masuk,
                        tekan tautan "Lupa Kata Sandi" yang akan mengarah kepada halaman untuk mengganti kata sandi.
                        Pada halaman tersebut, masukkan alamat email akun anda, kemudian sistem akan mengirimkan pesan yang hanya berlaku selama 5 menit jika tidak diklik
                        kepada alamat email yang bersangkutan untuk mengganti kata sandi anda.
                      </Typography>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
            <Grid item>
              <ExpansionPanel variant="outlined" defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5" color="primary">
                    Notifikasi
                  </Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa kegunaan notifikasi?</b>
                      </Typography>
                      <Typography>
                        Notifikasi berguna untuk mengingatkan tugas yang belum dikerjakan untuk murid dan mengingatkan tugas yang harus diperiksa untuk guru.
                        Notifikasi juga berguna untuk memberitahukan update pada schooly.
                      </Typography>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
            <Grid item>
              <ExpansionPanel variant="outlined" defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5" color="primary">
                    Kelas
                  </Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa itu kelas?</b>
                      </Typography>
                      <Typography>
                        Sama seperti pengertian kelas secara harafiah, di Schooly suatu kelas berarti kelompok belajar yang terdiri atas pelajar dan pengajar.
                        Suatu kelas dapat dibuat oleh akun pengelola pada suatu lingkup sekolah.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa saja isi suatu kelas?</b>
                      </Typography>
                      <Typography>
                         Suatu kelas terdiri dari mata pelajaran, murid (pelajar), dan guru (pengajar).
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apakah suatu mata pelajaran dapat dibuat?</b>
                      </Typography>
                      <Typography>
                         Suatu mata pelajaran dapat dibuat oleh akun pengelola sekolah yang bersangkutan.
                         Setiap kelas memiliki daftar mata pelajaran yang sama.
                      </Typography>
                    </Grid>
                </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
            <Grid item>
              <ExpansionPanel variant="outlined" defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5" color="primary">
                    Tugas
                  </Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa itu tugas?</b>
                      </Typography>
                      <Typography>
                        Sama seperti pengertian tugas secara harafiah, di Schooly suatu kelas berarti suatu target pembelajaran yang harus diberikan oleh pengajar ke pelajar untuk diselesaikan.
                        Suatu kelas dapat dibuat oleh akun guru terhadap 1 kelas atau lebih pada suatu lingkup sekolah.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa saja isi suatu tugas?</b>
                      </Typography>
                      <Typography>
                        Suatu tugas terdiri dari judul tugas, penanggung jawab, deskripsi tugas, file terlampir, dan batas waktu.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Bagaimana</b>
                      </Typography>
                      <Typography>
                        Suatu tugas terdiri dari judul tugas, penanggung jawab, deskripsi tugas, file terlampir, dan batas waktu.
                      </Typography>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
        </div>
        <div className={classes.moreHelp}>
          <Typography variant="h4" gutterBottom className={classes.moreHelpText}>
            Ada yang bisa kami bantu?
          </Typography>
          <Typography variant="h6" className={classes.moreHelpText}>
            Masih belum menemukan solusi dari permasalahan anda? Silahkan hubungi kami.
          </Typography>
        </div>
        <Grid container justify="space-around">
          <Grid item>
            <Paper variant="outlined" button component="a" className={classes.paperIcon} href="mailto:schoolysystem@gmail.com">
              <Avatar className={classes.iconAvatar}>
                <EmailIcon className={classes.mailIcon} />
              </Avatar>
              <Typography variant="h7">
                <b>schoolysystem@gmail.com</b>
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper variant="outlined" button component="a" className={classes.paperIcon} href="http://www.instagram.com">
              <Avatar className={classes.iconAvatar}>
                <InstagramIcon className={classes.instagramIcon} />
              </Avatar>
              <Typography variant="h7">
                <b>schoolysystem.id</b>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Help;
