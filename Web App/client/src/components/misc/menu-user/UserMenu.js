import React from "react";
import { Link } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';


function UserMenu(props) {

    const { options, row, rowCount} = props
    const { handleOpenDeleteDialog, handleOpenDisableDialog } = props
    const [anchorEl, setAnchorEl] = React.useState(null);
    // const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
    // const [selectedUserId, setSelectedUserId] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (e) => {
        setAnchorEl(null);
    };

    // const handleOpenDeleteDialog = (e, id, name) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     setOpenDeleteDialog(true);
    //     setSelectedUserId(id);
    //     setSelectedUserName(name);
    // };

    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
                disabled={rowCount}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        width: '20ch',
                    },
                }}
            >
                {options.map((option) => {
                    return (
                        <MenuItem key={option} selected={option === 'Detail'}
                            onClick={
                                option === 'Hapus' ?
                                    handleOpenDisableDialog !== null ?
                                        (e) => handleOpenDeleteDialog(e, row._id, row.name)
                                        : (e) => handleOpenDeleteDialog(e, "Student")
                                    : option === 'Nonaktifkan' ?
                                        (e) => handleOpenDisableDialog(e, row._id, row.name)
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