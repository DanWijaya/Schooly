import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import OptionMenu from "../../misc/menu/OptionMenu";
import { Grid, Typography } from "@material-ui/core";
import { LibraryBooks as LibraryBooksIcon } from "@material-ui/icons";
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
    minHeight: "65px",
    padding: "10px 10px 10px 20px",
  },
}));

function SubjectItem(props) {
  const classes = useStyles();
  const { data, handleOpenDeleteDialog, handleOpenEditDialog } = props;
  const { user } = props.auth;

  return data.map((row) => (
    <Grid item>
      <Grid container alignItems="stretch" className={classes.root}>
        <Grid item className={classes.subjectIcon}>
          <LibraryBooksIcon />
        </Grid>
        <Grid item xs
          container
          justify="space-between"
          alignItems="center"
          className={classes.subjectItemContent}
        >
          <Grid item>
            <Typography noWrap>{row.name}</Typography>
          </Grid>
          {user.role === "Admin" ? (
            <Grid item
              onClick={(e) => e.stopPropagation()}
            >
              <OptionMenu
                actions={["Sunting", "Hapus"]}
                row={row}
                handleActionOnClick={[
                  handleOpenEditDialog,
                  handleOpenDeleteDialog,
                ]}
              />
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  ));
}

SubjectItem.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(SubjectItem);
