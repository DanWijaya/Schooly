import React from "react";

const StandardTextField = (props) => {
  const [borderStyle, setBorderStyle] = React.useState("1px solid #CCC")

  const onBlur = () => {
    setBorderStyle("1px solid #CCC")
  }
  const onFocus = () => {
    setBorderStyle("2px solid #2196F3")
  }

  return (
    <div>
      <input
        onFocus={onFocus}
        onBlur={onBlur}
        defaultValue={props.defaultValue}
        onChange={props.on_change}
        value={props.value}
        disabled={props.disabled}
        style={{
          width: !props.width ? "100%" : props.width,
          display: "inline-block",
          borderBottom: !props.borderBottom ? borderStyle : props.borderBottom,
          boxShadow: "none",
          backgroundColor: "#FFFFFF",
        }}
      />
    </div>
  )
}

export default StandardTextField;
