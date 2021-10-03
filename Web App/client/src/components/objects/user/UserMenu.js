import React from "react";
import { Link } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";

function UserMenu(props) {
  const { options, row, rowCount, role } = props;
  const { handleOpenDeleteDialog, handleOpenDisableApproveDialog, CheckboxDialog } = props;
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
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        PaperProps={{
          style: {
            maxWidth: "150px",
            width: "100%",
          },
        }}
      >
        {options.map((option) => {
            // if (role === "Student" && option === "Hapus") {
            //     CheckboxDialog("Delete", "Student");
            // } else if (role === "Teacher" && option === "Hapus") {
            //     CheckboxDialog("Delete", "Teacher");
            // }
            return (
              <MenuItem key={option} selected={option === "Detail"}
                onClick={
                  option === "Hapus" ?
                    role !== null ?
                      role === "Student" ?
                        (e) => handleOpenDeleteDialog(e, "Student")
                        : (e) => handleOpenDeleteDialog(e, "Teacher")
                      : (e) => handleOpenDeleteDialog(e, row._id, row.name)
                    : option === "Nonaktifkan" || option === "Aktifkan" ?
                      role !== null ?
                        role === "Student" ?
                          (e) => handleOpenDisableApproveDialog(e, "Student")
                          : (e) => handleOpenDisableApproveDialog(e, "Teacher")
                        : (e) => handleOpenDisableApproveDialog(e, row._id, row.name)
                      : () => { }
                  // : (e) => handleOpenApproveDialog(e, row._id, row.name)
                }
              >
                {option}
              </MenuItem>
            )
        })}
      </Menu>
    </div>
  );
}
export default UserMenu