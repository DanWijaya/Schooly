import React, { Component } from "react";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import lokal from "date-fns/locale/id";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Badge, Button, CircularProgress, Divider, FormControl, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup, TablePagination, TextField, Typography } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import SaveIcon from "@material-ui/icons/Save";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  content: {
    padding: "20px",
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
                <div className={classes.content}>
                  <Typography variant="h5" gutterBottom>
                    <b>Buat Kuis</b>
                  </Typography>
                  <Typography color="textSecondary">
                    Tambahkan keterangan kuis untuk membuat kuis.
                  </Typography>
                </div>
                <Divider />
                <Grid container direction="column" spacing={3} justify="center" className={classes.content}>
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
                  <Grid item>
                    <Typography component="label" for="workTime" color="primary">
                      Jadwal Pengerjaan
                    </Typography>
                    <MuiPickersUtilsProvider locale={lokal} utils={DateFnsUtils}>
                      <KeyboardDateTimePicker
                        fullWidth
                        disablePast
                        inputVariant="outlined"
                        format="dd/MM/yyyy - HH:mm"
                        ampm={false}
                        okLabel="Simpan"
                        cancelLabel="Batal"
                        minDateMessage="Batas waktu harus waktu yang akan datang"
                        invalidDateMessage="Format tanggal tidak benar"
                        id="workTime"
                        value=""
                        onChange=""
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item>
              <Paper>
                <Grid container>
                  <Grid item xs sm md container direction="column" spacing={2} className={classes.content}>
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
                  <Divider flexItem orientation="vertical" />
                  <Grid item xs={3} sm={2} md={1} container direction="column" alignItems="center" className={classes.content}>
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
              </Paper>
            </Grid>
            <Grid item>
              <Paper>
                <Grid container justify="flex-end" spacing={2} className={classes.content}>
                  <Grid item>
                    <LightTooltip title="Tambah Soal">
                      <IconButton className={classes.addQuestionButton}>
                        <AddIcon />
                      </IconButton>
                    </LightTooltip>
                  </Grid>
                  <Grid item>
                    <LightTooltip title="Simpan Kuis">
                      <Badge
                        badgeContent={
                          <Avatar style={{backgroundColor: "green", color: "white", width: "20px", height: "20px"}}>
                            <DoneOutlineIcon style={{width: "15px", height: "15px"}} />
                          </Avatar>
                        }
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                      >
                        <IconButton className={classes.draftAssessmentButton}>
                          <SaveIcon />
                        </IconButton>
                      </Badge>
                    </LightTooltip>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" className={classes.createAssessmentButton}>
                      Buat Kuis
                    </Button>
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
