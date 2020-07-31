import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'center',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

function CustomizedMenus(props) {
  const {handleClose, anchorEl, setAnchorEl, menuItemList} = props;

  return (
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        // keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItemList.map((item) => 
        <StyledMenuItem 
        onClick={(e) => { 
          e.stopPropagation()
          item.handleClick()
          }}>
          {!item.icon ? null : 
          <ListItemIcon>
            {item.icon}
          </ListItemIcon>
          }
          <ListItemText primary={item.text} />
        </StyledMenuItem>)
        }
      </StyledMenu>
  );
}

export default CustomizedMenus;