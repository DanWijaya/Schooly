import React, { useEffect } from "react";
import whatIsSchooly from "./WhatIsSchooly.png";
import schoolyFeature1 from "./SchoolyFeature1.png";
import schoolyFeature2 from "./SchoolyFeature2.png";
import schoolyFeature3 from "./SchoolyFeature3.png";
import { Button, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EmailIcon from "@material-ui/icons/Email";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  whatIsSchoolyBackground: {
    backgroundColor: theme.palette.primary.light,
  },
  whatIsSchooly: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  schoolyFeatures: {
    margin: "auto",
    maxWidth: "1000px",
    marginTop: "10px",
    marginBottom: "10px",
    padding: "20px",
  },
  supportSchoolyBackground: {
    backgroundColor: theme.palette.primary.fade,
  },
  supportSchooly: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    margin: "auto",
    maxWidth: "1000px",
    padding: "20px",
  },
  supportSchoolyButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  }
}));

function About(props) {
  const classes = useStyles();
  const { handleMarginTopValue } = props;

  useEffect(() => {
    handleMarginTopValue(0);
    return () => {
      handleMarginTopValue(20)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  document.title = "Schooly | Tentang Schooly";

  return (
    <div className={classes.root}>
      <div className={classes.whatIsSchoolyBackground}>
        <div className={classes.whatIsSchooly}>
          <img
            alt="What is Schooly"
            src={whatIsSchooly}
            style={{maxWidth: "100%", maxHeight: "100%", marginBottom: "20px"}}
          />
          <Typography variant="h3" align="center" gutterBottom>
            Apa itu Schooly?
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Schooly adalah sebuah sistem persekolahan berbasis aplikasi web yang dibuat untuk memudahkan dan membantu kegiatan belajar-mengajar yang ada di sekolah.
          </Typography>
          <Typography align="center" style={{marginBottom: "40px"}}>
            "Kami percaya dengan bantuan teknologi pekerjaan apapun termasuk kegiatan persekolahan akan menjadi lebih efektif dan efisien."
          </Typography>
        </div>
      </div>
      <div className={classes.schoolyFeatures}>
        <Grid container spacing={5} direction="column">
          <Grid item container spacing={5} justify="center" alignItems="center">
            <Grid item xs={6}>
              <img
                alt="Schooly Feature 1"
                src={schoolyFeature1}
                style={{maxWidth: "100%", maxHeight: "100%"}}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4" color="primary" gutterBottom>
               Semua kegiatan persekolahanmu ada di tanganmu
              </Typography>
              <Typography variant="h6">
               Fitur Schooly yang bermacam-macam membuat kegiatan persekolahan lebih efektif dan efisien. Contohnya pengecekkan pekerjaan sekolah secara otomatis,
               pemberian materi tanpa harus mencetak, dan masih banyak lagi.
              </Typography>
            </Grid>
          </Grid>
          <Grid item container spacing={5} justify="center" alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h4" color="primary" gutterBottom>
               Akses dengan mudah
              </Typography>
              <Typography variant="h6">
               Akses merupakan salah satu hal yang paling penting dalam sebuah aplikasi.
               Schooly dibuat sebagai aplikasi web sehingga bisa diakses perangkat apa saja dengan mudah.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <img
                alt="Schooly Feature 2"
                src={schoolyFeature2}
                style={{maxWidth: "100%", maxHeight: "100%"}}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={5} justify="center" alignItems="center">
            <Grid item xs={6}>
              <img
                alt="Schooly Feature 3"
                src={schoolyFeature3}
                style={{maxWidth: "100%", maxHeight: "100%"}}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4" color="primary" gutterBottom>
               Media sosial persekolahan
              </Typography>
              <Typography variant="h6">
               Temukan kontak orang-orang sepersekolahan dengan mudah di Schooly.
               Sebarkan informasi mengenai kegiatan sekolah hanya dengan beberapa ketuk.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={classes.supportSchoolyBackground}>
        <div className={classes.supportSchooly}>
          <Typography variant="h4" align="center" color="primary" gutterBottom >
            Sudah menggunakan Schooly tetapi masih belum puas?
          </Typography>
          <Typography align="center" paragraph>
            Bantu Schooly berkembang dengan pendapat Anda. Saran maupun kritik Anda sangat berarti bagi kami.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<EmailIcon />}
            className={classes.supportSchoolyButton}
          >
            Kirim Pesan
          </Button>
        </div>
      </div>
    </div>
  )
};

export default About;
