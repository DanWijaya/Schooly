import React from "react";
import InfoIcon from '@material-ui/icons/Info';

const OutlinedTextField = (props) => {
  const [borderStyle, setBorderStyle] = React.useState("1px solid #ccc")
  const onBlur = () => {
    setBorderStyle("1px solid #CCC")
  }
  const onFocus = () => {
    setBorderStyle("1.5px solid #2196f3")
  }

  return (
    <div>
      <label htmlFor={props.html_for}>{props.labelname}</label>
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
      />
      <span className={props.span_classname}>
        {props.error1}
        {props.error2}
      </span>
    </div>
  )
}

export default OutlinedTextField;
