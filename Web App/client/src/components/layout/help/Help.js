import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import helpCenter from "./HelpCenter.png";
import helpCenterSmall from "./HelpCenterSmall.png";
import {
  Avatar,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  helpCenter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "400px",
    padding: "20px",
    backgroundImage: `url(${helpCenter})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    [theme.breakpoints.down("sm")]: {
      height: "350px",
      backgroundImage: `url(${helpCenterSmall})`,
    },
  },
  helpTopics: {
    margin: "auto",
    marginTop: "50px",
    marginBottom: "75px",
    padding: "10px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  list: {
    margin: "0px 0px 0px 16px",
    padding: "0px",
  },
  moreHelp: {
    margin: "auto",
    padding: "10px",
    width: "80%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  moreHelpContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 5% 40px 5%",
  },
  contactSupportIcon: {
    maxWidth: "25px",
    maxHeight: "25px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
}));

function Help(props) {
  const classes = useStyles();
  const { user } = props.auth;

  document.title = "Schooly | Bantuan";

  return (
    <div className={classes.root}>
      <div className={classes.helpCenter}>
        <Typography variant="h3" align="center">
          <b>Pusat Bantuan</b>
        </Typography>
        <Typography variant="h6" align="center">
          Temukan solusi permasalahanmu dari topik bantuan berikut.
        </Typography>
      </div>
      <div className={classes.helpTopics}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <ExpansionPanel variant="outlined" defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5" color="primary">
                  Akun, Pendaftaran, dan Masuk
                </Typography>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Ada jenis akun apa saja di Schooly?</b>
                    </Typography>
                    <Typography align="justify">
                      Ada tiga jenis akun yaitu Murid, Guru, dan Pengelola.
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>
                        Bagaimana cara mendaftarkan suatu akun Schooly?
                      </b>
                    </Typography>
                    <Typography  align="justify">
                      <ul className={classes.list}>
                        <li style={{ listStyleType: "disc" }}>
                          Anda dapat mendaftarkan akun Anda pada <Link to="/daftar">halaman Pendaftaran Schooly</Link>.
                          Masukkan jenis akun yang sesuai, dan setelah mendaftar Anda dapat menghubungi pengelola sekolah
                          Anda untuk mengaktifkan akun Anda.
                        </li>
                        <li style={{ listStyleType: "disc" }}>
                          Anda juga dapat menghubungi pengelola Anda untuk mendaftarkan akun Anda.
                        </li>
                      </ul>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>
                        Apa yang perlu dilakukan jika saya lupa email akun
                        saya?
                      </b>
                    </Typography>
                    <Typography align="justify">
                      Silahkan hubungi pengelola Schooly sekolah Anda
                      untuk mendapatkan email akun Anda.
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>
                        Apa yang perlu dilakukan jika saya lupa kata sandi
                        akun saya?
                      </b>
                    </Typography>
                    <Typography align="justify">
                      <ol className={classes.list}>
                        <li>
                          Masuk ke <Link to="/lupa-katasandi">halaman Lupa Kata Sandi Schooly</Link>,
                          yang dapat ditemukan di bagian bawah <Link to="/masuk">halaman Masuk Schooly</Link>.
                        </li>
                        <li>
                          Masukkan alamat email akun Anda.
                        </li>
                        <li>
                          Sistem akan mengirimkan pesan yang hanya
                          berlaku selama 5 menit jika tidak diklik kepada alamat
                          email yang bersangkutan untuk mengganti kata sandi Anda.
                        </li>
                      </ol>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>
                        Apa yang perlu dilakukan jika saya akun saya belum
                        aktif?
                      </b>
                    </Typography>
                    <Typography align="justify">
                      Hubungi pengelola sekolah Anda untuk mengonfirmasi akun yang
                      telah Anda daftarkan.
                    </Typography>
                  </Grid>
                  {user.role === "Student" || user.role === "Teacher" ? (
                    <Grid item container spacing={4}>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>Bagaimana cara mengubah kata sandi?</b>
                        </Typography>
                        <Typography align="justify">
                          <ol className={classes.list}>
                            <li>
                              Buka <Link to="/profil">halaman profil</Link>.
                            </li>
                            <li>
                              Tekan tombol "Ganti Kata Sandi" yang memiliki simbol gembok.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana cara untuk melengkapi keterangan profil atau
                            mengubah keterangan profil?
                          </b>
                        </Typography>
                        <Typography  align="justify">
                          <ol className={classes.list}>
                            <li>
                              Buka <Link to="/profil">halaman profil</Link>.
                            </li>
                            <li>
                              Tekan tombol "Sunting Profil" yang memiliki simbol gembok.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>Bagaimana cara mengubah foto akun?</b>
                        </Typography>
                        <Typography  align="justify">
                        <ol className={classes.list}>
                          <li>
                            Buka <Link to="/profil">halaman profil</Link>.
                          </li>
                          <li>
                            Tekan tombol "Ganti Foto Profil" yang memiliki simbol kamera.
                          </li>
                        </ol>
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : user.role === "Admin" ? (
                    <Grid item container spacing={4}>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>Bagaimana cara mengubah kata sandi?</b>
                        </Typography>
                        <Typography align="justify">
                          <ol className={classes.list}>
                            <li>
                              Buka <Link to="/profil">halaman profil</Link>.
                            </li>
                            <li>
                              Tekan tombol "Ganti Kata Sandi" yang memiliki simbol gembok.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana cara untuk melengkapi keterangan profil atau
                            mengubah keterangan profil?
                          </b>
                        </Typography>
                        <Typography  align="justify">
                          <ol className={classes.list}>
                            <li>
                              Buka <Link to="/profil">halaman profil</Link>.
                            </li>
                            <li>
                              Tekan tombol "Sunting Profil" yang memiliki simbol gembok.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>Bagaimana cara mengubah foto akun?</b>
                        </Typography>
                        <Typography  align="justify">
                        <ol className={classes.list}>
                          <li>
                            Buka <Link to="/profil">halaman profil</Link>.
                          </li>
                          <li>
                            Tekan tombol "Ganti Foto Profil" yang memiliki simbol kamera.
                          </li>
                        </ol>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah yang perlu dilakukan untuk mempersiapkan
                            penggunaan Schooly dalam suatu sekolah?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          <ol className={classes.list}>
                            <li>
                              Ajak guru-guru dan murid-murid di sekolah Anda
                              untuk mendaftar ke Schooly. Atau Anda dapat
                              membuatkan akun Schooly bagi pengguna Anda.
                            </li>
                            <li>
                              Aktifkan akun-akun tersebut pada <Link to="/pengguna-tidakaktif">halaman Pengguna Tidak Aktif</Link>.
                              Kemudian klik tombol "Aktifkan" untuk mengaktifkan suatu akun
                              atau tombol "Hapus" untuk menghapus suatu akun.
                            </li>
                            <li>
                              Buat <Link to="/daftar-mata-pelajaran">halaman Mata Pelajaran
                              </Link>, kemudian tekan tombol "Buat Mata Pelajaran" untuk membuat
                              mata pelajarna yang Anda inginkan.
                            </li>
                            <li>
                              Buat semua kelas-kelas yang Anda butuhkan pada <Link to="/buat-kelas">halaman
                              Buat Kelas</Link>. Masukkan mata pelajaran apa saja untuk kelas yang bersangkutan.
                            </li>
                            <li>
                              Kelompokkan murid-murid dengan menggunakan tombol "Atur Kelas Murid"
                              pada <Link to="/daftar-kelas">halaman Kelas</Link>.
                            </li>
                            <li>
                              Atur mata pelajaran dan kelas yang diajar masing-masing guru
                              pada <Link to="/sunting-guru">halaman Sunting Data Ajar Guru</Link>.
                            </li>
                            <li>
                              Lakukan penyuntingan kelas untuk memberikan peran
                              murid seperti Ketua Kelas, Sekretaris, dan
                              Bendahara.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                    </Grid>
                    ) : (
                    <Grid item>
                      <Typography color="textSecondary">
                        Silahkan masuk untuk mendapatkan bantuan lebih lanjut mengenai topik ini.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item>
            <ExpansionPanel variant="outlined" defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5" color="primary">
                  Mata Pelajaran
                </Typography>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Apa itu mata pelajaran?</b>
                    </Typography>
                    <Typography align="justify">
                      Mata pelajaran adalah jenis ilmu pengetahuan yang diajarkan.
                    </Typography>
                  </Grid>
                  {user.role === "Admin" ? (
                    <Grid item>
                      <Typography variant="h6" align="justify" gutterBottom>
                        <b>
                          Bagaimana cara membuat suatu mata pelajaran?
                        </b>
                      </Typography>
                      <Typography align="justify">
                        <ol className={classes.list}>
                          <li>
                            Buka <Link to="/daftar-mata-pelajaran">halaman Mata Pelajaran</Link>.
                          </li>
                          <li>
                            Tekan tombol "Buat Mata Pelajaran" untuk membuat mata pelajaran.
                          </li>
                          <li>
                            Masukkan nama mata pelajaran yang diinginkan, jika sudah tekan tombol
                            "Buat".
                          </li>
                        </ol>
                      </Typography>
                    </Grid>
                  ) : (
                    <Grid item>
                      <Typography color="textSecondary">
                        Silahkan masuk untuk mendapatkan bantuan lebih lanjut mengenai topik ini.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item>
            <ExpansionPanel variant="outlined" defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5" align="justify" color="primary">
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
                    <Typography align="justify">
                      Sama seperti pengertian kelas secara harafiah, di
                      Schooly suatu kelas berarti kelompok belajar yang
                      terdiri atas pelajar dan pengajar. Suatu kelas dapat
                      dibuat oleh akun pengelola pada suatu lingkup sekolah.
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Apa saja isi suatu kelas?</b>
                    </Typography>
                    <Typography align="justify">
                      Suatu kelas terdiri dari pekerjaan kelas, mata
                      pelajaran, murid (pelajar), dan guru (pengajar).
                    </Typography>
                  </Grid>
                  {user.role === "Student" ? (
                    <Grid item container spacing={4}>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>Apa isi dari pekerjaan kelas?</b>
                        </Typography>
                        <Typography align="justify">
                          Pekerjaan kelas berisi materi, tugas, kuis, dan
                          ujian yang diberikan oleh guru pada kelas tersebut.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>Apa isi dari mata pelajaran?</b>
                        </Typography>
                        <Typography align="justify">
                          Di Schooly, Mata pelajaran berisi materi, tugas,
                          kuis, dan ujian dari mata pelajaran tersebut yang
                          diberikan dalam suatu kelas dan diurutkan sesuai
                          waktu tugas tersebut diberikan.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah mata pelajaran dapat dilihat secara spesifik?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Iya. Mata pelajaran secara spesifik dapat dilihat
                          dengan menekan panel mata pelajaran yang bersangkutan.
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : user.role === "Teacher" ? (
                    <Grid item>
                      <Typography variant="h6" align="justify" gutterBottom>
                        <b>
                          Apakah guru dapat melihat kelas-kelas yang ada pada
                          lingkup sekolahnya?
                        </b>
                      </Typography>
                      <Typography align="justify">
                        Iya. Guru dapat melihat kelas-kelas yang ada pada <Link to="/daftar-kelas">
                        halaman Kelas</Link>.
                      </Typography>
                    </Grid>
                  ) : user.role === "Admin" ? (
                    <Grid item container spacing={4}>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah keterangan suatu kelas dapat disunting dan
                            dihapus?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Iya. Setiap kelas yang telah dibuat dapat
                          disunting dan dihapus pada <Link to="daftar-kelas">halaman Kelas
                          </Link>.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah wali kelas dan murid-murid yang ada pada
                            suatu kelas dapat diatur?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Iya. Murid-murid yang ada pada suatu kelas dapat
                          diatur dengan menekan tombol "Atur Kelas Murid"
                          pada <Link to="/daftar-kelas">halaman Kelas</Link>,
                          sedangkan wali kelas yang ada dapat diatur
                          pada halaman <Link to="/atur-walikelas">halaman Atur Wali Kelas</Link>.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana mekanisme sistem pergantian alokasi
                            murid antar kelas?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          <ol className={classes.list}>
                            <li>
                              Buka <Link to="/daftar-kelas">halaman Kelas</Link>.
                            </li>
                            <li>
                              Tekan tombol "Atur Kelas Murid”.
                            </li>
                            <li>
                              Tekan tombol “Unduh Data Kelas” untuk mengunduh
                              file data kelas dalam format <i>Comma-Separated
                              Values</i> (CSV). Untuk memudahkan pembacaan dan
                              pengubahan isi file, disarankan untuk
                              menggunakan aplikasi spreadsheet yang dapat
                              menampilkan isi file CSV dalam bentuk tabular.
                            </li>
                            <li>Buka file data kelas yang telah diunduh.</li>
                            <li>
                              Baris pertama file data kelas berisi semua nama
                              kelas, sedangkan baris dua dan seterusnya berisi
                              email murid. Email milik murid yang ditempatkan
                              pada suatu kelas akan berada pada kolom kelas tersebut,
                              sedangkan email murid yang belum ditempatkan ke kelas
                              manapun akan berada pada kolom “Belum
                              Ditempatkan”. Untuk memindahkan murid, pindahkan
                              email setiap murid yang ingin
                              dipindahkan ke kolom kelas yang sesuai.
                            </li>
                            <li>
                              Simpan file data kelas yang telah selesai
                              diubah.
                            </li>
                            <li>
                              Kembali ke halaman daftar kelas. Tekan tombol
                              “Atur Kelas Murid”.
                            </li>
                            <li>
                              Tekan tombol “Unggah Data Kelas” untuk mengunggah
                              data kelas yang terbaru.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid item>
                      <Typography color="textSecondary">
                        Silahkan masuk untuk mendapatkan bantuan lebih lanjut mengenai topik ini.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item>
            <ExpansionPanel variant="outlined" defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5" color="primary">
                  Pengumuman
                </Typography>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Apa itu pengumuman?</b>
                    </Typography>
                    <Typography align="justify">
                      Pengumuman adalah informasi berupa teks yang disebarkan
                      oleh pengelola kepada guru dan/atau murid, guru kepada
                      murid, atau ketua kelas kepada murid-murid yang di
                      kelasnya sendiri. File dapat dilampirkan pada suatu
                      pengumuman.
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Apa saja isi suatu pengumuman?</b>
                    </Typography>
                    <Typography align="justify">
                      Suatu pengumuman terdiri dari judul pengumuman,
                      deskripsi pengumuman, pemberi pengumuman, dan lampiran
                      berkas.
                    </Typography>
                  </Grid>
                  {user.role === "Student" ? (
                    <Grid item>
                      <Typography variant="h6" align="justify" gutterBottom>
                        <b>Apakah seorang murid dapat membuat pengumuman?</b>
                      </Typography>
                      <Typography align="justify">
                        Hanya murid yang memiliki peran "Ketua Kelas" yang
                        dapat membuat pengumuman dan pengumuman yang dibuat
                        oleh ketua kelas hanya dapat disebarkan kepada
                        kelasnya sendiri.
                      </Typography>
                    </Grid>
                  ) : user.role === "Teacher" ? (
                    <Grid item container spacing={4}>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana cara untuk membuat suatu pengumuman?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          <ol className={classes.list}>
                            <li>
                              Buka <Link to="/buat-pengumuman">halaman Buat Pengumuman
                              </Link>.
                            </li>
                            <li>
                              Lengkapi pengumuman dengan keterangan seperti
                              deskripsi dan/atau lampiran berkas.
                            </li>
                            <li>
                              Tekan tombol buat untuk menyelesaikan pembuatan
                              pengumuman.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah pengumuman yang dibuat dapat disunting dan
                            dihapus?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Iya. Pengumuman yang telah dibuat dapat disunting
                          dan dihapus pada <Link to="/daftar-pengumuman">halaman Pengumuman</Link>,
                          dengan cara menekan tombol "Sunting" untuk menyunting suatu
                          pengumuman dan menekan tombol "Hapus" untuk menghapus suatu
                          pengumuman. Penyuntingan dan penghapusan suatu pengumuman juga
                          dapat dilakukan dengan membuka halaman masing-masing pengumuman,
                          baru menyunting ataupun menghapus pengumuman tersebut.
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : user.role === "Admin" ? (
                    <Grid item container spacing={4}>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>Bagaimana cara untuk membuat suatu pengumuman?</b>
                        </Typography>
                        <Typography>
                          <ol className={classes.list}>
                            <li>
                              Buka halaman daftar pengumuman dengan menekan
                              tombol "Pengumuman" yang dapat ditemukan pada
                              bagian kiri aplikasi.
                            </li>
                            <li>
                              Klik tombol "Buat Pengumuman" untuk membuat
                              pengumuman.
                            </li>
                            <li>
                              Lengkapi pengumuman dengan keterangan seperti
                              deskripsi dan/atau lampiran berkas.
                            </li>
                            <li>
                              Pilih pihak yang ingin ditujukkan, murid saja,
                              guru saja, ataupun keduanya.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah pengumuman yang dibuat dapat disunting dan
                            dihapus?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Iya. Pengumuman yang telah dibuat dapat disunting
                          dan dihapus pada <Link to="/daftar-pengumuman">halaman Pengumuman</Link>,
                          dengan cara menekan tombol "Sunting" untuk menyunting suatu
                          pengumuman dan menekan tombol "Hapus" untuk menghapus suatu
                          pengumuman. Penyuntingan dan penghapusan suatu pengumuman juga
                          dapat dilakukan dengan membuka halaman masing-masing pengumuman,
                          baru menyunting ataupun menghapus pengumuman tersebut.
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid item>
                      <Typography color="textSecondary">
                        Silahkan masuk untuk mendapatkan bantuan lebih lanjut mengenai topik ini.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item>
            <ExpansionPanel variant="outlined" defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5" color="primary">
                  Materi
                </Typography>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Apa itu Materi?</b>
                    </Typography>
                    <Typography align="justify">
                      Materi adalah bahan pembelajaran yang diberikan oleh
                      guru kepada murid. Materi yang diberikan harus disertai
                      lampiran berkas.
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Apa saja isi suatu materi?</b>
                    </Typography>
                    <Typography align="justify">
                      Suatu materi terdiri dari judul materi, deskripsi
                      materi, mata pelajaran, dan lampiran berkas.
                    </Typography>
                  </Grid>
                  {user.role === "Student" ? null : user.role === "Teacher" ? (
                    <Grid item container spacing={4}>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>Bagaimana cara untuk membuat suatu materi?</b>
                        </Typography>
                        <Typography align="justify">
                          <ol className={classes.list}>
                            <li>
                              Buka <Link to="/buat-materi">halaman Buat Materi
                              </Link>.
                            </li>
                            <li>
                              Lengkapi materi dengan keterangan seperti
                              deskripsi, mata pelajaran, dan lampiran berkas.
                            </li>
                            <li>
                              Tekan tombol buat untuk menyelesaikan pembuatan
                              materi.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah materi yang dibuat dapat disunting dan
                            dihapus?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Iya. Materi yang telah dibuat dapat disunting
                          dan dihapus pada <Link to="/daftar-materi">halaman Materi</Link>,
                          dengan cara menekan tombol "Sunting" untuk menyunting suatu
                          materi dan menekan tombol "Hapus" untuk menghapus suatu
                          materi. Penyuntingan dan penghapusan suatu materi juga
                          dapat dilakukan dengan membuka halaman masing-masing materi,
                          baru menyunting ataupun menghapus materi tersebut.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Siapa saja yang dapat menyunting dan menghapus
                            suatu materi?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Suatu materi hanya dapat disunting dan dihapus oleh
                          guru yang membuat materi tersebut.
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : user.role === "Admin" ? (
                    <Grid item>
                      <Typography variant="h6" align="justify" gutterBottom>
                        <b>
                          Apakah akun pengelola memiliki wewenang akan materi
                          yang telah dibuat?
                        </b>
                      </Typography>
                      <Typography align="justify">
                        Tidak. Akun pengelola tidak memiliki wewenang akan
                        materi apapun. Suatu materi hanya dapat diubah oleh
                        guru yang membuat materi tersebut.
                      </Typography>
                    </Grid>
                  ) : (
                    <Grid item>
                      <Typography color="textSecondary">
                        Silahkan masuk untuk mendapatkan bantuan lebih lanjut mengenai topik ini.
                      </Typography>
                    </Grid>
                  )}
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
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Apa itu tugas?</b>
                    </Typography>
                    <Typography align="justify">
                      Tugas adalah suatu pekerjaan yang diberikan kepada murid
                      untuk meningkatkan pemamahan mengenai sebuah materi.
                      File dapat dilampirkan pada suatu tugas.
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Apa saja isi suatu tugas?</b>
                    </Typography>
                    <Typography align="justify">
                      Suatu tugas terdiri dari judul tugas, deskripsi tugas,
                      lampiran berkas, dan batas waktu. Tugas yang dikumpulkan
                      adalah dalam bentuk file dengan jenis apa saja.
                    </Typography>
                  </Grid>
                  {user.role === "Student" ? (
                    <Grid item container spacing={4}>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>Bagaimana cara untuk mengumpulkan tugas?</b>
                        </Typography>
                        <Typography align="justify">
                          <ol className={classes.list}>
                            <li>
                              Tekan tombol "Pilih File" pada halaman tugas
                              yang bersangkutan.
                            </li>
                            <li>
                              Pilih file-file yang ingin Anda kumpulkan.
                              <br />
                              Tips: Tahan tombol "CTRL" pada keyboard dan klik kiri
                              pada mouse untuk memilih file dalam jumlah
                              banyak.
                            </li>
                            <li>
                              File yang Anda pilih akan muncul pada daftar
                              "File Terpilih".
                            </li>
                            <li>
                              Tekan tombol "Kumpul Tugas" untuk mengunggah
                              file Anda. File Anda yang terkumpul akan muncul
                              pada daftar di bagian hasil pekerjaan.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah file yang sudah dikumpulkan dapat diunduh
                            atau diganti?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Iya. File yang sudah dikumpulkan dapat diunduh
                          dengan menekan tombol unduh pada file tersebut dan
                          dapat dihapus dengan menekan tombol hapus pada file
                          tersebut. Perlu diperhatikan apabila <u>suatu file</u> yang
                          diunggah setelah batas waktu terlewati akan dianggap
                          sebagai telat.
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : user.role === "Teacher" ? (
                    <Grid item container spacing={4}>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>Bagaimana cara untuk membuat suatu tugas?</b>
                        </Typography>
                        <Typography align="justify">
                          <ol className={classes.list}>
                            <li>
                              Buka <Link to="/buat-tugas">halaman Buat Tugas
                              </Link>.
                            </li>
                            <li>
                              Lengkapi tugas dengan keterangan seperti
                              deskripsi, batas waktu, dan lampiran berkas.
                            </li>
                            <li>
                              Tekan tombol buat untuk menyelesaikan pembuatan
                              tugas.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah tugas yang dibuat dapat disunting dan
                            dihapus?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Iya. Tugas yang telah dibuat dapat disunting
                          dan dihapus pada <Link to="/daftar-tugas">halaman Materi</Link>,
                          dengan cara menekan tombol "Sunting" untuk menyunting suatu
                          tugas dan menekan tombol "Hapus" untuk menghapus suatu
                          tugas. Penyuntingan dan penghapusan suatu tugas juga
                          dapat dilakukan dengan membuka halaman masing-masing tugas,
                          baru menyunting ataupun menghapus tugas tersebut.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Siapa saja yang dapat menyunting dan menghapus
                            suatu tugas?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Suatu tugas hanya dapat disunting dan dihapus oleh
                          guru yang membuat tugas tersebut.
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : user.role === "Admin" ? (
                    <Grid item>
                      <Typography variant="h6" align="justify" gutterBottom>
                        <b>
                          Apakah akun pengelola memiliki wewenang akan tugas
                          yang telah dibuat?
                        </b>
                      </Typography>
                      <Typography align="justify">
                        Tidak. Akun pengelola tidak memiliki wewenang akan
                        tugas apapun. Suatu tugas hanya dapat diubah oleh guru
                        yang membuat tugas tersebut.
                      </Typography>
                    </Grid>
                  ) : (
                    <Grid item>
                      <Typography color="textSecondary">
                        Silahkan masuk untuk mendapatkan bantuan lebih lanjut mengenai topik ini.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item>
            <ExpansionPanel variant="outlined" defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5" align="justify" color="primary">
                  Kuis dan Ujian
                </Typography>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Apa itu kuis dan ujian?</b>
                    </Typography>
                    <Typography>
                      Kuis dan Ujian adalah evaluasi berkala terhadap pemahaman
                      murid terhadap pembelajaran yang telah diajarkan. Pada
                      Schooly, tersedia 4 jenis soal pada fitur kuis dan ujian ini
                      yaitu pilihan ganda, kotak centang, isilah, dan uraian.
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Apa saja isi suatu kuis dan ujian?</b>
                    </Typography>
                    <Typography>
                      Suatu tugas terdiri dari judul kuis dan ujian, deskripsi
                      kuis dan ujian, mata pelajaran, waktu mulai pengerjaan,
                      waktu selesai pengerjaan, serta soal-soal yang ada pada
                      kuis dan ujian tersebut.
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Apa perbedaan dari kuis dan ujian?</b>
                    </Typography>
                    <Typography>
                      Pada dasarnya, kuis dan ujian memiliki fungsi dan cara penggunaan yang sama,
                      tetapi memang diberi dua buah penamaan yang berbeda untuk memudahkan
                      penilaian.
                    </Typography>
                  </Grid>
                  {user.role === "Student" ? (
                    <Grid item container spacing={4}>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana cara untuk mengerjakan suatu kuis dan ujian?
                          </b>
                        </Typography>
                        <Typography>
                          <ol className={classes.list}>
                            <li>
                              Lihat waktu mulai pengerjaan dari kuis dan ujian
                              yang bersangkutan pada <Link to="/daftar-kuis">halaman
                              Kuis</Link> dan <Link to="/daftar-ujian"> halaman Ujian</Link>.
                            </li>
                            <li>
                              Beberapa waktu sebelum mulai, guru pemberi
                              kuis dan ujian tersebut akan memberikan file untuk
                              membuka kuis dan ujian tersebut.
                            </li>
                            <li>
                              Kerjakan kuis dan ujian sesuai dengan waktu yang
                              diberikan.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana sistem penilaian soal jenis pilihan ganda?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Setiap soal yang dijawab benar, murid akan mendapatkan poin
                          sebesar bobot untuk soal pilihan ganda tersebut.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana sistem penilaian soal jenis kotak
                            centang?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Untuk setiap pilihan yang di jawab benar, murid
                          mendapat +1 poin per jumlah pilihan yang benar.
                          Untuk setiap pilihan yang di jawab salah, murid
                          mendapatkan penailti -2 poin per jumlah pilihan yang
                          benar. Untuk pilihan yang seharusnya benar namun
                          dikosongkan, murid tidak mendapatkan poin (0 poin).
                          Kemudian poin tersebut dijumlahkan dan dikalikan
                          dengan nilai bobot 1 soal untuk soal jenis kotak
                          centang. <br />
                          <b>Contoh:</b> Terdapat suatu soal dengan 5 pilihan yaitu
                          A, B, C, D, dan E, dimana 4 pilihannya benar yaitu
                          A, B, C, dan D. Asumsi soal tersebut memiliki bobot
                          5 poin per soalnya. Murid menjawab A, B, C, dan E
                          sebagai pilihan yang benar. <br />
                          Karena terdapat 3 pilihan yang benar dijawab yaitu
                          A, B, dan C, maka murid mendapatkan 3 poin. Pilihan
                          D yang dikosongkan tidak memberikan poin apa-apa (0
                          poin). Pilihan E yang seharusnya tidak dijawab namun
                          dijawab memberikan penalti sebesar -2 poin. Kemudian
                          poin-poin ini ditotalkan menjadi 1 poin dibagi
                          dengan jumlah pilihan yang benar yaitu 4 pilihan,
                          menjadi 0,25. Kemudian nilai ini dikallikan bobot
                          soal tersebut yaitu 5, menghasilkan 1,25. <br />
                          Kesimpulan, murid mendapatkan 1,25 poin dari 5 poin.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana sistem penilaian soal jenis isian pendek?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Untuk setiap isian pendek yang dijawab benar, murid akan
                          mendapatkan poin sebesar jumlah isian yang benar dibagi dengan
                          jumlah isian dikalikan bobot untuk soal isian pendek tersebut.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana sistem penilaian soal jenis uraian?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Penilaian soal jenis uraian dilakukan secara objektif
                          oleh Guru yang bersangkutan.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah ujian yang sudah dikumpulkan dapat diubah?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Tidak. Ujian yang sudah dikumpulkan tidak akan bisa
                          diubah kembali, pastikan Anda sudah yakin akan
                          jawaban Anda ketika mengumpulkan ujian.
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : user.role === "Teacher" ? (
                    <Grid item container spacing={4}>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana cara untuk membuat suatu kuis dan ujian?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          <ol className={classes.list}>
                            <li>
                              Buka <Link to="/buat-kuis">halaman Buat Kuis</Link> untuk
                              membuat kuis atau <Link to="/buat-ujian">halaman Buat Ujian
                              </Link> untuk membuat ujian.
                            </li>
                            <li>
                              Lengkapi kuis atau ujian dengan keterangan seperti
                              deskripsi, mata pelajaran, waktu mulai
                              pengerjaan, dan waktu selesai pengerjaan.
                            </li>
                            <li>
                              Buat soal yang Anda inginkan sesuai dengan jenis
                              soal yang tersedia.
                            </li>
                            <li>
                              Jangan lupa untuk menampilkan kuis atau ujian yang telah dibuat
                              jika sudah yakin melengkapi deskripsi dan waktu pelaksanaannya.
                            </li>
                            <li>
                              Tekan tombol buat untuk menyelesaikan pembuatan
                              kuis atau ujian.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah kuis atau ujian yang dibuat dapat disunting dan
                            dihapus?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Iya. Kuis dan ujian yang telah dibuat dapat disunting
                          dan dihapus pada <Link to="/daftar-kuis">halaman Kuis
                          </Link> dan <Link to="/daftar-ujian">halaman Ujian</Link>,
                          dengan cara menekan tombol "Sunting" untuk menyunting suatu
                          kuis atau ujian dan menekan tombol "Hapus" untuk menghapus suatu
                          kuis atau ujian. Penyuntingan dan penghapusan suatu kuis dan ujian juga
                          dapat dilakukan dengan membuka halaman masing-masing kuis atau ujian,
                          baru menyunting ataupun menghapus kuis atau ujian tersebut.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Siapa saja yang dapat menyunting dan menghapus
                            suatu kuis dan ujian?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Suatu kuis dan ujian hanya dapat disunting dan dihapus
                          oleh guru yang membuat kuis dan ujian tersebut.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>Bagaimana cara menambahkan soal baru?</b>
                        </Typography>
                        <Typography>
                          Pada bagian bawah halaman kuis atau ujian yang bersangkutan
                          terdapat 4 buah tombol "Tambah Soal" untuk masing-masing jenis soal.
                          Tambahkan soal sesuai keinginan.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Jenis soal apa saja yang di nilai secara otomatis?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Jenis soal pilihan ganda, kotak centang, dan isilah
                          dinilai secara otomatis. Sedangkan untuk jenis soal
                          uraian harus diperiksa secara manual.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana sistem penilaian soal jenis pilihan ganda?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Setiap soal yang dijawab benar, murid akan mendapatkan poin
                          sebesar bobot untuk soal pilihan ganda tersebut.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana sistem penilaian soal jenis kotak
                            centang?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Untuk setiap pilihan yang di jawab benar, murid
                          mendapat +1 poin per jumlah pilihan yang benar.
                          Untuk setiap pilihan yang di jawab salah, murid
                          mendapatkan penailti -2 poin per jumlah pilihan yang
                          benar. Untuk pilihan yang seharusnya benar namun
                          dikosongkan, murid tidak mendapatkan poin (0 poin).
                          Kemudian poin tersebut dijumlahkan dan dikalikan
                          dengan nilai bobot 1 soal untuk soal jenis kotak
                          centang. <br />
                          <b>Contoh:</b> Terdapat suatu soal dengan 5 pilihan yaitu
                          A, B, C, D, dan E, dimana 4 pilihannya benar yaitu
                          A, B, C, dan D. Asumsi soal tersebut memiliki bobot
                          5 poin per soalnya. Murid menjawab A, B, C, dan E
                          sebagai pilihan yang benar. <br />
                          Karena terdapat 3 pilihan yang benar dijawab yaitu
                          A, B, dan C, maka murid mendapatkan 3 poin. Pilihan
                          D yang dikosongkan tidak memberikan poin apa-apa (0
                          poin). Pilihan E yang seharusnya tidak dijawab namun
                          dijawab memberikan penalti sebesar -2 poin. Kemudian
                          poin-poin ini ditotalkan menjadi 1 poin dibagi
                          dengan jumlah pilihan yang benar yaitu 4 pilihan,
                          menjadi 0,25. Kemudian nilai ini dikallikan bobot
                          soal tersebut yaitu 5, menghasilkan 1,25. <br />
                          Kesimpulan, murid mendapatkan 1,25 poin dari 5 poin.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana sistem penilaian soal jenis isian pendek?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Untuk setiap isian pendek yang dijawab benar, murid akan
                          mendapatkan poin sebesar jumlah isian yang benar dibagi dengan
                          jumlah isian dikalikan bobot untuk soal isian pendek tersebut.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Bagaimana sistem penilaian soal jenis uraian?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Penilaian soal jenis uraian dilakukan secara objektif
                          oleh Guru yang bersangkutan.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>Apakah suatu soal dapat dilampirkan gambar?</b>
                        </Typography>
                        <Typography align="justify">
                          Iya. Suatu soal dapat dilampirkan gambar dengan
                          menekan tombol "Tambahkan Gambar" pada bagian kanan
                          sebuah soal.
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : user.role === "Admin" ? (
                    <Grid item>
                      <Typography variant="h6" align="justify" gutterBottom>
                        <b>
                          Apakah akun pengelola memiliki wewenang akan
                          kuis dan ujian yang telah dibuat?
                        </b>
                      </Typography>
                      <Typography align="justify">
                        Tidak. Akun pengelola tidak memiliki wewenang akan
                        kuis dan ujian apapun. Suatu kuis dan ujian hanya dapat diubah
                        oleh guru yang membuat kuis dan ujian tersebut.
                      </Typography>
                    </Grid>
                  ) : (
                    <Grid item>
                      <Typography color="textSecondary">
                        Silahkan masuk untuk mendapatkan bantuan lebih lanjut mengenai topik ini.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item>
            <ExpansionPanel variant="outlined" defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5" align="justify" color="primary">
                  Rapor
                </Typography>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Typography variant="h6" align="justify" gutterBottom>
                      <b>Apa itu rapor?</b>
                    </Typography>
                    <Typography align="justify">
                      Rapor adalah rangkuman dari nilai-nilai tugas, kuis, dan
                      ujian yang telah diperiksa.
                    </Typography>
                  </Grid>
                  {user.role === "Student" ? (
                    null
                  ) : user.role === "Teacher" ? (
                    <Grid item container spacing={4}>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah guru dapat melihat rapor mata pelajaran di
                            luar subjek ajarnya?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Tidak. Guru hanya bisa melihat rapor dari mata
                          pelajaran yang diajarnya saja.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="justify" gutterBottom>
                          <b>
                            Apakah guru dengan peran wali kelas dapat melihat
                            nilai semua mata pelajaran dari murid pada
                            kelasnya?
                          </b>
                        </Typography>
                        <Typography align="justify">
                          Iya. Guru dengan peran wali kelas dapat melihat
                          semua nilai mata pelajaran dari murid pada kelasnya.
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : user.role === "Admin" ? null : (
                    <Grid item>
                      <Typography color="textSecondary">
                        Silahkan masuk untuk mendapatkan bantuan lebih lanjut mengenai topik ini.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </Grid>
      </div>
      <div className={classes.moreHelp}>
        <Paper variant="outlined" className={classes.moreHelpContainer}>
          <Typography variant="h4" align="center">
            Butuh bantuan lebih lanjut?
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Silahkan coba opsi bantuan berikut.
          </Typography>
          <Paper elevation={2} component="a" href="mailto:schoolysystem@gmail.com" style={{ padding: "16px" }}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar className={classes.contactSupportIcon}>
                  <ContactSupportIcon fontSize="small" />
                </Avatar>
              </Grid>
              <Grid item>
                <Typography align="left">
                  <b>Hubungi Kami</b>
                </Typography>
                <Typography color="textSecondary">
                  Beritahu kami lebih lanjut tentang masalah Anda
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Paper>
      </div>
    </div>
  );
}

Help.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Help);
