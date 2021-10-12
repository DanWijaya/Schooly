import React from "react";
import { Link } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography
} from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";

function OptionMenu(props) {
  const { actions, row, rowCount, handleActionOnClick } = props;
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

  return (
    <div>
      <IconButton onClick={handleClick} disabled={rowCount}>
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
                handleActionOnClick[idx](e, row._id, row.name);
                handleClose();
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
