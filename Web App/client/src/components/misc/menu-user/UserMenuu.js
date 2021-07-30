import React from "react";
// import { Link } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';


function UserMenuu(props) {

    const { options } = props
    const [anchorEl, setAnchorEl] = React.useState(null);
    // const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
    // const [selectedUserId, setSelectedUserId] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handle = (e) => {
        setAnchorEl(null);
        console.log(e.target.name);
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
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handle}
                PaperProps={{
                    style: {
                        width: '20ch',
                    },
                }}
            >

                {options.map((option) => {
                    // let content;
                    // if (option === "Detail") {
                    //     content = (
                    //         <Link
                    //             to={{
                    //                 pathname: `/lihat-profil/${row._id}`,
                    //             }}
                    //         />


                    //     );
                    // } else {
                    //     content = (
                    //         <div>
                    //             {option}
                    //         </div>
                    //     )
                    // }
                    return (
                        <MenuItem key={option} selected={option === 'Detail'} onClick={handle}>
                            {option}
                            <IconButton
                            // onClick={(e) => {
                            //     if (option === "Hapus") {
                            //         handleOpenDeleteDialog(e, row._id, row.name);
                            //     }
                            // }}
                            />
                        </MenuItem>
                    )
                })}
            </Menu>
        </div>
    );
}
export default UserMenuu