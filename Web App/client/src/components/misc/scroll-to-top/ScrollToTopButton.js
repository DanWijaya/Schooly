import React from "react";
import PropTypes from "prop-types";
import { Fab, Zoom, useScrollTrigger } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme) => ({
  scrollToTop: {
    position: "fixed",
    bottom: "15px",
    right: "15px",
  },
}));

function ScrollToTopButton(props) {
  const { window } = props;
  const classes = useStyles();

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} className={classes.scrollToTop}>
        <Fab color="primary" size="small">
          <KeyboardArrowUpIcon />
        </Fab>
      </div>
    </Zoom>
  );
}

ScrollToTopButton.propTypes = {
  window: PropTypes.func,
};

export default ScrollToTopButton;
