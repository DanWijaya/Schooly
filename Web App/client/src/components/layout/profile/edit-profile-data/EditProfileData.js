import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import lokal from "date-fns/locale/id";
import { updateUserData } from "../../../../actions/UserActions";
import { clearErrors } from "../../../../actions/ErrorActions";
import DataField from "../DataField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import List from "@material-ui/core/List";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { useMediaQuery } from "@material-ui/core";
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

const useStyles = makeStyles((theme) => ({
  root: {
    "@media (max-width: 500px)": {
      maxWidth: "100%",
    },
  },
  editProfileButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  profileDataTabs: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  },
  dataIcon: {
    backgroundColor: theme.palette.primary.main,
  },
  saveButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "25px",
    paddingBottom: "10px",
  },
  saveButton: {
    maxWidth: "100px",
    width: "100%",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

const Validator = require("validator");
const isEmpty = require("is-empty");

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} id={`tabpanel-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
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

function EditProfileData(props) {
  const classes = useStyles();
  const { user } = props.auth;
  const { updateUserData, clearErrors, errors, handleOpenAlert} = props;

  const fullScreen = useMediaQuery("(max-width:500px)");

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (save) => {
    if (save !== "save") setDataProfil(defaultUserData);
    clearErrors();
    setOpen(false);
  };

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    clearErrors();
    setValue(newValue);
  };

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
    uni_impian: user.uni_impian,
  };

  const [dataProfil, setDataProfil] = React.useState(defaultUserData);

  //Pass the submit form
  const onSubmit = (e) => {
    e.preventDefault();
    let userId = user._id;
    handleOpenAlert()
    // if (isEmpty(dataProfil.email) && Validator.isEmail(dataProfil.email))
    //   handleOpenAlert();

    updateUserData(dataProfil, userId, props.history)
        .then((res) => props.handleOpenAlert());
  };

  const handleChangeDataProfil = (e, otherfield) => {
    let { id, value } = e.target;
    clearErrors();
    if (otherfield === "jenis_kelamin") {
      setDataProfil((prev) => ({
        ...prev,
        jenis_kelamin: value,
      }));
    }
    setDataProfil((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDateChange = (date) => {
    setDataProfil((prev) => ({
      ...prev,
      tanggal_lahir: date,
    }));
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<EditIcon />}
        onClick={handleClickOpen}
        className={classes.editProfileButton}
      >
        Sunting Profil
      </Button>
      <Dialog fullWidth open={open} onClose={handleClose} fullScreen={fullScreen}>
        <div className={classes.root}>
          <DialogActions>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogActions>
          <DialogTitle>
            <Typography variant="h6" align="center">
              <b>Sunting Profil</b>
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={onSubmit}>
              <Tabs
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                value={value}
                onChange={handleChange}
                className={classes.profileDataTabs}
              >
                <Tab
                  icon={<ContactsIcon />}
                  label={
                    <Typography variant="caption">
                      Informasi Pribadi
                    </Typography>
                  }
                  {...TabIndex(0)}
                />
                <Tab
                  icon={<ContactMailIcon />}
                  label={
                    <Typography variant="caption">
                      Kontak
                    </Typography>
                  }
                  {...TabIndex(1)}
                />
                {user.role === "Student" ? (
                  <Tab
                    icon={<EmojiPeopleIcon />}
                    label={
                      <Typography variant="caption">
                        Karir
                      </Typography>
                    }
                    {...TabIndex(2)}
                  />
                ) : null}
              </Tabs>
              <TabPanel value={value} index={0}>
                <List>
                  <DataField
                    icon={<PersonIcon />}
                    iconStyle={classes.dataIcon}
                    type="Nama"
                    isTextField
                    value={dataProfil.nama}
                    id="nama"
                    onChange={handleChangeDataProfil}
                  />
                  <DataField
                    icon={<CakeIcon />}
                    iconStyle={classes.dataIcon}
                    type="Tanggal Lahir"
                    nonTextFieldContent={
                      <div>
                        <MuiPickersUtilsProvider
                          locale={lokal}
                          utils={DateFnsUtils}
                        >
                          <KeyboardDatePicker
                            fullWidth
                            disableFuture
                            label="Tanggal Lahir"
                            inputVariant="outlined"
                            maxDateMessage="Harus waktu yang akan datang"
                            invalidDateMessage="Format tanggal tidak benar"
                            format="dd MMM yyyy"
                            okLabel="Simpan"
                            cancelLabel="Batal"
                            id="tanggal_lahir"
                            onChange={(date) => handleDateChange(date)}
                            value={
                              dataProfil.tanggal_lahir instanceof Date
                                ? dataProfil.tanggal_lahir
                                : null
                            }
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                    }
                  />
                  <DataField
                    icon={<WcIcon />}
                    iconStyle={classes.dataIcon}
                    type="Jenis Kelamin"
                    nonTextFieldContent={
                      <FormControl
                        id="jenis_kelamin"
                        variant="outlined"
                        color="primary"
                        fullWidth
                      >
                        <InputLabel id="subject-label">Jenis Kelamin</InputLabel>
                        <Select
                          labelId="subject-label"
                          label="Mata Pelajaran"
                          value={dataProfil.jenis_kelamin}
                          onChange={(event) => {
                            handleChangeDataProfil(event, "jenis_kelamin");
                          }}
                        >
                          <MenuItem value="Pria">Pria</MenuItem>
                          <MenuItem value="Wanita">Wanita</MenuItem>
                        </Select>
                      </FormControl>
                    }
                  />
                  {/*<DataField
                    icon={<SchoolIcon />}
                    iconStyle={classes.dataIcon}
                    type="Sekolah"
                    isTextField
                    value={dataProfil.sekolah}
                    id="sekolah"
                    onChange={handleChangeDataProfil}
                  />*/}
                </List>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <List>
                  <DataField
                    icon={<EmailIcon />}
                    iconStyle={classes.dataIcon}
                    type="Email"
                    isTextField
                    value={dataProfil.email}
                    errors={errors.email}
                    id="email"
                    onChange={handleChangeDataProfil}
                  />
                  <DataField
                    icon={<PhoneIcon />}
                    iconStyle={classes.dataIcon}
                    type="Nomor Telepon"
                    isTextField
                    value={dataProfil.no_telp}
                    id="no_telp"
                    onChange={handleChangeDataProfil}
                  />
                  <DataField
                    icon={<ContactPhoneIcon />}
                    iconStyle={classes.dataIcon}
                    type="Nomor Telepon Darurat"
                    isTextField
                    value={dataProfil.no_telp_darurat}
                    id="no_telp_darurat"
                    onChange={handleChangeDataProfil}
                  />
                  <DataField
                    icon={<HomeIcon />}
                    iconStyle={classes.dataIcon}
                    type="Alamat"
                    isTextField
                    value={dataProfil.alamat}
                    id="alamat"
                    onChange={handleChangeDataProfil}
                  />
                </List>
              </TabPanel>
              {user.role === "Student" ? (
                <TabPanel value={value} index={2}>
                  <List>
                    <DataField
                      icon={<SportsEsportsIcon />}
                      iconStyle={classes.dataIcon}
                      type="Hobi dan Minat"
                      isTextField
                      value={dataProfil.hobi_minat}
                      id="hobi_minat"
                      onChange={handleChangeDataProfil}
                    />
                    <DataField
                      icon={<ColorLensIcon />}
                      iconStyle={classes.dataIcon}
                      type="Keterampilan Non-Akademik"
                      isTextField
                      value={dataProfil.ket_non_teknis}
                      id="ket_non_teknis"
                      onChange={handleChangeDataProfil}
                    />
                    <DataField
                      icon={<WorkIcon />}
                      iconStyle={classes.dataIcon}
                      type="Cita-Cita"
                      isTextField
                      value={dataProfil.cita_cita}
                      id="cita_cita"
                      onChange={handleChangeDataProfil}
                    />
                    <DataField
                      icon={<AccountBalanceIcon />}
                      iconStyle={classes.dataIcon}
                      type="Perguruan Tinggi Impian"
                      isTextField
                      value={dataProfil.uni_impian}
                      id="uni_impian"
                      onChange={handleChangeDataProfil}
                    />
                  </List>
                </TabPanel>
              ) : null}
              <div className={classes.saveButtonContainer}>
                <Button
                  id="save"
                  type="submit"
                  className={classes.saveButton}
                >
                  Simpan
                </Button>
              </div>
            </form>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}

EditProfileData.propTypes = {
  auth: PropTypes.object.isRequired,
  updateUserData: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { updateUserData, clearErrors })(
  EditProfileData
);
