import React from "react";
import Input from "@material-ui/core/Input";

function FlexibleInput(props) {
  const {
    type,
    key,
    id,
    value,
    onChange,
  } = props;

  return (
    <Input
      type={type}
      key={key}
      id={id}
      value={value}
      onChange={onChange}
      InputProps={{
        style: {
          padding: "0px",
        },
      }}
      inputProps={{
        style: {
          borderBottom: "none",
          boxShadow: "none",
          margin: "0px",
          WebkitBoxShadow: "0 0 0 1000px white inset",
        },
      }}
    />
  );
}

export default FlexibleInput;
