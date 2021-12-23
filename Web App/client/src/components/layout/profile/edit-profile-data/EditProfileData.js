import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import lokal from "date-fns/locale/id";
import { updateUserData } from "../../../../actions/UserActions";
import { clearErrors } from "../../../../actions/ErrorActions";
import DataField from "../DataField";
import { TabPanel, TabIndex } from "../../../misc/tab-panel/TabPanel";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  AccountBalance as AccountBalanceIcon,
  Cake as CakeIcon,
  Close as CloseIcon,
  ColorLens as ColorLensIcon,
  Contacts as ContactsIcon,
  ContactMail as ContactMailIcon,
  ContactPhone as ContactPhoneIcon,
  Edit as EditIcon,
  EmojiPeople as EmojiPeopleIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  SportsEsports as SportsEsportsIcon,
  Wc as WcIcon,
  Work as WorkIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

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
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
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

function EditProfileData(props) {
  const classes = useStyles();
  const { user } = props.auth;
  const { updateUserData, clearErrors, errors, handleOpenAlert } = props;

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

    // Contacts
    email: user.email,
    no_telp: user.phone,
    no_telp_darurat: user.emergency_phone,
    alamat: user.address,

    // Career
    hobi_minat: user.hobi_minat,
    ket_non_teknis: user.ket_non_teknis,
    cita_cita: user.cita_cita,
    uni_impian: user.uni_impian,
  };

  const [dataProfil, setDataProfil] = React.useState(defaultUserData);

  // Pass the submit form.
  const onSubmit = (e) => {
    e.preventDefault();
    let userId = user._id;
    handleOpenAlert();

    updateUserData(dataProfil, userId, props.history).then((res) =>
      props.handleOpenAlert()
    );
  };

  const handleChangeProfileData = (e, otherfield) => {
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
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
      >
        <div className={classes.root}>
          <DialogActions>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogActions>
          <DialogTitle>
            <Typography variant="h6" align="center">
              Sunting Profil
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
                    <Typography variant="caption">Informasi Pribadi</Typography>
                  }
                  {...TabIndex(0)}
                />
                <Tab
                  icon={<ContactMailIcon />}
                  label={<Typography variant="caption">Kontak</Typography>}
                  {...TabIndex(1)}
                />
                {user.role === "Student" ? (
                  <Tab
                    icon={<EmojiPeopleIcon />}
                    label={<Typography variant="caption">Karir</Typography>}
                    {...TabIndex(2)}
                  />
                ) : null}
              </Tabs>
              <TabPanel value={value} index={0}>
                <List>
                  <DataField
                    isTextField
                    id="nama"
                    type="Nama"
                    icon={<PersonIcon />}
                    iconStyle={classes.dataIcon}
                    value={dataProfil.nama}
                    onChange={handleChangeProfileData}
                  />
                  <DataField
                    type="Tanggal Lahir"
                    icon={<CakeIcon />}
                    iconStyle={classes.dataIcon}
                    nonTextFieldContent={
                      <div>
                        <MuiPickersUtilsProvider
                          locale={lokal}
                          utils={DateFnsUtils}
                        >
                          <KeyboardDatePicker
                            fullWidth
                            disableFuture
                            inputVariant="outlined"
                            size="small"
                            id="tanggal_lahir"
                            label="Tanggal Lahir"
                            maxDateMessage="Harus waktu yang akan datang"
                            invalidDateMessage="Format tanggal tidak benar"
                            format="dd MMM yyyy"
                            okLabel="Simpan"
                            cancelLabel="Batal"
                            value={
                              dataProfil.tanggal_lahir instanceof Date
                                ? dataProfil.tanggal_lahir
                                : null
                            }
                            onChange={(date) => handleDateChange(date)}
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                    }
                  />
                  <DataField
                    type="Jenis Kelamin"
                    icon={<WcIcon />}
                    iconStyle={classes.dataIcon}
                    nonTextFieldContent={
                      <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        color="primary"
                        id="jenis_kelamin"
                      >
                        <InputLabel>
                          Jenis Kelamin
                        </InputLabel>
                        <Select
                          label="Mata Pelajaran"
                          value={dataProfil.jenis_kelamin}
                          onChange={(event) => {
                            handleChangeProfileData(event, "jenis_kelamin");
                          }}
                        >
                          <MenuItem value="Pria">Pria</MenuItem>
                          <MenuItem value="Wanita">Wanita</MenuItem>
                        </Select>
                      </FormControl>
                    }
                  />
                </List>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <List>
                  <DataField
                    id="email"
                    isTextField
                    type="Email"
                    icon={<EmailIcon />}
                    iconStyle={classes.dataIcon}
                    value={dataProfil.email}
                    onChange={handleChangeProfileData}
                    errors={errors.email}
                  />
                  <DataField
                    isTextField
                    id="no_telp"
                    type="Nomor Telepon"
                    icon={<PhoneIcon />}
                    iconStyle={classes.dataIcon}
                    value={dataProfil.no_telp}
                    onChange={handleChangeProfileData}
                  />
                  <DataField
                    isTextField
                    id="no_telp_darurat"
                    type="Nomor Telepon Darurat"
                    icon={<ContactPhoneIcon />}
                    iconStyle={classes.dataIcon}
                    value={dataProfil.no_telp_darurat}
                    onChange={handleChangeProfileData}
                  />
                  <DataField
                    isTextField
                    id="alamat"
                    type="Alamat"
                    icon={<HomeIcon />}
                    iconStyle={classes.dataIcon}
                    value={dataProfil.alamat}
                    onChange={handleChangeProfileData}
                  />
                </List>
              </TabPanel>
              {user.role === "Student" ? (
                <TabPanel value={value} index={2}>
                  <List>
                    <DataField
                      isTextField
                      id="hobi_minat"
                      type="Hobi dan Minat"
                      icon={<SportsEsportsIcon />}
                      iconStyle={classes.dataIcon}
                      value={dataProfil.hobi_minat}
                      onChange={handleChangeProfileData}
                    />
                    <DataField
                      isTextField
                      id="ket_non_teknis"
                      type="Keterampilan Non-Akademik"
                      icon={<ColorLensIcon />}
                      iconStyle={classes.dataIcon}
                      value={dataProfil.ket_non_teknis}
                      onChange={handleChangeProfileData}
                    />
                    <DataField
                      isTextField
                      id="cita_cita"
                      type="Cita-Cita"
                      icon={<WorkIcon />}
                      iconStyle={classes.dataIcon}
                      value={dataProfil.cita_cita}
                      onChange={handleChangeProfileData}
                    />
                    <DataField
                      isTextField
                      id="uni_impian"
                      type="Perguruan Tinggi Impian"
                      icon={<AccountBalanceIcon />}
                      iconStyle={classes.dataIcon}
                      value={dataProfil.uni_impian}
                      onChange={handleChangeProfileData}
                    />
                  </List>
                </TabPanel>
              ) : null}
              <div className={classes.saveButtonContainer}>
                <Button id="save" type="submit" className={classes.saveButton}>
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
