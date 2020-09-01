import React, { useEffect } from "react";
import PolicyContent from "./PolicyContent";

function Policy(props) {
  const { handleMarginTopValue } = props;

  useEffect(() => {
    handleMarginTopValue(0);
  },[handleMarginTopValue])

  useEffect(() => {
    return () => {
      handleMarginTopValue(20)
    }
  }, [handleMarginTopValue])

  document.title = "Schooly | Kebijakan Penggunaan";

  return (
    <PolicyContent />
  )
};

export default Policy;
