import React, { Component } from "react";
import { Button, Divider, FormControl, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  paperContent: {
    padding: "15px 20px 15px 20px",
  },
  createAssessmentButton: {
    margin: "15px",
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.create.main,
    },
  },
});

class CreateAssessment extends Component {
  constructor() {
    super();
    this.state = {
      value: "option1",
    }
  }

  handleChange = (event) => {
    this.setState(event.target.value);
  };

  render() {
    const { classes }  = this.props;

    document.title = "Schooly | Buat Kuis";

    return (
      <div className={classes.root}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Paper className={classes.paperContent}>
              <Grid container direction="column" spacing={1} justify="center">
                <Grid item>
                  <TextField
                    fullWidth
                    inputProps={{
                      placeholder: "Judul Kuis",
                      style: {
                        fontSize: "30px",
                        borderBottom: "none",
                        boxShadow: "none",
                        margin: "0px",
                        padding: "0px",
                        WebkitBoxShadow: "0 0 0 1000px white inset",
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    multiline
                    fullWidth
                    inputProps={{
                      placeholder: "Deskripsi Kuis",
                      style: {
                        borderBottom: "none",
                        boxShadow: "none",
                        margin: "0px",
                        WebkitBoxShadow: "0 0 0 1000px white inset",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <Grid container>
                <Grid item xs className={classes.paperContent}>
                  <Grid item container direction="column" spacing={2}>
                    <Grid item>
                      <Typography variant="h6">
                        Soal 1
                      </Typography>
                      <TextField multiline fullWidth variant="filled" />
                    </Grid>
                    <Grid item>
                      <FormControl component="fieldset">
                        <RadioGroup value={this.state.value} onChange={this.handleChange}>
                          <FormControlLabel value="female" control={<Radio />} label="Female" />
                          <FormControlLabel value="male" control={<Radio />} label="Male" />
                          <FormControlLabel value="other" control={<Radio />} label="Other" />
                          <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider flexItem orientation="vertical" />
                <Grid item xs={1} container direction="column" alignItems="center" className={classes.paperContent}>
                  <Grid item>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
};

export default (withStyles(styles)(CreateAssessment));
