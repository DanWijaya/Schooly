import React, { useEffect } from "react";
import LightTooltip from "../../../misc/light-tooltip/LightTooltip";
import {
  Button,
  Dialog,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import LockIcon from "@material-ui/icons/Lock";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { changePassword } from "../../../../actions/AuthActions";
import { logoutUser } from "../../../../actions/UserActions";
import { clearErrors } from "../../../../actions/ErrorActions";

const useStyles = makeStyles((theme) => ({
  editPasswordButton: {
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
  },
  root: {
    padding: "15px",
  },
  content: {
    padding: "0px 10px 0px 10px",
    marginTop: "15px",
    width: "100%",
  },
  changePasswordCaution: {
    color: "#A9A9A9",
    display: "flex",
    textAlign: "center",
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

function EditPasswordField(props) {
  const { on_change, value, errors, id } = props;

  return (
    <Grid item>
      <TextField
        fullWidth
        variant="outlined"
        id={id}
        label={props.edit_password_requirement}
        onChange={on_change}
        value={value}
        error={Boolean(errors)}
        type="password"
        helperText={errors}
      />
    </Grid>
  );
}

function EditPassword(props) {
  const [old_password, setOldPassword] = React.useState("");
  const [new_password, setNewPassword] = React.useState("");
  const [new_password2, setNewPassword2] = React.useState("");
  const {
    changePassword,
    success,
    errors,
    handleOpenAlert,
    clearErrors,
  } = props;
  // const [errorMessage, setErrorMessage] = React.useState({})
  const { user } = props.auth;

  const classes = useStyles();

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
  console.log(success);

  return (
    <div>
      <LightTooltip title="Ganti Kata Sandi">
        <Button
          variant="contained"
          onClick={handleClickOpen}
          className={classes.editPasswordButton}
        >
          <LockIcon fontSize="default" />
        </Button>
      </LightTooltip>
      <Dialog open={open} onClose={handleClose}>
        <Grid
          container
          direction="column"
          alignItems="center"
          className={classes.root}
        >
          <Grid item container justify="flex-end" alignItems="flex-start">
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid
            item
            className={classes.content}
            style={{ marginBottom: "15px" }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              <b>Ganti Kata Sandi</b>
            </Typography>
            <Typography
              variant="subtitle2"
              className={classes.changePasswordCaution}
            >
              Kata sandi adalah informasi pribadi yang tidak boleh diketahui
              oleh orang lain.
            </Typography>
          </Grid>
          <form onSubmit={onSubmit} className={classes.content}>
            <Grid container direction="column" spacing={3}>
              <EditPasswordField
                id="old_password"
                errors={errors.old_password}
                value={old_password}
                on_change={onChange}
                edit_password_requirement="Kata Sandi Saat Ini"
              />
              <EditPasswordField
                id="new_password"
                value={new_password}
                errors={errors.new_password}
                on_change={onChange}
                edit_password_requirement="Kata Sandi Baru"
              />
              <EditPasswordField
                id="new_password2"
                value={new_password2}
                on_change={onChange}
                errors={errors.new_password}
                edit_password_requirement="Konfirmasi Kata Sandi Baru"
              />
            </Grid>
            <Grid container justify="center" style={{ marginTop: "30px" }}>
              <Button
                type="submit"
                variant="contained"
                className={classes.saveButton}
              >
                Simpan
              </Button>
            </Grid>
          </form>
        </Grid>
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
