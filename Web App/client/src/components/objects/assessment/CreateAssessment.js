import React, { Component } from "react";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Button, Divider, FormControl, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup, TablePagination, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import SaveIcon from "@material-ui/icons/Save";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  paperContent: {
    padding: "20px",
  },
  pageButton: {
    width: "35px",
    height: "35px",
    padding: "0px",
    backgroundColor: theme.palette.action.selected,
    color: "grey",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "grey",
    },
  },
  addQuestionButton: {
    width: "35px",
    height: "35px",
    padding: "0px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  draftAssessmentButton: {
    width: "35px",
    height: "35px",
    padding: "0px",
    backgroundColor: theme.palette.warning.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.main,
    },
  },
  createAssessmentButton: {
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
      radioValue: "option1",
    }
  }

  handleRadioValue = (event) => {
    this.setState(event.target.value);
  };

  render() {
    const { classes } = this.props;

    document.title = "Schooly | Buat Kuis";

    return (
      <div className={classes.root}>
        <form>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Paper>
                <div className={classes.paperContent}>
                  <Typography variant="h5" gutterBottom>
                    <b>Buat Kuis</b>
                  </Typography>
                  <Typography color="textSecondary">
                    Tambahkan keterangan kuis untuk membuat kuis.
                  </Typography>
                </div>
                <Divider />
                <Grid container direction="column" spacing={3} justify="center" className={classes.paperContent}>
                  <Grid item>
                    <Typography component="label" for="name" color="primary">
                      Judul
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="name"
                    />
                  </Grid>
                  <Grid item>
                    <Typography component="label" for="description" color="primary">
                      Deskripsi
                    </Typography>
                    <TextField
                      multiline
                      fullWidth
                      variant="outlined"
                      id="description"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item>
              <Paper>
                <Grid container>
                  <Grid item xs sm className={classes.paperContent}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography variant="h6" gutterBottom>
                          Soal 1
                        </Typography>
                        <TextField multiline fullWidth variant="filled" />
                      </Grid>
                      <Grid item>
                        <FormControl component="fieldset">
                          <RadioGroup value={this.state.radioValue} onChange={this.handleRadioValue}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                            <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" />
                            <FormControlLabel disabled control={<Radio />} label={<TextField />} />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider flexItem orientation="vertical" />
                  <Grid item xs={3} sm={1} className={classes.paperContent}>
                    <Grid container direction="column" alignItems="center">
                      <Grid item>
                        <LightTooltip title="Tambahkan Berkas" placement="right">
                          <IconButton>
                            <AttachFileIcon />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                      <Grid item>
                        <LightTooltip title="Duplikat Soal" placement="right">
                          <IconButton>
                            <FilterNoneIcon />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                      <Grid item>
                        <LightTooltip title="Hapus Soal" placement="right">
                          <IconButton>
                            <DeleteIcon />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item>
              <Paper>
                <Grid container>
                  <Grid item xs sm className={classes.paperContent}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography variant="h6" gutterBottom>
                          Soal 1
                        </Typography>
                        <TextField multiline fullWidth variant="filled" />
                      </Grid>
                      <Grid item>
                        <FormControl component="fieldset">
                          <RadioGroup value={this.state.radioValue} onChange={this.handleRadioValue}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                            <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" />
                            <FormControlLabel disabled control={<Radio />} label={<TextField />} />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider flexItem orientation="vertical" />
                  <Grid item xs={3} sm={1} className={classes.paperContent}>
                    <Grid container direction="column" alignItems="center">
                      <Grid item>
                        <LightTooltip title="Tambahkan Berkas" placement="right">
                          <IconButton>
                            <AttachFileIcon />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                      <Grid item>
                        <LightTooltip title="Duplikat Soal" placement="right">
                          <IconButton>
                            <FilterNoneIcon />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                      <Grid item>
                        <LightTooltip title="Hapus Soal" placement="right">
                          <IconButton>
                            <DeleteIcon />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item>
              <Paper>
                <div style={{display: "flex", justifyContent: "flex-end"}} className={classes.paperContent}>
                  <div style={{marginRight: "20px"}}>
                    <LightTooltip title="Tambah Soal">
                      <IconButton className={classes.addQuestionButton}>
                        <AddIcon />
                      </IconButton>
                    </LightTooltip>
                  </div>
                  <div style={{marginRight: "20px"}}>
                    <LightTooltip title="Simpan Kuis">
                      <IconButton className={classes.draftAssessmentButton}>
                        <SaveIcon />
                      </IconButton>
                    </LightTooltip>
                  </div>
                  <div>
                    <Button variant="contained" className={classes.createAssessmentButton}>
                      Buat Kuis
                    </Button>
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item>
              <Paper>
                <Grid container>
                  <Grid item xs className={classes.paperContent}>
                    <Grid container justify="space-between">
                      <Grid item>
                        <Grid item container spacing={3} alignItems="center">
                          <Grid item>
                            1
                          </Grid>
                          <Grid item>
                            2
                          </Grid>
                          <Grid item>
                            3
                          </Grid>
                          <Grid item>
                            <LightTooltip title="Tambah Soal">
                              <IconButton className={classes.addQuestionButton}>
                                <AddIcon />
                              </IconButton>
                            </LightTooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid item container spacing={2}>
                          <Grid item>
                            <LightTooltip title="Sebelumnya">
                              <IconButton className={classes.pageButton}>
                                <ChevronLeftIcon />
                              </IconButton>
                            </LightTooltip>
                          </Grid>
                          <Grid item>
                            <LightTooltip title="Selanjutnya">
                              <IconButton className={classes.pageButton}>
                                <ChevronRightIcon />
                              </IconButton>
                            </LightTooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider flexItem orientation="vertical" />
                  <Grid item className={classes.paperContent}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <LightTooltip title="Simpan Kuis">
                          <IconButton className={classes.draftAssessmentButton}>
                            <SaveIcon />
                          </IconButton>
                        </LightTooltip>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          className={classes.createAssessmentButton}
                        >
                          Buat Kuis
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </div>
    )
  }
};

export default (withStyles(styles)(CreateAssessment));
