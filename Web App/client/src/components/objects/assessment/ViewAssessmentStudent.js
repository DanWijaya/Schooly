import React from "react";
import { Link } from "react-router-dom";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Badge, Button, Divider, FormControl, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup, TablePagination, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
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
  startAssessmentButton: {
    backgroundColor: theme.palette.create.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.create.main,
    },
  },
  questionPaper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "35px",
    height: "35px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  saveAnswerButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  pageButton: {
    width: "35px",
    height: "35px",
    padding: "0px",
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    }
  },
}));

function QuestionPage(props) {
  const { classes } = props;

  return (
    <Grid item>
      <Link to={props.question_link}>
        <Paper variant="outlined" button className={classes.questionPaper}>
          <Typography>
            {props.question_number}
          </Typography>
        </Paper>
      </Link>
    </Grid>
  )
}

function ViewAssessmentStudent() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <form>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Paper>
              <Grid container direction="column" spacing={5} alignItems="center" className={classes.content}>
                <Grid item>
                  <Typography variant="h6" align="center">
                    Mata Pelajaran
                  </Typography>
                  <Typography variant="h4" align="center" gutterBottom>
                    Judul Kuis
                  </Typography>
                  <Typography align="center">
                    Deskripsi Kuis
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="contained" className={classes.startAssessmentButton}>
                    Mulai
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <div className={classes.content}>
                <Typography color="primary" style={{marginBottom: "20px"}}>
                  Pindah ke Soal:
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                  <QuestionPage
                    classes={classes}
                    question_link="/daftar-kuis"
                    question_number="1"
                  />
                </Grid>
              </div>
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
          <Grid item>
            <Paper>
              <Grid container>
              <Divider flexItem orientation="vertical" />
              <Grid item container spacing={2} justify="flex-end" alignItems="center" className={classes.content}>
                <Grid item>
                  <LightTooltip title="Soal Sebelumnya">
                    <IconButton className={classes.pageButton}>
                      <ChevronLeftIcon />
                    </IconButton>
                  </LightTooltip>
                </Grid>
                <Grid item>
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
                    <Button variant="contained" className={classes.saveAnswerButton}>
                      Simpan Jawaban
                    </Button>
                  </Badge>
                </Grid>
                <Grid item>
                  <LightTooltip title="Soal Selanjutnya">
                    <IconButton className={classes.pageButton}>
                      <ChevronRightIcon />
                    </IconButton>
                  </LightTooltip>
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
