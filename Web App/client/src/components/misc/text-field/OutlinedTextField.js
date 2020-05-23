import React from "react";

const OutlinedTextField = (props) => {
  return (
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
  )
}

export default OutlinedTextField;
