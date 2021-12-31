import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  ContactMail as ContactMailIcon,
  DoneOutline as DoneOutlineIcon,
  Storage as StorageIcon,
  Email as EmailIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#CCC",
    color: "#FFF",
    zIndex: 1,
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage: "linear-gradient(136deg, #2196F3 30%, #21CBF3 90%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage: "linear-gradient(136deg, #2196F3 30%, #21CBF3 90%)",
  },
}));

function RegisterStepIcon(props) {
  const classes = useStyles();
  const { active, completed } = props;

  const icons = {
    1: <StorageIcon />,
    2: <EmailIcon />,
    3: <ContactMailIcon />,
    4: <DoneOutlineIcon />,
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
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

export default RegisterStepIcon;
