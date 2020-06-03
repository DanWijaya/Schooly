import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "900px",
    textAlign: "center",
  },
  paragraph: {
    marginBottom: "40px",
  },
  paragraphTitle: {
    fontFamily: "Helvetica Neue",
    color: "#2196f3",
  }
}));

function About() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.paragraph}>
        <Typography variant="h4" gutterBottom className={classes.paragraphTitle}>
          Apa itu Schooly?
        </Typography>
        <Typography variant="body1">
          Schooly adalah sebuah sistem persekolahan berbasis aplikasi web yang dibuat untuk memudahkan dan membantu kegiatan belajar-mengajar yang terjadi di sekolah.
          Di Schooly, Kami percaya dengan bantuan teknologi pekerjaan apapun termasuk kegiatan persekolahan akan menjadi lebih efektif dan efisien.
        </Typography>
      </div>

      <div className={classes.paragraph}>
        <Typography variant="h4" gutterBottom className={classes.paragraphTitle}>
          Visi dan Misi <br /> Schooly
        </Typography>
        <Grid container justify="center">
          <Grid item xs>
            <Typography variant="h5" gutterBottom>
              Visi
            </Typography>
            <Typography variant="body1">
              Visi kami adalah menerapkan inovasi dan teknologi terhadap sistem persekolahan yang ada di Indonesia.
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" gutterBottom>
              Misi
            </Typography>
            <Typography variant="body1">
              Misi kami adalah: <br />
              1. Menyediakan sistem persekolahan berbasis komputer bagi sekolah-sekolah yang ada. <br />
              2. Memudahkan sistem belajar-mengajar yang ada dengan fitur-fitur Schooly. <br />
              3. Memberikan prasarana komunikasi jarak jauh yang lebih baik antara murid, guru, dan sekolah.
            </Typography>
          </Grid>
        </Grid>
      </div>

      <div className={classes.paragraph}>
        <Typography variant="h4" gutterBottom className={classes.paragraphTitle}>
          Apa saja fitur-fitur Schooly?
        </Typography>
        <Grid container justify="center">
          <Grid item xs={6}>
            <Paper>
              <img />
              Sistem kelas dan mata pelajaran per kelas.
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <img />
              Sarana pengumpulan tugas.
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <img />
              Pengumuman dari sekolah dan Guru.
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <img />
                Kuis dan Ujian Berbasis Web.
            </Paper>
          </Grid>
        </Grid>
      </div>

      <div className={classes.paragraph}>
      <Typography variant="h4" gutterBottom className={classes.paragraphTitle}>
        Fitur-fitur yang akan datang:
      </Typography>
      <Grid container justify="center">
        <Grid item xs={6}>
          <Paper>
            <img />
            Pengunci Browser
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <img />
            Pengecek Kuis dan Ujian Otomatis untuk Berbagai Jenis Soal (Pilihan Ganda, Isilah, dan Essay)
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <img />
            Chat grup kelas, murid ke guru baik secara pribadi maupun dalam tugas spesifik.
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <img />
            Sistem absen sekolah (tatap muka).
          </Paper>
        </Grid>
      </Grid>
      </div>
    </div>
  )
};

export default About;
