import React from 'react'
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
  } from "@material-ui/core/";
  import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
  import LightTooltip from "../../misc/light-tooltip/LightTooltip";
  import { makeStyles } from "@material-ui/core/styles";
  import EditIcon from "@material-ui/icons/Edit";
  import DeleteIcon from "@material-ui/icons/Delete";

  const useStyles = makeStyles((theme) => ({
    listItem: {
        padding: "6px 16px",
      },
    listAvatar: {
        backgroundColor: theme.palette.primary.main,
    },
    editSubjectButton: {
        backgroundColor: theme.palette.primary.main,
        color: "white",
        "&:focus, &:hover": {
          backgroundColor: "white",
          color: theme.palette.primary.main,
        },
      },
      deleteSubjectButton: {
        backgroundColor: theme.palette.error.dark,
        color: "white",
        "&:focus, &:hover": {
          backgroundColor: "white",
          color: theme.palette.error.dark,
        },
      },
  }))
  function SubjectPaper(props) {
      const classes = useStyles();
    const { data, isEditable, handleOpenDeleteDialog, handleOpenFormDialog } = props;
    return (
        data.map((subject) => (
        <Grid item>
            <Paper variant="outlined">
            <ListItem className={classes.listItem}>
            <Hidden smUp implementation="css">
                <ListItemText
                style={{ margin: "6px 0" }}
                primary={
                    <Grid container alignItems="center">
                    <Typography variant="subtitle1" color="textPrimary">
                        {subject.name}
                    </Typography>

                    {/* bagian ini ditambahkan agar tinggi listitemnya sama seperti listitem yang ada props secondarynya */}
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
                        {subject.name}
                        </Typography>

                        {/* bagian ini ditambahkan agar tinggi listitemnya sama seperti listitem yang ada props secondarynya */}
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
            {isEditable ? 
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
                            subject._id,
                            subject.name,
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
                        className={classes.deleteSubjectButton}
                        onClick={(e) => {
                            handleOpenDeleteDialog(e, subject._id, subject.name);
                        }}
                        >
                        <DeleteIcon fontSize="small" />
                        </IconButton>
                    </LightTooltip>
                    </Grid>
                </Grid>
                }
            />
            : 
            null
            }
            </ListItem>
        </Paper>
      </Grid>
    )))
}

export default SubjectPaper;
