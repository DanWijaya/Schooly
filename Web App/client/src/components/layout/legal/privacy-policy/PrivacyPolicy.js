import React from "react";
import { Link } from "react-router-dom";
import privacyPolicyArt from "./PrivacyPolicyArt.png";
import ScrollToTopButton from "../../../misc/scroll-to-top/ScrollToTopButton";
import { Divider, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    padding: "20px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  privacyPolicyTitle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  privacyPolicyArt: {
    maxHeight: "225px",
    [theme.breakpoints.down("md")]: {
      maxHeight: "200px",
    },
  },
  privacyPolicyTitleText: {
    fontSize: "13px",
  },
  content: {
    paddingTop: "75px",
  },
  contentSectionTitle: {
    marginTop: "25px",
    marginBottom: "25px",
  },
  contentSection: {
    paddingTop: "50px",
  },
  contentSubsection: {
    paddingTop: "25px",
  },
  list: {
    margin: "0px 0px 0px 40px",
    padding: "0px",
    [theme.breakpoints.down("sm")]: {
      margin: "0px 0px 0px 16px",
    },
  },
}));

function PrivacyPolicy(props) {
  const classes = useStyles();

  document.title = "Schooly | Kebijakan Privasi";

  return (
    <div className={classes.root}>
      <div className={classes.privacyPolicyTitle}>
        <img
          alt="Privacy Policy Art"
          src={privacyPolicyArt}
          className={classes.privacyPolicyArt}
        />
        <Typography variant="overline" align="center" gutterBottom className={classes.privacyPolicyTitleText}>
          Kebijakan Privasi Schooly System
        </Typography>
        <Typography>
          Berlaku efektif: 1 Januari 2020
        </Typography>
      </div>
      <div className={classes.content}>
        <Typography variant="h6" gutterBottom>
          <b>Pendahuluan</b>
        </Typography>
        <Typography align="justify" paragraph>
          Kami peduli dengan privasi. Kami percaya bahwa privasi adalah hak dasar
          bagi semua individu. Klien kami mempercayakan kami dengan informasi
          pribadi penggunanya, yang umumnya adalah pelajar. Demi keamanan bersama,
          Kami menganggap perihal mengenai privasi ini dengan sangat serius.
        </Typography>
        <Typography align="justify" paragraph>
          Model bisnis kami berbeda dengan perusahaan yang mengumpulkan informasi
          pribadi Anda untuk memonetisasi data tersebut. Kami mengumpulkan dan
          menggunakan informasi pribadi untuk memungkinkan kami menyediakan
          produk dan layanan kami kepada klien dan pengguna kami.
          Pada kasus umum, kami melakukan ini atas arahan klien kami.
          Kami tidak dan tidak akan menjual atau menyewakan data Anda kepada
          pihak ketiga kecuali jika diperlukan dalam konteks perubahan struktur
          bisnis kami seperti merger atau akuisisi.
          Lihat <a href="#vendor-mitra-dan-jenis-pengungkapan-lainnya">Vendor, mitra dan jenis
          pengungkapan lainnya</a> untuk perincian lebih lanjut tentang bagaimana
          kami dapat mengungkapkan informasi pribadi dalam kasus perubahan
          struktur bisnis kami.
        </Typography>
        <Typography align="justify" paragraph>
          Saat kami merujuk pada “kami”, “milik kami”, atau “Schooly” dalam
          Kebijakan ini, yang kami maksud adalah Schooly System dan afiliasinya.
          Kebijakan ini mengatur semua layanan kami yang kami berikan langsung
          kepada Anda. Baik Anda menjelajahi situs web kami, menerima buletin
          kami, atau menggunakan produk kami.
        </Typography>
        <Typography align="justify" paragraph>
          Jika Anda adalah pengguna dari klien kami dan kami menyediakan produk
          dan layanan kami kepada Anda atas nama klien kami (institusi Anda),
          kami dianggap sebagai "pengolah data". Dalam hal ini, kebijakan
          privasi institusi Anda mengatur penggunaan data pribadi. Pada kasus ini
          kebijakan privasi institusi Anda mengatur penggunaan informasi pribadi.
          Kebijakan Privasi kami tidak menggantikan ketentuan perjanjian apa pun
          antara kami dan institusi Anda (atau klien lain atau pihak ketiga mana pun),
          juga tidak memengaruhi ketentuan perjanjian apa pun antara Anda
          dan institusi Anda.
        </Typography>
        <Typography align="justify" paragraph>
          Dari waktu ke waktu, kami perlu memperbarui Kebijakan ini untuk
          mencerminkan perubahan pada produk dan layanan kami, cara kami beroperasi,
          atau untuk memenuhi persyaratan hukum dan peraturan baru.
          Anda akan menemukan versi terbaru Kebijakan ini di <a href="http://www.schoolysystem.com/legal/kebijakan-privasi">
          halaman ini</a>.
        </Typography>
        <div id="back-to-top-anchor" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Daftar Isi</b>
          </Typography>
          <List>
            <ListItem button component="a" href="#bagaimana-informasi-anda-digunakan">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Bagaimana Informasi Anda Digunakan" />
            </ListItem>
            <Divider variant="middle" />
            <ListItem button component="a" href="#vendor-mitra-dan-jenis-pengungkapan-lainnya">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Vendor, Mitra dan Jenis Pengungkapan Lainnya" />
            </ListItem>
            <Divider variant="middle" />
            <ListItem button component="a" href="#keterlibatan-klien-dan-pemasaran">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Keterlibatan Klien dan Pemasaran" />
            </ListItem>
            <Divider variant="middle" />
            <ListItem button component="a" href="#keamanan">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Keamanan" />
            </ListItem>
            <Divider variant="middle" />
            <ListItem button component="a" href="#hak-anda">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Hak Anda" />
            </ListItem>
            <Divider variant="middle" />
            <ListItem button component="a" href="#hubungi-kami">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Hubungi Kami" />
            </ListItem>
          </List>
        </div>
        <div id="bagaimana-informasi-anda-digunakan" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Bagaimana Informasi Anda Digunakan</b>
          </Typography>
          <Typography>
            Bagaimana kami menggunakan informasi Anda tergantung dengan hubungan Anda dengan kami.
            Pelajari lebih lanjut untuk masing-masing kasus di bawah ini:
          </Typography>
          <div className={classes.contentSubsection}>
            <Typography align="justify" paragraph>
              <u>Pengguna Individu</u>
            </Typography>
            <Typography align="justify" paragraph>
              Schooly memiliki situs web untuk layanan yang berbeda misalnya,
              halaman umum Schooly yang dapat diakses tanpa harus masuk oleh siapa saja.
              Anda biasanya dapat mengunjungi situs web kami tanpa harus masuk
              atau mengidentifikasi diri Anda sendiri. Namun sebelum menggunakan
              layanan kami, Anda perlu masuk untuk mengidetinfikasi diri Anda terlebih dahulu.
            </Typography>
            <ul className={classes.list}>
              <li style={{ listStyleType: "disc" }}>
                <Typography align="justify" paragraph>
                  Informasi yang kami kumpulkan
                  <ul className={classes.list}>
                    <li style={{ listStyleType: "circle" }}>
                      Langsung dari Anda. Situs web kami mengharuskan Anda
                      untuk mendaftar akun. Saat Anda melakukannya, kami meminta
                      informasi, seperti nama dan alamat email Anda, yang kami perlukan
                      untuk menyiapkan akun Anda. Seringkali Anda juga dapat secara
                      sukarela memberikan informasi tambahan, seperti foto atau
                      informasi biografi, untuk memanfaatkan situs web kami dengan
                      lebih baik.
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Secara tidak langsung dari Anda. Kami mengumpulkan informasi
                      tentang halaman yang Anda kunjungi dan bagaimana Anda mengakses
                      dan menggunakan situs web kami menggunakan cookie dan alat
                      analitik pihak ketiga. Informasi ini mencakup informasi tentang
                      perangkat yang Anda gunakan untuk mengakses situs web termasuk
                      pengidentifikasi perangkat unik, alamat IP, sistem operasi,
                      browser, dan cookie.
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Informasi dari pihak ketiga. Kami menerima informasi dari
                      afiliasi di grup perusahaan Schooly kami, mitra kami, dan
                      pihak ketiga lainnya yang kami gunakan untuk meningkatkan
                      kualitas penggunaan situs web dan mempromosikan produk dan
                      layanan kami.
                    </li>
                  </ul>
                </Typography>
              </li>
              <li style={{ listStyleType: "disc" }}>
                <Typography align="justify" paragraph>
                  Bagaimana kami menggunakan informasi ini
                  <ul className={classes.list}>
                    <li style={{ listStyleType: "circle" }}>
                      Analisis dan pemasaran. Kami menganalisis informasi penggunaan
                      untuk tujuan penjualan dan pemasaran dan untuk tren tentang
                      pengunjung kami dan demografi mereka dan bagaimana mereka
                      menggunakan situs web kami. Analisis ini diperlukan agar lebih
                      dapat memahami pengguna kami dan bagaimana mereka berinteraksi
                      dengan kami dan situs web kami, meningkatkan situs web kami
                      dan komunikasi dengan Anda (termasuk untuk tujuan
                      pemasaran). <a href="#keterlibatan-klien-dan-pemasaran">Pelajari lebih lanjut
                      tentang bagaimana kami menggunakan informasi pribadi untuk
                      keterlibatan dan pemasaran klien</a>.
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Personalisasi. Kami juga  menggunakan informasi Anda untuk
                      mempersonalisasi halaman yang ada untuk memberikan informasi
                      yang lebih relevan saat Anda menjelajahi situs web kami.
                      Misalnya, jika Anda telah menunjukkan ketertarikan atau
                      karir Anda, kami dapat menyajikan konten yang terkait dengan
                      hal tersebut saat Anda menjelajahi situs web kami.
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Komunikasi. Kami menggunakan kontak yang Anda berikan untuk
                      berkomunikasi dengan Anda dan memungkinkan Anda berkomunikasi
                      dengan kami dan pengguna Schooly lainnya. Kami
                      menggunakan informasi ini karena tentunya diperlukan untuk
                      menyediakan layanan ini.
                    </li>
                  </ul>
                  <Typography>
                    Kami menyimpan informasi penggunaan situs web selama diperlukan
                    untuk tujuan yang dijelaskan di atas. Jangka waktu ini akan
                    bervariasi tergantung pada layanan dan situs web yang Anda
                    gunakan dan bagaimana Anda berinteraksi dengan kami. Informasi
                    akun disimpan sampai Anda menghapus akun dan untuk jangka waktu
                    terbatas setelahnya. Jika Anda memberikan informasi dalam bentuk formulir,
                    informasi tersebut disimpan hanya selama diperlukan. Misalnya,
                    kami mungkin perlu menyimpan catatan korespondensi dengan Anda
                    jika Anda telah mengajukan keluhan selama itu diperlukan untuk
                    melindungi kami dari tuntutan hukum apa pun. Demikian pula, jika
                    Anda berhenti berlangganan dari menerima komunikasi pemasaran
                    dari kami, akan menyimpan catatan ini untuk memastikan Anda
                    tidak menerima komunikasi tersebut di masa mendatang.
                  </Typography>
                </Typography>
              </li>
              <li style={{ listStyleType: "disc" }}>
                <Typography align="justify" paragraph>
                  Dengan siapa kami membagikan informasi ini
                  <ul className={classes.list}>
                    <li style={{ listStyleType: "circle" }}>
                      Alat pihak ketiga. Saat kami menggunakan alat pihak ketiga
                      (misalnya untuk memahami bagaimana situs web kami digunakan
                      dan memastikan Anda melihat iklan dan kampanye yang relevan
                      di situs web lain), pihak ketiga ini akan memiliki akses
                      ke beberapa informasi pribadi Anda. Ini termasuk alat
                      analitik seperti Google Analytics dan alat periklanan
                      seperti Facebook Business.
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Mitra. Kami membagikan informasi pribadi yang terkait kepada
                      klien kami yang sudah ada atau calon klien kami serta
                      pengecer produk dan layanan kami dan mitra lain, yang mungkin
                      menggunakan informasi tersebut untuk pemasaran. Kami tidak
                      membagikan informasi pribadi apa pun yang kami gunakan atas
                      nama klien kami (misalnya Data murid) kecuali seperti yang
                      diinstruksikan oleh klien kami.
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Vendor. Kami juga berbagi informasi dengan vendor dan penyedia
                      layanan kami serta pihak ketiga lainnya untuk tujuan hukum atau
                      bisnis.
                    </li>
                  </ul>
                </Typography>
              </li>
            </ul>
          </div>
          <div className={classes.contentSubsection}>
            <Typography align="justify" paragraph>
              <u>Institusi</u>
            </Typography>
            <Typography align="justify" paragraph>
              Institusi Anda memutuskan bagaimana informasi pribadi Anda digunakan.
              Kami menyediakan sebagian besar produk dan layanan kami kepada pengguna
              institusi sebagai apa yang disebut "pengolah data" atas nama
              klien kami (misalnya, sekolah, distrik, universitas, dan perusahaan).
              Ini berarti bahwa tanggung jawab utama untuk kepatuhan privasi data
              terletak pada institusi Anda sebagai "pengontrol data". Ini juga berarti
              bahwa kebijakan privasi institusi Anda mengatur penggunaan
              informasi pribadi Anda (bukan milik kami). Institusi Anda menentukan
              bagaimana informasi tersebut digunakan, dan kami memproses
              informasi Anda sesuai dengan instruksi institusi Anda dan ketentuan
              kontrak kami dengan institusi Anda.
            </Typography>
            <ul className={classes.list}>
              <li style={{ listStyleType: "disc" }}>
                <Typography align="justify" paragraph>
                  Informasi yang kami kumpulkan
                  <ul className={classes.list}>
                    <li style={{ listStyleType: "circle" }}>
                      Biasanya, produk dan layanan kami terintegrasi dengan sistem
                      institusi Anda. Dengan demikian, institusi Anda akan memberi
                      kami informasi tentang Anda untuk mengatur dan memelihara akun
                      Anda atau agar kami dapat menyediakan produk atau layanan. Ini
                      termasuk informasi dalam kategori data berikut:
                      <ol className={classes.list}>
                        <li>
                          Informasi akun: Pada umumnya terdiri dari nama, alamat
                          email, ID murid, kredensial akun, dan kelas yang Anda
                          ikuti saat kami pertama kali menyiapkan produk dan layanan
                          untuk institusi Anda. Kami akan menerima informasi yang
                          diperbarui secara berkala untuk menjaga agar informasi
                          akun Anda tetap akurat dan terkini.
                        </li>
                        <li>
                          Detail kontak tambahan: Kami juga menerima nomor telepon
                          Anda untuk mengirimkan pemberitahuan teks (SMS) kepada Anda.
                        </li>
                        <li>
                          Aplikasi, pendaftaran, dan informasi bantuan keuangan:
                          Jika kami menyediakan Layanan Pelajar, seperti bantuan pendaftaran
                          dan keuangan atas nama institusi Anda, institusi Anda akan
                          menyediakan jenis informasi ini kepada kami untuk menyediakan
                          layanan ini. Kami biasanya tidak menyimpan informasi ini
                          tetapi mungkin memiliki akses ke sistem institusi Anda yang
                          menyimpan data tersebut.
                        </li>
                      </ol>
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Langsung dari Anda. Bergantung pada produk dan layanan yang Anda
                      gunakan, kami akan mengumpulkan kategori data berikut langsung dari Anda:
                      <ol className={classes.list}>
                        <li>
                          Informasi profil. Kami mengumpulkan nama lengkap
                          Anda, alamat email, dan data kontak serupa saat Anda
                          memberikan atau memperbarui informasi ini di produk kami.
                          Pada produk dan layanan umumnya, Anda dapat memilih untuk
                          memberikan lebih banyak informasi untuk profil akun Anda,
                          seperti foto Anda dan konten biografi lainnya. Kelengkapan informasi ini
                          juga membantu institusi Anda untuk memiliki informasi terbaru tentang Anda.
                          Di beberapa produk, Anda dapat memilih untuk memberikan nomor
                          telepon Anda untuk menerima pemberitahuan melalui teks (SMS).
                        </li>
                        <li>
                          Kredensial. Kami akan mengumpulkan kata sandi, petunjuk kata sandi,
                          dan informasi keamanan serupa yang kami gunakan untuk
                          otentikasi dan akses akun.
                        </li>
                        <li>
                          Konten dan aktivitas. Kami mengumpulkan data tentang tanggapan
                          Anda terhadap tugas, kuis Anda dan file yang Anda kirimkan atau
                          unggah serta aktivitas dan tindakan Anda dalam produk dan layanan kami.
                          Di beberapa produk, Anda juga dapat memberikan komentar
                          dan mengirim pesan ke rekan dan instruktur Anda. Jika Anda seorang
                          instruktur, kami juga mengumpulkan informasi tentang penilaian,
                          umpan balik dan penilaian Anda, dan tindakan serupa dalam produk kami.
                        </li>
                        <li>
                          Rekaman audio dan video. Beberapa produk kami memungkinkan Anda
                          (sebagai murid atau instruktur) untuk mengirimkan umpan
                          balik audio dan video, dan kami mengumpulkan informasi
                          terkait, termasuk metadata.
                        </li>
                        <li>
                          Informasi keuangan. Jika kami memberikan bantuan
                          keuangan atas nama institusi Anda, kami akan mengumpulkan
                          informasi keuangan yang diperlukan untuk membantu Anda
                          dengan aplikasi terkait.
                        </li>
                        <li>
                          Bantuan. Ketika Anda atau institusi Anda menghubungi
                          kami untuk mendapatkan bantuan, kami dapat mengumpulkan
                          informasi terbatas tentang Anda yang Anda atau perwakilan
                          dari institusi Anda berikan kepada kami. Kami menggunakan
                          informasi ini hanya untuk membantu kasus dukungan klien
                          atas nama institusi Anda. Saat Anda menghubungi kami,
                          percakapan telepon atau sesi obrolan Anda dengan tim dukungan
                          klien kami dapat dipantau dan direkam untuk tujuan pelatihan
                          dan kualitas.
                        </li>
                      </ol>
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Secara tidak langsung dari Anda. Kami mengumpulkan informasi
                      tentang bagaimana Anda menggunakan produk dan layanan kami.
                      Bergantung pada produk atau layanan yang Anda gunakan,
                      ini mungkin termasuk kategori data berikut:
                      <ol className={classes.list}>
                        <li>
                          Data lokasi dan acara. Untuk beberapa produk dan layanan
                          seperti kartu akses dan Kehadiran, kami akan mengumpulkan
                          informasi tentang tempat, kelas, dan acara mana yang telah
                          Anda kunjungi dan hadiri atas nama institusi Anda,
                          serta waktu dan tanggal kunjungan tersebut.
                        </li>
                        <li>
                          Perangkat dan penggunaan. Kami mengumpulkan informasi
                          perangkat dan penggunaan saat Anda mengakses dan menggunakan
                          produk dan layanan kami, termasuk informasi yang dikirimkan
                          browser atau aplikasi seluler Anda saat Anda menggunakannya.
                          Data ini dapat mencakup pengenal perangkat unik Anda, alamat
                          Protokol Internet, jenis dan konfigurasi browser Anda, serta
                          tanggal dan waktu penggunaan produk atau layanan Anda.
                        </li>
                      </ol>
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Informasi dari pihak ketiga.
                      <ol className={classes.list}>
                        <li>
                          Afiliasi dan vendor. Kami dapat menerima informasi dari
                          afiliasi di grup perusahaan Schooly kami, mitra kami,
                          dan pihak ketiga lainnya. Misalnya, kami mungkin menerima
                          informasi pribadi terbatas dari produk kami yang lain atau
                          dari layanan pihak ketiga yang mengintegrasikan atau
                          melengkapi produk kami untuk menyediakan kualitas penggunaan
                          yang lebih baik.
                        </li>
                        <li>
                          Informasi dari situs media sosial. Saat Anda berinteraksi
                          dengan produk dan layanan kami melalui layanan media sosial,
                          seperti saat Anda masuk melalui Facebook, Instagram,
                          Twitter, atau LinkedIn, kami mungkin menerima informasi dari
                          perusahaan media sosial tersebut.
                          Jika institusi Anda telah mengaktifkan Profil Cloud atau
                          Profil Sosial, Anda juga dapat menghubungkan profil Schooly
                          Anda dengan akun Facebook dan Twitter Anda dan menggunakan
                          informasi dari akun tersebut untuk profil Schooly Anda.
                          Data yang kami terima bergantung pada layanan media sosial
                          dan pengaturan privasi Anda dengan layanan media sosial.
                        </li>
                        <li>
                          Postingan media sosial. Produk Manajer Media Sosial kami
                          memungkinkan institusi untuk mengumpulkan posting dan komentar
                          media sosial publik dengan kata kunci dan tagar yang cocok
                          untuk memberikan visibilitas institusi ke dalam percakapan
                          sosial yang terjadi tentang mereka. Manajer Media Sosial
                          akan menyimpan informasi ini untuk institusi meskipun
                          konten aslinya telah dihapus.
                        </li>
                      </ol>
                    </li>
                  </ul>
                </Typography>
              </li>
              <li style={{ listStyleType: "disc" }}>
                <Typography align="justify" paragraph>
                  Bagaimana kami menggunakan informasi ini
                  <ul className={classes.list}>
                    <li style={{ listStyleType: "circle" }}>
                      Atas nama institusi Anda. Kami menggunakan informasi Anda atas
                      nama dan di bawah instruksi institusi Anda, yang merupakan
                      pengontrol data. Kami menggunakan informasi sesuai dengan perjanjian
                      kami dengan institusi Anda untuk mengoperasikan, memelihara,
                      dan menyediakan fitur dan fungsionalitas produk dan layanan.
                      Institusi Anda menentukan bagaimana informasi Anda digunakan.
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Analisis. Menyediakan produk dan layanan kami ke institusi Anda
                      dapat mencakup fungsi analitik. Antara lain, fungsi tersebut
                      dapat menunjukkan kinerja Anda dibandingkan dengan rekan-rekan
                      Anda, memproyeksikan kinerja masa depan Anda, dan memberikan
                      informasi ini kepada instruktur dan staf lain dari institusi
                      Anda sehingga mereka dapat mendukung Anda.
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Silakan baca kebijakan privasi institusi Anda untuk detil
                      lebih lanjut tentang bagaimana institusi Anda menggunakan
                      informasi pribadi Anda.
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Penyempurnaan produk dan riset. Jika perjanjian dengan institusi
                      Anda memberi kami izin, kami juga dapat menggunakan Informasi pribadi
                      Anda untuk mengevaluasi dan meningkatkan produk
                      dan layanan kami serta mengembangkan produk dan layanan baru.
                      Serta, informasi yang tidak teridentifikasi untuk tujuan lain seperti
                      melakukan penelitian dan menganalisis tren untuk lebih memahami
                      bagaimana pengguna menggunakan layanan produk kami dan bagaimana
                      kami dapat mengembangkannya.

                      Ketika kami menggunakan informasi untuk tujuan ini, kami akan
                      menerapkan perlindungan yang sesuai. Ini mungkin termasuk
                      menghapus atau membuat samaran pengenal langsung (misalnya,
                      nama, alamat email, dan ID perangkat Anda) dari kumpulan
                      data sebelum melakukan penelitian dan analisis.
                    </li>
                  </ul>
                </Typography>
              </li>
              <li style={{ listStyleType: "disc" }}>
                <Typography align="justify" paragraph>
                  Kami membagikan informasi Anda sesuai dengan kesepakatan kami
                  dengan institusi Anda. Umumnya, ini termasuk berbagi
                  data di dalam dan di luar Schooly.
                  <ul className={classes.list}>
                    <li style={{ listStyleType: "circle" }}>
                      Di dalam Schooly. Informasi Anda hanya akan diakses oleh
                      mereka memiliki kepentingan untuk menyediakan produk dan
                      layanan kepada institusi Anda dan mengembangkannya. Misalnya,
                      tim teknis dan tim bantuan klien kami mungkin memiliki akses
                      ke informasi Anda saat kami menyiapkan produk untuk institusi
                      Anda atau saat perubahan perangkat lunak atau basis data yang
                      diperlukan untuk bantuan dan pemeliharaan.
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Dengan institusi Anda. Sebagian besar informasi pribadi yang
                      kami kumpulkan dan gunakan tentang Anda dibagikan dengan
                      institusi Anda yang menggunakan produk dan layanan kami dan
                      dengan pengguna institusional lainnya. Harap baca kebijakan privasi
                      institusi Anda untuk mempelajari lebih lanjut.
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Di luar Schooly. Kami menggunakan vendor untuk membantu
                      kami menyediakan produk dan layanan kami kepada Anda atas nama
                      institusi Anda. Misalnya, Amazon Web Services dan
                      Microsoft membantu kami menjalankan produk dan layanan kami.
                      Jika kami menggunakan alat pihak ketiga (misalnya untuk
                      memahami bagaimana produk dan layanan kami digunakan),
                      pihak ketiga ini akan memiliki akses ke beberapa informasi
                      pribadi Anda. Kami menggunakan Google Analytics dan alat
                      analitik lainnya untuk membantu kami mengukur lalu lintas
                      dan tren penggunaan untuk membantu kami menganalisis dan
                      meningkatkan kinerja situs web kami.
                    </li>
                  </ul>
                </Typography>
              </li>
            </ul>
          </div>
        </div>
        <div id="vendor-mitra-dan-jenis-pengungkapan-lainnya" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Vendor, Mitra dan Jenis Pengungkapan Lainnya</b>
          </Typography>
          <Typography align="justify" paragraph>
            Bagian ini memberikan informasi lebih lanjut tentang bagaimana kami
            melindungi informasi Anda ketika kami melibatkan vendor, bagaimana
            kami berbagi informasi dengan mitra kami, dan dalam skenario lain
            dimana kami dapat membagikan informasi Anda dengan pihak ketiga.
          </Typography>
          <div className={classes.contentSubsection}>
            <Typography align="justify" paragraph>
              <u>Vendor</u>
            </Typography>
            <Typography align="justify" paragraph>
              Kami menggunakan vendor untuk membantu kami menyediakan produk dan
              layanan kami kepada klien kami dan Anda atau untuk melakukan pekerjaan
              atas nama kami. Jika ini memerlukan akses ke informasi pribadi,
              kami bertanggung jawab atas praktik privasi data vendor. Vendor kami
              harus mematuhi persyaratan dan instruksi privasi dan keamanan data
              kami yang ketat. Mereka tidak diperbolehkan untuk menggunakan
              informasi pribadi yang mereka akses atau terima dari kami untuk
              tujuan lain selain yang diperlukan untuk melaksanakan pekerjaan
              mereka untuk kami.
            </Typography>
          </div>
          <div className={classes.contentSubsection}>
            <Typography align="justify" paragraph>
              <u>Mitra</u>
            </Typography>
            <Typography align="justify" paragraph>
              Dalam kasus tertentu, produk dan layanan kami dapat ditawarkan
              melalui mitra cabang (atau penjualan kembali).
              Kami akan berbagi informasi dengan mereka yang diperlukan bagi mereka
              untuk menawarkan dan menyediakan produk dan layanan kami kepada
              klien kami saat ini dan calon klien kami.
            </Typography>
          </div>
          <div className={classes.contentSubsection}>
            <Typography align="justify" paragraph>
              <u>Jenis pengungkapan lainnya</u>
            </Typography>
            <Typography align="justify" paragraph>
              Kami juga akan membagikan informasi Anda jika diperlukan dalam
              situasi berikut:
            </Typography>
            <Typography align="justify" paragraph>
              <ul className={classes.list}>
                <li style={{ listStyleType: "disc" }}>
                  Pembayaran. Saat Anda menggunakan produk dan layanan kami untuk
                  melakukan pembelian atau transaksi, kami akan membagikan data
                  pembayaran dan transaksi Anda dengan bank dan organisasi lain
                  untuk memproses transaksi dan untuk tujuan deteksi dan pencegahan
                  penipuan atau anti pencucian uang.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  Perubahan struktur bisnis kami. Jika diizinkan oleh hukum yang
                  berlaku dan kontrak dengan klien kami, kami dapat mengungkapkan
                  informasi Anda dalam kasus berikut. Kami akan selalu bertujuan
                  untuk terus menerapkan komitmen yang kami buat dalam Kebijakan
                  ini dalam kasus seperti itu. Jika ini tidak memungkinkan,
                  kami akan memberi tahu klien kami dan kami tidak akan memberikan
                  informasi pribadi tentang klien kami (termasuk Data murid)
                  tanpa persetujuan yang diperlukan dari klien kami, kepada entitas
                  penerus dalam situasi yang dijelaskan di bawah ini:
                  <ul className={classes.list}>
                    <li style={{ listStyleType: "circle" }}>
                      Transaksi perusahaan seperti merger, akuisisi, penjualan aset, dan pembiayaan
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Kebangkrutan, pembubaran atau reorganisasi, atau dalam transaksi atau proses serupa
                    </li>
                    <li style={{ listStyleType: "circle" }}>
                      Langkah-langkah yang terkait dengan poin-poin sebelumnya (misalnya, uji tuntas)
                    </li>
                  </ul>
                </li>
                <li style={{ listStyleType: "disc" }}>
                  Kami mungkin perlu mengungkapkan informasi Anda
                  untuk mematuhi persyaratan hukum atau peraturan dan untuk menanggapi
                  permintaan yang sah, perintah pengadilan, dan proses hukum.
                  Kami akan selalu bertujuan untuk membatasi informasi yang kami
                  berikan sebanyak mungkin. Jika pengungkapan tersebut berkaitan
                  dengan informasi pribadi yang kami simpan atas nama klien kami,
                  kami akan menunda permintaan tersebut kepada klien kami jika diizinkan.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  Kami mungkin perlu mengungkapkan informasi Anda untuk melindungi
                  dan membela hak, properti, atau keselamatan kami, klien kami, atau
                  pihak ketiga, termasuk menegakkan kontrak atau kebijakan atau
                  sehubungan dengan penyelidikan dan pencegahan penipuan.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  Kami dapat mengungkapkan informasi yang tidak teridentifikasi
                  untuk penelitian atau untuk meningkatkan dan mempromosikan produk dan layanan kami.
                  Misalnya, kami dapat berbagi informasi ini dengan mitra kami
                  atau orang lain untuk tujuan bisnis, atau penelitian seperti bekerja sama
                  dengan firma riset atau akademisi untuk mengetahui bagaimana
                  produk kami digunakan dan bagaimana data tersebut dapat
                  digunakan untuk meningkatkan fungsionalitas dan lebih lanjut
                  membantu klien kami dan lembaga pendidikan lainnya.
                  Kami akan menerapkan pengamanan yang sesuai sebelum membagikan informasi,
                  yang mungkin mencakup penghapusan atau menyamarkan identitas (misalnya, nama, alamat
                  email, dan ID perangkat Anda).
                </li>
              </ul>
            </Typography>
          </div>
        </div>
        <div id="keterlibatan-klien-dan-pemasaran" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Keterlibatan Klien dan Pemasaran</b>
          </Typography>
          <div className={classes.contentSubsection}>
            <Typography align="justify" paragraph>
              <u>Keterlibatan klien</u>
            </Typography>
            <Typography align="justify" paragraph>
              Kami mengumpulkan dan menyimpan informasi pribadi terbatas tentang
              kontak yang relevan di klien kami untuk faktur, pemberitahuan pembaruan
              dan pemeliharaan produk, dan tujuan serupa.
            </Typography>
          </div>
          <div className={classes.contentSubsection}>
            <Typography align="justify" paragraph>
              <u>Pemasaran</u>
            </Typography>
            <Typography align="justify" paragraph>
              Dalam memasarkan produk atau layanan kami, kami tidak pernah
              menerapkan perilaku iklan kepada murid.
              Kami tidak menggunakan atau mengungkapkan informasi (baik informasi
              pribadi atau lainnya) tentang murid yang kami kumpulkan melalui
              produk dan layanan pendidikan yang kami sediakan atas nama lembaga
              pendidikan untuk penargetan perilaku iklan kepada murid. Kami hanya akan
              melakukan hal ini jika diizinkan oleh institusi Anda dengan sebuah perjanjian.
              Kami melakukan pemasaran dalam berbagai bentuk atau media sebagai berikut:
            </Typography>
            <Typography align="justify" paragraph>
              <ul className={classes.list}>
                <li style={{ listStyleType: "disc" }}>
                  Promosi produk dan layanan. Kami melakukan pemasaran untuk mempromosikan
                  produk dan layanan kami. Pemasaran ini umumnya ditujukan untuk staf
                  klien dan mitra kami yang sudah ada dan calon klien. Namun, kami tidak
                  membatasi aktivitas dan acara yang ada hanya untuk entitas tersebut,
                  contohnya ketika aktivitas dan acara tersebut bermanfaat bagi instruktur dan pengguna,
                  seperti webinar yang menjelaskan bagaimana produk kami dapat digunakan secara efektif.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  Acara dan webinar. Saat kami mengadakan atau mensponsori acara dan
                  webinar, kami akan mengumpulkan informasi tentang peserta, seperti
                  sesi yang mereka hadiri dan kontak mereka, untuk memberi
                  mereka informasi produk yang relevan dan informasi terkait Schooly lainnya.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  Berbagi informasi di dalam Schooly sendiri. Kami dapat membagikan
                  informasi pribadi yang terkait dengan pemasaran dengan afiliasi dan departemen
                  Schooly yang relevan. Misalnya, informasi dari tim Penjualan
                  lokal dapat diberikan kepada tim Pemasaran utama
                  untuk memperbarui sistem yang relevan dan mengirimkan produk dan
                  komunikasi promosi lainnya kepada Anda.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  Berbagi informasi dengan mitra. Di beberapa negara dan wilayah, produk dan
                  layanan kami ditawarkan melalui mitra cabang (atau penjualan kembali).
                  Kami akan membagikan informasi yang diperlukan bagi mitra kami untuk mempromosikan
                  produk dan layanan kami kepada klien mereka dan klien potensial.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  Berbagi informasi dengan vendor. Kami dapat menggunakan vendor untuk membantu
                  kami mengatur dan melakukan kampanye, acara, dan aspek pemasaran
                  lainnya. Kami hanya akan berbagi informasi pribadi
                  yang diperlukan dan memastikan bahwa mereka mengikuti persyaratan yang ada.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  Iklan online dan berbasis minat di situs web kami. Kadang-kadang,
                  kami menggunakan alat iklan pihak ketiga untuk mengumpulkan
                  informasi tentang kunjungan Anda ke situs web kami untuk memberikan Anda
                  iklan berdasarkan riwayat penelusuran dan minat Anda
                  di situs web dan layanan online lain atau pada perangkat lain yang
                  mungkin Anda gunakan. Kami hanya menggunakan alat ini di situs web
                  kami sendiri dan bukan untuk produk dan layanan kami. Ketika kami
                  menyediakan layanan kami atas nama klien, produk dan layanan kami
                  tidak menggunakan alat periklanan berbasis minat kecuali seperti
                  yang diinstruksikan oleh klien kami.
                  <br />
                  Dalam beberapa kasus, kami dapat membagikan pengenal akun umum
                  yang terkait dengan penggunaan Anda atas situs web kami (seperti
                  alamat email atau ID pengguna) dengan mitra iklan pihak ketiga
                  kami untuk membantu mengidentifikasi dan menghubungi Anda di
                  seluruh perangkat. Kami dan mitra pihak ketiga kami menggunakan
                  informasi ini untuk membuat iklan yang Anda lihat lebih
                  relevan dengan minat Anda, serta untuk menyediakan layanan terkait
                  iklan seperti pelaporan, atribusi, analitik, dan riset pasar.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  Google Analytics dan Iklan di situs web kami. Kami juga dapat
                  menggunakan bentuk iklan bergambar tertentu dan fitur lanjutan
                  lainnya melalui Google Analytics, seperti Pemasaran Ulang dengan
                  Google Analytics, Pelaporan Tayangan Jaringan Display Google,
                  Integrasi Pengelola Kampanye DoubleClick, dan Pelaporan Demografi
                  dan Minat Google Analytics di situs web kami sendiri. Fitur ini
                  memungkinkan kami untuk menggunakan cookie pihak pertama (seperti
                  cookie Google Analytics) dan cookie pihak ketiga (seperti cookie
                  iklan Doubleclick) atau cookie pihak ketiga lainnya bersama-sama
                  untuk menginformasikan, mengoptimalkan, dan menampilkan iklan
                  berdasarkan kunjungan masa lalu Anda ke situs web kami. Untuk
                  informasi tentang cara Google Analytics mengumpulkan dan memproses
                  data, serta bagaimana Anda dapat mengontrol informasi yang dikirim
                  ke Google, tinjau situs Google "<a href="https://policies.google.com/technologies/partner-sites" target="_blank">
                  Bagaimana Google menggunakan data saat Anda menggunakan situs atau aplikasi mitra kami</a>". Anda dapat
                  mengontrol preferensi iklan atau memilih keluar dari produk iklan Google
                  tertentu dengan mengunjungi Pengelola Preferensi Iklan Google,
                  yang saat ini tersedia di <a href="https://google.com/ads/preferences" target="_blank">https://google.com/ads/preferences</a>.
                </li>
              </ul>
            </Typography>
          </div>
        </div>
        <div id="keamanan" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Keamanan</b>
          </Typography>
          <Typography align="justify" paragraph>
            Kami menerapkan berbagai pengamanan fisik, administratif, dan
            teknologi yang dirancang untuk melindungi informasi pribadi dari
            kehilangan, penyalahgunaan, dan akses atau pengungkapan yang tidak
            sah. Kami telah mendedikasikan program keamanan informasi dan
            bekerja keras untuk terus meningkatkan keamanan
            teknis dan operasional kami.
          </Typography>
          <Typography align="justify" paragraph>
            Kami mempertimbangkan sensitivitas informasi yang kami kumpulkan, gunakan,
            dan simpan, dan kondisi teknologi saat ini.
            Tindakan keamanan kami mencakup enkripsi data, firewall,
            penggunaan data, dan pembatasan akses untuk personel dan vendor kami.
          </Typography>
        </div>
        <div id="hak-anda" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Hak Anda</b>
          </Typography>
          <Typography align="justify" paragraph>
            Pada yurisdiksi yang ada, Anda memiliki hak untuk mengontrol bagaimana
            informasi pribadi Anda digunakan. Anda memiliki hak untuk
            meminta akses, perbaikan, atau penghapusan informasi pribadi yang
            kami miliki tentang Anda. Anda juga berhak untuk menolak atau
            membatasi jenis penggunaan tertentu dari informasi pribadi Anda dan
            meminta untuk menerima salinan yang dapat dibaca mesin dari informasi
            pribadi yang telah Anda berikan kepada kami.
          </Typography>
          <Typography align="justify" paragraph>
            Di banyak produk kami, Anda akan dapat mengakses informasi Anda
            serta mengubah dan menghapus beberapa informasi sendiri dengan
            masuk ke akun Anda. Jika Anda tidak dapat mengakses, memperbaiki,
            atau menghapus sendiri informasi yang diperlukan,
            ikuti langkah-langkah berikut:
            <ul className={classes.list}>
              <li style={{ listStyleType: "disc" }}>
                Jika Anda adalah pengguna produk dan layanan kami yang kami
                sediakan atas nama institusi Anda, silahkan hubungi institusi Anda.
                Mereka perlu mengelola permintaan Anda bahkan jika itu terkait
                dengan informasi yang kami simpan atas nama institusi Anda.
                Kami akan mendukung institusi Anda dengan permintaan Anda.
              </li>
              <li style={{ listStyleType: "disc" }}>
                Dalam kasus lain, kirimkan email kepada kami di <a href="mailto:schoolysystem@gmail.com">schoolysystem@gmail.com</a> jika
                Anda ingin menggunakan salah satu dari hak-hak ini.
              </li>
            </ul>
          </Typography>
          <Typography align="justify" paragraph>
            Harap diingat bahwa banyak dari hak-hak ini tidak mutlak.
            Dalam beberapa keadaan, kami (atau institusi Anda) tidak diwajibkan
            secara hukum untuk memenuhi permintaan Anda karena pengecualian
            hukum yang relevan.
          </Typography>
          <Typography align="justify" paragraph>
            Pada yurisdiksi yang ada, Anda juga berhak mengajukan keluhan kepada
            otoritas perlindungan data setempat. Namun harap hubungi kami
            terlebih dahulu, agar kami dapat mengatasi masalah Anda.
          </Typography>
        </div>
        <div id="hubungi-kami" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Hubungi Kami</b>
          </Typography>
          <Typography align="justify" paragraph>
            Jika Anda adalah pengguna produk dan layanan kami yang kami sediakan
            atas nama institusi Anda, hubungi institusi Anda terlebih dahulu karena
            kebijkan privasi institusi Anda dan praktik privasi data akan
            menentukan bagaimana Schooly menggunakan informasi pribadi
            atas nama institusi Anda. Jika Anda memiliki masalah teknis atau
            dukungan, silakan hubungi meja bantuan institusi Anda.
            Mereka akan dapat membantu.
          </Typography>
          <Typography align="justify" paragraph>
            Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan
            Privasi kami atau praktik privasi data kami sendiri, hubungi kami
            di <a href="mailto:schoolysystem@gmail.com">schoolysystem@gmail.com</a>.
          </Typography>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default PrivacyPolicy;
