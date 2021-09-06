import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { changePassword } from "../../../../actions/AuthActions";
import { clearErrors } from "../../../../actions/ErrorActions";
import { logoutUser } from "../../../../actions/UserActions";
import PasswordField from "./PasswordField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import LockIcon from "@material-ui/icons/Lock";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "450px",
    [theme.breakpoints.down("xs")]: {
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
    fullScreen
  } = props;

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

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    clearErrors();
    setOpen(true);
  };
  const handleClose = (e) => {
    setOpen(false);
  };

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
              <b>Ganti Kata Sandi</b>
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={onSubmit}>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Pilih kata sandi yang kuat dan unik.
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Kata sandi Anda adalah rahasia dan tidak boleh diketahui oleh orang lain.
                  </Typography>
                </Grid>
                <Grid item>
                  <PasswordField
                    id="old_password"
                    label="Kata Sandi Saat Ini"
                    errors={errors.old_password}
                    value={old_password}
                    onChange={onChange}
                    helperText={errors.old_password}
                  />
                </Grid>
                <Grid item>
                  <PasswordField
                    id="new_password"
                    label="Kata Sandi Baru"
                    errors={errors.new_password}
                    value={new_password}
                    onChange={onChange}
                    helperText={errors.new_password ? errors.new_password : "Gunakan 8 karakter atau lebih dengan kombinasi huruf kapital dan angka." }
                  />
                </Grid>
                <Grid item>
                  <PasswordField
                    id="new_password2"
                    label="Konfirmasi Kata Sandi Baru"
                    errors={errors.new_password}
                    value={new_password2}
                    onChange={onChange}
                    helperText={errors.new_password}
                  />
                </Grid>
              </Grid>
              <div className={classes.saveButtonContainer}>
                <Button
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
