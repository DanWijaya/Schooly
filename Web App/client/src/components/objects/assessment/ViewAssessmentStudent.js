import React from "react";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Button, Divider, FormControl, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup, TablePagination, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteIcon from "@material-ui/icons/Delete";
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
}));

function ViewAssessmentStudent() {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <form>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Paper>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <Grid container direction="column" spacing={3} justify="center" className={classes.content}>
                <Grid item>
                  <Typography variant="h5" gutterBottom>
                    Judul Kuis
                  </Typography>
                  <Typography>
                    Deskripsi Kuis
                  </Typography>
                </Grid>
                <Grid item>
                  {/*<CountdownCircleTimer
                    isPlaying
                    duration={10}
                    colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
                    onComplete={() => [true, 1000]}
                  >
                    {renderTime}
                  </CountdownCircleTimer> */}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <Grid container>
                <Grid item xs sm className={classes.content}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        Soal 1
                      </Typography>
                      <TextField multiline fullWidth variant="filled" />
                    </Grid>
                    <Grid item>
                      <FormControl component="fieldset">
                        <RadioGroup value="" onChange="">
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
                <Grid item xs={3} sm={1} className={classes.content}>
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
        </Grid>
      </form>
    </div>
  )
};

export default ViewAssessmentStudent;
