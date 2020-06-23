import React from "react";
import PolicyContent from "./PolicyContent";

function Policy(props) {
  document.title = "Schooly | Kebijakan Penggunaan";

  const [isFirsttimeRendered, setFirstTime] = React.useState(false)
  const { handleMarginTopValue } = props;
  if(!isFirsttimeRendered) {
    handleMarginTopValue(0);
    setFirstTime(true);
  }

  return (
    <PolicyContent />
  )
};

export default Policy;
