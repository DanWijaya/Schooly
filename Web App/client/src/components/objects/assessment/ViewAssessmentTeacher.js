import React, { Component } from "react";
import { Link } from "react-router-dom";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Button, Divider, Fab, FormControl, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup, TablePagination, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  content: {
    padding: "20px",
  },
  seeAllAssessmentButton: {
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.create.main,
    },
  },
  editAssessmentButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteAssessmentButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
}));

function ViewAssessmentTeacher() {
  const classes = useStyles();

  document.title = "Schooly | Buat Kuis";

  return (
    <div className={classes.root}>
      <form>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Paper className={classes.content}>
              <Typography variant="h5" gutterBottom>
                <b>Judul Kuis</b>
              </Typography>
              <Typography color="textSecondary" style={{marginBottom: "50px"}}>
                Deskripsi Kuis
              </Typography>
              <Typography variant="body2" color="primary">
                Waktu Pengerjaan: 24 Jam
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <Grid container direction="column" spacing={2} className={classes.content}>
                <Grid item>
                  <Typography variant="h6" gutterBottom>
                    Soal 1
                  </Typography>
                  <Typography>
                    Isi pertanyaan 1.
                  </Typography>
                </Grid>
                <Grid item>
                  <FormControl component="fieldset">
                    <RadioGroup>
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="other" control={<Radio />} label="Other" />
                      <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" />
                      <FormControlLabel disabled control={<Radio />} label={<TextField />} />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item container spacing={2} justify="flex-end" alignItems="center">
            <Grid item>
              <Link to="">
                <Fab variant="extended" className={classes.seeAllAssessmentButton}>
                  <AssignmentIcon style={{marginRight: "10px"}} />
                  Lihat Hasil
                </Fab>
              </Link>
            </Grid>
            <Grid item>
              <Link to="">
                <LightTooltip title="Sunting Tugas" placement="bottom">
                  <Fab className={classes.editAssessmentButton}>
                    <EditIcon />
                  </Fab>
                </LightTooltip>
              </Link>
            </Grid>
            <Grid item>
              <LightTooltip title="Buang Tugas" placement="bottom">
                <Fab className={classes.deleteAssessmentButton} onClick="">
                  <DeleteIcon />
                </Fab>
              </LightTooltip>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  )
};

export default ViewAssessmentTeacher;
