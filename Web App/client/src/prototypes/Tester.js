import React from 'react';
import { Fraction, toTex } from 'algebra.js';
import { Node, Context } from 'react-mathjax2';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Button, Paper, Grid, Typography, AppBar, Dialog, FormControlLabel, Switch, Slide, Toolbar, TextField, IconButton, List, ListItem, ListItemText, Divider } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    margin: "auto",
    maxWidth: "1000px",
    minHeight: "500px",
    padding: "10px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    [theme.breakpoints.up("sm")]: {
      backgroundSize: "contain",
    },
  },
  mainPaper: {
    margin: "auto",
    maxWidth: "350px",
    padding: "40px",
  },
  changePasswordButton: {
    width: "100%",
    marginTop: "30px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Formula(props) {
  return (
    <Context input="tex">
      <Node inline>{props.tex}</Node>
    </Context>
  );
}

export default function Tester() {
  //Latex
  const a = new Fraction(1, 5);
  const b = new Fraction(2, 7);
  const answer = a.multiply(b);

  const question = <Formula tex={`${toTex(a)} × ${toTex(b)} = ${toTex(answer)}`} />;

  document.getElementById('math')

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{margin: "auto", maxWidth: "1000px"}}>
      <div>
        {question}
      </div>
      <InlineMath math="\\int_0^\\infty x^2 dx"/>
      <BlockMath math="\\int_0^\\infty x^2 dx"/>
      <div className={classes.root}>
        <Paper elevation={11} className={classes.mainPaper}>
          <Grid container direction="column" spacing={5}>
            <Grid item>
              <Typography variant="h6" align="center" gutterBottom>
                <b>Ubah Kata Sandi</b>
              </Typography>
              <Typography variant="body1" align="center" color="textSecondary">
                Masukkan Kata Sandi baru Anda
              </Typography>
            </Grid>
            <Grid item>
              <form noValidate>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <label for="password">Kata Sandi</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="password"
                    />
                  </Grid>
                  <Grid item>
                    <label for="password2">Konfirmasi Kata Sandi</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      type="submit"
                      className={classes.changePasswordButton}
                    >
                      Ubah Kata Sandi
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </div>
  );
}
