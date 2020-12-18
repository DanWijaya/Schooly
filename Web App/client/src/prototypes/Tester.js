import React from 'react';
import { Fraction, toTex } from 'algebra.js';
import { Node, Context } from 'react-mathjax2';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { AppBar, Dialog, FormControlLabel, Switch, Slide, Toolbar, TextField, IconButton, List, ListItem, ListItemText, Divider } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const PurpleSwitch = withStyles((theme) => ({
  switchBase: {
    padding: 0,
    margin: "8.25px",
    color: theme.palette.warning.main,
    '&$checked': {
      color: theme.palette.warning.main,
    },
    '&$checked + $track': {
      backgroundColor: theme.palette.warning.main,
    },
  },
  checked: {},
  track: {},
}))(Switch);

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Formula(props) {
  return (
    <Context input="tex">
      <Node inline>{props.tex}</Node>
    </Context>
  );
}

export default function Tester() {
  //Latex
  const a = new Fraction(1, 5);
  const b = new Fraction(2, 7);
  const answer = a.multiply(b);

  const question = <Formula tex={`${toTex(a)} × ${toTex(b)} = ${toTex(answer)}`} />;

  document.getElementById('math')

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{margin: "auto", maxWidth: "1000px"}}>
      <div>
        {question}
      </div>
      <FormControlLabel
        control={<PurpleSwitch name="checkedA" checkedIcon={<FiberManualRecordIcon />} icon={<FiberManualRecordIcon />} /> }
        label="Custom color"
      />
      <FormControlLabel
        control={<AntSwitch name="checkedA" checkedIcon={<FiberManualRecordIcon />} icon={<FiberManualRecordIcon />} /> }
        label="Custom color"
      />
      <FormControlLabel
        control={<IOSSwitch name="checkedA" checkedIcon={<FiberManualRecordIcon />} icon={<FiberManualRecordIcon />} /> }
        label="Custom color"
      />
      <InlineMath math="\\int_0^\\infty x^2 dx"/>
      <BlockMath math="\\int_0^\\infty x^2 dx"/>
      <IconButton onClick={handleClickOpen} style={{backgroundColor: "blue", color: "white"}}>
        <SearchIcon />
      </IconButton>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <ArrowBackIosIcon />
            </IconButton>
            <TextField variant="outlined" className={classes.title} />
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Default notification ringtone" secondary="Tethys" />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
