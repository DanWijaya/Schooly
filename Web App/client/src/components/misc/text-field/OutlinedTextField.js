import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const OutlinedTextField = (props) => {
  return (
    <div>
      <label htmlFor={props.html_for}>{props.labelname}</label>
      <input
        autofocus required
        class="form-control"
        onChange={props.on_change}
        value={props.value}
        error={props.error}
        id={props.id}
        type={props.type}
        className={props.classname}
        style={{
          width: "100%",
          border: "2px solid #aaa",
          borderRadius: "4px",
          margin: "8px 0",
          outline: "none",
          padding: "8px",
          boxSizing: "border-box",
          transition: "0.3s",
       }}
      />
      <span className={props.span_classname}>
        {props.error1}
        {props.error2}
      </span>
    </div>
  )
}

export default OutlinedTextField;
