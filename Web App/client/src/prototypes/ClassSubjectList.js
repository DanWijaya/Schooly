import React from "react";
import { Badge, Button, Grid, IconButton, Paper, Typography } from "@material-ui/core"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssessmentIcon from "@material-ui/icons/AssessmentOutlined";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AddBoxIcon from '@material-ui/icons/AddBox';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    marginTop: "30px",
    maxWidth: "1000px",
  },
  classCardPaper: {
    padding: "15px",
  },
  classWallpaper: {
    width: "50%",
    height: "50%",
  },
  classInfo: {
    display: "flex",
    alignItems: "center",
  },
}));

function ClassSubjectList() {
  const classes = useStyles();

  return(
    <div className={classes.root}>
      <Paper className={classes.classCardPaper}>
        <Grid container spacing={2}>
          <Grid item>
              <img src="" className={classes.classWallpaper} />
          </Grid>
          <Grid item xs={6} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography variant="subtitle1" gutterBottom>
                  <h2>Subject Name</h2>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <h5>Class XA</h5>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Teacher: LEONARDUS
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                  <IconButton>
                    <Badge badgeContent={5} color="secondary">
                      <AnnouncementIcon />
                    </Badge>
                  </IconButton>
                  <IconButton>
                    <Badge badgeContent={17} color="secondary">
                      <AssignmentIcon />
                    </Badge>
                  </IconButton>
                  <IconButton>
                    <Badge badgeContent={50} color="secondary">
                      <AssessmentIcon />
                    </Badge>
                  </IconButton>
                </Typography>
              </Grid>
            </Grid>
            <Grid item className={classes.classInfo}>
              <Typography variant="subtitle1">
                Hooray, there is no work assigned!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/*This button will only be showed for administators or maybe teacher*/}
      <Button
        variant="contained"
        startIcon={<AddBoxIcon />}
        style={{
          marginTop: "30px",
        }}
      >
        Add A New Class
      </Button>
    </div>
  )
}

export default ClassSubjectList;
