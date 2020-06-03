import React from "react";
import { Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
    textAlign: "center",
  },
  helpTitle: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#61bd4f",
    marginBottom: "50px",
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
        <Typography className={classes.helpTitle}>
          Butuh bantuan dalam menggunakan Schooly? Silahkan baca pertanyaan yang sering diajukan di bawah ini.
        </Typography>
      </Paper>

      <Grid container spacing={3} className={classes.mainGrid}>
        <Grid item xs={4}>
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
        </Grid>
        <Grid item xs={4}>
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
        </Grid>
        <Grid item xs={4}>
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
        </Grid>

        <Grid item xs={4}>
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
        </Grid>
        <Grid item xs={4}>
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
        </Grid>
        <Grid item xs={4}>
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
        </Grid>

        <Grid item xs={4}>
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
        </Grid>
        <Grid item xs={4}>
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
        </Grid>
        <Grid item xs={4}>
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
        </Grid>
      </Grid>

      <Paper className={classes.helpTitlePaper}>
        <Typography className={classes.helpTitle}>
          Butuh bantuan lebih lanjut? Silahkan hubungi kami: 911
        </Typography>
      </Paper>
    </div>
  )
}

export default Help;
