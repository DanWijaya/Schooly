import React from "react";
import { connect } from "react-redux";
import { useLocation , Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "moment/locale/id";
import { updateAvatar } from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import { Avatar, Badge, Divider, Grid, Hidden, List, ListItem, ListItemAvatar, ListItemText, 
  Paper, Typography, IconButton } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CakeIcon from "@material-ui/icons/Cake";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import EmailIcon from "@material-ui/icons/Email";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import WcIcon from "@material-ui/icons/Wc";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import WorkIcon from "@material-ui/icons/Work";
import BlockIcon from "@material-ui/icons/Block";
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px"
  },
  avatar: {
    margin: "auto",
    width: theme.spacing(20),
    height: theme.spacing(20)
  },
  profileDivider: {
    backgroundColor: theme.palette.primary.main,
    margin: "15px 0px 15px 0px"
  },
  informationPaper: {
    backgroundColor: fade(theme.palette.primary.main,0.2),
    padding: '25px'
  },
  name: {
    backgroundColor: fade(theme.palette.primary.main,0.2),
    padding:'5px',
    margin: '5px'
  },
  kelas: {
    backgroundColor: fade(theme.palette.primary.main,0.2)
  },
  informationPictureContainer: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end"
    },
  },
  informationPicture: {
    height: "100px",
    [theme.breakpoints.up("sm")]: {
      height: "125px"
    },
  },
  profileDataItemAvatar: {
    backgroundColor: "#00b7ff"
  },
  emptyProfileData: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "150px",
    padding: "5px",
    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: theme.palette.error.main,
    color: "white"
  },
  descriptionText: {
    color: "white", 
    marginTop: "10px", 
    marginLeft: "20px", 
    fontWeight: "300",
    fontStyle: "italic"
  },
  background_gradient: {
    padding:"20px",
    background: "linear-gradient(to bottom right, #00b7ff, #2196F3, #00b7ff)"
  }
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: theme.spacing(2),
    top: theme.spacing(16),
  }
}))(Badge);


function Profile(props) {
  const classes = useStyles();
  const location = useLocation();

  const { role } = location.state

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Fisika', 159, 6.0, 24, 4.0),
    createData('Kimia', 237, 9.0, 37, 4.3),
    createData('Matematika', 262, 16.0, 24, 6.0),
    createData('Biologi', 305, 3.7, 67, 4.3),
    createData('Bahasa Inggris', 356, 16.0, 49, 3.9),
  ];

  return (
    <div className={classes.root}>
        {(role=='Teacher') ?
        <Grid container direction="column" spacing={5}>
            <Grid item>
            <Typography variant="h4" align="center" color="textPrimary">
                MATA PELAJARAN FISIKA
            </Typography>
            <Divider className={classes.profileDivider}/>
            </Grid>
            <Grid container item direction="row" spacing={3} alignContent="space-between">
                <Grid item xs={4} sm={4} md={4} lg={4}> 
                    <Paper className={classes.informationPaper}>NAMA :  Donald John Trump</Paper>
                </Grid>
                <Grid item xs={3} sm={4} md={5} lg={5}> 
                </Grid>
                <Grid item xs={5} sm={4} md={3} lg={3}>
                    <Paper style={{display:'flex', flexDirection:'row', padding:'10px', justifyContent:'space-between'}}>
                        <div>
                            <InputLabel id="label">Kelas</InputLabel>
                            <Select labelId="label" id="select">
                                <MenuItem value="10">VII A</MenuItem>
                                <MenuItem value="20">VIII B</MenuItem>
                            </Select>
                        </div>
                        <div>
                            <InputLabel id="label">Mata Pelajaran</InputLabel>
                            <Select labelId="label" id="select">
                                <MenuItem value="10">Matematika</MenuItem>
                                <MenuItem value="20">Fisika</MenuItem>
                            </Select>
                        </div>
                    </Paper> 
                </Grid>
            </Grid>
            <Grid container direction="column" spacing={5} style={{margin:'auto'}}>
                <Grid item xs={12} sm={12} md={12} lg={12}> 
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" size="medium">
                            <TableHead>
                            <TableRow>
                                <TableCell>Nama</TableCell>
                                <TableCell align="right">Tugas 1</TableCell>
                                <TableCell align="right">Tugas 2</TableCell>
                                <TableCell align="right">Kuis</TableCell>
                                <TableCell align="right">Ujian</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Grid>
        : (role=='Student') ?
        <Grid container direction="column" spacing={5}>
            <Grid item>
            <Typography variant="h4" align="center" color="textPrimary">
                RAPOR SEMESTER X TAHUN XXXX
            </Typography>
            <Divider className={classes.profileDivider}/>
            </Grid>
            <Grid container item direction="row" spacing={3} alignContent="space-between">
                <Grid item xs={4} sm={4} md={4} lg={4}> 
                    <Paper className={classes.informationPaper}>NAMA :  Donald John Trump</Paper>
                </Grid>
                <Grid item xs={3} sm={4} md={5} lg={5}> 
                </Grid>
            </Grid>
            <Grid container direction="column" spacing={5} style={{margin:'auto'}}>
                <Grid item xs={12} sm={12} md={12} lg={12}> 
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" size="medium">
                            <TableHead>
                            <TableRow>
                                <TableCell>Mata Pelajaran</TableCell>
                                <TableCell align="right">Total Nilai Tugas</TableCell>
                                <TableCell align="right">Total Nilai Kuis</TableCell>
                                <TableCell align="right">Total Nilai Ujian</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Grid>
        :
        <Grid container direction="column" spacing={5}>
            <Grid item>
            <Typography variant="h4" align="center" color="textPrimary">
                HALAMAN RAPOR
            </Typography>
            <Divider className={classes.profileDivider}/>
            </Grid>
            <Grid container item direction="row" spacing={3} alignContent="space-between">
                <Grid item xs={4} sm={4} md={4} lg={4}> 
                    <Paper className={classes.informationPaper}>NAMA :  Donald John Trump</Paper>
                </Grid>
                <Grid item xs={3} sm={4} md={5} lg={5}> 
                </Grid>
                <Grid item xs={5} sm={4} md={3} lg={3}>
                    <Paper style={{display:'flex', flexDirection:'row', padding:'10px', justifyContent:'space-between'}}>
                        <div>
                            <InputLabel id="label">Kelas</InputLabel>
                            <Select labelId="label" id="select">
                                <MenuItem value="10">VII A</MenuItem>
                                <MenuItem value="20">VIII B</MenuItem>
                            </Select>
                        </div>
                        <div>
                            <InputLabel id="label">Mata Pelajaran</InputLabel>
                            <Select labelId="label" id="select">
                                <MenuItem value="10">Matematika</MenuItem>
                                <MenuItem value="20">Fisika</MenuItem>
                            </Select>
                        </div>
                    </Paper> 
                </Grid>
            </Grid>
            <Grid container direction="column" spacing={5} style={{margin:'auto'}}>
                <Grid item xs={12} sm={12} md={12} lg={12}> 
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" size="medium">
                            <TableHead>
                            <TableRow>
                                <TableCell>Mata Pelajaran</TableCell>
                                <TableCell align="right">Total Nilai Tugas</TableCell>
                                <TableCell align="right">Total Nilai Kuis</TableCell>
                                <TableCell align="right">Total Nilai Ujian</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Grid>
        }
    </div>
  )
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  updateAvatar: PropTypes.func.isRequired,
  setCurrentClass: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
});

export default connect(
    mapStateToProps, { updateAvatar, setCurrentClass }
  ) (Profile);