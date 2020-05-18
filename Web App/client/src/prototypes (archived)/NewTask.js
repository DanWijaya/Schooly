import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Avatar, Button, Divider, Grid, IconButton, List, ListItem,
  ListItemAvatar, ListItemText, Paper, TextField, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import ForumIcon from '@material-ui/icons/Forum';
import PublishIcon from "@material-ui/icons/Publish";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1075px",
  },
  profilePicture: {
    width: theme.spacing(5),
    height: theme.spacing(5),
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
  workButton: {
    width: "200px",
  },
}));

function TaskDiscussionComment(props) {
  const classes = useStyles();

  return(
    <ListItem>
      <ListItemAvatar>
        <Avatar src={props.user_photo} className={classes.profilePicture} />
      </ListItemAvatar>
      <ListItemText
        primary={props.user_name}
        secondary={props.user_task_discussion_comment}
      />
    </ListItem>
  )
}

function NewTask(props) {

  const { user } = props.auth;
  const classes = useStyles();

  return(
    <div className={classes.root}>
      <Grid container
        spacing={2}
        style={{
          display: "flex",
          justifyContent: "space-between"
          }}
      >
        <Paper className={classes.paperBox}>
          <Grid item
            container
            spacing={2}
            style={{width: "700px"}}
          >
            <Grid item xs={6}>
              <Typography variant="h4" >
                Task Title
              </Typography>
              <Typography variant="caption" color="textSecondary">
                <h6>Subject Name</h6>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Penanggung Jawab:
              </Typography>
            </Grid>
            <Grid item xs={6}
              container
              direction="column"
              alignItems="flex-end"
            >
              <Typography variant="overline" color="textSecondary">
                Tanggal Kumpul:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Nilai Maksimum: 100
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Deskripsi Tugas:
              </Typography>
              <Typography variant="paragraph" gutterBottom>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
                dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Berkas yang Terlampir:
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paperBox}>
          <Grid item
            container
            direction="column"
            justify="space-evenly"
            style={{width: "300px"}}
          >
            <Grid item container style={{alignItems: "center"}}>
              <ForumIcon style={{marginRight: "10px"}}/>
              <Typography variant="h6">
                Diskusi Tugas Pribadi
              </Typography>
            </Grid>
            <Divider />
            <Grid item>{/*A height should be set*/}
              <List>
                <TaskDiscussionComment
                  user_photo={`/api/uploads/image/${user.avatar}`}
                  user_name={user.name}
                  user_task_discussion_comment="My name is Budi"
                />
              </List>
            </Grid>
            <Divider />
            <Grid item>
              <Avatar src={`/api/uploads/image/${user.avatar}`} className={classes.profilePicture} />
              <TextField label="Tulis komentar pribadi" variant="outlined" />
              <IconButton>
                <SendIcon style={{color: "#2196f3"}}/>
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid container spacing={2} className={classes.workBox}>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={classes.workButton}
            style={{color: "#2196f3", backgroundColor: "white"}}
          >
            Unggah Tugas
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<PublishIcon />}
            className={classes.workButton}
            style={{color: "white", backgroundColor: "#2196f3"}}
          >
            Kumpul Tugas
          </Button>
        </Grid>
      </Grid>

      <div>
        <Paper>
          <Typography style={{color: "red"}} gutterBottom>
            Not Submitted/Due Soon/Not Graded/Graded
          </Typography>
          <Typography>
            <h3>Nilai:</h3>
            You got a motherfuckin rotten egg u stupid
          </Typography>
        </Paper>
      </div>
    </div>
  )
}

NewTask.propTypes = {
   auth: PropTypes.object.isRequired,
 }

const mapStateToProps = (state) => ({
   auth: state.auth
 });

export default connect(
   mapStateToProps
 ) (NewTask);
