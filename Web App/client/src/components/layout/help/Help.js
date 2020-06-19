import React from "react";
import helpTopics from "./HelpTopics.png";
import { Button, Drawer, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Paper, Typography, List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import EmailIcon from "@material-ui/icons/Email";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import InstagramIcon from "@material-ui/icons/Instagram";
import MailIcon from "@material-ui/icons/Mail";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  helpTopicsBackground: {
    backgroundColor: "#38b6ff",
  },
  helpTopics: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: "auto",
    width: "1000px",
    height: "500px",
    color: "white",
    backgroundImage: `url(${helpTopics})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  content: {
    maxWidth: "1000px",
    margin: "auto",
  }
}));

function Help(props) {
  document.title="Schooly | Bantuan"

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.helpTopicsBackground}>
        <div className={classes.helpTopics}>
          <Typography variant="h2">
            <b>CARI TOPIK BANTUAN</b>
          </Typography>
          <Typography variant="h6">
            Temukan solusi permasalahanmu dari topik-topik bantuan berikut.
          </Typography>
        </div>
      </div>
      <div className={classes.content}>
        <div style={{marginBottom: "100px"}}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                Apa yang saya lakukan jika saya lupa email akun saya?
              </Typography>
            </ExpansionPanelSummary>
            <Divider />
            <ExpansionPanelDetails>
              <Typography>
                Email dapat didapatkan kembali dengan meminta admin sekolah anda untuk mencari email pada akun anda.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
        <Paper className={classes.helpTitlePaper} style={{marginBottom: "30px"}}>
          <Grid container direction="column" alignItems="center" className={classes.helpTitle}>
            <Typography variant="h4" gutterBottom>
              Ada yang bisa kami bantu?
            </Typography>
            <Typography variant="h6">
              Silahkan hubungi:
            </Typography>
          </Grid>
        </Paper>
        <Grid container justify="space-around">
          <Paper style={{padding: "20px"}} component="button" component="a" href="mailto:schoolysystem@gmail.com">
            <Grid item xs={6} container direction="column" alignItems="center">
                <EmailIcon style={{width: "200px", height: "200px"}} />
                <Typography variant="h7" style={{textAlign: "center"}}>
                  schoolysystem@gmail.com
                </Typography>
            </Grid>
          </Paper>
          <Paper style={{padding: "20px"}} component="button" component="a" href="mailto:schoolysystem@gmail.com">
            <Grid item xs={6} container direction="column" alignItems="center">
                <InstagramIcon style={{width: "200px", height: "200px"}} />
                <Typography variant="h7" style={{textAlign: "center"}}>
                  schoolysystem.id
                </Typography>
            </Grid>
          </Paper>
        </Grid>
      </div>
    </div>
  )
}

export default Help;
