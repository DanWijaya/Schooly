import React, { useEffect } from "react";
import PolicyContent from "./PolicyContent";

function Policy(props) {
  const { handleMarginTopValue } = props;

  useEffect(() => {
    handleMarginTopValue(0);
    return () => {
      handleMarginTopValue(20)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  document.title = " Kebijakan Penggunaan";

  return (
    <PolicyContent />
  )
};

export default Policy;
