import React from "react";
import { Link } from "react-router-dom";
import { Fab, Menu, MenuItem } from "@material-ui/core";
import { HelpOutline as HelpOutlineIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: "10px",
    right: "10px",
  },
  floatingHelpButton: {
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.grey.A700,
    "&:focus, &:hover": {
      backgroundColor: theme.palette.grey[50],
      color: theme.palette.grey.A700,
    },
  },
}));

function FloatingHelp(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <Fab size="small" onClick={handleOpen} className={classes.floatingHelpButton}>
        <HelpOutlineIcon />
      </Fab>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Link to="/bantuan" target="_blank" rel="noopener noreferrer">
          <MenuItem onClick={handleClose} style={{ color: "black" }}>
            Bantuan
          </MenuItem>
        </Link>
        <a href="mailto:schoolysystem@gmail.com">
          <MenuItem onClick={handleClose} style={{ color: "black" }}>
            Hubungi Kami
          </MenuItem>
        </a>
        <Link to="/legal/ketentuan-penggunaan" target="_blank" rel="noopener noreferrer">
          <MenuItem onClick={handleClose} style={{ color: "black" }}>
            Ketentuan Penggunaan
          </MenuItem>
        </Link>
        <Link to="/legal/kebijakan-privasi" target="_blank" rel="noopener noreferrer">
          <MenuItem onClick={handleClose} style={{ color: "black" }}>
            Kebijakan Privasi
          </MenuItem>
        </Link>
      </Menu>
    </div>
  );
}

export default FloatingHelp;
