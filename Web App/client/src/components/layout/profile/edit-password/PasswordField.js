import React from "react";
import TextField from "@material-ui/core/TextField";

function PasswordField(props) {
  const { id, label, onChange, value, errors, helperText } = props;

  return (
    <TextField
      fullWidth
      variant="outlined"
      id={id}
      label={label}
      onChange={onChange}
      value={value}
      error={Boolean(errors)}
      type="password"
      helperText={helperText}
    />
  );
}

export default PasswordField;
