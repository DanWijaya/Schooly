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
          if (typeof handleActionOnClick[idx] === "string") {
            return (
              <Link to={handleActionOnClick[idx]} style={{ color: "black" }}>
                <MenuItem key={option} selected={option === "Detail"}>
                  {option}
                </MenuItem>
              </Link>
            );
          } else {
            return (
              <MenuItem
                key={option}
                selected={option === "Detail"}
                onClick={(e) => {
                  e.preventDefault();
                  actionOnClick(e, idx);
                  handleClose();
                  // handleActionOnClick[idx](e, row._id, row.name);
                }}
              >
                {option}
              </MenuItem>
            );
          }
        })}
      </Menu>
    </div>
  );
}
export default OptionMenu;
