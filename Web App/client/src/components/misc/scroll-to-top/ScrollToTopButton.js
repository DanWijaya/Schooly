import React from "react";
import PropTypes from "prop-types";
import { Fab, Zoom } from "@material-ui/core";
import { useScrollTrigger } from "@material-ui/core";
import { CircularProgress, Typography } from "@material-ui/core";
import { KeyboardArrowUp as KeyboardArrowUpIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  scrollToTopButton: {
    position: "fixed",
    bottom: "15px",
    right: "15px",
  },
}));

function ScrollToTopButton(props) {
  const classes = useStyles();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 900,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} className={classes.scrollToTopButton}>
        <Fab color="primary" size="small">
          <KeyboardArrowUpIcon />
        </Fab>
      </div>
    </Zoom>
  );
}

export default ScrollToTopButton;
