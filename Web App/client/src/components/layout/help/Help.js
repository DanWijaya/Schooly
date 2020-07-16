import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import helpTopics from "./HelpTopics.png";
import moreHelpBackground from "./MoreHelpBackground.png";
import { Avatar, Button, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Hidden, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EmailIcon from "@material-ui/icons/Email";
import InstagramIcon from "@material-ui/icons/Instagram";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  helpTopicsBackground: {
    backgroundColor: "#38B6FF",
  },
  helpTopics: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
    height: "500px",
    color: "white",
    backgroundImage: `url(${helpTopics})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  content: {
    maxWidth: "1000px",
    margin: "auto",
    marginTop: "50px",
    padding: "10px",
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
    backgroundSize: "cover",
  },
  paperIcon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "200px",
    height: "100%",
    padding: "20px",
    "&:focus, &:hover": {
      boxShadow: "1px 3px 5px 2px rgba(0, 0, 0, .3)",
    },
  },
  iconAvatar: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    width: "100px",
    height: "100px",
    marginBottom: "20px",
  },
  mailIcon: {
    width: "75px",
    height: "75px",
  },
  instagramIcon: {
    width: "75px",
    height: "75px",
  },
  moreHelpMobileButton: {
    minWidth: "250px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

function Help(props) {
  const classes = useStyles();

  const { user } = props.auth;

  const [isFirsttimeRendered, setFirstTime] = React.useState(false)
  const { handleMarginTopValue } = props;
  if (!isFirsttimeRendered) {
    handleMarginTopValue(0);
    setFirstTime(true);
  }

  document.title = "Schooly | Bantuan";

  return(
    <div className={classes.root}>
      <div className={classes.helpTopicsBackground}>
        <div className={classes.helpTopics}>
          <Typography variant="h3">
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
                    Akun, Registrasi, dan Masuk
                  </Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Ada jenis akun apa saja di Schooly?</b>
                      </Typography>
                      <Typography>
                        Ada tiga jenis akun yaitu Murid, Guru, dan Pengelola.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Bagaimana cara untuk melengkapi keterangan profil atau mengubah keterangan profil?</b>
                      </Typography>
                      <Typography>
                        Keterangan akun dapat diubah dengan menekan tombol "Sunting Profil" pada halaman profil,
                        yang dapat diakses dengan menekan foto profil pada bagian kanan atas aplikasi.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Bagaimana cara mengubah foto akun?</b>
                      </Typography>
                      <Typography>
                        Foto akun dapat diubah dengan menekan tombol dengan gambar "Kamera" pada halaman profil,
                        yang dapat diakses dengan menekan foto profil pada bagian kanan atas aplikasi.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Bagaimana cara mengubah kata sandi?</b>
                      </Typography>
                      <Typography>
                        Kata sandi dapat diubah dengan menekan tombol "Ganti Kata Sandi" pada halaman profil,
                        yang dapat diakses dengan menekan foto profil pada bagian kanan atas aplikasi.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Bagaimana cara saya untuk meregistrasi akun Schooly saya?</b>
                      </Typography>
                      <Typography>
                        Silahkan hubungi pengelola Schooly pada sekolah anda untuk memberikan tautan untuk registrasi akun
                        anda sesuai dengan kebutuhan anda (Guru atau Murid).
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa yang perlu dilakukan jika saya lupa email saya?</b>
                      </Typography>
                      <Typography>
                        Silahkan hubungi pengelola Schooly pada sekolah anda untuk mendapatkan email akun anda.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa yang perlu dilakukan jika saya lupa kata sandi saya?</b>
                      </Typography>
                      <Typography>
                        Masuk ke halaman masuk schooly. Pada bagian bawah formulir masuk,
                        tekan tautan "Lupa Kata Sandi" yang akan mengarah kepada halaman untuk mengganti kata sandi.
                        Pada halaman tersebut, masukkan alamat email akun anda, kemudian sistem akan mengirimkan
                        pesan yang hanya berlaku selama 5 menit jika tidak diklik kepada alamat email yang bersangkutan
                        untuk mengganti kata sandi anda.
                      </Typography>
                    </Grid>
                    { user.role === "Admin" ?
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>Apakah yang perlu dilakukan untuk mempersiapkan penggunaan Schooly dalam suatu sekolah?</b>
                          </Typography>
                          <Typography paragraph>
                            <ol>
                              <li>
                                Masuk dengan akun pengelola sekolah anda.
                              </li>
                              <li>
                                Undang guru-guru dan murid-murid di sekolah anda dengan mengirim tautan untuk registrasi
                                yang dapat diakses pada halaman "Beranda" yang dapat ditemukan pada bagian kiri aplikasi
                                (tautan tersebut hanya berlaku pada waktu yang terbatas).
                              </li>
                              <li>
                                Buat kelas-kelas yang anda butuhkan yang dapat diakses dengan pada halaman "Kelas"
                                yang dapat ditemukan pada bagian kiri aplikasi (Anda akan diarahkan ke suatu halaman yang berisi
                                daftar kelas anda), kemudian klik tombol "Buat Kelas".
                              </li>
                              <li>
                                Lakukan penyuntingan kelas untuk memberikan peran murid seperti Ketua Kelas, Sekretaris, dan Bendahara.
                                (Dapat dilakukan juga oleh wali kelas masing-masing).
                              </li>
                            </ol>
                          </Typography>
                        </Grid>
                      : user.role === "Teacher" || user.role === "Student" ?
                        null
                      :
                        <Grid item>
                          <Typography align="center" color="primary">
                            <b>Silahkan masuk ke akun Schooly anda untuk mendapatkan bantuan lebih lanjut mengenai topik ini.</b>
                          </Typography>
                        </Grid>
                    }
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
                         Suatu kelas terdiri dari pekerjaan kelas, mata pelajaran, murid (pelajar), dan guru (pengajar).
                      </Typography>
                    </Grid>
                    { user.role === "Student" ?
                        <Grid item container spacing={4}>
                          <Grid item>
                            <Typography variant="h6" gutterBottom>
                              <b>Apa isi dari pekerjaan kelas?</b>
                            </Typography>
                            <Typography>
                               Pekerjaan kelas berisi tugas-tugas yang diberikan dalam suatu kelas yang diurutkan sesuai waktu
                               tugas tersebut diberikan.
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="h6" gutterBottom>
                              <b>Apa isi dari mata pelajaran?</b>
                            </Typography>
                            <Typography>
                               Mata pelajaran berisi tugas-tugas mata pelajaran tersebut yang diberikan dalam suatu kelas dan diurutkan
                               sesuai waktu tugas tersebut diberikan.
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="h6" gutterBottom>
                              <b>Apakah mata pelajaran secara spesifik dapat dilihat?</b>
                            </Typography>
                            <Typography>
                               Bisa, mata pelajaran secara spesifik dapat dilihat dengan membuka panel mata pelajaran dalam suatu kelas
                               dan menekan tombol "Lihat Mata Pelajaran".
                            </Typography>
                          </Grid>
                        </Grid>
                      : user.role === "Teacher" ?
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>Apakah guru dapat melihat kelas yang diajar?</b>
                          </Typography>
                          <Typography>
                             Bisa, guru dapat melihat kelas yang di ajar dengan menekan tombol "Kelas" yang dapat ditemukan pada bagian kiri aplikasi.
                          </Typography>
                        </Grid>
                      : user.role === "Admin" ?
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>Apakah keterangan suatu kelas dapat disunting atau dihapus?</b>
                          </Typography>
                          <Typography>
                            Bisa, dengan akun pengelola sekolah yang bersangkutan masing-masing kelas yang telah dibuat dapat disunting dan dihapus pada halaman daftar kelas yang dapat ditemukan pada
                            dengan menekan tombol "Kelas" pada bagian kiri aplikasi.
                          </Typography>
                        </Grid>
                      :
                      <Grid item>
                        <Typography align="center" color="primary">
                          <b>Silahkan masuk ke akun Schooly anda untuk mendapatkan bantuan lebih lanjut mengenai topik ini.</b>
                        </Typography>
                      </Grid>
                    }
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
                        Suatu tugas terdiri dari judul tugas, deskripsi tugas, penanggung jawab, lampiran berkas, dan batas waktu.
                        Tugas yang dikumpulkan adalah dalam bentuk file dengan jenis apa saja.
                      </Typography>
                    </Grid>
                    { user.role === "Student" ?
                        <Grid item container spacing={4}>
                          <Grid item>
                            <Typography variant="h6" gutterBottom>
                              <b>Bagaimana cara untuk mengumpulkan tugas?</b>
                            </Typography>
                            <Typography paragraph>
                               <ol>
                                <li>
                                  Tekan tombol "Pilih File" pada halaman tugas yang bersangkutan.
                                </li>
                                <li>
                                  Pilih file-file yang ingin anda kumpulkan. <br />
                                  Tips: Tahan tombol "CTRL" dan menekan klik kiri pada mouse untuk memilih file dalam jumlah banyak.
                                </li>
                                <li>
                                  File yang anda pilih akan muncul pada daftar "File Terpilih".
                                </li>
                                <li>
                                  Tekan tombol kumpul tugas untuk mengunggah file anda. File anda yang terkumpul akan muncul pada daftar di bagian
                                  hasil pekeraan.
                                </li>
                              </ol>
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="h6" gutterBottom>
                              <b>Apakah file yang sudah saya kumpulkan dapat diunduh atau dihapus?</b>
                            </Typography>
                            <Typography>
                               Bisa, file yang sudah dikumpulkan dapat diunduh dengan menekan tombol unduh pada file tersebut dan dapat
                               dihapus dengan menekan tombol hapus pada file tersebut.
                            </Typography>
                          </Grid>
                        </Grid>
                      : user.role === "Teacher" ?
                        <Grid item container spacing={4}>
                          <Grid item>
                            <Typography variant="h6" gutterBottom>
                              <b>Bagaimana cara untuk membuat suatu tugas?</b>
                            </Typography>
                            <Typography>
                               <ol>
                                <li>
                                  Buka halaman daftar tugas dengan menekan tombol "Tugas" yang dapat ditemukan pada bagian kiri aplikasi.
                                </li>
                                <li>
                                  Klik tombol "Buat Tugas" untuk membuat tugas.
                                </li>
                                <li>
                                  Lengkapi tugas dengan keterangan seperti deskripsi, batas waktu, dan lampiran berkas.
                                </li>
                               </ol>
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="h6" gutterBottom>
                              <b>Apakah tugas yang dibuat dapat disunting atau dihapus?</b>
                            </Typography>
                            <Typography>
                               Bisa, tugas yang dibuat dapat disunting atau dihapus pada halaman daftar tugas yang telah dibuat (dapat ditemukan pada
                               dengan menekan tombol "Tugas" yang dapat ditemukan pada bagian kiri aplikasi).
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="h6" gutterBottom>
                              <b>Siapa saja yang dapat menyunting atau menghapus suatu tugas?</b>
                            </Typography>
                            <Typography>
                               Suatu tugas hanya dapat disunting atau dihapus oleh guru yang membuat tugas tersebut.
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="h6" color="primary" align="center" gutterBottom>
                              <b>Tips Mengenai Tugas</b>
                            </Typography>
                            <Typography>
                               Suatu tugas dapat digunakan juga sebagai ulangan harian, kuis, ataupun pekerjaan sekolah yang lainnya, dikarenakan fleksibilitas
                               file yang diunggah bisa dalam bentuk apapun, dan batas waktu yang akurat.
                            </Typography>
                          </Grid>
                        </Grid>
                      : user.role === "Admin" ?
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>Apakah akun pengelola memiliki wewenang akan tugas yang telah dibuat?</b>
                          </Typography>
                          <Typography>
                            Tidak, akun pengelola tidak memiliki wewenang akan tugas apapun. Suatu tugas hanya dapat diubah
                            oleh guru yang membuat tugas tersebut.
                          </Typography>
                        </Grid>
                      :
                      <Grid item>
                        <Typography align="center" color="primary">
                          <b>Silahkan masuk ke akun Schooly anda untuk mendapatkan bantuan lebih lanjut mengenai topik ini.</b>
                        </Typography>
                      </Grid>
                    }
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
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item>
            <Hidden smUp implementation="css">
              <Button
                variant="contained"
                startIcon={<EmailIcon />}
                className={classes.moreHelpMobileButton}
                href="mailto:schoolysystem@gmail.com"
              >
                schoolysystem@gmail.com
              </Button>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Paper
                variant="outlined"
                button component="a"
                className={classes.paperIcon}
                href="mailto:schoolysystem@gmail.com"
                style={{marginRight: "50px"}}
              >
                <Avatar className={classes.iconAvatar}>
                  <EmailIcon className={classes.mailIcon} />
                </Avatar>
                <Typography variant="caption">
                  <b>schoolysystem@gmail.com</b>
                </Typography>
              </Paper>
            </Hidden>
          </Grid>
          <Grid item>
            <Hidden smUp implementation="css">
              <Button
                variant="contained"
                startIcon={<InstagramIcon />}
                className={classes.moreHelpMobileButton}
                href="http://www.instagram.com"
              >
                schoolysystem.com
              </Button>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Paper
                variant="outlined"
                button component="a"
                className={classes.paperIcon}
                href="http://www.instagram.com"
              >
                <Avatar className={classes.iconAvatar}>
                  <InstagramIcon className={classes.instagramIcon} />
                </Avatar>
                <Typography variant="caption">
                  <b>schoolysystem.com</b>
                </Typography>
              </Paper>
            </Hidden>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

Help.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps
) (Help);
