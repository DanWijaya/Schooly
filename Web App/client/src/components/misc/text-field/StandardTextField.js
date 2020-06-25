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
          width: "100%",
          display: "inline-block",
          borderBottom: `${borderStyle}`,
          boxShadow: "none",
          backgroundColor: "#FFFFFF",
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  )
}

export default StandardTextField;
