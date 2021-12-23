import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { changePassword } from "../../../../actions/AuthActions";
import { clearErrors } from "../../../../actions/ErrorActions";
import { logoutUser } from "../../../../actions/UserActions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Close as CloseIcon, Lock as LockIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "450px",
    "@media (max-width: 450px)": {
      maxWidth: "100%",
    },
  },
  editPasswordButton: {
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
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

function EditPassword(props) {
  const classes = useStyles();
  const { user } = props.auth;
  const {
    changePassword,
    success,
    errors,
    handleOpenAlert,
    clearErrors,
  } = props;

  const fullScreen = useMediaQuery("(max-width:450px)");

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    clearErrors();
    setOpen(true);
  };
  const handleClose = (e) => {
    setOpen(false);
  };

  const [old_password, setOldPassword] = React.useState("");
  const [new_password, setNewPassword] = React.useState("");
  const [new_password2, setNewPassword2] = React.useState("");
  // const [errorMessage, setErrorMessage] = React.useState({})

  useEffect(() => {
    if (success) {
      handleOpenAlert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const onSubmit = (e) => {
    e.preventDefault();

    var passwordData = {
      email: user.email,
      old_password: old_password,
      new_password: new_password,
      new_password2: new_password2,
    };
    changePassword(passwordData);
  };

  const onChange = (e) => {
    if (Object.keys(errors).length) clearErrors();

    switch (e.target.id) {
      case "old_password":
        setOldPassword(e.target.value);
        break;

      case "new_password":
        setNewPassword(e.target.value);
        break;

      case "new_password2":
        setNewPassword2(e.target.value);
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        className={classes.editPasswordButton}
      >
        <LockIcon />
      </Button>
      <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
        <div className={classes.root}>
          <DialogActions>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogActions>
          <DialogTitle>
            <Typography variant="h6" align="center">
              Ganti Kata Sandi
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={onSubmit}>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Kata sandi Anda adalah rahasia dan tidak boleh diketahui
                    oleh orang lain.
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    id="old_password"
                    label="Kata Sandi Saat Ini"
                    onChange={onChange}
                    value={old_password}
                    error={errors.old_password}
                    type="password"
                    helperText={errors.old_password}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    id="new_password"
                    label="Kata Sandi Baru"
                    onChange={onChange}
                    value={new_password}
                    error={errors.new_password}
                    type="password"
                    helperText={
                      errors.new_password
                        ? errors.new_password
                        : "Gunakan 8 karakter atau lebih dengan kombinasi huruf kapital dan angka."
                    }
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    id="new_password2"
                    label="Konfirmasi Kata Sandi Baru"
                    onChange={onChange}
                    value={new_password2}
                    error={errors.new_password}
                    type="password"
                    helperText={errors.new_password}
                  />
                </Grid>
              </Grid>
              <div className={classes.saveButtonContainer}>
                <Button type="submit" className={classes.saveButton}>
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

EditPassword.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  changePassword: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  success: state.success,
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  changePassword,
  logoutUser,
  clearErrors,
})(EditPassword);
