import React from "react"
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Button,
  IconButton,
  Grid,
  Hidden,
  Paper,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  LibraryBooks as LibraryBooksIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "4px",
    boxShadow: "0px 2px 3px 0px rgba(60,64,67,0.12), 0px 2px 8px 2px rgba(60,64,67,0.10)",
    "&:focus, &:hover": {
      boxShadow: "0px 2px 3px 0px rgba(60,64,67,0.30), 0px 2px 8px 2px rgba(60,64,67,0.15)",
    }
  },
  subjectIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "3px 0px 0px 3px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    width: "100px",
    [theme.breakpoints.down("md")]: {
      width: "60px",
    },
  },
  subjectItemContent: {
    padding: "10px 10px 10px 20px",
  },
}))

function SubjectItem(props) {
  const classes = useStyles();
  const { data, isEditable, handleOpenDeleteDialog, handleOpenFormDialog } = props;

  return (
    data.map((subject) => (
      <Grid item>
        <Grid container alignItems="stretch" className={classes.root}>
          <Grid item className={classes.subjectIcon}>
            <LibraryBooksIcon />
          </Grid>
          <Grid item xs container justify="space-between" alignItems="center" className={classes.subjectItemContent}>
            <Grid item>
              <Typography noWrap>
                {row.name}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        {/*<ListItem
          className={classes.listItem}
        >
          <Hidden smUp implementation="css">
            <ListItemText
              style={{ margin: "6px 0" }}
              primary={
                <Grid container alignItems="center">
                  <Typography variant="subtitle1" color="textPrimary">
                    {row.name}
                  </Typography>

                  <Grid item style={{ visibility: "hidden" }}>
                    <Typography variant="subtitle1">
                      {"\u200B"}
                    </Typography>
                    <Typography variant="caption">
                      {"\u200B"}
                    </Typography>
                  </Grid>
                </Grid>
              }
            />
          </Hidden>
          <Hidden xsDown implementation="css">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ListItemAvatar>
                <Avatar className={classes.listAvatar}>
                  <LibraryBooksIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                style={{ margin: "6px 0" }}
                primary={
                  <Grid container alignItems="center">
                    <Typography variant="h6" color="textPrimary">
                      {row.name}
                    </Typography>

                    <Grid item style={{ visibility: "hidden" }}>
                      <Grid container direction="column">
                        <Typography variant="h6">
                          {"\u200B"}
                        </Typography>
                        <Typography variant="body2">
                          {"\u200B"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                }
              />
            </div>
          </Hidden>
          <ListItemText
            align="right"
            primary={
              <Grid container spacing={1} justify="flex-end">
                <Grid item>
                  <LightTooltip title="Sunting">
                    <IconButton
                      size="small"
                      className={classes.editSubjectButton}
                      onClick={(e) =>
                        handleOpenFormDialog(
                          e,
                          row._id,
                          row.name,
                          true
                        )
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </LightTooltip>
                </Grid>
                <Grid item>
                  <LightTooltip title="Hapus">
                    <IconButton
                      size="small"
                      className={classes.deleteSubjectlButton}
                      onClick={(e) => {
                        handleOpenDeleteDialog(e, row._id, row.name);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </LightTooltip>
                </Grid>
              </Grid>
            }
          />
        </ListItem>*/}
      </Grid>
  )))
};

export default SubjectItem;
