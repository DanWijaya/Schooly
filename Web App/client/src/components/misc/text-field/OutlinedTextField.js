import React from "react";
import WarningIcon from '@material-ui/icons/Warning';
import { Typography, TextField } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles((theme) => ({
//   textarea: {
//     "&:focus": {
//       border: "2px solid #2196f3",
//       outline: "none"
//     },
//     "&:hover": {
//       border: "2px solid #2196f3",
//       outline: "none"
//     }
//   }
// }))

const OutlinedTextField = (props) => {
  const [borderStyle, setBorderStyle] = React.useState("1px solid #CCC")
  // const classes = useStyles()

  const onBlur = () => {
    setBorderStyle("1px solid #CCC")
  }
  const onFocus = () => {
    setBorderStyle("2px solid #2196f3")
  }


  return (
    <div>
      <label htmlFor={props.html_for}>
        <div className={props.label_classname}>
          {props.labelname}
        </div>
      </label>
      {props.multiline == undefined ? 
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
          display: "inline-block",
          border: `${borderStyle}`,
          borderRadius: "4px",
          boxSizing: "border-box",
          boxShadow: "none",
          backgroundColor: "#FFFFFF",
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      /> : 
      <textarea
        onChange={props.on_change}
        value={props.value}
        error={props.error}
        id={props.id}
        type={props.type}
        className={props.classname}
        style={{
          width: "100%",
          padding: "10px",
          display: "inline-block",
          border: `${borderStyle}`,
          borderRadius: "4px",
          boxSizing: "border-box",
          boxShadow: "none",
          outline: "none",
          backgroundColor: "#FFFFFF",
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      }
      <span className={props.span_classname}>
        <div style={{ display:"flex", alignItems: "center"}}>
        {props.error1 || props.error2 ? <WarningIcon style={{ height: "5%", width:"5%"}} /> : null}
        <Typography variant="h8" style={{marginLeft: "4px"}}>
          {props.error1}
          {props.error2}
        </Typography>
        </div>
      </span>
    </div>
  )
}

export default OutlinedTextField;
