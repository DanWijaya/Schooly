import React from "react";
import {
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import {
  LibraryBooks as LibraryBooksIcon,
  MoreVert as MoreVertIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "4px",
    boxShadow:
      "0px 1px 2px 0px rgba(60,64,67,0.12), 0px 1px 4px 1px rgba(60,64,67,0.10)",
    "&:focus, &:hover": {
      boxShadow:
        "0px 2px 3px 0px rgba(60,64,67,0.30), 0px 2px 8px 2px rgba(60,64,67,0.15)",
    },
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
}));

function SubjectItem(props) {
  const classes = useStyles();
  const {
    data,
    isEditable,
    handleOpenDeleteDialog,
    handleOpenFormDialog,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return data.map((subject) => (
    <Grid item>
      <Grid container alignItems="stretch" className={classes.root}>
        <Grid item className={classes.subjectIcon}>
          <LibraryBooksIcon />
        </Grid>
        <Grid
          item
          xs
          container
          justify="space-between"
          alignItems="center"
          className={classes.subjectItemContent}
        >
          <Grid item>
            <Typography noWrap>{subject.name}</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem
                onClick={(e) =>
                  handleOpenFormDialog(e, subject._id, subject.name, true)
                }
              >
                Sunting
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  handleOpenDeleteDialog(e, subject._id, subject.name);
                }}
              >
                Hapus
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ));
}

export default SubjectItem;
