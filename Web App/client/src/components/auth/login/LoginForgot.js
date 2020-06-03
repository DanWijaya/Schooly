import React, { Component } from "react";
import schoolyLogoAlt from "../../../images/SchoolyLogoAlt.png";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "750px",
    margin: "auto",
  },
  mainGrid: {
    maxWidth: "400px",
    padding: "40px",
  },
  infoTitle: {
    textAlign: "center",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px"
  },
  schoolyLogoAlt: {
    width: "30%",
    height: "30%",
    marginBottom: "30px",
  },
});

class LoginForgot extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      activeStep: 0,
    };
  }

  render() {
    document.title="Lupa Akun"
    const { classes } = this.props;

    const getStepContent = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return (
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="space-between"
              spacing={3}
              className={classes.mainGrid}
            >
              <Grid item className={classes.infoTitle}>
                <Typography variant="h6" gutterBottom>
                  <b>Lupa Kata Sandi?</b>
                </Typography>
                <Typography variant="body1">
                  Masukkan email dan nomor telepon anda untuk melanjutkan.
                </Typography>
              </Grid>
              <Grid item style={{width:"300px"}} >
                <form noValidate onSubmit={this.onSubmit}>
                  <div style={{marginBottom: "20px"}}>
                    <OutlinedTextField
                      on_change=""
                      value=""
                      error=""
                      id=""
                      type=""
                      classname=""
                      html_for=""
                      labelname="Email"
                      span_classname={classes.errorInfo}
                      error1=""
                      error2=""
                    />
                  </div>
                  <OutlinedTextField
                    on_change=""
                    value=""
                    error=""
                    id=""
                    type=""
                    classname=""
                    html_for=""
                    labelname="Nomor Telepon"
                    span_classname={classes.errorInfo}
                    error1=""
                    error2=""
                  />
                  <Button
                    onClick={handleNext}
                    type="submit"
                    style={{
                      backgroundColor: "#2196f3",
                      color: "white",
                      width: "100%",
                      marginTop: "30px"
                    }}
                  >
                    Lanjut
                  </Button>
                </form>
              </Grid>
            </Grid>
          );
        case 1:
          return (
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="space-between"
              spacing={3}
              className={classes.mainGrid}
            >
              <Grid item className={classes.infoTitle}>
                <Typography variant="h6" gutterBottom>
                  <b>Lupa Kata Sandi?</b>
                </Typography>
                <Typography variant="body1">
                  Jawab pertanyaan berikut agar dapat mengganti kata sandi.
                </Typography>
              </Grid>
              <Grid item style={{width:"300px"}} >
                <form noValidate onSubmit={this.onSubmit}>
                  <Typography>
                    Masukkan pertanyaan disini.
                  </Typography>
                  <OutlinedTextField
                    on_change=""
                    value=""
                    error=""
                    id=""
                    type=""
                    classname=""
                    html_for=""
                    labelname="Jawaban"
                    span_classname={classes.errorInfo}
                    error1=""
                    error2=""
                  />
                  <Button
                    onClick={handleNext}
                    type="submit"
                    style={{
                      backgroundColor: "#2196f3",
                      color: "white",
                      width: "100%",
                      marginTop: "30px"
                    }}
                  >
                    Lanjut
                  </Button>
                </form>
              </Grid>
            </Grid>
          );
        case 2:
          return (
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="space-between"
              spacing={3}
              className={classes.mainGrid}
            >
              <Grid item className={classes.infoTitle}>
                <Typography variant="h6" gutterBottom>
                  <b>Masukkan kata sandi baru anda</b>
                </Typography>
              </Grid>
              <Grid item style={{width:"300px"}} >
                <form noValidate onSubmit={this.onSubmit}>
                  <div style={{marginBottom: "20px"}}>
                    <OutlinedTextField
                      on_change=""
                      value=""
                      error=""
                      id=""
                      type=""
                      classname=""
                      html_for=""
                      labelname="Kata Sandi Baru"
                      span_classname={classes.errorInfo}
                      error1=""
                      error2=""
                    />
                  </div>
                  <OutlinedTextField
                    on_change=""
                    value=""
                    error=""
                    id=""
                    type=""
                    classname=""
                    html_for=""
                    labelname="Konfirmasi Kata Sandi Baru"
                    span_classname={classes.errorInfo}
                    error1=""
                    error2=""
                  />
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: "#61bd4f",
                      color: "white",
                      width: "100%",
                      marginTop: "30px"
                    }}
                  >
                    Selesai
                  </Button>
                </form>
              </Grid>
            </Grid>
          );
        default:
          return "Unknown stepIndex";
      }
    }

    const handleNext = () => {
      if(this.state.activeStep !== 1 || this.state.errors === null)
        this.setState(prevState => ({
          activeStep: prevState.activeStep + 1,
          submitButtonClicked: false
          })
      )
    };

    return (
      <div className={classes.root}>
        <img src={schoolyLogoAlt} className={classes.schoolyLogoAlt} alt="schooly logo alt" />
        <Paper>
          {getStepContent(this.state.activeStep)}
        </Paper>
      </div>
    )
  }
}

export default (withStyles(styles)(LoginForgot));
