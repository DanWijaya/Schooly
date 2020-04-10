import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core"

function ClassSubjectList() {
  return(
    <div>
      <Paper>
        <Grid container spacing={2}>
          <Grid item>
              <img />Insert Image Here (mungkin bakal ada image khusus per pelajaran mau cari icon pack)
              dan foto kelas kalau mau diupload
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
                  Mungkin bakal direplace dengan beberapa icon kayak notif icon
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">Nilai rata-rata subject?</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default ClassSubjectList;
