import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUserData } from "../../../actions/UserActions"
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Avatar, Button, Box, Dialog, Grid, IconButton, List, ListItem, ListItemAvatar,
   Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CakeIcon from "@material-ui/icons/Cake";
import CloseIcon from "@material-ui/icons/Close";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ContactsIcon from "@material-ui/icons/Contacts";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import EditIcon from "@material-ui/icons/Edit";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import EmailIcon from "@material-ui/icons/Email";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import SchoolIcon from "@material-ui/icons/School";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import WcIcon from "@material-ui/icons/Wc";
import WorkIcon from "@material-ui/icons/Work";

const useStyles = makeStyles((theme) => ({
  editProfileButton: {
    width: "200px",
    marginBottom: "10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  root: {
    padding: "15px",
  },
  profileDataItemAvatar: {
    backgroundColor: theme.palette.primary.main,
  },
  saveButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          {children}
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
  const classes = useStyles();

  return (
    <ListItem>
        <ListItemAvatar>
          <Avatar className={classes.profileDataItemAvatar}>
            {props.profile_data_icon}
          </Avatar>
        </ListItemAvatar>
        <Grid container spacing={2} justify="space-between" alignItems="center">
          <Grid item xs={6}>
            <Typography variant="button">
              {props.profile_data_category}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <OutlinedTextField value={props.value} id={props.id} on_change={props.on_change}/>
          </Grid>
        </Grid>
    </ListItem>
  )
}

function ProfileDataEditorDialog(props) {
  const classes = useStyles();

  const { user } = props.auth;
  const { updateUserData } = props;

  //Dialog
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (simpan) => {
    console.log(simpan)
    if(simpan !== "simpan")
      setDataProfil(defaultUserData)
    setOpen(false);
  };

  //Tabs
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const defaultUserData = {
    // Informasi Pribadi
    nama: user.name,
    tanggal_lahir: user.tanggal_lahir,
    jenis_kelamin: user.jenis_kelamin,
    sekolah: user.sekolah,

    //Kontak
    email: user.email,
    no_telp: user.phone,
    no_telp_darurat: user.emergency_phone,
    alamat: user.address,

    //Karir
    hobi_minat: user.hobi_minat,
    ket_non_teknis: user.ket_non_teknis,
    cita_cita: user.cita_cita,
    uni_impian: user.uni_impian
  }

  const [dataProfil, setDataProfil] = React.useState(defaultUserData)

  //pas submit formnya
  const onSubmit = (e) => {
    e.preventDefault()
    props.handleOpenAlert()
    handleClose("simpan")

    let userId = user.id;

    let userData = {
      nama: dataProfil.nama,
      tanggal_lahir: dataProfil.tanggal_lahir,
      jenis_kelamin: dataProfil.jenis_kelamin,
      sekolah: dataProfil.sekolah,

      //Kontak
      email: dataProfil.email,
      no_telp: dataProfil.no_telp,
      no_telp_darurat: dataProfil.no_telp_darurat,
      alamat: dataProfil.alamat,

      //Karir
      hobi_minat: dataProfil.hobi_minat,
      ket_non_teknis: dataProfil.ket_non_teknis,
      cita_cita: dataProfil.cita_cita,
      uni_impian: dataProfil.uni_impian
    }

    updateUserData(userData, userId, props.history)
  }

  const handleChangeDataProfil = (e) => {
    let { id , value} = e.target
    setDataProfil((prev) => ({
      ...prev,
      [id] : value
    }))
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        startIcon={<EditIcon />}
        className={classes.editProfileButton}
      >
        Sunting Profil
      </Button>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <Grid container direction="column" alignItems="center" className={classes.root}>
          <Grid item container justify="flex-end" alignItems="flex-start" style={{marginBottom: "10px"}}>
            <IconButton
              size="small"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item style={{marginBottom: "30px"}}>
            <Typography variant="h5" gutterBottom>
              <b>Sunting Profil</b>
            </Typography>
          </Grid>
          <form onSubmit={onSubmit} style={{width: "100%"}}>
            <Tabs
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              value={value}
              onChange={handleChange}
            >
              <Tab icon={<ContactsIcon />} label="Informasi Pribadi" {...TabIndex(0)} />
              <Tab icon={<ContactMailIcon />} label="Kontak" {...TabIndex(1)} />
              <Tab icon={<EmojiPeopleIcon />} label="Karir" {...TabIndex(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <List>
                <ProfileDataItemEdit
                  profile_data_icon={<PersonIcon />}
                  profile_data_category="Nama"
                  value={dataProfil.nama}
                  id="nama"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<CakeIcon />}
                  profile_data_category="Tanggal Lahir"
                  value={dataProfil.tanggal_lahir}
                  id="tanggal_lahir"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<WcIcon />}
                  profile_data_category="Jenis Kelamin"
                  value={dataProfil.jenis_kelamin}
                  id="jenis_kelamin"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<SchoolIcon />}
                  profile_data_category="Sekolah"
                  value={dataProfil.sekolah}
                  id="sekolah"
                  on_change={handleChangeDataProfil}
                />
              </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <List>
                <ProfileDataItemEdit
                  profile_data_icon={<EmailIcon />}
                  profile_data_category="Email"
                  value={dataProfil.email}
                  id="email"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<PhoneIcon />}
                  profile_data_category="Nomor Telepon"
                  value={dataProfil.no_telp}
                  id="no_telp"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<ContactPhoneIcon />}
                  profile_data_category="Nomor Telepon Darurat"
                  value={dataProfil.no_telp_darurat}
                  id="no_telp_darurat"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<HomeIcon />}
                  profile_data_category="Alamat"
                  value={dataProfil.alamat}
                  id="alamat"
                  on_change={handleChangeDataProfil}
                />
              </List>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <List>
                <ProfileDataItemEdit
                  profile_data_icon={<SportsEsportsIcon />}
                  profile_data_category="Hobi dan Minat"
                  value={dataProfil.hobi_minat}
                  id="hobi_minat"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<ColorLensIcon />}
                  profile_data_category="Keterampilan non-teknis"
                  value={dataProfil.ket_non_teknis}
                  id="ket_non_teknis"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<WorkIcon />}
                  profile_data_category="Cita-Cita"
                  value={dataProfil.cita_cita}
                  id="cita_cita"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<AccountBalanceIcon />}
                  profile_data_category="Universitas Impian"
                  value={dataProfil.uni_impian}
                  id="uni_impian"
                  on_change={handleChangeDataProfil}
                />
              </List>
            </TabPanel>
            <Grid container justify="center" style={{marginTop: "15px"}}>
              <Button
                type="submit"
                id="simpan"
                className={classes.saveButton}
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

ProfileDataEditorDialog.propTypes = {
  auth: PropTypes.object.isRequired,
  updateUserData: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(
  mapStateToProps, {updateUserData}
)(ProfileDataEditorDialog);
