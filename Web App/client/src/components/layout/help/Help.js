import React from "react";
import {  Button, Drawer, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Paper, Typography, List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import EmailIcon from "@material-ui/icons/Email";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import InstagramIcon from "@material-ui/icons/Instagram";
import MailIcon from "@material-ui/icons/Mail";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "1000px",
    margin: "auto",
  },
  mainGrid: {
    textAlign: "justify",
    marginBottom: "75px",
  },
  helpTitle: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#61bd4f",
    marginBottom: "50px",
    textAlign: "center",
  },
}));

function Help(props) {
  document.title="Schooly | Bantuan"

  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.helpTitlePaper}>
        <Typography variant="h3" className={classes.helpTitle}>
          <p>Topik-Topik Bantuan</p>
        </Typography>
      </Paper>

      <div style={{marginBottom: "100px"}}>
        <ExpansionPanel expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
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
        <ExpansionPanel expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              Apa yang saya lakukan jika saya lupa kata sandi akun saya?
            </Typography>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails>
            <Typography>
              Pada halaman masuk, dapat diketuk tautan "Lupa Kata Sandi?", ikuti langkah-langkah yang tertera untuk mendapatkan kembali akun anda.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === "panel3"} onChange={handleChange("panel3")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              Apakah tugas yang telah dikumpulkan dapat diunduh kembali?
            </Typography>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails>
            <Typography>
              Tugas yang telah dikumpulkan dapat diunduh kembali dengan mengetuk tombol unduh disamping arsip yang dikumpulkan.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === "panel4"} onChange={handleChange("panel4")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              General settings
            </Typography>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails>
            <Typography>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissim quam.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === "panel5"} onChange={handleChange("panel5")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              General settings
            </Typography>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails>
            <Typography>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissim quam.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === "panel6"} onChange={handleChange("panel6")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              General settings
            </Typography>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails>
            <Typography>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissim quam.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === "panel7"} onChange={handleChange("panel7")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              General settings
            </Typography>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails>
            <Typography>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissim quam.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === "panel8"} onChange={handleChange("panel8")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              General settings
            </Typography>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails>
            <Typography>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissim quam.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === "panel9"} onChange={handleChange("panel9")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              General settings
            </Typography>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails>
            <Typography>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissim quam.
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
  )
}

export default Help;
