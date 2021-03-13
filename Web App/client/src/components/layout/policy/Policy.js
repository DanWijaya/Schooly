import React, { useEffect } from "react";
import PolicyContent from "./PolicyContent";

function Policy(props) {
  const { handleMarginTopValue } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
    handleMarginTopValue(0);
    return () => {
      handleMarginTopValue(20);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  document.title = "Schooly | Kebijakan Penggunaan";
  document.body.style = "background: #FFFFFF";

  return <PolicyContent />;
}

export default Policy;
