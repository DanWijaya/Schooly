import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import lokal from "date-fns/locale/id";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Hidden,
  InputLabel,
  MenuItem,
  Paper,
  Snackbar,
  Select,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
import { getAllUnits } from "../../../actions/UnitActions";
import {
  registerUser,
  validateRegister,
  checkEmailExist,
} from "../../../actions/UserActions";
import {
  sendOTPRegistrationEmail,
  verifyOTPRegistration,
} from "../../../actions/EmailServiceActions";
import { clearErrors } from "../../../actions/ErrorActions";
import RegisterStepIcon from "./RegisterStepIcon";
import RegisterStepConnector from "./RegisterStepConnector";
import UploadDialog from "../../misc/dialog/UploadDialog";

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
  buttonsContainer: {
    marginTop: "15px",
  },
  loginButton: {
    color: theme.palette.primary.main,
  },
  backButton: {
    width: "100%",
    maxWidth: "90px",
    color: theme.palette.primary.main,
  },
  resendCodeLink: {
    cursor: "pointer",
    textDecoration: "underline",
    color: theme.palette.primary.main,
  },
  resendCodeLinkDisabled: {
    cursor: "default",
    color: "grey",
  },
  continueButton: {
    width: "100%",
    maxWidth: "90px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  registerButton: {
    width: "100%",
    maxWidth: "90px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  registerArt: {
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
      email: "",
      password: "",
      password2: "",
      isVerifiedEmail: false,
      isResendDisabled: true,
      otp: "",
      phone: "",
      emergency_phone: "",
      address: "",
      tanggal_lahir: new Date(),
      role: "",
      unit: null,
      activeStep: 0,
      submitButtonActive: false,
      openUploadDialog: false,
      openSnackbar: false,
      errors: {},
      timer: 30,
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

  onStart = () => {
    this.setState((prevState) => ({
      timer: prevState.timer - 1,
    }));
    if (this.state.timer <= 0) {
      this.onReset();
    }
  };

  onReset = () => {
    clearInterval(this.f);
    this.setState({ timer: 30, isResendDisabled: false });
  };

  timer = () => {
    this.setState({ isResendDisabled: true });
    this.f = setInterval(this.onStart, 1000);
  };

  componentWillUnmount() {
    this.props.handleNavbar(true);
    this.props.clearErrors();
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

    if (this.state.activeStep === 0 && this.state.isVerifiedEmail) {
      this.setState({ isVerifiedEmail: false });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    var newUser = {
      name: this.state.name,
      email: this.state.email.toLowerCase(),
      password: this.state.password,
      password2: this.state.password2,
      phone: this.state.phone,
      emergency_phone: this.state.emergency_phone,
      address: this.state.address,
      tanggal_lahir: this.state.tanggal_lahir,
      role: this.state.role,
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
          })
        );
    }
  };

  // Upload Dialog
  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true });
  };

  // OTP Snackbar
  handleOpenSnackbar = () => {
    this.setState({ openSnackbar: true });
  };

  handleCloseSnackbar = () => {
    this.setState({ openSnackbar: false });
  };

  render() {
    const { classes } = this.props;
    const { all_units } = this.props.unitsCollection;
    const { errors } = this.state;

    const getSteps = () => {
      return [
        "Kredensial Masuk",
        "Verifikasi Email",
        "Informasi Pribadi",
        "Konfirmasi Pendaftaran",
      ];
    };

    const getStepContent = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return (
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  id="name"
                  type="text"
                  label="Nama Lengkap"
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  id="email"
                  type="email"
                  label="Email"
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  helperText={
                    errors.email
                      ? errors.email
                      : "Gunakan email sekolah Anda jika ada"
                  }
                />
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      id="password"
                      type="password"
                      label="Kata Sandi"
                      onChange={this.onChange}
                      value={this.state.password}
                      error={errors.password}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      id="password2"
                      type="password"
                      label="Konfirmasi"
                      onChange={this.onChange}
                      value={this.state.password2}
                      error={errors.password2}
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
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography variant="body2">
                  Masukkan kode verifikasi yang telah dikirimkan ke email{" "}
                  <b>{this.state.email}</b>.
                </Typography>
                <Typography variant="body2">
                  <span
                    onClick={() => {
                      this.setState({ otp: "", errors: {} });
                      this.timer();
                      sendOTPRegistrationEmail({
                        email: this.state.email,
                        name: this.state.name,
                      });
                      this.handleOpenSnackbar();
                    }}
                    className={
                      this.state.isResendDisabled
                        ? classes.resendCodeLinkDisabled
                        : classes.resendCodeLink
                    }
                  >
                    Kirim Ulang
                  </span>{" "}
                  {`(00:${this.state.timer})`}
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  id="otp"
                  type="text"
                  label="Kode Verifikasi Email"
                  onChange={this.onChange}
                  disabled={this.state.is}
                  value={this.state.otp}
                  error={errors.otp}
                  helperText={errors.otp}
                />
              </Grid>
            </Grid>
          );
        case 2:
          return (
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <FormControl
                  fullWidth
                  variant="outlined"
                  size="small"
                  color="primary"
                  id="role"
                  error={Boolean(errors.role)}
                >
                  <InputLabel>Daftar Sebagai</InputLabel>
                  <Select
                    label="Daftar Sebagai"
                    value={this.state.role}
                    onChange={(event) => this.onChange(event, "role")}
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
                    variant="outlined"
                    size="small"
                    color="primary"
                    id="unit"
                    error={Boolean(errors.unit)}
                  >
                    <InputLabel>Unit</InputLabel>
                    <Select
                      label="Unit"
                      value={this.state.unit}
                      onChange={(event) => this.onChange(event, "unit")}
                    >
                      {all_units.map((unit) => (
                        <MenuItem value={unit._id}>{unit.name}</MenuItem>
                      ))}
                    </Select>
                    {Boolean(errors.unit) ? (
                      <FormHelperText>{errors.unit}</FormHelperText>
                    ) : null}
                  </FormControl>
                </Grid>
              )}
              <Grid item>
                <MuiPickersUtilsProvider locale={lokal} utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    fullWidth
                    disableFuture
                    inputVariant="outlined"
                    size="small"
                    id="tanggal_lahir"
                    format="dd MMM yyyy"
                    label="Tanggal Lahir"
                    okLabelL="Simpan"
                    cancelLabel="Batal"
                    invalidDateMessage="Format tanggal tidak benar"
                    maxDateMessage="Harus waktu yang akan datang"
                    onChange={(date) => this.handleDateChange(date)}
                    defaultValue={null}
                    value={this.state.tanggal_lahir}
                    error={errors.tanggal_lahir}
                    helperText={errors.tanggal_lahir}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      id="phone"
                      type="tel"
                      label="Nomor Telepon"
                      onChange={this.onChange}
                      value={this.state.phone}
                      error={errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      id="emergency_phone"
                      type="tel"
                      label="Nomor Telepon Darurat"
                      onChange={this.onChange}
                      value={this.state.emergency_phone}
                      error={errors.emergency_phone}
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
                  size="small"
                  id="address"
                  type="text"
                  label="Alamat"
                  onChange={this.onChange}
                  value={this.state.address}
                  error={errors.address}
                  helperText={errors.address}
                />
              </Grid>
            </Grid>
          );
        case 3:
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
                  <ul>
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

    const getDataToValidate = () => {
      // To decide the value of the data to validate.
      var dataToValidate;
      if (this.state.activeStep === 0) {
        dataToValidate = {
          name: this.state.name,
          email: this.state.email.toLowerCase(),
          password: this.state.password,
          password2: this.state.password2,
        };
      } else if (this.state.activeStep === 2) {
        dataToValidate = {
          role: this.state.role,
          phone: this.state.phone,
          emergency_phone: this.state.emergency_phone,
          address: this.state.address,
          tanggal_lahir: this.state.tanggal_lahir,
        };
      }

      return dataToValidate;
    };

    const handleNext = async () => {
      // To decide the value of the data to validate.
      try {
        if (this.state.isVerifiedEmail && this.state.activeStep === 0) {
          // If email is verified and no info change from the first step, jump directly to user details page.
          this.setState({ activeStep: 2 });
          return;
        }
        if (this.state.activeStep === 1) {
          const data = {
            email: this.state.email,
            name: this.state.name,
            otp: this.state.otp,
          };
          if (!this.state.isVerifiedEmail) {
            const otpResponse = await verifyOTPRegistration(data);
            if (!otpResponse.success) {
              this.setState({ errors: { otp: otpResponse.message } });
              return;
            }
          }
          this.setState((prevState) => ({
            activeStep: prevState.activeStep + 1,
            submitButtonActive: false,
            isVerifiedEmail: true,
            otp: "",
          }));
          return;
        }

        var dataToValidate = getDataToValidate();
        //Decide if we have to do validate register or not.
        await validateRegister(dataToValidate, this.state.activeStep + 1);
        this.setState({ errors: {} });
        if (this.state.activeStep === 0) {
          //Send email when click next in the first page
          const isExist = await checkEmailExist(this.state.email);
          if (isExist) {
            this.setState({ errors: { email: "Email sudah terdaftar" } });
            return;
          }
          const data = { email: this.state.email, name: this.state.name };
          await sendOTPRegistrationEmail(data);
          this.timer();
        }

        if (this.state.activeStep === 2) {
          this.setState({ submitButtonActive: true });
        } else {
          this.setState({ submitButtonActive: false });
        }

        this.setState((prevState) => ({
          activeStep: prevState.activeStep + 1,
        }));
      } catch (err) {
        this.setState({ errors: err });
      }

      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };

    const handleBack = () => {
      if (this.state.activeStep === 1) {
        this.setState({ otp: "" });
      }
      if (this.state.activeStep === 3) {
        this.setState((prevState) => ({
          activeStep: prevState.activeStep - 1,
        }));
      } else {
        this.setState({ activeStep: 0 });
      }

      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };

    document.title = "Daftar ke Schooly";

    return (
      <div className={classes.root}>
        <Link to="/">
          <img
            alt="Schooly Introduction"
            src="/logos/SchoolyLogo.png"
            className={classes.schoolyLogo}
          />
        </Link>
        <Paper elevation={11} className={classes.registerPaper}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={7}>
              <Grid container direction="column" spacing={6}>
                <Grid item>
                  <Typography variant="h6">Daftar ke Schooly</Typography>
                </Grid>
                <Grid item>
                  <form noValidate onSubmit={this.onSubmit}>
                    <Grid
                      container
                      direction="column"
                      justify="space-between"
                      spacing={6}
                      style={{ minHeight: "350px" }}
                    >
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
                  style={{ marginTop: "70px" }}
                >
                  Buat akun Anda dengan tiga langkah mudah
                </Typography>
                <img
                  alt="Register Art"
                  src="/images/illustrations/RegisterStepperArt.png"
                  className={classes.registerArt}
                />
                <Stepper
                  alternativeLabel
                  connector={<RegisterStepConnector />}
                  activeStep={this.state.activeStep}
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
        <UploadDialog
          openUploadDialog={this.state.openUploadDialog}
          success={!errors}
          messageUploading="Akun baru sedang dibuat"
          messageSuccess="Akun baru berhasil dibuat"
          redirectLink="/masuk"
        />
        <Snackbar
          open={this.state.openSnackbar}
          onClose={this.handleCloseSnackbar}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert elevation={6} variant="filled" severity="success">
            Kode verifikasi baru telah dikirm ke email Anda
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

Register.propTypes = {
  auth: PropTypes.object.isRequired,
  unitsCollection: PropTypes.object.isRequired,
  getAllUnits: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  unitsCollection: state.unitsCollection,
  errors: state.errors,
});

export default withRouter(
  connect(mapStateToProps, {
    getAllUnits,
    registerUser,
    clearErrors,
  })(withStyles(styles)(Register))
);
