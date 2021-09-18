import React from "react";
import { Link } from "react-router-dom";
import termsOfServiceArt from "./TermsOfServiceArt.png";
import ScrollToTopButton from "../../../misc/scroll-to-top/ScrollToTopButton";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";
import { KeyboardArrowRight as KeyboardArrowRightIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

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
  termsOfServiceTitle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  termsOfServiceArt: {
    maxHeight: "225px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  termsOfServiceTitleText: {
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
}));

function TermsOfService(props) {
  const classes = useStyles();

  document.title = "Schooly | Ketentuan Penggunaan";

  return (
    <div className={classes.root}>
      <div className={classes.termsOfServiceTitle}>
        <img
          alt="Terms of Service Art"
          src={termsOfServiceArt}
          className={classes.termsOfServiceArt}
        />
        <Typography variant="overline" align="center" gutterBottom className={classes.termsOfServiceTitleText}>
          Ketentuan Penggunaan Schooly System
        </Typography>
        <Typography>
          Berlaku efektif: 1 Januari 2020
        </Typography>
      </div>
      <div className={classes.content}>
        <Typography variant="h6" gutterBottom>
          <b>Selamat Datang di Schooly</b>
        </Typography>
        <Typography align="justify" paragraph>
          PENTING - HARAP BACA DENGAN SEKSAMA. Ketentuan ini adalah perjanjian
          antara Anda dan Schooly System. Referensi ke "kami", "milik kami", dan
          "Schooly" akan berarti Schooly System. Ketentuan ini mengatur akses
          Anda ke dan penggunaan produk, dan/atau layanan Schooly (secara
          individu atau bersama, "Produk") dan segala informasi, konten, teks,
          grafik, foto atau materi lain yang diunggah, diunduh, dibeli, atau
          muncul pada atau melalui Produk (secara kolektif disebut sebagai
          "Konten"). Persyaratan tambahan atau persyaratan produk dapat berlaku
          untuk masing-masing Produk kami dan tersedia dengan Produk yang
          relevan. Ketentuan ini berlaku untuk semua pengunjung, pengguna, dan
          orang lain yang mengakses dan menggunakan Produk ("Pengguna").
        </Typography>
        <Typography align="justify" paragraph>
          Dengan mengakses atau menggunakan Produk, Anda setuju untuk terikat
          oleh Ketentuan ini.
        </Typography>
        <div id="back-to-top-anchor" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Daftar Isi</b>
          </Typography>
          <List>
            <ListItem alignItems="flex-start" button component="a" href="#ketentuan-umum-dan-akun">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Ketentuan Umum dan Akun" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start" button component="a" href="#privasi-dan-penggunaan-informasi-pribadi">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Privasi dan Penggunaan Informasi Pribadi" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start" button component="a" href="#konten-dan-hak-anda">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Konten dan Hak Anda" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start" button component="a" href="#lisensi-anda-untuk-menggunakan-produk">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Lisensi Anda untuk menggunakan Produk" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start" button component="a" href="#hak-schooly">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Hak Schooly" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start" button component="a" href="#tanggung-jawab-pendaftaran-dan-kata-sandi">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Tanggung Jawab Pendaftaran dan Kata Sandi" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start" button component="a" href="#penghentian-penggunaan">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Penghentian Penggunaan" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start" button component="a" href="#tautan-dan-sumber-daya pihak-ketiga">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Tautan dan Sumber Daya Pihak Ketiga" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start" button component="a" href="#batasan-pertanggung-jawaban">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Batasan Pertanggung Jawaban" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start" button component="a" href="#tentang-ketentuan-ini">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Tentang Ketentuan Ini" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start" button component="a" href="#informasi-lebih-lanjut">
              <ListItemIcon>
                <KeyboardArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Informasi Lebih Lanjut" />
            </ListItem>
          </List>
        </div>
        <div id="ketentuan-umum-dan-akun" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Ketentuan Umum dan Akun</b>
          </Typography>
          <Typography align="justify" paragraph>
            Anda bertanggung jawab atas penggunaan Produk yang ada. Anda dapat
            menggunakan Produk hanya jika Anda dapat membentuk kontrak yang
            mengikat dengan Schooly. Akun Anda dengan Schooly (dan penggunaan
            Produk) memberi Anda akses ke layanan dan fungsionalitas yang dapat
            kami bangun dan kelola dari waktu ke waktu dan atas kebijakan kami
            sendiri. Jika Anda menerima Ketentuan ini dan menggunakan Produk
            atas nama perusahaan, organisasi, pemerintah, atau badan hukum
            lainnya, maka (a) "Anda" termasuk Anda dan entitas itu, dan (b) Anda
            mewakili dan menjamin bahwa Anda adalah perwakilan resmi entitas
            dengan wewenang untuk mengikat entitas dengan Ketentuan ini, dan
            bahwa Anda menyetujui Ketentuan ini atas nama entitas. Anda dapat
            menggunakan Produk hanya sesuai dengan Ketentuan ini, perjanjian apa
            pun yang dibuat oleh institusi Anda terkait dengan Produk, dan semua
            hukum, peraturan dan regulasi lokal, negara bagian, nasional, dan
            internasional.
          </Typography>
          <Typography align="justify" paragraph>
            Dalam kasus di mana Anda telah mengizinkan atau mendaftarkan orang
            lain, termasuk anak di bawah umur, untuk menggunakan akun Anda, Anda
            sepenuhnya bertanggung jawab atas (i) perilaku online Pengguna
            tersebut; (ii) mengendalikan akses Pengguna ke dan penggunaan
            Produk; dan (iii) konsekuensi dari penyalahgunaan. Schooly
            mensyaratkan bahwa orang tua, wali, atau orang dewasa atau institusi
            pendidikan minor lainnya secara tegas menyetujui penggunaan Produk
            Schooly oleh minor tersebut. Schooly berhak untuk memberikan akses
            ke akun minor kepada orang tua, wali, atau orang dewasa atau lembaga
            pendidikan resmi lainnya, atas permintaan orang dewasa tersebut.
          </Typography>
          <Typography align="justify" paragraph>
            Anda bertanggung jawab penuh atas interaksi Anda dengan Pengguna
            lain. Kami berhak, tetapi tidak memiliki kewajiban, untuk memantau
            perselisihan antara Anda dan Pengguna lain. Schooly tidak
            bertanggung jawab atas interaksi Anda dengan Pengguna lain, atau
            untuk tindakan atau kelalaian Pengguna apa pun.
          </Typography>
        </div>
        <div id="privasi-dan-penggunaan-informasi-pribadi" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Privasi dan Penggunaan Informasi Pribadi</b>
          </Typography>
          <Typography align="justify" paragraph>
            Setiap informasi yang Anda berikan kepada Schooly, termasuk nama
            depan, nama belakang, alamat email, dan informasi lainnya termasuk
            informasi pribadi yang Anda berikan, dapat berikan, atau dapat
            dikumpulkan oleh kami sehubungan dengan penggunaan Anda terhadap
            Produk (“Informasi Anda "), akan dikumpulkan, dijaga, dan digunakan
            untuk menyediakan Produk kepada Anda atau lembaga Anda. Ada pun persyaratan
            tambahan yang berlaku untuk Produk individual, dan
            perjanjian apa pun yang dibuat oleh institusi Anda terkait dengan Produk.
            Anda memahami bahwa, melalui penggunaan Produk oleh Anda, Anda
            menyetujui pengumpulan dan penggunaan informasi Anda (sebagaimana diatur dalam
            Ketentuan ini, <Link to="/legal/kebijakan-privasi">Kebijakan Privasi</Link>,
            dan perjanjian apa pun yang dibuat oleh institusi Anda terkait dengan Produk).
          </Typography>
          <Typography align="justify" paragraph>
            Untuk menghindari keraguan, informasi pribadi yang mencakup Data
            Pelajar (didefinisikan di bawah) yang diberikan kepada Schooly
            melalui penggunaan Produk-produk ini diatur oleh
            perjanjian antara Schooly dan lembaga pendidikan yang relevan dengan
            penggunaan Anda atas Produk. Di antara Schooly dan Anda, Anda
            dan/atau lembaga pendidikan memiliki semua hak, kepemilikan, dan
            minat terhadap semua Data murid yang Anda berikan atau sediakan bagi
            kami, dan kami tidak memiliki, mengendalikan, atau melisensikan Data
            murid tersebut, kecuali jika untuk menyediakan Produk kepada Anda
            dan ke lembaga pendidikan yang menyediakan produk dan mengendalikan
            Data murid dari catatan pendidikan, jika berlaku, dan sebagaimana
            dijelaskan di sini. “Data murid” adalah segala informasi (dalam
            format apa pun) yang secara langsung terkait dengan murid saat ini
            atau mantan murid yang dikelola oleh sekolah, distrik sekolah, atau
            entitas atau organisasi terkait, atau oleh kami, sebagai bagian dari
            ketentuan Produk.
          </Typography>
          <Typography align="justify" paragraph>
            Jika Anda memiliki pertanyaan tentang privasi dan penggunaan
            Informasi Anda, silakan hubungi kami di <Link href="mailto:schoolysystem@gmail.com">
            schoolysystem@gmail.com </Link>, atau lembaga pendidikan Anda.
          </Typography>
        </div>
        <div id="konten-dan-hak-anda" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Konten dan Hak Anda</b>
          </Typography>
          <Typography align="justify" paragraph>
            Anda bertanggung jawab atas Konten yang Anda bagikan ke Produk, dan
            segala konsekuensinya. Konten yang Anda bagikan atau tampilkan dapat
            dilihat oleh Pengguna Produk lainnya.
          </Typography>
          <Typography align="justify" paragraph>
            Anda memegang hak Anda untuk Konten yang Anda bagikan atau tampilkan
            pada atau melalui Produk. Dengan membagikan atau menampilkan Konten
            pada atau melalui Produk, Anda memberi kami lisensi bebas royalti di
            seluruh dunia, non-eksklusif, dengan hak untuk mensublisensikan
            untuk menggunakan, menyelenggarakan, menyimpan, menyalin,
            mereproduksi, memproses, beradaptasi, memodifikasi, menerbitkan,
            mentransmisikan, membuat karya turunan dari, mengomunikasikan,
            menampilkan, dan/atau mendistribusikan Konten tersebut di setiap dan
            semua media atau metode distribusi (sekarang dikenal atau belakangan
            dikembangkan) sebagai bagian dari penyediaan Produk apa pun. Anda
            setuju bahwa lisensi ini mencakup hak Schooly untuk menyediakan,
            mempromosikan, dan meningkatkan Produk dan untuk membuat Konten yang
            dikirimkan ke atau melalui Produk tersedia untuk institusi atau
            individu lain sebagai bagian dari penyediaan Produk (termasuk
            setelah penghentian penggunaan Anda atas Produk). Anda menyatakan
            dan menjamin bahwa Anda memiliki semua hak, kekuasaan, dan otoritas
            yang diperlukan untuk memberikan hak yang diberikan di sini untuk
            Konten apa pun yang Anda kirimkan.
          </Typography>
          <Typography align="justify" paragraph>
            Semua Konten, baik yang dipublikasikan atau dikirimkan secara
            pribadi, adalah tanggung jawab orang yang membuat Konten tersebut.
            Kami tidak mungkin memantau atau mengontrol Konten yang dibagikan
            melalui Produk, dan kami tidak bertanggung jawab atas Konten
            tersebut. Setiap penggunaan atau kepercayaan pada Konten atau materi
            yang dibagikan melalui Produk atau diperoleh oleh Anda melalui
            Produk adalah risiko Anda sendiri.
          </Typography>
          <Typography align="justify" paragraph>
            Lebih lanjut, sehubungan dengan Konten yang Anda bagikan atau
            tampilkan pada atau melalui Produk, Anda menegaskan, mewakili, dan
            menjamin hal-hal berikut: (a) Anda memiliki persetujuan tertulis
            dari setiap orang yang diidentifikasi dalam Konten, jika ada, untuk
            menggunakan nama atau kemiripan orang tersebut dengan cara yang
            dimaksud oleh Produk apa pun dan Ketentuan ini, dan setiap orang
            tersebut membebaskan Anda dari tanggung jawab apa pun yang mungkin
            timbul sehubungan dengan penggunaan tersebut; (b) Anda telah
            memperoleh dan sepenuhnya bertanggung jawab untuk mendapatkan semua
            persetujuan sebagaimana diwajibkan oleh hukum untuk membagikan
            Konten yang terkait dengan pihak ketiga; (c) Konten Anda dan Schooly
            digunakan sesuai dengan Ketentuan ini dan Produk apa pun tidak akan
            melanggar hukum apa pun atau melanggar hak pihak ketiga mana pun,
            termasuk tetapi tidak terbatas pada hak kekayaan intelektual dan hak
            privasi; dan (d) Schooly dapat menggunakan hak atas Konten Anda yang
            diberikan berdasarkan Ketentuan ini tanpa tanggung jawab untuk
            pembayaran pembayaran, biaya, atau royalti yang dibayarkan
            berdasarkan perjanjian perundingan bersama, pengaturan lisensi atau
            lainnya.
          </Typography>
          <Typography align="justify" paragraph>
            Schooly menghormati hak kekayaan intelektual orang lain dan
            mengharapkan Pengguna Produk untuk melakukan hal yang sama. Kami
            akan menanggapi pemberitahuan dugaan pelanggaran hak cipta yang
            sesuai dengan hukum yang berlaku dan diberikan kepada kami dengan
            semestinya. Jika Anda yakin bahwa Konten Anda telah disalin dengan
            cara yang merupakan pelanggaran hak cipta, berikan informasi berikut
            kepada kami: (i) tanda tangan fisik atau elektronik dari pemilik hak
            cipta atau orang yang diberi wewenang untuk bertindak atas nama
            mereka; (ii) identifikasi karya berhak cipta yang diklaim telah
            dilanggar; (iii) identifikasi materi yang diklaim sebagai
            pelanggaran atau menjadi subjek aktivitas pelanggaran dan yang akan
            dihapus atau akses yang akan dinonaktifkan, dan informasi yang cukup
            memadai untuk memungkinkan kami menemukan materi; (iv) informasi
            kontak Anda, termasuk alamat, nomor telepon, dan alamat email Anda;
            (v) pernyataan oleh Anda bahwa Anda memiliki itikad baik dengan niat
            bahwa penggunaan materi dengan cara yang dikeluhkan tidak diizinkan
            oleh pemilik hak cipta, agennya, atau hukum; dan (vi) pernyataan
            bahwa informasi dalam pemberitahuan itu akurat, dan, di bawah
            penalti sumpah palsu, bahwa Anda berwenang untuk bertindak atas nama
            pemilik hak cipta.
          </Typography>
          <Typography align="justify" paragraph>
            Kami berhak untuk menghapus Konten yang diduga melanggar tanpa
            pemberitahuan sebelumnya, atas kebijakan kami sendiri, dan tanpa
            tanggung jawab kepada Anda.
          </Typography>
        </div>
        <div id="lisensi-anda-untuk-menggunakan-produk" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Lisensi Anda untuk menggunakan Produk</b>
          </Typography>
          <Typography align="justify" paragraph>
            Schooly memberi Anda lisensi pribadi, di seluruh dunia, bebas
            royalti, tidak dapat dialihkan, dan tidak eksklusif untuk
            menggunakan Produk, tunduk pada Ketentuan ini dan perjanjian apa pun
            yang dibuat oleh lembaga Anda terkait dengan Produk, semata-mata
            untuk tujuan penggunaan Produk, dan bukan untuk intelijen, analisis,
            atau demonstrasi kompetitif. Anda tidak boleh menyalin,
            memodifikasi, mendistribusikan, menjual, atau menyewakan bagian apa
            pun dari Produk kami, dan Anda juga tidak dapat merekayasa balik
            atau mencoba mengekstraksi kode sumber Produk apa pun, kecuali
            undang-undang melarang pembatasan tersebut atau Anda memiliki izin
            tertulis dari kami.
          </Typography>
          <Typography align="justify" paragraph>
            Saat menggunakan Produk, Anda tidak boleh: (i) mengelak,
            menonaktifkan, atau mengganggu fitur keamanan apa pun terkait Produk
            atau fitur yang mencegah atau membatasi penggunaan atau menyalin
            konten yang dapat diakses melalui Produk; (ii) membuat lebih dari
            satu akun untuk digunakan dengan Produk tertentu (iii) memberikan
            informasi yang salah atau menyesatkan atau mengizinkan orang lain
            untuk menggunakan Produk dengan nama Anda atau atas nama Anda; (iv)
            berkedok sebagai orang lain, atau salah menggambarkan identitas atau
            afiliasi Anda dengan orang lain atau memberi kesan mereka terkait
            dengan Schooly, jika ini bukan masalahnya; (v) menggunakan Produk
            jika kami telah menangguhkan atau melarang Anda menggunakannya; (vi)
            mengirim spam, pesan berulang, iklan atau email pemasaran,
            panggilan, atau pesan teks yang tidak diminta, atau terlibat dalam
            aktivitas apa pun yang melanggar undang-undang dan peraturan
            anti-spam; (vii) mengadvokasi, mempromosikan atau terlibat dalam
            tindakan atau perilaku ilegal atau melanggar hukum apa pun yang
            menyebabkan kerusakan atau cedera pada orang atau properti apa pun;
            (viii) memodifikasi, mengganggu, mencegat, mengganggu atau meretas
            Produk apa pun atau mengumpulkan data apa pun dari Produk selain
            sesuai dengan Ketentuan Penggunaan ini; (ix) menyalahgunakan Produk
            dengan sengaja memperkenalkan virus, Trojan, worm, bom logika atau
            materi lain yang akan membahayakan Produk atau Pengguna apa pun dari
            peralatan Produk; (x) menyerahkan atau menyumbang Konten apa pun
            yang mengandung ketelanjangan atau kekerasan atau kasar, mengancam,
            cabul, menyesatkan, tidak benar atau menyinggung (dalam setiap kasus
            kecuali Konten tersebut diserahkan atau berkontribusi untuk tujuan
            pendidikan yang dominan, seperti, misalnya, historis bahan-bahan
            yang disumbangkan melalui Produk untuk diskusi kelas); (xi)
            mengirimkan atau menyumbang Konten apa pun tanpa izin dari pemilik
            konten atau melanggar hak cipta, merek dagang, privasi, publisitas,
            atau hak lain dari pihak ketiga; (xii) menggunakan Konten apa pun
            yang melanggar persyaratan lisensi yang ditentukan oleh pemilik;
            (xiii) menyerahkan atau menyumbangkan informasi atau komentar
            tentang orang lain tanpa izin orang tersebut; (xiv) mengancam,
            menyalahgunakan atau menyerang privasi orang lain, atau menyebabkan
            gangguan, ketidaknyamanan, atau kecemasan yang tidak perlu atau
            mengambil tindakan apa pun yang cenderung melecehkan, membuat marah,
            mempermalukan, mengkhawatirkan, mengkhawatirkan, atau mengganggu
            orang lain; atau (xv) menggunakan sistem otomatis apa pun, termasuk
            tanpa batasan "robot", "spider" atau "offline reader" untuk
            mengakses Produk dengan cara yang mengirimkan lebih banyak pesan
            permintaan ke Produk daripada yang dapat diproduksi manusia pada
            periode waktu yang sama.
          </Typography>
          <Typography align="justify" paragraph>
            Kegagalan untuk mematuhi aturan penggunaan yang dapat diterima ini
            merupakan pelanggaran serius terhadap Ketentuan Penggunaan ini, dan
            dapat mengakibatkan kami mengambil semua atau salah satu dari
            tindakan berikut (dengan atau tanpa pemberitahuan): (a) penarikan
            segera, sementara atau permanen dari Anda hak untuk menggunakan
            Produk kami; (b) penghapusan segera, sementara atau permanen dari
            Konten; (c) mengeluarkan peringatan kepada Anda; (d) tindakan hukum
            terhadap Anda termasuk proses untuk penggantian semua biaya
            (termasuk, tetapi tidak terbatas pada, biaya administrasi dan hukum
            yang wajar) yang dihasilkan dari pelanggaran; dan (e) pengungkapan
            informasi tersebut kepada pihak penegak hukum yang kami rasa perlu.
          </Typography>
          <Typography align="justify" paragraph>
            Tanggapan yang dijelaskan dalam Bagian ini tidak terbatas, dan kami
            dapat mengambil tindakan lain yang kami anggap pantas.
          </Typography>
        </div>
        <div id="hak-schooly" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Hak Schooly</b>
          </Typography>
          <Typography align="justify" paragraph>
            Produk selalu berevolusi dimana bentuk, sifat, dan/atau fungsi
            Produk dapat berubah dari waktu ke waktu tanpa pemberitahuan
            sebelumnya kepada Anda. Selain itu, Schooly dapat berhenti (secara
            permanen atau sementara) menyediakan Produk (atau fitur apa pun
            dalam Produk) kepada Anda atau kepada Pengguna secara umum dan
            mungkin tidak dapat memberi Anda pemberitahuan sebelumnya. Kami juga
            memiliki hak untuk membatasi penggunaan dan penyimpanan atas
            kebijakan kami kapan saja tanpa pemberitahuan sebelumnya kepada
            Anda.
          </Typography>
          <Typography align="justify" paragraph>
            Semua hak, kepemilikan, dan minat pada dan terhadap Produk (tidak
            termasuk Konten yang disediakan oleh Pengguna atau pihak ketiga
            lainnya) adalah dan akan tetap menjadi milik eksklusif Schooly dan
            pemberi lisensinya. Produk dilindungi oleh hak cipta, merek dagang,
            dan undang-undang lainnya dari Amerika Serikat dan negara-negara
            asing. Tidak ada dalam Ketentuan yang memberi Anda hak untuk
            menggunakan nama Schooly atau merek dagang Schooly, logo, nama
            domain, dan fitur merek khas lainnya. Setiap umpan balik, komentar,
            atau saran yang Anda berikan mengenai Schooly, atau Produk
            sepenuhnya bersifat sukarela dan kami akan bebas untuk menggunakan
            umpan balik, komentar atau saran seperti yang kami anggap cocok dan
            tanpa kewajiban apa pun kepada Anda.
          </Typography>
        </div>
        <div id="tanggung-jawab-pendaftaran-dan-kata-sandi" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Tanggung Jawab Pendaftaran dan Kata Sandi</b>
          </Typography>
          <Typography align="justify" paragraph>
            Anda tidak boleh menggunakan akun Pengguna lain tanpa izin dari
            Schooly. Dengan mempertimbangkan penggunaan Anda atas Produk, Anda
            setuju (a) bahwa Informasi Anda akan benar, akurat, terkini dan
            lengkap, dan (b) untuk memelihara dan segera memperbarui Informasi
            Anda agar tetap benar, akurat, terkini, dan lengkap. Anda
            bertanggung jawab untuk menjaga kata sandi apa pun yang Anda gunakan
            untuk mengakses Produk (termasuk kata sandi yang digunakan pada
            produk Schooly lain yang mengizinkan sistem masuk tunggal ke Produk)
            dan untuk setiap kegiatan atau tindakan di bawah kata sandi Anda.
            Kami menyarankan Anda untuk menggunakan kata sandi "kuat" (kata
            sandi yang menggunakan kombinasi huruf besar dan kecil, angka, dan
            simbol, dan memiliki setidaknya delapan (8) karakter) dengan akun
            Anda. Anda setuju untuk (a) memberi tahu Schooly tentang
            penyalahgunaan kata sandi atau identifikasi Pengguna Anda tanpa izin
            dan segala pelanggaran keamanan lainnya, dan (b) memastikan bahwa
            Anda keluar dari akun Anda di akhir setiap sesi.
          </Typography>
        </div>
        <div id="penghentian-penggunaan" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Penghentian Penggunaan</b>
          </Typography>
          <Typography align="justify" paragraph>
            Kami dapat menangguhkan atau menghentikan akun Anda atau berhenti
            memberikan Anda semua atau sebagian Produk kapan saja dengan alasan
            apa pun, termasuk, tetapi tidak terbatas pada, jika kami yakin: (i)
            Anda telah melanggar Ketentuan ini, (ii) Anda membuat risiko atau
            kemungkinan paparan hukum bagi kami; atau (iii) ketentuan kami atas
            Produk tidak lagi layak secara komersial. Dalam peristiwa
            penghentian seperti itu, lisensi yang diberikan di bawah ini akan
            secara otomatis berakhir. Kami akan menghapus akun yang Anda
            tentukan dalam waktu yang wajar, kecuali dilarang oleh hukum. Tidak
            ada dalam Bagian ini yang akan memengaruhi hak Schooly untuk
            mengubah, membatasi, atau menghentikan penyediaan Produk tanpa
            pemberitahuan sebelumnya, seperti yang disediakan di tempat lain
            dalam Ketentuan ini.
          </Typography>
        </div>
        <div id="tautan-dan-sumber-daya pihak-ketiga" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Tautan dan Sumber Daya Pihak Ketiga</b>
          </Typography>
          <Typography align="justify" paragraph>
            Produk dapat berisi tautan ke situs web atau sumber daya pihak
            ketiga. Anda mengakui dan menyetujui bahwa Entitas Schooly tidak
            bertanggung jawab atau berkewajiban atas: (i) ketersediaan atau
            keakuratan situs web atau sumber daya tersebut; atau (ii) konten,
            produk, atau layanan di atau tersedia dari situs web atau sumber
            daya tersebut. Tautan ke situs web atau sumber daya tersebut tidak
            menyiratkan pengesahan oleh Entitas Schooly dari situs web atau
            sumber daya tersebut atau konten, produk, atau layanan yang tersedia
            dari situs web atau sumber daya tersebut. Anda mengakui tanggung
            jawab tunggal untuk dan menanggung semua risiko yang timbul dari
            penggunaan Anda atas situs web atau sumber daya tersebut. Jika Anda
            mengakses situs web atau layanan pihak ketiga dari suatu Produk atau
            membagikan Konten Anda pada atau melalui situs web atau layanan
            pihak ketiga mana pun, Anda melakukannya dengan risiko Anda sendiri,
            dan Anda memahami bahwa Ketentuan ini dan Kebijakan Privasi tidak
            berlaku untuk Anda menggunakan situs-situs tersebut.
          </Typography>
        </div>
        <div id="batasan-pertanggung-jawaban" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Batasan Pertanggung Jawaban</b>
          </Typography>
          <Typography align="justify" paragraph>
            SAMPAI KEPADA BATAS MAKSIMUM YANG DIIZINKAN OLEH UNDANG-UNDANG YANG
            BERLAKU, ENTITAS SCHOOLY TIDAK AKAN BERTANGGUNG JAWAB ATAS KERUSAKAN
            LANGSUNG, INSIDENTAL, KHUSUS, KONSEKUENSIAL ATAU PUNITIF, ATAU
            KEHILANGAN KEUNTUNGAN ATAU PENDAPATAN, APAKAH TERJADI SECARA
            LANGSUNG ATAU TIDAK LANGSUNG, ATAU ADANYA KEHILANGAN DATA,
            PENGGUNAAN, ATAU KERUGIAN TIDAK BERWUJUD LAINNYA HASIL DARI (i)
            AKSES ANDA UNTUK ATAU PENGGUNAAN ATAU KETIDAKMAMPUAN UNTUK MENGAKSES
            ATAU MENGGUNAKAN PRODUK; (ii) SETIAP PERILAKU ATAU KONTEN DARI
            PENGGUNA ATAU PIHAK KETIGA LAINNYA PADA, MELALUI, ATAU TERKAIT
            DENGAN PRODUK, TERMASUK TANPA BATASAN, SETIAP PERUBAHAN, PAKSA ATAU
            PERILAKU ILEGAL PENGGUNA LAIN ATAU PIHAK KETIGA; (iii) KONTEN YANG
            DIPEROLEH DARI PRODUK; ATAU (iv) AKSES YANG TIDAK DIHORMATI,
            MENGGUNAKAN ATAU MENGUBAH TRANSMISI ANDA ATAU KONTEN.
          </Typography>
        </div>
        <div id="tentang-ketentuan-ini" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Tentang Ketentuan Ini</b>
          </Typography>
          <Typography align="justify" paragraph>
            Ketentuan ini dan Kebijakan Privasi kami adalah keseluruhan dan
            perjanjian eksklusif antara Schooly dan Anda mengenai Produk, dan
            Ketentuan ini memperbaharui dan menggantikan perjanjian sebelumnya
            antara Schooly dan Anda mengenai Produk. Selain anggota grup
            perusahaan di mana Schooly adalah induknya, tidak ada orang atau
            perusahaan lain yang akan menjadi penerima pihak ketiga Persyaratan.
          </Typography>
          <Typography align="justify" paragraph>
            Terlepas dari hal yang telah disebutkan sebelumnya, tidak ada dalam
            Ketentuan ini yang menggantikan atau membatasi hak Anda berdasarkan
            (1) syarat dan ketentuan dari perjanjian tertulis apa pun yang Anda
            buat dengan Schooly mengenai penggunaan Produk, atau (2) hukum atau
            peraturan yang berlaku sejauh Ketentuan ini dilarang oleh hukum atau
            peraturan tersebut. Jika terjadi pertentangan antara Ketentuan ini
            dan syarat dan ketentuan dari perjanjian tertulis yang berlaku yang
            Anda buat dengan Schooly, syarat dan ketentuan perjanjian tertulis
            akan berlaku.
          </Typography>
          <Typography align="justify" paragraph>
            Kami dapat merevisi Ketentuan ini dari waktu ke waktu, versi terbaru
            akan selalu tersedia di <Link href="https://www.schoolysystem.com">
            https://www.schoolysystem.com</Link>.
            Jika revisi, atas kebijakan kami sendiri, adalah materi, kami akan
            memberi tahu Anda melalui Produk atau melalui email yang terkait
            dengan profil Anda. Dengan terus mengakses atau menggunakan Produk
            setelah revisi tersebut berlaku, Anda setuju untuk terikat oleh
            Persyaratan yang direvisi.
          </Typography>
        </div>
        <div id="informasi-lebih-lanjut" className={classes.contentSection}>
          <Divider />
          <Typography variant="h6" className={classes.contentSectionTitle}>
            <b>Informasi Lebih Lanjut</b>
          </Typography>
          <Typography align="justify" paragraph>
            Jika terdapat informasi yang masih kurang jelas atau ada pertanyaan
            mengenai kebijakan penggunaan di atas, silahkan menghubungi kami di <Link href="mailto:schoolysystem@gmail.com">
            schoolysystem@gmail.com</Link>.
          </Typography>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default TermsOfService;
