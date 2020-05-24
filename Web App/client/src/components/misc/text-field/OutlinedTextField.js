import React from "react";
<<<<<<< HEAD
// Atau pakai 
// const OutlinedTextField = (props) => { ... 

function OutlinedTextField (props) {
=======
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  floatingLabel: {
    fontZize: "13px",
    color: "#cccccc",
    position: "absolute",
    pointerEvents: "none",
    top: "9px",
    left: "12px",
    transition: "all 0.1s ease",
  },
}));

const OutlinedTextField = (props) => {
  const classes = useStyles();

>>>>>>> db9d4f2e2b1a58fab83b9b169dcb2bd5707ae103
  return (
    <div>
      <input
        onChange={props.on_change}
        value={props.value}
        error={props.error}
        id={props.id}
        type={props.type}
        className={props.classname}
        style={{
          width: "100%",
          padding: "10px 10px",
          margin: "8px 0",
          display: "inline-block",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxSizing: "border-box",
          "&:focus": {
            backgroundColor: "#2196f3",
          },
       }}
      />
      <label htmlFor={props.html_for} className={classes.floatingLabel}>{props.labelname}</label>
      <span className={props.span_classname}>
        {props.error1}
        {props.error2}
      </span>
    </div>
  )
}

export default OutlinedTextField;
