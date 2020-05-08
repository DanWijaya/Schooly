// Nanti bakal ganti viewnya di sidebarnya?
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { withStyles, useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import PublishIcon from "@material-ui/icons/Publish";
import SmsIcon from "@material-ui/icons/Sms";
import PropTypes from 'prop-types';

// import Modal from 'react-modal';

const styles = (theme) => ({
  root: {
    margin: "auto",
    marginTop: "30px",
    maxWidth: "1075px",
  },
  paperBox :{
    padding: "20px",
  },
  workBox: {
    margin: "auto",
    marginTop: "30px",
    justifyContent: "center",
    flexDirection: "row"
  },
  workButtonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  workButton: {
    width: "200px",
  },
});

class TaskDataTable extends Component {

    render(){

        const { classes } = this.props;

          return(
            <div className={classes.root}>
              <Grid container spacing={2} style={{display: "flex", justifyContent: "space-between"}}>
                <Paper className={classes.paperBox}>
                  <Grid item xs container direction="column" spacing={2} style={{width: "700px"}}>
                    <Typography variant="subtitle1" >
                      <h2>{this.props.obj.name}</h2>
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      <h6>{this.props.obj.subject}</h6>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <h5>Due Date: {this.props.obj.deadline.slice(0,10)}</h5>
                      <h5>Maximum Score: 100</h5>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Assigned by:
                    </Typography>
                    <Typography>
                      Task Description:
                    </Typography>
                    <Typography variant="paragraph" gutterBottom>
                      This task is compulsory
                    </Typography>
                    <Typography>
                      Attached Files: (Will be added once the file is uploaded)
                    </Typography>
                  </Grid>
                </Paper>
                <Paper className={classes.paperBox}>
                  <Grid item xs style={{width: "300px"}}>
                    <Typography variant="h6">
                      <SmsIcon /> Private Discussion
                    </Typography>
                  </Grid>
                </Paper>
              </Grid>
              <Grid container direction="column" spacing={2} className={classes.workBox}>
                <Grid item className={classes.workButtonContainer}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    className={classes.workButton}
                    style={{color: "#2196f3", backgroundColor: "white"}}
                  >
                    Upload Your Work
                  </Button>
                </Grid>
                <Grid item className={classes.workButtonContainer}>
                  <Button
                    variant="contained"
                    startIcon={<PublishIcon />}
                    className={classes.workButton}
                    style={{color: "white", backgroundColor: "#2196f3"}}
                  >
                    Submit Your Work
                  </Button>
                </Grid>
              </Grid>
            </div>
          )
        // return(
        //         <tr>
        //             <td style={{textAlign: "center"}}>
        //                 {this.props.obj.name}
        //             </td>
        //             <td style={{textAlign: "center"}}>
        //                 {this.props.obj.subject}
        //             </td>
        //             <td style={{textAlign: "center"}}>
        //                 {this.props.obj.deadline}
        //             </td>
        //             <td style={{textAlign: "center"}}>

        //                 {classes}
        //             </td>
        //             <td style={{textAlign: "center"}}>
        //             {/* If want to pass datas, use this kind of Link format  */}
        //             <Link to={{
        //                 pathname: `/task/${this.props.obj._id}`,
        //                 state:{
        //                     taskId : this.props.obj._id,
        //                 }
        //             }}
        //             className="btn btn-primary">Edit</Link>
        //             </td>
        //             <td style={{textAlign: "center"}}>
        //                 <Link to={{
        //                     pathname: `/deletetask/${this.props.obj._id}`,
        //                     state:{
        //                         taskId: this.props.obj._id
        //                     }
        //                 }}
        //                 className="btn btn-danger">Delete</Link>
        //             </td>
        //         </tr>
        // )
          }
}

// TaskDataTable.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(TaskDataTable);
