import React from "react";
import PropTypes from "prop-types";

export const TabPanel = (props) => {
  const { children, value, id, index, ...other } = props; //id is used to customize.

  return (
    <div hidden={value !== index} id={`tabpanel-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export const TabIndex = (index) => {
  return {
    id: `tab-${index}`,
  };
}
