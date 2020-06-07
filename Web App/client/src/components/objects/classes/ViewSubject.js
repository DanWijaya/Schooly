import React from "react";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Avatar, Badge, Divider, ExpansionPanel, ExpansionPanelSummary, Fab, Grid,
   IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText,
   Menu, MenuItem, Paper, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import PostAddIcon from "@material-ui/icons/PostAdd";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { GrNotes, GrDocumentPerformance } from "react-icons/gr";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    marginTop: "30px", //Should be deleted after theme passing from navbar worked
    maxWidth: "800px",
  },
  subjectIcons: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    color: "grey",
  },
  subjectCardPaper: {
    padding: "15px",
    paddingBottom: "40px",
  },
  subjectPanel: {
    marginLeft: "50px",
  },
  expansionPanelList: {
    marginLeft: "20px",
    marginRight: "15px",
    marginBottom: "10px",
  },
}));

function WorkListItem(props) {
  return (
    <ListItem button component="a" href={props.work_link}>
      <ListItemAvatar>
        <Avatar>
          {props.work_category_avatar}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="h6">
            {props.work_title}
          </Typography>
        }
        secondary={props.work_sender}
      />
      <ListItemSecondaryAction>
        <Typography>
          {props.work_status}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

function ViewSubject() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleCreateMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCreateMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.subjectCardPaper}>
      <Grid container>
        <Grid item xs={6} container direction="column" spacing={3}>
          <Grid item xs>
            <Typography variant="subtitle1">
              <h3>Subject Name</h3>
            </Typography>
            <Typography variant="body2">
              <h5>Class XA</h5>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Teacher: LEONARDUS
            </Typography>
          </Grid>
          <Grid item>
            <LightTooltip title="Pengumuman">
              <IconButton disabled>
                <Badge badgeContent={0} color="secondary">
                  <AnnouncementIcon />
                </Badge>
              </IconButton>
            </LightTooltip>
            <LightTooltip title="Tugas">
              <IconButton disableRipple style={{cursor: "default"}}>
                <Badge badgeContent={5} color="secondary">
                  <AssignmentIcon />
                </Badge>
              </IconButton>
            </LightTooltip>
            <LightTooltip title="Kuis">
              <IconButton disabled>
                <Badge badgeContent={0} color="secondary">
                  <GrNotes className={classes.subjectIcons} />
                </Badge>
              </IconButton>
            </LightTooltip>
            <LightTooltip title="Ujian">
              <IconButton disabled>
                <Badge badgeContent={0} color="secondary">
                  <GrDocumentPerformance className={classes.subjectIcons} />
                </Badge>
              </IconButton>
            </LightTooltip>
          </Grid>
        </Grid>
        <Grid item xs={6} container justify="flex-end" alignItems="flex-end">
          <Fab color="primary" onClick={handleCreateMenuOpen}>
            <PostAddIcon fontSize="large" />
          </Fab>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCreateMenuClose}
          >
            <MenuItem onClick={handleCreateMenuClose}>Buat Tugas</MenuItem>
            <MenuItem onClick={handleCreateMenuClose}>Buat Kuis</MenuItem>
            <MenuItem onClick={handleCreateMenuClose}>Buat Ujian</MenuItem>
          </Menu>
        </Grid>
      </Grid>
      </Paper>

      <Grid container direction="column" style={{marginTop: "20px"}}>
        <Grid item className={classes.subjectPanel}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Tugas
              </Typography>
            </ExpansionPanelSummary>
            <Divider />
            <List className={classes.expansionPanelList}>
              <WorkListItem
                work_title="Tugas Fisika"
                work_category_avatar=""
                work_sender="Mr Jenggot"
                work_status="Telah Dikumpulkan"
                work_link="/test"
              />
              <WorkListItem
                work_title="Tugas Biologi"
                work_category_avatar=""
                work_sender="Mr Jenggot"
                work_status="Belum Dikumpulkan"
                work_link="/test"
              />
            </List>
          </ExpansionPanel>
        </Grid>
        <Grid item className={classes.subjectPanel}>
          <ExpansionPanel disabled>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Kuis (Coming Soon)
              </Typography>
            </ExpansionPanelSummary>
            <Divider />
            <List className={classes.expansionPanelList}>
              <WorkListItem
                work_title="Tugas Fisika"
                work_category_avatar=""
                work_sender="Mr Jenggot"
                work_status="Telah Dikumpulkan"
                work_link="/test"
              />
              <WorkListItem
                work_title="Tugas Biologi"
                work_category_avatar=""
                work_sender="Mr Jenggot"
                work_status="Belum Dikumpulkan"
                work_link="/test"
              />
            </List>
          </ExpansionPanel>
        </Grid>
        <Grid item className={classes.subjectPanel}>
          <ExpansionPanel disabled>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Ujian (Coming Soon)
              </Typography>
            </ExpansionPanelSummary>
            <Divider />
            <List className={classes.expansionPanelList}>
              <WorkListItem
                work_title="Tugas Fisika"
                work_category_avatar=""
                work_sender="Mr Jenggot"
                work_status="Telah Dikumpulkan"
                work_link="/test"
              />
              <WorkListItem
                work_title="Tugas Biologi"
                work_category_avatar=""
                work_sender="Mr Jenggot"
                work_status="Belum Dikumpulkan"
                work_link="/test"
              />
            </List>
          </ExpansionPanel>
        </Grid>
      </Grid>
    </div>
  )
}

export default ViewSubject;
