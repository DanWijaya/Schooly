import React from "react";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Image1 from "./Gambar/fisika-kuantum-ilustrasi.jpg";
import Image2 from "./Gambar/w644.jpg";
import Image3 from "./Gambar/drawing-the-chemical-theme-on-a-black-background-FGJT3X.jpg";
import { createMuiTheme } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";
import { List, ListItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "5%",
    marginLeft: "100px",
    padding: "300px",
    backgroundColor: "blue",
  },
  paper: {
    marginRight: "10%",
    marginLeft: "10%",
    width: "210px",
    marginBottom: "6%",
  },
  type: {
    padding: "10px",
    borderRadius: 5,
    backgroundColor: fade("#FFFFFF", 0.7),
    fontFamily: "Alegreya",
    fontWeight: "550",
    minHeight: "20px",
    minWidth: "80px",
  },
  button: {
    backgroundColor: fade("#FFFFFF", 0.7),
    fontSize: 12,
    fontFamily: "Alegreya",
    marginTop: "20%",
  },
}));

const theme = createMuiTheme();

theme.typography.h3 = {
  fontSize: "0.9rem",

  [theme.breakpoints.up("sm")]: {
    fontSize: "0.9rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.2rem",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "1.5rem",
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: "1.8rem",
  },
};

function SimpleDialog(props) {
  const { onClose, selectedValue, open, subject } = props;
  const pass_subject = subject;
  const stylesheet = useStyles();

  const handleClose = () => {
    onClose(selectedValue);
  };

  function handleSubject(subject) {
    if (subject === "Fisika") {
      return (
        <div>
          <Paper className={stylesheet.paper}>Nama Pelajaran : Fisika</Paper>
          <Paper className={stylesheet.paper}>
            Nama Guru : Heru Pambudi, S.Pd.
          </Paper>
          <Paper className={stylesheet.paper}>Semester : I (Ganjil)</Paper>
          <Paper className={stylesheet.paper}>
            <div>Materi Pokok :</div>
            <List style={{ padding: "2%" }}>
              <ListItem className={{ fontSize: 12 }}>
                Besaran dan Dimensi
              </ListItem>
              <ListItem className={{ fontSize: 12 }}>Kinematika Gerak</ListItem>
              <ListItem className={{ fontSize: 12 }}>
                Dinamika (Gaya dan Hukum Newton)
              </ListItem>
              <ListItem className={{ fontSize: 12 }}>
                Gelombang Bunyi dan Cahaya
              </ListItem>
              <ListItem className={{ fontSize: 12 }}>
                Listrik AC/DC, Kapasitor
              </ListItem>
            </List>
          </Paper>
        </div>
      );
    } else if (subject === "Matematika") {
      return (
        <div>
          <Paper className={stylesheet.paper}>
            Nama Pelajaran : Matematika
          </Paper>
          <Paper className={stylesheet.paper}>
            Nama Guru : Ag. Eko Hendarto, S.Pd.
          </Paper>
          <Paper className={stylesheet.paper}>Semester : I (Ganjil)</Paper>
          <Paper className={stylesheet.paper}>
            <div>Materi Pokok :</div>
            <List style={{ padding: "2%" }}>
              <ListItem className={{ fontSize: 12 }}>
                Aritmatika Aljabar
              </ListItem>
              <ListItem className={{ fontSize: 12 }}>
                Polinom (Suku Banyak)
              </ListItem>
              <ListItem className={{ fontSize: 12 }}>
                Peluang dan Kejadian
              </ListItem>
              <ListItem className={{ fontSize: 12 }}>Operasi Matriks</ListItem>
              <ListItem className={{ fontSize: 12 }}>
                Kalkulus (Turunan dan Integral)
              </ListItem>
            </List>
          </Paper>
        </div>
      );
    } else if (subject === "Kimia") {
      return (
        <div>
          <Paper className={stylesheet.paper}>Nama Pelajaran : Kimia</Paper>
          <Paper className={stylesheet.paper}>
            Nama Guru : Henrikus Supriyanto, S.Pd.
          </Paper>
          <Paper className={stylesheet.paper}>Semester : I (Ganjil)</Paper>
          <Paper className={stylesheet.paper}>
            <div>Materi Pokok :</div>
            <List style={{ padding: "2%" }}>
              <ListItem className={{ fontSize: 12 }}>Teori Atom</ListItem>
              <ListItem className={{ fontSize: 12 }}>
                Unsur, Senyawa, dan Campuran
              </ListItem>
              <ListItem className={{ fontSize: 12 }}>
                Mol dan Konsentrasi (Konsep Mol)
              </ListItem>
              <ListItem className={{ fontSize: 12 }}>
                Senyawa Hidrokarbon
              </ListItem>
              <ListItem className={{ fontSize: 12 }}>
                Kesetimbangan Kimia
              </ListItem>
            </List>
          </Paper>
        </div>
      );
    }
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
        Deskripsi Mata Pelajaran
      </DialogTitle>
      {handleSubject(pass_subject)}
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

function Abc() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [subject, setSubject] = React.useState(null);
  const stylesheet = useStyles();

  const handleClickOpen = (name) => {
    setOpen(true);
    setSubject(name);
  };

  // const handleClickOpenFisika = () => {
  //   setOpen(true);
  //   setSubject('Fisika')
  // };

  // const handleClickOpenMatematika = () => {
  //   setOpen(true);
  //   setSubject('Matematika')
  // };

  // const handleClickOpenKimia = () => {
  //   setOpen(true);
  //   setSubject('Kimia')
  // };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      spacing={2}
    >
      <Grid
        item
        xs={6}
        sm={3}
        align="center"
        style={{
          padding: "100px",
          margin: "15px",
          borderRadius: 35,
          backgroundImage: `url(${Image1})`,
        }}
      >
        <ThemeProvider theme={theme}>
          <Typography variant="h3" align="center" className={stylesheet.type}>
            FISIKA
          </Typography>
        </ThemeProvider>
        <Button
          style={{
            backgroundColor: fade("#FFFFFF", 0.7),
            fontSize: 12,
            fontFamily: "Alegreya",
            marginTop: "20%",
          }}
          onClick={() => handleClickOpen("Fisika")}
        >
          Deskripsi Pelajaran
        </Button>
        <SimpleDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
          subject={subject}
        />
      </Grid>
      <Grid
        item
        xs={6}
        sm={3}
        align="center"
        style={{
          padding: "100px",
          margin: "15px",
          borderRadius: 35,
          backgroundImage: `url(${Image2})`,
        }}
      >
        <ThemeProvider theme={theme}>
          <Typography variant="h3" align="center" className={stylesheet.type}>
            MAT
          </Typography>
        </ThemeProvider>
        <Button
          style={{
            backgroundColor: fade("#FFFFFF", 0.7),
            fontSize: 12,
            fontFamily: "Alegreya",
            marginTop: "20%",
          }}
          onClick={() => handleClickOpen("Matematika")}
        >
          Deskripsi Pelajaran
        </Button>
        <SimpleDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
          subject={subject}
        />
      </Grid>
      <Grid
        item
        xs={6}
        sm={3}
        align="center"
        style={{
          padding: "100px",
          margin: "20px",
          borderRadius: 35,
          backgroundImage: `url(${Image3})`,
        }}
      >
        <ThemeProvider theme={theme}>
          <Typography variant="h3" align="center" className={stylesheet.type}>
            KIMIA
          </Typography>
        </ThemeProvider>
        <Button
          style={{
            backgroundColor: fade("#FFFFFF", 0.7),
            fontSize: 12,
            fontFamily: "Alegreya",
            marginTop: "20%",
          }}
          onClick={() => handleClickOpen("Kimia")}
        >
          Deskripsi Pelajaran
        </Button>
        <SimpleDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
          subject={subject}
        />
      </Grid>
    </Grid>
  );
}

export default Abc;
