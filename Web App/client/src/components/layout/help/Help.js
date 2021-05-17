import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import helpTopics from "./HelpTopics.png";
import moreHelpBackground from "./MoreHelpBackground.png";
import {
  Avatar,
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Hidden,
  Paper,
  Typography,
} from "@material-ui/core";
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
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    padding: "10px",
    height: "500px",
    color: "white",
    backgroundImage: `url(${helpTopics})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  content: {
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    margin: "auto",
    marginTop: "50px",
    padding: "10px",
  },
  moreHelp: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    // maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
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
      boxShadow: "1px 3px 5px 2px rgba(0, 0, 0, .2)",
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
  const { handleMarginTopValue } = props;

  useEffect(() => {
    handleMarginTopValue(0);
    return () => {
      handleMarginTopValue(20);
    }; // dirun pas komponennya diunmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  document.title = "Schooly | Bantuan";
  document.body.style = "background: #FFFFFF";

  return (
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
        <div style={{ marginBottom: "100px" }}>
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
                        <b>
                          Bagaimana cara untuk melengkapi keterangan profil atau
                          mengubah keterangan profil?
                        </b>
                      </Typography>
                      <Typography>
                        Keterangan akun dapat diubah dengan menekan tombol
                        "Sunting Profil" pada halaman profil, yang dapat diakses
                        dengan menekan foto profil pada bagian kanan atas
                        aplikasi.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Bagaimana cara mengubah foto akun?</b>
                      </Typography>
                      <Typography>
                        Foto akun dapat diubah dengan menekan tombol dengan
                        gambar "Kamera" pada halaman profil, yang dapat diakses
                        dengan menekan foto profil pada bagian kanan atas
                        aplikasi.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Bagaimana cara mengubah kata sandi?</b>
                      </Typography>
                      <Typography>
                        Kata sandi dapat diubah dengan menekan tombol "Ganti
                        Kata Sandi" pada halaman profil, yang dapat diakses
                        dengan menekan foto profil pada bagian kanan atas
                        aplikasi.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>
                          Bagaimana cara untuk meregistrasi suatu akun Schooly?
                        </b>
                      </Typography>
                      <Typography>
                        Silahkan hubungi pengelola Schooly pada sekolah Anda
                        untuk memberikan tautan untuk registrasi akun Anda
                        sesuai dengan kebutuhan Anda (Guru atau Murid).
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>
                          Apa yang perlu dilakukan jika saya lupa email akun
                          saya?
                        </b>
                      </Typography>
                      <Typography>
                        Silahkan hubungi pengelola Schooly pada sekolah Anda
                        untuk mendapatkan email akun Anda.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>
                          Apa yang perlu dilakukan jika saya lupa kata sandi
                          akun saya?
                        </b>
                      </Typography>
                      <Typography>
                        Masuk ke halaman masuk schooly. Pada bagian bawah
                        formulir masuk, tekan tautan "Lupa Kata Sandi" yang akan
                        mengarah kepada halaman untuk mengganti kata sandi. Pada
                        halaman tersebut, masukkan alamat email akun Anda,
                        kemudian sistem akan mengirimkan pesan yang hanya
                        berlaku selama 5 menit jika tidak diklik kepada alamat
                        email yang bersangkutan untuk mengganti kata sandi Anda.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>
                          Apa yang perlu dilakukan jika saya akun saya belum
                          aktif?
                        </b>
                      </Typography>
                      <Typography>
                        Hubungi pengelola sekolah Anda untuk mengaktifkan akun
                        Anda.
                      </Typography>
                    </Grid>
                    {user.role === "Admin" ? (
                      <Grid item>
                        <Typography variant="h6" gutterBottom>
                          <b>
                            Apakah yang perlu dilakukan untuk mempersiapkan
                            penggunaan Schooly dalam suatu sekolah?
                          </b>
                        </Typography>
                        <Typography>
                          <ol>
                            <li>Masuk dengan akun pengelola sekolah Anda.</li>
                            <li>
                              Ajak guru-guru dan murid-murid di sekolah Anda
                              untuk mendaftar ke Schooly, kemudian aktifkan
                              akun-akun tersebut di halaman "Pengguna Tertunda",
                              yang dapat ditemukan pada bagian kiri aplikasi
                              (Anda akan diarahkan ke suatu halaman yang berisi
                              daftar pengguna yang mendaftar). Kemudian klik
                              tombol "Aktifkan" untuk mengaktifkan suatu akun
                              atau tombol "Hapus" untuk menghapus suatu akun.
                            </li>
                            <li>
                              Buat semua kelas yang Anda butuhkan pada halaman
                              "Kelas", yang dapat ditemukan pada bagian kiri
                              aplikasi (Anda akan diarahkan ke suatu halaman
                              yang berisi daftar kelas Anda), kemudian klik
                              tombol "Buat Kelas".
                            </li>
                            <li>
                              Setelah Anda membuat semua kelas yang Anda
                              butuhkan, kelompokkan murid-murid dan berikan
                              peran wali kelas kepada guru-guru yang ada
                              inginkan. Tombol-tombol tersebut dapat ditemukan
                              di halaman "Kelas", di samping kanan tombol "Buat
                              Kelas".
                            </li>
                            <li>
                              Lakukan penyuntingan kelas untuk memberikan peran
                              murid seperti Ketua Kelas, Sekretaris, dan
                              Bendahara. (Dapat dilakukan juga oleh wali kelas
                              masing-masing).
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                    ) : user.role === "Teacher" ||
                      user.role === "Student" ? null : (
                      <Grid item>
                        <Typography align="center" color="primary">
                          <b>
                            Silahkan masuk ke akun Schooly Anda untuk
                            mendapatkan bantuan lebih lanjut mengenai topik ini.
                          </b>
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
                        Sama seperti pengertian kelas secara harafiah, di
                        Schooly suatu kelas berarti kelompok belajar yang
                        terdiri atas pelajar dan pengajar. Suatu kelas dapat
                        dibuat oleh akun pengelola pada suatu lingkup sekolah.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa saja isi suatu kelas?</b>
                      </Typography>
                      <Typography>
                        Suatu kelas terdiri dari pekerjaan kelas, mata
                        pelajaran, murid (pelajar), dan guru (pengajar).
                      </Typography>
                    </Grid>
                    {user.role === "Student" ? (
                      <Grid item container spacing={4}>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>Apa isi dari pekerjaan kelas?</b>
                          </Typography>
                          <Typography>
                            Pekerjaan kelas berisi materi, tugas, kuis, dan
                            ujian yang diberikan oleh guru pada kelas tersebut.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>Apa isi dari mata pelajaran?</b>
                          </Typography>
                          <Typography>
                            Di Schooly, Mata pelajaran berisi materi, tugas,
                            kuis, dan ujian dari mata pelajaran tersebut yang
                            diberikan dalam suatu kelas dan diurutkan sesuai
                            waktu tugas tersebut diberikan.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Apakah mata pelajaran secara spesifik dapat
                              dilihat?
                            </b>
                          </Typography>
                          <Typography>
                            Dapat. Mata pelajaran secara spesifik dapat dilihat
                            dengan membuka panel mata pelajaran dalam suatu
                            kelas dan menekan tombol "Lihat Mata Pelajaran".
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : user.role === "Teacher" ? (
                      <Grid item>
                        <Typography variant="h6" gutterBottom>
                          <b>
                            Apakah guru dapat melihat kelas-kelas yang ada pada
                            lingkup sekolahnya?
                          </b>
                        </Typography>
                        <Typography>
                          Dapat. Guru dapat melihat kelas yang ada dengan
                          menekan tombol "Kelas" yang dapat ditemukan pada
                          bagian kiri aplikasi.
                        </Typography>
                      </Grid>
                    ) : user.role === "Admin" ? (
                      <Grid item container spacing={4}>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Apakah keterangan suatu kelas dapat disunting atau
                              dihapus?
                            </b>
                          </Typography>
                          <Typography>
                            Dapat. Masing-masing kelas yang telah dibuat dapat
                            disunting dan dihapus pada halaman daftar kelas yang
                            dapat ditemukan pada dengan menekan tombol "Kelas"
                            pada bagian kiri aplikasi.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Apakah wali kelas dan murid-murid yang ada pada
                              suatu kelas dapat diatur?
                            </b>
                          </Typography>
                          <Typography>
                            Dapat. Murid-murid yang ada pada suatu kelas dapat
                            diatur dengan menekan tombol "Atur Kelas Murid",
                            sedangkan wali kelas yang ada dapat diatur dengan
                            menekan tombol "Atur Wali Kelas". Kedua tombol
                            tersebut dapat ditemukan di samping tombol "Buat
                            Kelas".
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Bagaimana mekanisme sistem pergantian alokasi
                              murid antar kelas?
                            </b>
                          </Typography>
                          <Typography>
                            <ol>
                              <li>
                                Buka halaman daftar kelas dengan menekan tombol
                                “Kelas” yang dapat ditemukan pada bagian kiri
                                aplikasi.
                              </li>
                              <li>Tekan tombol “Atur Kelas Murid”.</li>
                              <li>
                                Pilih opsi “Export Data Kelas” untuk mengunduh
                                file data kelas dalam format comma-separated
                                values (CSV). Untuk memudahkan pembacaan dan
                                pengubahan isi file, kami menyarankan Anda
                                menggunakan aplikasi spreadsheet yang dapat
                                menampilkan isi file CSV dalam bentuk tabular.
                              </li>
                              <li>Buka file data kelas yang telah diunduh.</li>
                              <li>
                                Baris pertama file data kelas berisi semua nama
                                kelas, sedangkan baris dua dan seterusnya berisi
                                username email murid. Username email milik murid
                                yang ditempatkan pada suatu kelas akan berada
                                pada kolom kelas tersebut, sedangkan username
                                email murid yang belum ditempatkan ke kelas
                                manapun akan berada pada kolom “belum
                                ditempatkan”. Untuk memindahkan murid, pindahkan
                                username email setiap murid yang ingin
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
                              <li>Pilih opsi “Import Data Kelas”.</li>
                              <li>
                                Pada kotak dialog yang terbuka, pilih file data
                                kelas dari langkah sebelumnya, lalu tekan tombol
                                “Open”.
                              </li>
                            </ol>
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid item>
                        <Typography align="center" color="primary">
                          <b>
                            Silahkan masuk ke akun Schooly Anda untuk
                            mendapatkan bantuan lebih lanjut mengenai topik ini.
                          </b>
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
                      <Typography variant="h6" gutterBottom>
                        <b>Apa itu pengumuman?</b>
                      </Typography>
                      <Typography>
                        Pengumuman adalah informasi berupa teks yang disebarkan
                        oleh pengelola kepada guru dan/atau murid, guru kepada
                        murid, atau ketua kelas kepada murid-murid yang di
                        kelasnya sendiri. File dapat dilampirkan pada suatu
                        pengumuman.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa saja isi suatu pengumuman?</b>
                      </Typography>
                      <Typography>
                        Suatu pengumuman terdiri dari judul pengumuman,
                        deskripsi pengumuman, pemberi pengumuman, dan lampiran
                        berkas.
                      </Typography>
                    </Grid>
                    {user.role === "Student" ? (
                      <Grid item>
                        <Typography variant="h6" gutterBottom>
                          <b>Apakah seorang murid dapat membuat pengumuman?</b>
                        </Typography>
                        <Typography>
                          Hanya murid yang memiliki peran "Ketua Kelas" yang
                          dapat membuat pengumuman dan pengumuman yang dibuat
                          oleh ketua kelas hanya dapat disebarkan kepada
                          kelasnya sendiri.
                        </Typography>
                      </Grid>
                    ) : user.role === "Teacher" ? (
                      <Grid item container spacing={4}>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Bagaimana cara untuk membuat suatu pengumuman?
                            </b>
                          </Typography>
                          <Typography>
                            <ol>
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
                            </ol>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Apakah pengumuman yang dibuat dapat disunting atau
                              dihapus?
                            </b>
                          </Typography>
                          <Typography>
                            Dapat. Pengumuman yang telah dibuat dapat disunting
                            atau dihapus pada halaman daftar pengumuman, dengan
                            cara menekan tombol "Hapus" untuk menghapus suatu
                            pengumuman atau menekan tombol "Sunting" untuk
                            menyunting suatu pengumuman. Atau dengan menekan
                            tombol "Lihat Lebih Lanjut" untuk melihat hasil
                            pengumuman yang telah dibuat, kemudian pada bagian
                            bawah halaman tersebut tekan tombol "Hapus" untuk
                            menghapus pengumuman tersebut atau tekan tombol
                            "Sunting" untuk menyunting pengumuman tersebut.
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : user.role === "Admin" ? (
                      <Grid item>
                        <Typography variant="h6" gutterBottom>
                          <b>Bagaimana cara untuk membuat suatu pengumuman?</b>
                        </Typography>
                        <Typography>
                          <ol>
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
                    ) : (
                      <Grid item>
                        <Typography align="center" color="primary">
                          <b>
                            Silahkan masuk ke akun Schooly Anda untuk
                            mendapatkan bantuan lebih lanjut mengenai topik ini.
                          </b>
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
                      <Typography variant="h6" gutterBottom>
                        <b>Apa itu Materi?</b>
                      </Typography>
                      <Typography>
                        Materi adalah bahan pembelajaran yang diberikan oleh
                        guru kepada murid. Materi yang diberikan harus disertai
                        lampiran berkas.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa saja isi suatu materi?</b>
                      </Typography>
                      <Typography>
                        Suatu materi terdiri dari judul materi, deskripsi
                        materi, mata pelajaran, dan lampiran berkas.
                      </Typography>
                    </Grid>
                    {user.role === "Student" ? null : user.role ===
                      "Teacher" ? (
                      <Grid item container spacing={4}>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>Bagaimana cara untuk membuat suatu materi?</b>
                          </Typography>
                          <Typography>
                            <ol>
                              <li>
                                Buka halaman daftar materi dengan menekan tombol
                                "Materi" yang dapat ditemukan pada bagian kiri
                                aplikasi.
                              </li>
                              <li>
                                Klik tombol "Buat Materi" untuk membuat materi.
                              </li>
                              <li>
                                Lengkapi materi dengan keterangan seperti
                                deskripsi, mata pelajaran, dan lampiran berkas.
                              </li>
                            </ol>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Apakah materi yang dibuat dapat disunting atau
                              dihapus?
                            </b>
                          </Typography>
                          <Typography>
                            Dapat. Materi yang telah dibuat dapat disunting atau
                            dihapus pada halaman daftar materi, dengan cara
                            menekan tombol "Hapus" untuk menghapus suatu
                            pengumuman atau menekan tombol "Sunting" untuk
                            menyunting suatu materi. Atau dengan menekan tombol
                            "Lihat Lebih Lanjut" untuk melihat hasil materi yang
                            telah dibuat, kemudian pada bagian bawah halaman
                            tersebut tekan tombol "Hapus" untuk menghapus materi
                            tersebut atau tekan tombol "Sunting" untuk
                            menyunting materi tersebut.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Siapa saja yang dapat menyunting atau menghapus
                              suatu materi?
                            </b>
                          </Typography>
                          <Typography>
                            Suatu materi hanya dapat disunting atau dihapus oleh
                            guru yang membuat materi tersebut.
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : user.role === "Admin" ? (
                      <Grid item>
                        <Typography variant="h6" gutterBottom>
                          <b>
                            Apakah akun pengelola memiliki wewenang akan materi
                            yang telah dibuat?
                          </b>
                        </Typography>
                        <Typography>
                          Tidak, akun pengelola tidak memiliki wewenang akan
                          materi apapun. Suatu materi hanya dapat diubah oleh
                          guru yang membuat materi tersebut.
                        </Typography>
                      </Grid>
                    ) : (
                      <Grid item>
                        <Typography align="center" color="primary">
                          <b>
                            Silahkan masuk ke akun Schooly Anda untuk
                            mendapatkan bantuan lebih lanjut mengenai topik ini.
                          </b>
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
                      <Typography variant="h6" gutterBottom>
                        <b>Apa itu tugas?</b>
                      </Typography>
                      <Typography>
                        Tugas adalah suatu pekerjaan yang diberikan kepada murid
                        untuk meningkatkan pemamahan mengenai sebuah materi.
                        File dapat dilampirkan pada suatu tugas.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa saja isi suatu tugas?</b>
                      </Typography>
                      <Typography>
                        Suatu tugas terdiri dari judul tugas, deskripsi tugas,
                        lampiran berkas, dan batas waktu. Tugas yang dikumpulkan
                        adalah dalam bentuk file dengan jenis apa saja.
                      </Typography>
                    </Grid>
                    {user.role === "Student" ? (
                      <Grid item container spacing={4}>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>Bagaimana cara untuk mengumpulkan tugas?</b>
                          </Typography>
                          <Typography>
                            <ol>
                              <li>
                                Tekan tombol "Pilih File" pada halaman tugas
                                yang bersangkutan.
                              </li>
                              <li>
                                Pilih file-file yang ingin Anda kumpulkan.{" "}
                                <br />
                                Tips: Tahan tombol "CTRL" dan menekan klik kiri
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
                                pada daftar di bagian hasil pekeraan.
                              </li>
                            </ol>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Apakah file yang sudah dikumpulkan dapat diunduh
                              atau diganti?
                            </b>
                          </Typography>
                          <Typography>
                            Dapat. File yang sudah dikumpulkan dapat diunduh
                            dengan menekan tombol unduh pada file tersebut dan
                            dapat dihapus dengan menekan tombol hapus pada file
                            tersebut. Perlu diperhatikan apabila suatu file yang
                            diunggah setelah batas waktu terlewati akan dianggap
                            sebagai telat.
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : user.role === "Teacher" ? (
                      <Grid item container spacing={4}>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>Bagaimana cara untuk membuat suatu tugas?</b>
                          </Typography>
                          <Typography>
                            <ol>
                              <li>
                                Buka halaman daftar tugas dengan menekan tombol
                                "Tugas" yang dapat ditemukan pada bagian kiri
                                aplikasi.
                              </li>
                              <li>
                                Klik tombol "Buat Tugas" untuk membuat tugas.
                              </li>
                              <li>
                                Lengkapi tugas dengan keterangan seperti
                                deskripsi, batas waktu, dan lampiran berkas.
                              </li>
                            </ol>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Apakah tugas yang dibuat dapat disunting atau
                              dihapus?
                            </b>
                          </Typography>
                          <Typography>
                            Dapat. Tugas yang telah dibuat dapat disunting atau
                            dihapus pada halaman daftar tugas, dengan cara
                            menekan tombol "Hapus" untuk menghapus suatu tugas
                            atau menekan tombol "Sunting" untuk menyunting suatu
                            tugas. Atau dengan menekan tombol "Lihat Lebih
                            Lanjut" untuk melihat hasil tugas yang telah dibuat,
                            kemudian pada bagian bawah halaman tersebut tekan
                            tombol "Hapus" untuk menghapus tugas tersebut atau
                            tekan tombol "Sunting" untuk menyunting tugas
                            tersebut.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Siapa saja yang dapat menyunting atau menghapus
                              suatu tugas?
                            </b>
                          </Typography>
                          <Typography>
                            Suatu tugas hanya dapat disunting atau dihapus oleh
                            guru yang membuat tugas tersebut.
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : user.role === "Admin" ? (
                      <Grid item>
                        <Typography variant="h6" gutterBottom>
                          <b>
                            Apakah akun pengelola memiliki wewenang akan tugas
                            yang telah dibuat?
                          </b>
                        </Typography>
                        <Typography>
                          Tidak, akun pengelola tidak memiliki wewenang akan
                          tugas apapun. Suatu tugas hanya dapat diubah oleh guru
                          yang membuat tugas tersebut.
                        </Typography>
                      </Grid>
                    ) : (
                      <Grid item>
                        <Typography align="center" color="primary">
                          <b>
                            Silahkan masuk ke akun Schooly Anda untuk
                            mendapatkan bantuan lebih lanjut mengenai topik ini.
                          </b>
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
                    Kuis/Ujian
                  </Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa itu kuis/ujian?</b>
                      </Typography>
                      <Typography>
                        Kuis/Ujian adalah evaluasi berkala terhadap pemahaman
                        murid terhadap pembelajaran yang telah diajarkan. Pada
                        Schooly, tersedia 4 jenis soal pada fitur kuis/ujian ini
                        yaitu pilihan ganda, kotak centang, isilah, dan uraian.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa saja isi suatu kuis/ujian?</b>
                      </Typography>
                      <Typography>
                        Suatu tugas terdiri dari judul kuis/ujian, deskripsi
                        kuis/ujian, mata pelajaran, waktu mulai pengerjaan,
                        waktu selesai pengerjaan, serta soal-soal yang ada pada
                        kuis/ujian tersebut.
                      </Typography>
                    </Grid>
                    {user.role === "Student" ? (
                      <Grid item container spacing={4}>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Bagaimana cara untuk mengerjakan suatu kuis/ujian?
                            </b>
                          </Typography>
                          <Typography>
                            <ol>
                              <li>
                                Lihat waktu mulai pengerjaan dari kuis/ujian
                                yang bersangkutan.
                              </li>
                              <li>
                                Beberapa waktu sebelum mulai, guru pemberi
                                kuis/ujian tersebut akan memberikan file untuk
                                membuka kuis/ujian tersebut.
                              </li>
                              <li>
                                Kerjakan kuis/ujian sesuai dengan waktu yang
                                diberikan.
                              </li>
                            </ol>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Apakah ujian yang sudah dikumpulkan dapat diubah?
                            </b>
                          </Typography>
                          <Typography>
                            Tidak. Ujian yang sudah dikumpulkan tidak akan bisa
                            diubah kembali, pastikan Anda sudah yakin akan
                            jawaban Anda ketika mengumpulkan ujian.
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : user.role === "Teacher" ? (
                      <Grid item container spacing={4}>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Bagaimana cara untuk membuat suatu kuis/ujian?
                            </b>
                          </Typography>
                          <Typography>
                            <ol>
                              <li>
                                Buka halaman daftar kuis atau daftar ujian
                                dengan menekan tombol "Kuis" atau tombol "Ujian"
                                yang dapat ditemukan pada bagian kiri aplikasi.
                              </li>
                              <li>
                                Klik tombol "Buat Kuis/Ujian" untuk membuat
                                kuis/ujian.
                              </li>
                              <li>
                                Lengkapi kuis/ujian dengan keterangan seperti
                                deskripsi, mata pelajaran, waktu mulai
                                pengerjaan, dan waktu selesai pengerjaan.
                              </li>
                              <li>
                                Pilih tipe penilaian apakah sebagai kuis atau
                                ujian.
                              </li>
                              <li>
                                Buat soal yang Anda inginkan sesuai dengan jenis
                                soal yang tersedia.
                              </li>
                            </ol>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Apakah kuis/ujian yang dibuat dapat disunting atau
                              dihapus?
                            </b>
                          </Typography>
                          <Typography>
                            Dapat. Kuis/ujian yang telah dibuat dapat disunting
                            atau dihapus pada halaman daftar kuis atau daftar
                            ujian, dengan cara menekan tombol "Hapus" untuk
                            menghapus suatu kuis/ujian atau menekan tombol
                            "Sunting" untuk menyunting suatu kuis/ujian. Atau
                            dengan menekan tombol "Lihat Lebih Lanjut" untuk
                            melihat hasil kuis/ujian yang telah dibuat, kemudian
                            pada bagian bawah halaman tersebut tekan tombol
                            "Hapus" untuk menghapus kuis/ujian tersebut atau
                            tekan tombol "Sunting" untuk menyunting kuis/ujian
                            tersebut.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Siapa saja yang dapat menyunting atau menghapus
                              suatu kuis/ujian?
                            </b>
                          </Typography>
                          <Typography>
                            Suatu kuis/ujian hanya dapat disunting atau dihapus
                            oleh guru yang membuat kuis/ujian tersebut.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>Bagaimana cara menambahkan soal baru?</b>
                          </Typography>
                          <Typography>
                            Pada halaman paling bawah "Buat Kuis/Ujian" atau
                            "Sunting Kuis/Ujian" terdapat 4 buah tombol "Tambah
                            Soal" untuk masing-masing jenis soal. Tambahkan soal
                            sesuai keinginan.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Jenis soal apa saja yang di nilai secara otomatis?
                            </b>
                          </Typography>
                          <Typography>
                            Jenis soal pilihan ganda, kotak centang, dan isilah
                            dinilai secara otomatis. Sedangkan untuk jenis soal
                            uraian harus diperiksa secara manual.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Bagaimana sistem penilaian soal jenis kotak
                              centang?
                            </b>
                          </Typography>
                          <Typography>
                            Untuk setiap pilihan yang di jawab benar, murid
                            mendapat +1 poin per jumlah pilihan yang benar.
                            Untuk setiap pilihan yang di jawab salah, murid
                            mendapatkan penailti -2 poin per jumlah pilihan yang
                            benar. Untuk pilihan yang seharusnya benar namun
                            dikosongkan, murid tidak mendapatkan poin (0 poin).
                            Kemudian poin tersebut dijumlahkan dan dikalikan
                            dengan nilai bobot 1 soal untuk soal jenis kotak
                            centang. <br />
                            Contoh: Terdapat suatu soal dengan 5 pilihan yaitu
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
                            menjadi 1/4. Kemudian nilai ini dikallikan bobot
                            soal tersebut yaitu 5, menghasilkan 1.25. <br />
                            Kesimpulan, murid mendapatkan 1.25 poin dari 5 poin.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>Apakah suatu soal dapat dilampirkan gambar?</b>
                          </Typography>
                          <Typography>
                            Dapat. Suatu soal dapat dilampirkan gambar dengan
                            menekan tombol "Tambahkan Gambar" pada bagian kanan
                            soal.
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : user.role === "Admin" ? (
                      <Grid item>
                        <Typography variant="h6" gutterBottom>
                          <b>
                            Apakah akun pengelola memiliki wewenang akan
                            kuis/ujian yang telah dibuat?
                          </b>
                        </Typography>
                        <Typography>
                          Tidak, akun pengelola tidak memiliki wewenang akan
                          kuis/ujian apapun. Suatu kuis/ujian hanya dapat diubah
                          oleh guru yang membuat kuis/ujian tersebut.
                        </Typography>
                      </Grid>
                    ) : (
                      <Grid item>
                        <Typography align="center" color="primary">
                          <b>
                            Silahkan masuk ke akun Schooly Anda untuk
                            mendapatkan bantuan lebih lanjut mengenai topik ini.
                          </b>
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
                    Rapor
                  </Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        <b>Apa itu rapor?</b>
                      </Typography>
                      <Typography>
                        Rapor adalah rangkuman dari nilai-nilai tugas, kuis, dan
                        ujian yang telah diperiksa.
                      </Typography>
                    </Grid>
                    {user.role === "Student" ? (
                      <Grid item>
                        <Typography variant="h6" gutterBottom>
                          <b>Bagaimana cara untuk melihat rapor?</b>
                        </Typography>
                        <Typography>
                          <ol>
                            <li>
                              Buka halaman profil Anda, dengan menekan tombol
                              foto anda pada bagian kanan atas aplikasi dan
                              tekan tombol "Profil Saya".
                            </li>
                            <li>
                              Tekan tombol "Lihat Rapor" untuk melihat rapor.
                            </li>
                          </ol>
                        </Typography>
                      </Grid>
                    ) : user.role === "Teacher" ? (
                      <Grid item container spacing={4}>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Apakah guru dapat melihat rapor mata pelajaran di
                              luar subjek ajarnya?
                            </b>
                          </Typography>
                          <Typography>
                            Tidak. Guru hanya bisa melihat rapor dari mata
                            pelajaran yang diajarnya saja.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" gutterBottom>
                            <b>
                              Apakah guru dengan peran wali kelas dapat melihat
                              nilai semua mata pelajaran dari murid pada
                              kelasnya?
                            </b>
                          </Typography>
                          <Typography>
                            Dapat. Guru dengan peran wali kelas dapat melihat
                            semua nilai mata pelajaran dari murid pada kelasnya.
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : user.role === "Admin" ? null : (
                      <Grid item>
                        <Typography align="center" color="primary">
                          <b>
                            Silahkan masuk ke akun Schooly Anda untuk
                            mendapatkan bantuan lebih lanjut mengenai topik ini.
                          </b>
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
          <Typography variant="h4" gutterBottom>
            Ada yang bisa kami bantu?
          </Typography>
          <Typography variant="h6">
            Masih belum menemukan solusi dari permasalahan Anda? Silahkan
            hubungi kami!
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
                button
                component="a"
                className={classes.paperIcon}
                href="mailto:schoolysystem@gmail.com"
                style={{ marginRight: "50px" }}
              >
                <Avatar className={classes.iconAvatar}>
                  <EmailIcon className={classes.mailIcon} />
                </Avatar>
                <Typography variant="caption">
                  schoolysystem@gmail.com
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
                href="https://instagram.com/schoolysystem"
              >
                schoolysystem
              </Button>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Paper
                variant="outlined"
                button
                component="a"
                className={classes.paperIcon}
                href="https://instagram.com/schoolysystem"
              >
                <Avatar className={classes.iconAvatar}>
                  <InstagramIcon className={classes.instagramIcon} />
                </Avatar>
                <Typography variant="caption">
                  schoolysystem
                </Typography>
              </Paper>
            </Hidden>
          </Grid>
        </Grid>
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
