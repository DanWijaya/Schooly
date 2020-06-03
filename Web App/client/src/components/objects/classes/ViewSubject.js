import React from "react";
import { Badge, Button, Grid, IconButton, Paper, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssessmentIcon from "@material-ui/icons/AssessmentOutlined";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AddBoxIcon from "@material-ui/icons/AddBox";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    marginTop: "30px", //Should be deleted after theme passing from navbar worked
    maxWidth: "1000px",
  },
  subjectCardPaper: {
    padding: "15px",
  },
  subjectInfo: {
    display: "flex",
    alignItems: "center",
  },
}));

function ViewSubject() {
  const classes = useStyles();

  return(
    <div className={classes.root}>
      <Paper className={classes.subjectCardPaper}>
        <Grid container spacing={2}>
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
                <Typography variant="body2" style={{ cursor: "pointer" }}>
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
            <Grid item className={classes.subjectInfo}>
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
        Create a New Task
      </Button>
    </div>
  )
}

export default ViewSubject;
