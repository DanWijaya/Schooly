import React from "react";
import PropTypes from "prop-types";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Avatar, Button, Box, Dialog, Grid, IconButton, List, ListItem, ListItemAvatar,
   Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from '@material-ui/styles';
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import BookIcon from "@material-ui/icons/Book";
import CakeIcon from "@material-ui/icons/Cake";
import CloseIcon from "@material-ui/icons/Close";
import ContactsIcon from "@material-ui/icons/Contacts";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import EditIcon from "@material-ui/icons/Edit";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import EmailIcon from "@material-ui/icons/Email";
import GamesIcon from "@material-ui/icons/Games";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import SchoolIcon from "@material-ui/icons/School";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import WcIcon from "@material-ui/icons/Wc";
import WorkIcon from "@material-ui/icons/Work";

const useStyles = makeStyles((theme) => ({
  buttonEditProfile: {
    backgroundColor: "#2196f3",
    color: "white",
    marginBottom: "10px",
    width: "200px",
    "&:focus": {
      backgroundColor: "#2196f3",
    },
    "&:hover": {
      backgroundColor: "#2196f3",
    },
  },
  dialogRoot: {
    padding: "15px",
  },
  iconButtonClose: {
    backgroundColor: "transparent",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  tabContentList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width:"500px",
    height: "300px",
  },
  tabInfo: {
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2196f3"
    },
  },
});

const onChange = (e) => {
  if(e.target.id)
    this.setState({ [e.target.id]: e.target.value });
  else
    this.setState({role: e.target.value});
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function TabIndex(index) {
  return {
    id: `tab-${index}`,
  };
}

function ProfileDataItemEdit(props) {

  // Informasi Pribadi 
  const [informasiPribadi, setInformasiPribadi] = React.useState({ 
                                                      nama: null, 
                                                      tanggalLahir: null, 
                                                      jenisKelamin: null,
                                                      sekolah: null
                                                    });
  const [kontak, setKontak] = React.useState({email: null, nomorTelp: null, nomorTelpDarurat: null, alamat: null})
  const [karir, setKarir] = React.useState({hobi_minat: null, ekstrakulikuler: null, cita_cita: null, perguruan_impian: null})
  
  return(
    <ListItem>
        <ListItemAvatar>
          <Avatar style={{backgroundColor: "#2196f3"}}>
            {props.profile_data_icon}
          </Avatar>
        </ListItemAvatar>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="button">
              {props.profile_data_category}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <OutlinedTextField value={props.value} id={props.id}/>
          </Grid>
        </Grid>
    </ListItem>
  )
}

function ProfileDataEditorDialog(props) {
  const classes = useStyles();

  //Dialog
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //Tabs
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //pas submit formnya
  const onSubmit = (e) => {
    e.preventDefault()
    props.handleOpenAlert()
    handleClose()
  }

  const onChangeInformasiPribadi = (e) => {

  }
  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        startIcon={<EditIcon />}
        className={classes.buttonEditProfile}
      >
        Sunting Profil
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Grid container direction="column" alignItems="center" className={classes.dialogRoot}>
          <Grid item container justify="flex-end" alignItems="flex-start" style={{marginBottom: "10px"}}>
            <IconButton
              size="small"
              disableRipple
              onClick={handleClose}
              className={classes.iconButtonClose}
            >
                <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item style={{marginBottom: "30px"}}>
            <Typography variant="h5" gutterBottom>
              <b>Sunting Profil</b>
            </Typography>
          </Grid>
          <form onSubmit={onSubmit}>
            <ThemeProvider theme={theme}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab disableRipple className={classes.tabInfo} icon={<ContactsIcon />} label="Informasi Pribadi" {...TabIndex(0)} />
              <Tab disableRipple className={classes.tabInfo} icon={<ContactMailIcon />} label="Kontak" {...TabIndex(0)} />
              <Tab disableRipple className={classes.tabInfo} icon={<EmojiPeopleIcon />} label="Karir" {...TabIndex(0)} />
            </Tabs>
            </ThemeProvider>
            <TabPanel value={value} index={0}>
              <List className={classes.tabContentList}>
                <ProfileDataItemEdit
                  profile_data_icon={<PersonIcon />}
                  profile_data_category="Nama"
                  onChange={onChangeInformasiPribadi}
                  value="test"
                  id="nama"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<CakeIcon />}
                  profile_data_category="Tanggal Lahir"
                  value="test"
                  id="tanggal_lahir"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<WcIcon />}
                  profile_data_category="Jenis Kelamin"
                  value="test"
                  id="jenis_kelamin"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<SchoolIcon />}
                  profile_data_category="Sekolah"
                  value="test"
                  id="sekolah"
                />
              </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <List className={classes.tabContentList}>
                <ProfileDataItemEdit
                  profile_data_icon={<EmailIcon />}
                  profile_data_category="Email"
                  value="test"
                  id="email"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<PhoneIcon />}
                  profile_data_category="Nomor Telepon"
                  value="test"
                  id="no_telp"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<SupervisorAccountIcon />}
                  profile_data_category="Nomor Telepon Darurat"
                  value="test"
                  id="no_telp_darurat"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<HomeIcon />}
                  profile_data_category="Alamat"
                  value="test"
                  id="alamat"
                />
              </List>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <List className={classes.tabContentList}>
                <ProfileDataItemEdit
                  profile_data_icon={<GamesIcon />}
                  profile_data_category="Hobi dan Minat"
                  value="test"
                  id="hobi_minat"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<BookIcon />}
                  profile_data_category="Keterampilan non-teknis"
                  value="test"
                  id="ket_non_teknis"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<WorkIcon />}
                  profile_data_category="Cita-Cita"
                  value="test"
                  id="cita_cita"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<AccountBalanceIcon />}
                  profile_data_category="Universitas Impian"
                  value="test"
                  id="uni_impian"
                />
              </List>
            </TabPanel>
            <Grid container justify="center" style={{marginTop: "15px"}}>
              <Button
                type="submit"
                style={{backgroundColor: "#2196f3", color: "white"}}
              >
                Simpan
              </Button>
            </Grid>
          </form> 
        </Grid>
      </Dialog>
    </div>
  )
}

export default ProfileDataEditorDialog;
