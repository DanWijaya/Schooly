import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import StorageIcon from "@material-ui/icons/Storage";

const useRegisterStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage:
      "linear-gradient(136deg, #2196F3 30%, #21CBF3 90%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage:
      "linear-gradient(136deg, #2196F3 30%, #21CBF3 90%)",
  },
});

function RegisterStepIcon(props) {
  const classes = useRegisterStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <StorageIcon />,
    2: <ContactMailIcon />,
    3: <DoneOutlineIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

RegisterStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

export default RegisterStepIcon;
