import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import lokal from "date-fns/locale/id";
import { updateUserData } from "../../../actions/UserActions";
import { clearErrors} from "../../../actions/ErrorActions";
import { Avatar, Button, Box, Dialog, Grid, Hidden, IconButton, List, ListItem, ListItemAvatar, MenuItem, Select, Tab, Tabs, TextField, Typography } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
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
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import WcIcon from "@material-ui/icons/Wc";
import WorkIcon from "@material-ui/icons/Work";

const Validator = require("validator");
const isEmpty = require("is-empty");

const useStyles = makeStyles((theme) => ({
  editProfileButton: {
    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.dark,
      color: "white",
    },
  },
  root: {
    padding: "15px",
  },
  tabTitle: {
    fontSize: "10px",
    [theme.breakpoints.up("sm")]: {
      fontSize: "12px",
    },
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
        <Box>
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
  const { errors } = props;
  console.log(errors)
  return (
    <ListItem>
      <Grid container alignItems="center">
        <Grid item sm={2}>
          <Hidden xsDown implementation="css">
            <ListItemAvatar>
              <Avatar className={classes.profileDataItemAvatar}>
                {props.profile_data_icon}
              </Avatar>
            </ListItemAvatar>
          </Hidden>
        </Grid>
        <Grid item xs={12} sm={10}>
          { props.is_textfield ?
            <div>
              <label for={props.id}>{props.profile_data_category}</label>
              <TextField
                fullWidth
                variant="outlined"
                id={props.id}
                onChange={props.on_change}
                value={props.value}
                error={!errors ? null : errors.email}
                helperText={!errors ? null : errors.email}
              />
            </div>
          :
            props.non_textfield_content
          }
        </Grid>
      </Grid>
    </ListItem>
  )
}

function ProfileDataEditorDialog(props) {
  const classes = useStyles();

  const { user } = props.auth;
  const { updateUserData, clearErrors, errors } = props;

  //Dialog
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (simpan) => {
    console.log(simpan)
    if (simpan !== "simpan")
      setDataProfil(defaultUserData)
    clearErrors()
    setOpen(false);
  };

  //Tabs
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    clearErrors()
    setValue(newValue);
  };

  console.log(user.tanggal_lahir instanceof Date)
  const defaultUserData = {
    // Informasi Pribadi
    nama: user.name,
    tanggal_lahir: new Date(user.tanggal_lahir),
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
    let userId = user.id;
    if (!isEmpty(dataProfil.email) && Validator.isEmail(dataProfil.email))
      props.handleOpenAlert()

    updateUserData(dataProfil, userId, props.history)
  }

  const handleChangeDataProfil = (e, otherfield) => {
    let { id, value } = e.target
    clearErrors()
    if (otherfield === "jenis_kelamin") {
      setDataProfil((prev) => ({
        ...prev,
        jenis_kelamin : value
      }))
    }
    setDataProfil((prev) => ({
      ...prev,
      [id] : value
    }))
  }

  const handleDateChange = (date) => {
    setDataProfil((prev) => ({
      ...prev,
      tanggal_lahir : date
    }))
  }

  return (
    <div>
      <Hidden smUp>
        <Button
          variant="contained"
          onClick={handleClickOpen}
          className={classes.editProfileButton}
        >
          <EditIcon />
        </Button>
      </Hidden>
      <Hidden xsDown>
        <Button
          variant="contained"
          onClick={handleClickOpen}
          startIcon={<EditIcon />}
          className={classes.editProfileButton}
        >
          Sunting Profil
        </Button>
      </Hidden>
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
          <Grid item style={{marginBottom: "10px"}}>
            <Typography variant="h5" gutterBottom>
              <b>Sunting Profil</b>
            </Typography>
          </Grid>
          <form onSubmit={onSubmit} style={{width: "90%"}}>
            <Tabs
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              value={value}
              onChange={handleChange}
            >
              <Tab
                icon={<ContactsIcon />}
                label={
                  <Typography className={classes.tabTitle}>
                    Informasi Pribadi
                  </Typography>
                }
                {...TabIndex(0)}
              />
              <Tab
                icon={<ContactMailIcon />}
                label={
                  <Typography className={classes.tabTitle}>
                    Kontak
                  </Typography>
                }
                {...TabIndex(1)}
              />
              {(user.role === "Student") ? (
                <Tab
                  icon={<EmojiPeopleIcon />}
                  label={
                    <Typography className={classes.tabTitle}>
                      Karir
                    </Typography>
                  }
                  {...TabIndex(2)}
                />
              ) : null}
            </Tabs>
            <TabPanel value={value} index={0}>
              <List>
                <ProfileDataItemEdit
                  profile_data_icon={<PersonIcon />}
                  profile_data_category="Nama"
                  is_textfield
                  value={dataProfil.nama}
                  id="nama"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<CakeIcon />}
                  profile_data_category="Tanggal Lahir"
                  non_textfield_content={
                    <div>
                      <label for="tanggal_lahir">Tanggal Lahir</label>
                      <MuiPickersUtilsProvider locale={lokal} utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          fullWidth
                          disableFuture
                          inputVariant="outlined"
                          maxDateMessage="Batas waktu harus waktu yang akan datang"
                          invalidDateMessage="Format tanggal tidak benar"
                          format="dd/MM/yyyy"
                          okLabel="Simpan"
                          cancelLabel="Batal"
                          id="tanggal_lahir"
                          onChange={(date) => handleDateChange(date)}
                          value={dataProfil.tanggal_lahir instanceof Date ?
                            dataProfil.tanggal_lahir
                          :
                            null
                          }
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                  }
                />
                <ProfileDataItemEdit
                  profile_data_icon={<WcIcon />}
                  profile_data_category="Jenis Kelamin"
                  non_textfield_content={
                    <div>
                      <label for="jenis_kelamin">Jenis kelamin</label>
                      <Select
                        fullWidth
                        variant="outlined"
                        color="primary"
                        id="jenis_kelamin"
                        value={dataProfil.jenis_kelamin}
                        onChange={(event) => {handleChangeDataProfil(event, "jenis_kelamin")}}
                      >
                        <MenuItem value="Pria">Pria</MenuItem>
                        <MenuItem value="Wanita">Wanita</MenuItem>
                      </Select>
                    </div>
                  }
                />
                {/*<ProfileDataItemEdit
                  profile_data_icon={<SchoolIcon />}
                  profile_data_category="Sekolah"
                  is_textfield
                  value={dataProfil.sekolah}
                  id="sekolah"
                  on_change={handleChangeDataProfil}
                />*/}
              </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <List>
                <ProfileDataItemEdit
                  profile_data_icon={<EmailIcon />}
                  profile_data_category="Email"
                  is_textfield
                  value={dataProfil.email}
                  errors={errors}
                  id="email"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<PhoneIcon />}
                  profile_data_category="Nomor Telepon"
                  is_textfield
                  value={dataProfil.no_telp}
                  id="no_telp"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<ContactPhoneIcon />}
                  profile_data_category="Nomor Telepon Darurat"
                  is_textfield
                  value={dataProfil.no_telp_darurat}
                  id="no_telp_darurat"
                  on_change={handleChangeDataProfil}
                />
                <ProfileDataItemEdit
                  profile_data_icon={<HomeIcon />}
                  profile_data_category="Alamat"
                  is_textfield
                  value={dataProfil.alamat}
                  id="alamat"
                  on_change={handleChangeDataProfil}
                />
              </List>
            </TabPanel>
            {(user.role==="Student") ? (
              <TabPanel value={value} index={2}>
                <List>
                  <ProfileDataItemEdit
                    profile_data_icon={<SportsEsportsIcon />}
                    profile_data_category="Hobi dan Minat"
                    is_textfield
                    value={dataProfil.hobi_minat}
                    id="hobi_minat"
                    on_change={handleChangeDataProfil}
                  />
                  <ProfileDataItemEdit
                    profile_data_icon={<ColorLensIcon />}
                    profile_data_category="Keterampilan Non-Akademik"
                    is_textfield
                    value={dataProfil.ket_non_teknis}
                    id="ket_non_teknis"
                    on_change={handleChangeDataProfil}
                  />
                  <ProfileDataItemEdit
                    profile_data_icon={<WorkIcon />}
                    profile_data_category="Cita-Cita"
                    is_textfield
                    value={dataProfil.cita_cita}
                    id="cita_cita"
                    on_change={handleChangeDataProfil}
                  />
                  <ProfileDataItemEdit
                    profile_data_icon={<AccountBalanceIcon />}
                    profile_data_category="Universitas Impian"
                    is_textfield
                    value={dataProfil.uni_impian}
                    id="uni_impian"
                    on_change={handleChangeDataProfil}
                  />
                </List>
              </TabPanel>
            ) : null}
            <Grid container justify="center" style={{marginTop: "10px"}}>
              <Button
                type="submit"
                variant="contained"
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
  updateUserData: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps, { updateUserData, clearErrors }
) (ProfileDataEditorDialog);
