import React from "react";
import { connect } from "react-redux";
import { withRouter, useLocation , Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { updateAvatar } from "../../../actions/UserActions";
import { setCurrentClass } from "../../../actions/ClassActions";
import informationContacts from "./InformationContacts.png";
import informationJob from "./InformationJob.png";
import informationPrivate from "./InformationPrivate.png";
import ProfileDataEditorDialog from "./ProfileDataEditorDialog";
import ProfilePictureEditorDialog from "./ProfilePictureEditorDialog";
import ProfilePasswordEditorDialog from "./ProfilePasswordEditorDialog";
import { Avatar, Badge, Divider, Grid, Hidden, List, ListItem, ListItemAvatar, ListItemText, Paper, Snackbar, Typography } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CakeIcon from "@material-ui/icons/Cake";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import EmailIcon from "@material-ui/icons/Email";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import WcIcon from "@material-ui/icons/Wc";
import SchoolIcon from "@material-ui/icons/School";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import WorkIcon from "@material-ui/icons/Work";
import { BsUnion } from "react-icons/bs";
import { fade } from '@material-ui/core/styles/colorManipulator';


const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  space:{
    
  },
  avatar: {
    margin: "auto",
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  profileDivider: {
    backgroundColor: theme.palette.primary.main,
    margin: "15px 0px 15px 0px",
  },
  informationPaper: {
    
    backgroundColor: fade(theme.palette.primary.main,0.04),
  },
  informationPictureContainer: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
  },
  informationPicture: {
    height: "100px",
    [theme.breakpoints.up("sm")]: {
      height: "125px",
    },
  },
  profileDataItemAvatar: {
    backgroundColor: '#00b7ff',
  },
  emptyProfileData: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "150px",
    padding: "5px",
    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: theme.palette.error.main,
    color: "white",
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: theme.spacing(2),
    top: theme.spacing(16),
  },
}))(Badge);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ProfileDataItem(props) {
  const classes = useStyles();

  return (
    <div>
      <Hidden smUp implementation="css">
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.profileDataItemAvatar}>
              {props.profile_data_icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="overline" color="textSecondary">
                <b>{props.profile_data_category}</b>
              </Typography>
            }
            secondary={
              !props.profile_data_info ?
                <Paper className={classes.emptyProfileData}>
                  <Typography variant="button">
                    Kosong
                  </Typography>
                </Paper>
              :
                <Typography variant="body1">
                  {props.profile_data_info}
                </Typography>
            }
          />
        </ListItem>
      </Hidden>
      <Hidden xsDown implementation="css">
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.profileDataItemAvatar}>
              {props.profile_data_icon}
            </Avatar>
          </ListItemAvatar>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Typography variant="overline" color="textSecondary">
                <b>{props.profile_data_category}</b>
              </Typography>
            </Grid>
            <Grid item xs={7}>
              {!props.profile_data_info ?
                <Paper className={classes.emptyProfileData}>
                  <Typography variant="button">
                    Kosong
                  </Typography>
                </Paper>
                :
                <Typography>
                  {props.profile_data_info}
                </Typography>
              }
            </Grid>
          </Grid>
        </ListItem>
      </Hidden>
    </div>
  )
}

function Profile(props) {
  const classes = useStyles();
  const location = useLocation();
  

  const { user } = props.auth;
  const { updateAvatar, setCurrentClass, classesCollection } = props;
  // const { kelas } = props.classesCollection;
  // Alert control for ProfilePictureEditorDialog

  const [namakelas, setNamaKelas] = React.useState('');
  const [firstRender, setFirstRender] = React.useState(true);



  const [openAlert, setOpenAlert] = React.useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  }
  const handleCloseAlert = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  }
  console.log(user.avatar)

  React.useEffect(() => {
    if (role === "Student") {
      setCurrentClass(kelas);
    }
  }, []);
  
  React.useEffect(() => {
    // isi classesCollection pas pertama kali render = classesCollection dari halaman kelas/:id
    if (firstRender) {
      setFirstRender(false);
    } else {
      setNamaKelas(classesCollection.kelas.name);
    }
  }, [classesCollection]);

  React.useEffect(() => {
    if (role === "Student") {
      setCurrentClass(kelas);
    }
  }, []);
  
  React.useEffect(() => {
    // isi classesCollection pas pertama kali render = classesCollection dari halaman kelas/:id
    if (firstRender) {
      setFirstRender(false);
    } else {
      setNamaKelas(classesCollection.kelas.name);
    }
  }, [classesCollection]);

  if(location.state==undefined){
    return(<Redirect to="/tidak-ditemukan"/>)
  }
  const { avatar, nama, role, viewable_section, tanggal_lahir, jenis_kelamin, 
    sekolah, email, phone, emergency_phone, alamat, hobi, ket, cita, uni, kelas, subject_teached } = location.state
    
  // Initially classesCollection.kelas.name === undefined
  // if (user.role === "Student" && !classesCollection.kelas.name) {
  //   setCurrentClass(user.kelas)
  // }

  console.log(location.state)

  

  document.title = "Schooly | Profil"
  console.log(classesCollection.kelas)
  return (
    <div className={classes.root}>
      
      <Grid container direction="column" spacing={1} alignItems="center">
        <Grid item>
          {avatar ?
          <StyledBadge
            
          >
            <Avatar
              src={`/api/upload/avatar/${avatar}`}
              className={classes.avatar}
            />
          </StyledBadge>
          :
          <StyledBadge
            
          >
            <Avatar className={classes.avatar} />
          </StyledBadge>
          }
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center">
            {nama}
          </Typography>
          <Typography variant="h6" align="center">
            {role === "Student" ?
              "Murid"
            : role === "Teacher" ?
              "Guru"
            :
              "Pengelola"
            }
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            {!namakelas ? null : `Kelas ${namakelas}`}
            {/* {!kelas ? null : `Kelas ${kelas}`} */}
          </Typography>
        </Grid>
      </Grid>
      <Divider className={classes.profileDivider} style={{marginTop:'10px'}} />
      <Grid container direction="column" alignItems="center" spacing={5}>
        
        <Grid item container direction="column" spacing={4} >
          {/* bookmark: section */}
          {
            (role == 'Teacher' ||  role == 'Student') ? [
              <Grid item  >
                <Paper className={classes.informationPaper} style={{display:'flex',flexDirection:'column',justifyContent:'flex-start'}}>
                  <Grid container >
                    <Grid item xs={12} sm={12} className={classes.space}>
                        <div style={{position:'absolute',margin:'3%'}}>
                    <Typography variant="h5" gutterBottom style={{color:'white'}} >
                        
                        INFORMASI PENGGUNA
                        
                    </Typography>
                    <Typography variant="h7" color="textSecondary" style={{color:'#E5E5E5',fontStyle:'italic',marginLeft:'25px',marginRight:'25px',marginBottom:'100px'}}>
                        User Information
                      </Typography>
                      </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 280" style={{bottom: 0,left:0,backgroundImage: "linear-gradient(to bottom right, #00b7ff, #2196F3)",color:"#2196F3",borderRadius:'2px',display:'box',boxShadow:'1.2px 0.6px 2px grey'}}><path fill="#2196F3" fill-opacity="1" d="M0,192L48,213.3C96,235,192,277,288,277.3C384,277,480,235,576,202.7C672,171,768,149,864,165.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z">
                        </path>
                    </svg>
                        
                    </Grid>
                    
                  </Grid>
                  <List style={{padding: "22.5px 25px 22.5px 25px"}}>
                    <ProfileDataItem
                      profile_data_icon={<PersonIcon />}
                      profile_data_category="Nama"
                      profile_data_info={nama}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<CakeIcon />}
                      profile_data_category="Role"
                      profile_data_info={role}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<WcIcon />}
                      profile_data_category="Jenis Kelamin"
                      profile_data_info={jenis_kelamin}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<EmailIcon />}
                      profile_data_category="Email"
                      profile_data_info={email}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<PhoneIcon />}
                      profile_data_category="Nomor Telepon"
                      profile_data_info={phone}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<ContactPhoneIcon />}
                      profile_data_category="Nomor Telepon Darurat"
                      profile_data_info={emergency_phone}
                    />
                  </List>
                  
                </Paper>
              </Grid>
            ].concat((viewable_section == "no_karir") ? (null) : (
              <Grid item>
                <Paper className={classes.informationPaper} style={{marginTop:'100px'}}>
                  <Grid container justify="flex-start">
                    <Grid item xs={12} sm={12} className={classes.space}>
                        <div style={{position:'absolute',margin:'3%'}}>
                      <Typography variant="h5" gutterBottom style={{color:'white'}}>
                        KARIR
                      </Typography>
                      <Typography variant="h7" color="textSecondary" style={{color:'#e5e5e5',fontStyle:'italic',marginLeft:'25px',marginRight:'25px'}}>
                        Career & Other Informations
                      </Typography>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 280" style={{backgroundImage: "linear-gradient(to right, #00b7ff, #2196F3)",color:"#2196F3",borderRadius:'2px',display:'box',boxShadow:'1.2px 0.6px 2px grey'}}>
                          <path fill="currentcolor" fill-opacity="1" d="M0,320L360,224L720,256L1080,64L1440,160L1440,0L1080,0L720,0L360,0L0,0Z">
                          </path></svg>
                    
                    </Grid>
                    
                  </Grid>
                  <List style={{padding: "22.5px 25px 22.5px 25px",marginBottom:'30px'}}>
                    <ProfileDataItem
                      profile_data_icon={<SportsEsportsIcon />}
                      profile_data_category="Hobi dan Minat"
                      profile_data_info={hobi}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<ColorLensIcon />}
                      profile_data_category="Keterampilan Non-Akademik"
                      profile_data_info={ket}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<WorkIcon />}
                      profile_data_category="Cita-Cita"
                      profile_data_info={cita}
                    />
                    <Divider variant="inset" />
                    <ProfileDataItem
                      profile_data_icon={<AccountBalanceIcon />}
                      profile_data_category="Perguruan Tinggi Impian"
                      profile_data_info={uni}
                    />
                  </List>
                  
                </Paper>
              </Grid>
            )) : (
              <Grid item container direction="column" spacing={4}>

                <Grid item>
                  <Paper className={classes.informationPaper}>
                    <Grid container justify="space-between">
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h4" gutterBottom>
                          Informasi Pribadi
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          Jangan lupa untuk mengisi semua informasi profil Anda untuk melengkapi
                          database sekolah Anda.
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <div className={classes.informationPictureContainer}>
                          <img alt="Private Information" src={informationPrivate} className={classes.informationPicture} />
                        </div>
                      </Grid>
                    </Grid>
                    <List>
                      <ProfileDataItem
                        profile_data_icon={<PersonIcon />}
                        profile_data_category="Nama"
                        profile_data_info={nama}
                      />
                      <Divider variant="inset" />
                      <ProfileDataItem
                        profile_data_icon={<CakeIcon />}
                        profile_data_category="Tanggal Lahir"
                        profile_data_info={tanggal_lahir}
                      />
                      <Divider variant="inset" />
                      <ProfileDataItem
                        profile_data_icon={<WcIcon />}
                        profile_data_category="Jenis Kelamin"
                        profile_data_info={jenis_kelamin}
                      />
                      <Divider variant="inset" />
                      <ProfileDataItem
                        profile_data_icon={<SchoolIcon />}
                        profile_data_category="Sekolah"
                        profile_data_info={sekolah}
                      />
                    </List>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper className={classes.informationPaper}>
                    <Grid container justify="space-between">
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h4" gutterBottom>
                          Kontak
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          Pastikan Anda mengecek kembali kontak-kontak yang Anda masukkan.
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <div className={classes.informationPictureContainer}>
                          <img alt="Contacts" src={informationContacts} className={classes.informationPicture} />
                        </div>
                      </Grid>
                    </Grid>
                    <List>
                      <ProfileDataItem
                        profile_data_icon={<EmailIcon />}
                        profile_data_category="Email"
                        profile_data_info={email}
                      />
                      <Divider variant="inset" />
                      <ProfileDataItem
                        profile_data_icon={<PhoneIcon />}
                        profile_data_category="Nomor Telepon"
                        profile_data_info={phone}
                      />
                      <Divider variant="inset" />
                      <ProfileDataItem
                        profile_data_icon={<ContactPhoneIcon />}
                        profile_data_category="Nomor Telepon Darurat"
                        profile_data_info={emergency_phone}
                      />
                      <Divider variant="inset" />
                      <ProfileDataItem
                        profile_data_icon={<HomeIcon />}
                        profile_data_category="Alamat"
                        profile_data_info={alamat}
                      />
                    </List>
                  </Paper>
                </Grid>
                <Grid item>
              <Paper className={classes.informationPaper}>
                <Grid container justify="space-between">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h4" gutterBottom>
                      Karir
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Kami ke depannya juga berencana untuk membantu Anda menemukan
                      jalur karir terbaik untuk Anda.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className={classes.informationPictureContainer}>
                      <img alt="Career" src={informationJob} className={classes.informationPicture} />
                    </div>
                  </Grid>
                </Grid>
                <List>
                  <ProfileDataItem
                    profile_data_icon={<SportsEsportsIcon />}
                    profile_data_category="Hobi dan Minat"
                    profile_data_info={hobi}
                  />
                  <Divider variant="inset" />
                  <ProfileDataItem
                    profile_data_icon={<ColorLensIcon />}
                    profile_data_category="Keterampilan Non-Akademik"
                    profile_data_info={ket}
                  />
                  <Divider variant="inset" />
                  <ProfileDataItem
                    profile_data_icon={<WorkIcon />}
                    profile_data_category="Cita-Cita"
                    profile_data_info={cita}
                  />
                  <Divider variant="inset" />
                  <ProfileDataItem
                    profile_data_icon={<AccountBalanceIcon />}
                    profile_data_category="Perguruan Tinggi Impian"
                    profile_data_info={uni}
                  />
                </List>
              </Paper>
            </Grid>
            
              </Grid>
            )
            
          }


        </Grid>
      </Grid>
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