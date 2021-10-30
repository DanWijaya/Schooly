import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import DateFnsUtils from "@date-io/date-fns";
import lokal from "date-fns/locale/id";
import { clearErrors } from "../../../actions/ErrorActions";
import { registerUser, validateRegister } from "../../../actions/UserActions";
import { getAllUnits } from "../../../actions/UnitActions";
import schoolyLogo from "../../../images/SchoolyLogo.png";
import registerStepperArt from "./RegisterStepperArt.png";
import UploadDialog from "../../misc/dialog/UploadDialog";
import RegisterStepIcon from "./RegisterStepIcon";
import RegisterStepConnector from "./RegisterStepConnector";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Hidden,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Alert from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    padding: "10px",
    background: "linear-gradient(#2196F3, #FFFFFF)",
    backgroundSize: "100% 300px",
    backgroundRepeat: "no-repeat",
  },
  schoolyLogo: {
    width: "250px",
    height: "125px",
    marginBottom: "25px",
  },
  registerPaper: {
    margin: "auto",
    padding: "40px",
    maxWidth: "800px",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "400px",
    },
  },
  combinedHelperText: {
    marginLeft: "14px",
  },
  list: {
    margin: "0px 0px 0px 40px",
    padding: "0px",
    [theme.breakpoints.down("sm")]: {
      margin: "0px 0px 0px 16px",
    },
  },
  buttonsContainer: {
    marginTop: "15px",
  },
  loginButton: {
    color: theme.palette.primary.main,
  },
  backButton: {
    color: theme.palette.primary.main,
    maxWidth: "90px",
    width: "100%",
  },
  continueButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    maxWidth: "90px",
    width: "100%",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  registerButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    maxWidth: "90px",
    width: "100%",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  artThumbnail: {
    maxWidth: "100%",
    maxHeight: "100%",
    marginBottom: "10px",
  },
  registerStepper: {
    padding: "0px",
  },
});

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      role: "",
      email: "",
      address: "",
      phone: "",
      emergency_phone: "",
      password: "",
      password2: "",
      errors: {},
      unit: null,
      tanggal_lahir: new Date(),
      activeStep: 0,
      snackbarOpen: false,
      submitButtonActive: false,
      openUploadDialog: false,
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/beranda");
    }
    this.props.handleNavbar(false);
    this.props.getAllUnits();
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.handleNavbar(true);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors === false) {
      this.setState({
        errors: nextProps.errors,
      });
      return;
    }

    if (Object.keys(nextProps.errors).length > 0) {
      this.setState({
        errors: nextProps.errors,
        snackbarOpen: true,
      });
    }
  }

  handleDateChange = (date) => {
    this.setState({
      tanggal_lahir: date,
      errors: { ...this.state.errors, tanggal_lahir: "" },
    });
  };

  onChange = (e, otherfield) => {
    let field = otherfield ? otherfield : e.target.id;
    if (this.state.errors[field]) {
      this.setState({ errors: { ...this.state.errors, [field]: null } });
    }
    this.setState({ [field]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    var newUser = {
      name: this.state.name,
      role: this.state.role,
      email: this.state.email.toLowerCase(),
      phone: this.state.phone,
      emergency_phone: this.state.emergency_phone,
      address: this.state.address,
      password: this.state.password,
      password2: this.state.password2,
      tanggal_lahir: this.state.tanggal_lahir,
      unit: this.state.unit,
    };

    if (this.state.submitButtonActive) {
      this.props
        .registerUser(newUser)
        .then((res) => {
          this.handleOpenUploadDialog();
        })
        .catch((err) =>
          this.setState({
            errors: err,
            snackbarOpen: true,
          })
        );
    }
  };

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true });
  };

  render() {
    const { classes } = this.props;
    const { errors } = this.state;
    const { all_units } = this.props.unitsCollection;
    const getSteps = () => {
      return [
        "Kredensial Masuk",
        "Informasi Pribadi",
        "Konfirmasi Pendaftaran",
      ];
    };

    const getStepContent = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return (
            <Grid container direction="column" spacing={5}>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="name"
                  label="Nama Lengkap"
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  type="text"
                  helperText={errors.name}
                  className={classnames("", {
                    invalid: errors.name,
                  })}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="email"
                  label="Email"
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  type="email"
                  helperText={
                    errors.email
                      ? errors.email
                      : "Isi dengan email sekolah Anda jika ada"
                  }
                  className={classnames("", {
                    invalid: errors.email,
                  })}
                />
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="password"
                      label="Kata Sandi"
                      onChange={this.onChange}
                      value={this.state.password}
                      error={errors.password}
                      type="password"
                      className={classnames("", {
                        invalid: errors.password,
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="password2"
                      label="Konfirmasi"
                      onChange={this.onChange}
                      value={this.state.password2}
                      error={errors.password2}
                      type="password"
                      className={classnames("", {
                        invalid: errors.password2,
                      })}
                    />
                  </Grid>
                </Grid>
                <FormHelperText
                  error={errors.password || errors.password2}
                  className={classes.combinedHelperText}
                >
                  {errors.password
                    ? errors.password
                    : errors.password2
                    ? errors.password2
                    : "Gunakan 8 karakter atau lebih dengan kombinasi huruf kapital dan angka"}
                </FormHelperText>
              </Grid>
            </Grid>
          );
        case 1:
          return (
            <Grid container direction="column" spacing={5}>
              <Grid item>
                <FormControl
                  fullWidth
                  id="role"
                  variant="outlined"
                  color="primary"
                  error={Boolean(errors.role)}
                >
                  <InputLabel id="role-label">Daftar Sebagai</InputLabel>
                  <Select
                    labelId="role-label"
                    label="Daftar Sebagai"
                    value={this.state.role}
                    onChange={(event) => {
                      this.onChange(event, "role");
                    }}
                  >
                    <MenuItem value="Student">Murid</MenuItem>
                    <MenuItem value="Teacher">Guru</MenuItem>
                    <MenuItem value="Admin">Pengelola Unit</MenuItem>
                    <MenuItem value="SuperAdmin">Pengelola Sekolah</MenuItem>
                  </Select>
                  {Boolean(errors.role) ? (
                    <FormHelperText>{errors.role}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>
              {this.state.role === "SuperAdmin" ? null : (
                <Grid item>
                  <FormControl
                    fullWidth
                    id="unit"
                    variant="outlined"
                    color="primary"
                    error={Boolean(errors.unit)}
                  >
                    <InputLabel id="unit-label">Unit</InputLabel>
                    <Select
                      labelId="unit-label"
                      label="Unit"
                      value={this.state.unit}
                      onChange={(event) => {
                        this.onChange(event, "unit");
                      }}
                    >
                      {all_units.map((unit) => (
                        <MenuItem value={unit._id}>{unit.name}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {Boolean(errors.unit) ? errors.unit : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              )}
              <Grid item>
                <MuiPickersUtilsProvider locale={lokal} utils={DateFnsUtils}>
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
                    defaultValue={null}
                    error={errors.tanggal_lahir}
                    helperText={errors.tanggal_lahir}
                    value={this.state.tanggal_lahir}
                    onChange={(date) => this.handleDateChange(date)}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="phone"
                      label="Nomor Telepon"
                      onChange={this.onChange}
                      value={this.state.phone}
                      error={errors.phone}
                      type="tel"
                      className={classnames("", {
                        invalid: errors.phone,
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="emergency_phone"
                      label="Nomor Telepon Darurat"
                      onChange={this.onChange}
                      value={this.state.emergency_phone}
                      error={errors.emergency_phone}
                      type="tel"
                      className={classnames("", {
                        invalid: errors.emergency_phone,
                      })}
                    />
                  </Grid>
                </Grid>
                <FormHelperText
                  error={errors.phone || errors.emergency_phone}
                  className={classes.combinedHelperText}
                >
                  {errors.phone
                    ? errors.phone
                    : errors.emergency_phone
                    ? errors.emergency_phone
                    : "Nomor telepon darurat harus diisi dengan nomor yang dapat dihubungi sewaktu keadaan darurat"}
                </FormHelperText>
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  multiline
                  rows="2"
                  rowsMax="3"
                  variant="outlined"
                  id="address"
                  label="Alamat"
                  onChange={this.onChange}
                  value={this.state.address}
                  error={errors.address}
                  type="text"
                  helperText={errors.address}
                  className={classnames("", {
                    invalid: errors.address,
                  })}
                />
              </Grid>
            </Grid>
          );
        case 2:
          return (
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Typography paragraph>
                  Setelah pendaftaran selesai, silahkan hubungi pengelola
                  sekolah Anda untuk mengaktifkan akun Anda.
                </Typography>
                <Typography>
                  Dengan mendaftar, Anda dan sekolah Anda telah menyetujui{" "}
                  <Link
                    to="/legal/ketentuan-penggunaan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ketentuan Penggunaan{" "}
                  </Link>{" "}
                  Schooly System.
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  Informasi yang Anda berikan pada pendaftaran ini serta
                  penggunaan yang akan Anda gunakan pada aplikasi ini diatur
                  dalam{" "}
                  <Link
                    to="/legal/kebijakan-privasi"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Kebijakan Privasi{" "}
                  </Link>{" "}
                  Schooly System, yang dimana telah dirangkum dalam beberapa
                  poin-poin utama berikut:
                </Typography>
                <Typography>
                  <ul className={classes.list}>
                    <li style={{ listStyleType: "disc" }}>
                      Kami peduli dengan privasi Anda. Kami tidak dan tidak akan
                      menjual atau menyewakan data Anda kepada pihak ketiga
                      kecuali jika diperlukan dalam konteks perubahan struktur
                      bisnis kami seperti merger atau akuisisi.
                    </li>
                    <li style={{ listStyleType: "disc" }}>
                      Informasi pribadi yang anda berikan hanya kami gunakan
                      untuk memberikan produk dan layanan yang lebih baik serta
                      analitik untuk pemasaran yang ada dalam lingkup Schooly
                      sendiri, institusi Anda, serta vendor dan mitra kami.
                    </li>
                    <li style={{ listStyleType: "disc" }}>
                      Kami membatasi dan berusaha untuk menyamarkan informasi
                      kami bagikan kepada vendor atau mitra untuk keamanan
                      bersama.
                    </li>
                    <li style={{ listStyleType: "disc" }}>
                      Jika Anda adalah pengguna produk dan layanan kami yang
                      kami sediakan atas nama institusi Anda, hubungi institusi
                      Anda terlebih dahulu karena kebijkan privasi institusi
                      Anda dan praktik privasi data akan menentukan bagaimana
                      Schooly menggunakan informasi pribadi atas nama institusi
                      Anda. Jika Anda memiliki masalah teknis atau dukungan,
                      silakan hubungi meja bantuan institusi Anda. Mereka akan
                      dapat membantu.
                    </li>
                    <li style={{ listStyleType: "disc" }}>
                      Jika Anda memiliki pertanyaan atau kekhawatiran tentang
                      kebijakan privasi kami atau praktik privasi data kami
                      sendiri, hubungi kami di{" "}
                      <a href="mailto:schoolysystem@gmail.com">
                        schoolysystem@gmail.com
                      </a>
                      .
                    </li>
                  </ul>
                </Typography>
              </Grid>
            </Grid>
          );
        default:
          return "Unknown stepIndex";
      }
    };

    const steps = getSteps();

    const handleNext = () => {
      if (this.state.activeStep !== 2 || this.state.errors === null)
        var userData;
      if (this.state.activeStep === 0) {
        userData = {
          name: this.state.name,
          email: this.state.email.toLowerCase(),
          password: this.state.password,
          password2: this.state.password2,
        };
      } else if (this.state.activeStep === 1) {
        userData = {
          role: this.state.role,
          phone: this.state.phone,
          emergency_phone: this.state.emergency_phone,
          address: this.state.address,
          tanggal_lahir: this.state.tanggal_lahir,
        };
      }

      // // get errors on current page
      // validateRegister(userData, this.state.activeStep + 1);
      // if no error exists, proceed to next page
      validateRegister(userData, this.state.activeStep + 1)
        .then(() => {
          this.setState({ errors: {} });
          if (Object.keys(this.state.errors).length === 0) {
            this.setState((prevState) => ({
              activeStep: prevState.activeStep + 1,
              submitButtonActive: false,
            }));
          }

          if (this.state.activeStep === 2) {
            this.setState({ submitButtonActive: true });
          }
        })
        .catch((err) => {
          this.setState({ errors: err });
        });

      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };

    const handleBack = () => {
      if (this.state.snackbarOpen) {
        this.setState({ snackbarOpen: false });
      }
      this.setState((prevState) => ({
        activeStep: prevState.activeStep - 1,
      }));
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };

    // Error Snackbar
    const handleCloseSnackbar = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      this.setState({ snackbarOpen: false });
    };

    document.title = "Daftar ke Schooly";

    return (
      <div className={classes.root}>
        <Link to="/">
          <img
            alt="Schooly Introduction"
            src={schoolyLogo}
            className={classes.schoolyLogo}
          />
        </Link>
        <Paper elevation={11} className={classes.registerPaper}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={7}>
              <Grid container direction="column" spacing={6}>
                <Grid item>
                  <Typography variant="h6">
                    <b>Daftar ke Schooly</b>
                  </Typography>
                </Grid>
                <Grid item>
                  <form noValidate onSubmit={this.onSubmit}>
                    <Grid container direction="column" spacing={6}>
                      <Grid item>{getStepContent(this.state.activeStep)}</Grid>
                      <Grid
                        item
                        container
                        justify="space-between"
                        className={classes.buttonsContainer}
                      >
                        <Grid item>
                          {this.state.activeStep === 0 ? (
                            <Link to="/masuk">
                              <Button className={classes.loginButton}>
                                Masuk saja
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              onClick={handleBack}
                              className={classes.backButton}
                            >
                              Kembali
                            </Button>
                          )}
                        </Grid>
                        <Grid item>
                          {this.state.activeStep === steps.length - 1 ? (
                            <Button
                              type="submit"
                              variant="contained"
                              className={classes.registerButton}
                            >
                              Daftar
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              onClick={handleNext}
                              className={classes.continueButton}
                            >
                              Lanjut
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </Grid>
            </Grid>
            <Hidden smDown>
              <Grid item xs={12} md={5}>
                <Typography
                  variant="body2"
                  align="center"
                  paragraph
                  style={{ marginTop: "80px" }}
                >
                  Buat akun Anda dengan tiga langkah mudah
                </Typography>
                <img
                  alt="Register Art"
                  src={registerStepperArt}
                  className={classes.artThumbnail}
                />
                <Stepper
                  alternativeLabel
                  activeStep={this.state.activeStep}
                  connector={<RegisterStepConnector />}
                  className={classes.registerStepper}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={RegisterStepIcon}>
                        <Typography variant="caption">{label}</Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Grid>
            </Hidden>
          </Grid>
        </Paper>
        <Snackbar
          open={this.state.snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            elevation={6}
            variant="filled"
            onClose={handleCloseSnackbar}
            severity="error"
          >
            Terdapat kesalahan dalam pengisian!
          </Alert>
        </Snackbar>
        <UploadDialog
          openUploadDialog={this.state.openUploadDialog}
          success={!errors}
          messageUploading="Akun baru sedang dibuat"
          messageSuccess="Akun baru telah terdaftar"
          redirectLink="/masuk"
        />
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  getAllUnits: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  unitsCollection: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  unitsCollection: state.unitsCollection,
});

export default withRouter(
  connect(mapStateToProps, {
    registerUser,
    clearErrors,
    getAllUnits,
  })(withStyles(styles)(Register))
);
