import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: "1",
    justifyContent: "center",
    textAlign: "center",
    maxWidth: "1000px"
  }
}));

function About() {
  const classes = useStyles();

  return(
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
      <Typography variant="h4">
        Apa itu Schooly?
      </Typography>
      <Typography variant="body1">
        Schooly adalah sebuah sistem persekolahan berbasis aplikasi web yang dibuat untuk memudahkan dan membantu kegiatan belajar-mengajar yang terjadi di sekolah.
        Di Schooly, Kami percaya dengan bantuan teknologi pekerjaan apapun termasuk kegiatan persekolahan akan menjadi lebih efektif dan efisien.
      </Typography>
      </Grid>

      <Grid item>
      <Typography variant="h4" gutterBottom>
        Visi dan Misi Schooly
      </Typography>
      <Typography variant="body1" gutterBottom>
        Visi kami adalah
      </Typography>
      <Typography variant="body1">
        Misi kami adalah
      </Typography>
      </Grid>

      <Grid item>
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
      </Grid>

      <Grid item>
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
      </Grid>
    </Grid>
  )
};

export default About;
