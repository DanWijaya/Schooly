import React from "react";
import { Link } from "react-router-dom";
import { Button, CircularProgress, Dialog, Grid, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "350px",
    minHeight: "175px",
    padding: "15px",
  },
  uploadSuccessIcon: {
    color: "green",
    height: "45px",
    width: "45px"
  },
  uploadFinishButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.create.main,
      color: "white",
    },
  },
}));

function UploadDialog() {
  const classes = useStyles();

  return (
    <Dialog open={this.state.openUploadDialog}>
      <Grid container direction="column" justify="space-between" alignItems="center" className={classes.root}>
        <Grid item>
          <Typography variant="h6" align="center" gutterBottom>
            {!success ? "Pengumuman sedang disunting" : "Pengumuman berhasil disunting"}
          </Typography>
        </Grid>
        <Grid item>
          {!success ? <CircularProgress /> : <CheckCircleIcon className={classes.uploadSuccessIcon} />}
        </Grid>
        <Grid item>
          {!success ?
            <Typography variant="body1" align="center" gutterBottom>
              <b>Mohon tetap tunggu di halaman ini.</b>
            </Typography>
          :
          <Link to={`/pengumuman/${this.props.match.params.id}`}>
              <Button
                variant="contained"
                className={classes.uploadFinishButton}
              >
                Selesai
              </Button>
            </Link>
          }
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default UploadDialog;
