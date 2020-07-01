import React from "react";
import PolicyContent from "./PolicyContent";

function Policy(props) {
  const [isFirsttimeRendered, setFirstTime] = React.useState(false)
  const { handleMarginTopValue } = props;
  if(!isFirsttimeRendered) {
    handleMarginTopValue(0);
    setFirstTime(true);
  }

  document.title = "Schooly | Kebijakan Penggunaan";

  return(
    <PolicyContent />
  )
};

export default Policy;
