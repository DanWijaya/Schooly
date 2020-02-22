import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
            asas
          <Paper className={classes.paper}>Wangdin</Paper>
        </Grid>
        <Grid item xs={6}>
            asasfdf
          <Paper className={classes.paper}>Ciu Siam</Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>Handersen Isaac
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}