import React from "react";

const OutlinedTextField = () => {
  return (
    <input
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
