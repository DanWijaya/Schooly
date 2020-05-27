import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    maxWidth: "1000px"
  }
}));

function About() {
  const classes = useStyles();

  return(
    <div className={classes.root}>
      <Typography variant="h4">
        Apa itu Schooly?
      </Typography>
      <Typography variant="body1">
        Schooly adalah sebuah sistem persekolahan berbasis aplikasi web yang dibuat untuk memudahkan dan membantu kegiatan belajar-mengajar yang terjadi di sekolah.
        Di Schooly, Kami percaya dengan bantuan teknologi pekerjaan apapun termasuk kegiatan persekolahan akan menjadi lebih efektif dan efisien.
      </Typography>

      <Typography variant="h4" gutterBottom>
        Visi dan Misi Schooly
      </Typography>
      <Typography variant="body1" gutterBottom>
        Visi kami adalah
      </Typography>
      <Typography variant="body1">
        Misi kami adalah
      </Typography>

      <Typography>
        Apa saja fitur-fitur Schooly?
      </Typography>
      <Grid container justify="center">
        <Grid item xs={6}>
          <Paper>
            <img />
            Fitur 1
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <img />
            Fitur 2
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <img />
            Fitur 3
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <img />
            Fitur 4
          </Paper>
        </Grid>
      </Grid>

      <Typography>
        Fitur-fitur yang akan datang:
      </Typography>
      <Grid container justify="center">
        <Grid item xs={6}>
          <Paper>
            <img />
            Fitur 1
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <img />
            Fitur 2
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <img />
            Fitur 3
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <img />
            Fitur 4
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
};

export default About;
