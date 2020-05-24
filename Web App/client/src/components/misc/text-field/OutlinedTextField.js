import React from "react";
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

  const [borderStyle, setBorderStyle] = React.useState("1px solid #ccc")

  const onBlur = () => {
    setBorderStyle("1px solid #CCC")
  }
  
  const onFocus = () => {
    setBorderStyle("1.5px solid #2196f3")
  }

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
          border: `${borderStyle}`,
          borderRadius: "4px",
          boxSizing: "border-box",
          boxShadow: "none",
          backgroundColor: "#FFFFFF",
       }}
          onFocus={onFocus}
          onBlur={onBlur}
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