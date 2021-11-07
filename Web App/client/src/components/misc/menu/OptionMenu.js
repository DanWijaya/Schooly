import React from "react";
import { Link } from "react-router-dom";
import { IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";

function OptionMenu(props) {
  const { actions, row, disabled, handleActionOnClick } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = (e) => {
    setAnchorEl(null);
  };

  const actionOnClick = (e, idx) => {
    if (row) {
      handleActionOnClick[idx](e, row);
      // handleActionOnClick[idx](e, row._id, row.name);
    } else {
      handleActionOnClick[idx](e);
    }
  };

  return (
    <div>
      <IconButton onClick={handleClick} disabled={disabled}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        keepMounted
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxWidth: "150px",
            width: "100%",
          },
        }}
      >
        {actions.map((option, idx) => {
          return (
            <MenuItem
              key={option}
              selected={option === "Detail"}
              onClick={(e) => {
                actionOnClick(e, idx, row);
                // handleActionOnClick[idx](e, row._id, row.name);
                // handleClose();
              }}
            >
              {option}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
export default OptionMenu;
