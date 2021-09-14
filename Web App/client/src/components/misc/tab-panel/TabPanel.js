import React from "react";
import { Box } from "@material-ui/core";
import PropTypes from "prop-types";

export const TabPanel = (props) => {
    // id nya dipakai untuk customnize nanti. 
    const { children, value, id, index, ...other } = props;
  
    return (
      <div hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
        {value === index && <Box p={3}>{children}</Box>}
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
      id: `simple-tab-${index}`,
    };
  }