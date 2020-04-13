import React from "react";
import { Badge, Button, Grid, IconButton, Paper, Typography } from "@material-ui/core"
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssessmentIcon from "@material-ui/icons/AssessmentOutlined";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AddBoxIcon from '@material-ui/icons/AddBox';

function ClassSubjectList() {
  return(
    <div style={{marginLeft: "100px"}}>
      <Paper>
        <Grid container spacing={2}>
          <Grid item>
              <img src="" />
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
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
            <Grid item>
              <Typography variant="subtitle1">
                Hooray, there is no work assigned!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<AddBoxIcon />}
      > //This button will only be showed for administators
        Add A New Class
      </Button>
    </div>
  )
}

export default ClassSubjectList;
