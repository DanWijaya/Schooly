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
        style={{
          width: !props.width ? "100%" : props.width,
          display: "inline-block",
          borderBottom: !props.borderBottom ? `${borderStyle}` : props.borderBottom,
          boxShadow: "none",
          backgroundColor: "#FFFFFF",
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={props.disabled}
        value={props.value}
      />
    </div>
  )
}

export default StandardTextField;
