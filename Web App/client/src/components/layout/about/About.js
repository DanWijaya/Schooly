import React from "react";
import backpackStudent from "./BackpackStudent-MateseFields.jpg";
import computerClass from "./ComputerClass-MimiThian.jpg";
import discussionWork from "./DiscussionWork-ScottGraham.jpg";
import onlineLearning from "./OnlineLearning-CompareFibre.jpg";
import aboutArt1 from "./AboutArt1.png";
import aboutArt2 from "./AboutArt2.png";
import aboutArt3 from "./AboutArt3.png";
import { Button, Divider, Grid, Typography, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EmailIcon from "@material-ui/icons/Email";

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
  whatIsSchooly: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "130px",
    paddingBottom: "130px",
  },
  schoolyMotto: {
    fontFamily: "Caveat",
    fontWeight: "bold",
    color: theme.palette.primary.main,
  },
  schoolyDefinition: {
    maxWidth: "80%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "90%",
    },
  },
  schoolyQuotes: {
    maxWidth: "60%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "80%",
    },
  },
  whatIsSchoolyDivider: {
    backgroundColor: theme.palette.primary.main,
    height: "3px",
    width: "20%",
    margin: "40px 0px 40px 0px",
    [theme.breakpoints.down("sm")]: {
      width: "30%",
      margin: "25px 0px 25px 0px",
    },
  },
  introduction: {
    backgroundImage: `url(${backpackStudent})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: "7.5px",
    height: "550px",
    [theme.breakpoints.down("sm")]: {
      height: "300px",
    },
  },
  introductionText: {
    maxWidth: "40%",
    marginLeft: "5%",
  },
  story: {
    marginTop: "40px",
    marginBottom: "40px",
  },
  worldChanges: {
    backgroundImage: `url(${computerClass})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: "7.5px",
    height: "300px",
  },
  techWorld: {
    backgroundImage: `url(${discussionWork})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: "7.5px",
    height: "300px",
  },
  solution: {
    backgroundImage: `url(${onlineLearning})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: "7.5px",
    height: "550px",
    [theme.breakpoints.down("sm")]: {
      height: "300px",
    },
  },
  solutionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  solutionTitle: {
    fontSize: "14px",
    color: theme.palette.primary.main,
    margin: "20px 0px 20px 0px",
  },
  solutionText: {
    maxWidth: "80%",
  },
  whySchooly: {
    marginTop: "130px",
    marginBottom: "130px",
  },
  whySchoolyThumbnailContainer: {
    display: "flex",
    justifyContent: "center",
  },
  whySchoolyThumbnail: {
    maxWidth: "60%",
    maxHeight: "60%",
    [theme.breakpoints.up("sm")]: {
      maxWidth: "90%",
      maxHeight: "90%",
    },
  },
  supportSchooly: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  supportSchoolyButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

function About(props) {
  const classes = useStyles();

  document.title = "Schooly | Tentang Schooly";

  return (
    <div className={classes.root}>
      <div className={classes.whatIsSchooly}>
        <Typography variant="h2" align="center" paragraph className={classes.schoolyMotto}>
          Schooly makes your school work easy!
        </Typography>
        <Typography variant="h6" align="center" className={classes.schoolyDefinition}>
          Schooly adalah sebuah sistem persekolahan berbasis aplikasi web yang
          dibuat untuk memudahkan dan membantu kegiatan belajar-mengajar yang
          ada di sekolah.
        </Typography>
        <Divider className={classes.whatIsSchoolyDivider} />
        <Typography variant="h6" color="textSecondary" align="center" className={classes.schoolyQuotes}>
          ❝Kami percaya dengan bantuan teknologi pekerjaan apapun termasuk
          kegiatan persekolahan akan menjadi lebih efektif dan efisien.❞
        </Typography>
      </div>
      <div className={classes.introduction}>
        <div className={classes.introductionText}>
          <Typography variant="overline" paragraph>
            Layanan Kami
          </Typography>
          <Typography gutterBottom>
            Apa pentingnya teknologi di dunia pendidikan?
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Pelajari lebih lanjut di bawah.
          </Typography>
        </div>
      </div>
      <div className={classes.story}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6} container direction="column">
            <div className={classes.worldChanges} />
            <Grid item>
              <Typography variant="h6" style={{ marginTop: "10px", marginBottom: "10px" }}>
                Dunia berubah, begitu juga seharusnya pendidikan
              </Typography>
              <Typography>
                Di kegiatan sehari-hari sekarang, tidak terlepas dengan namanya teknologi.
                Hampir segala sesuatu yang kita butuhkan dan inginkan dapat terpenuhi melalui
                perangkat komputer dan ponsel yang selalu kita bawa kemana-mana.
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} container direction="column">
            <div className={classes.techWorld} />
            <Grid item>
              <Typography variant="h6" style={{ marginTop: "10px", marginBottom: "10px" }}>
                Apa kata perkuliahan dan pekerjaan zaman sekarang?
              </Typography>
              <Typography>
                Pengaruh teknologi ini juga dapat dilihat baik di perkuliahan dan pekerjaan
                zaman sekarang. Sekarang, hampir semua tugas dan ujian di perkuliahan
                membutuhkan komputer dan dikumpul dalam bentuk digital. Begitu juga di
                dunia kerja. Kegiatan pemasaran, perhitungan keuangan, dan pekerjaan lainnya
                sekarang membutuhkan bantuan komputer ataupun ponsel. Lantas, mengapa
                sekolah-sekolah pada umumnya malah melarang penggunaan perangkat digital ini?
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div>
        <div className={classes.solution} />
        <div className={classes.solutionContainer}>
          <Typography variant="overline" align="center" className={classes.solutionTitle}>
            Schooly adalah solusinya!
          </Typography>
          <Typography align="center" className={classes.solutionText}>
            Kami mengerti akan masalah-masalah yang dihadapi sekolah-sekolah yang ada
            untuk beradaptasi di era digital ini. Terutama dalam mengatur murid-murid yang ada,
            agar tidak terdistraksi atau menyalahgunakan teknologi yang ada bukan untuk belajar.
            Schooly memiliki visi dimana membawa perangkat ke sekolah bukanlah sebuah tantangan,
            melainkan hal yang dapat membantu kegiatan belajar-mengajar.
          </Typography>
        </div>
      </div>
      <div className={classes.whySchooly}>
        <Typography variant="h4" align="center" gutterBottom>
          Mengapa Schooly?
        </Typography>
        <Typography align="center" paragraph>
          Secara singkat, berikut adalah alasan keuntungan penggunaan Schooly.
        </Typography>
        <Grid container spacing={5} direction="column">
          <Grid item container spacing={5} justify="center" alignItems="center">
            <Grid item xs={12} sm={6} className={classes.whySchoolyThumbnailContainer}>
              <img
                alt="Schooly Feature 1"
                src={aboutArt1}
                className={classes.whySchoolyThumbnail}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" color="primary" gutterBottom>
                Semua kegiatan persekolahanmu ada di tanganmu
              </Typography>
              <Typography variant="h6">
                Fitur Schooly yang bermacam-macam membuat kegiatan persekolahan
                lebih efektif dan efisien. Contohnya pengecekkan pekerjaan
                sekolah secara otomatis, pemberian materi tanpa harus mencetak,
                dan masih banyak lagi.
              </Typography>
            </Grid>
          </Grid>
          <Hidden xsDown>
            <Grid
              item
              container
              spacing={5}
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} sm={6}>
                <Typography variant="h4" color="primary" gutterBottom>
                  Akses dengan mudah
                </Typography>
                <Typography variant="h6">
                  Akses merupakan salah satu hal yang paling penting dalam
                  sebuah aplikasi. Schooly dibuat sebagai aplikasi web sehingga
                  bisa diakses perangkat apa saja dengan mudah.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.whySchoolyThumbnailContainer}>
                <img
                  alt="Schooly Feature 2"
                  src={aboutArt2}
                  className={classes.whySchoolyThumbnail}
                />
              </Grid>
            </Grid>
          </Hidden>
          <Hidden smUp>
            <Grid
              item
              container
              spacing={5}
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} sm={6} className={classes.whySchoolyThumbnailContainer}>
                <img
                  alt="Schooly Feature 2"
                  src={aboutArt2}
                  className={classes.whySchoolyThumbnail}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h4" color="primary" gutterBottom>
                  Akses dengan mudah
                </Typography>
                <Typography variant="h6">
                  Akses merupakan salah satu hal yang paling penting dalam
                  sebuah aplikasi. Schooly dibuat sebagai aplikasi web sehingga
                  bisa diakses perangkat apa saja dengan mudah.
                </Typography>
              </Grid>
            </Grid>
          </Hidden>
          <Grid item container spacing={5} justify="center" alignItems="center">
            <Grid item xs={12} sm={6} className={classes.whySchoolyThumbnailContainer}>
              <img
                alt="Schooly Feature 3"
                src={aboutArt3}
                className={classes.whySchoolyThumbnail}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" color="primary" gutterBottom>
                Media sosial persekolahan
              </Typography>
              <Typography variant="h6">
                Temukan kontak orang-orang sepersekolahan dengan mudah di
                Schooly. Sebarkan informasi mengenai kegiatan persekolahan hanya
                dengan beberapa ketuk.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={classes.supportSchooly}>
        <Typography variant="h4" align="center" color="textSecondary" gutterBottom>
          Ada masukan atau saran?
        </Typography>
        <Typography align="center" paragraph>
          Bantu Schooly berkembang dengan pendapat Anda. Saran maupun kritik
          Anda sangat berarti bagi kami!
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="mailto:schoolysystem@gmail.com"
          startIcon={<EmailIcon />}
          className={classes.supportSchoolyButton}
        >
          Kirim Pesan
        </Button>
      </div>
    </div>
  );
}

export default About;
