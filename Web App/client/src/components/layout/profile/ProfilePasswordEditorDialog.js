import React from "react";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Button, Dialog, Grid, IconButton, List, ListItem, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import LockIcon from "@material-ui/icons/Lock";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { changePassword } from "../../../actions/AuthActions"
import { logoutUser } from "../../../actions/UserActions"
const useStyles = makeStyles((theme) => ({
  dialogRoot: {
    padding: "15px",
  },
  changePasswordCaution: {
    color: "#A9A9A9",
    display: "flex",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  errorInfo: {
    color: "red",
    fontSize: "10px"
  }
}));

function EditPasswordField(props) {
  const {on_change, value, errors, id} = props;
  const classes = useStyles();

  return (
    <ListItem>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              {props.edit_password_requirement}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <OutlinedTextField 
            on_change={on_change}
            id={id}
            value={value}
            span_classname={classes.errorInfo}
            html_for="password_lama"
            labelname="Kata sandi lama"
            error1 = {errors.password}
            type="password"/>
          </Grid>
        </Grid>
    </ListItem>
  )
}

function ProfilePasswordEditorDialog(props) {
  const [old_password, setOldPassword] = React.useState("");
  const [new_password, setNewPassword] = React.useState("");
  const [new_password2, setNewPassword2] = React.useState("");
  const {changePassword, logoutUser} = props;
  const {user} = props.auth;
  
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault()
    handleClose()
    props.handleOpenAlert()
  }

  const onChange = e => {
    switch(e.target.id) {
      case "old_password":
        setOldPassword(e.target.value)
        break;

      case "new_password":
        setNewPassword(e.target.value)
        break;
      
      case "new_password2":
        setNewPassword2(e.target.value)
        break;
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        startIcon={<LockIcon />}
        style={{
          backgroundColor: "#DCDCDC",
          color: "black",
          width: "200px",
        }}
      >
        Ganti Kata Sandi
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Grid container direction="column" alignItems="center" className={classes.dialogRoot}>
          <Grid item container justify="flex-end" alignItems="flex-start">
            <IconButton
              size="small"
              disableRipple
              onClick={handleClose}
            >
                <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item style={{marginBottom: "10px"}}>
            <Typography variant="h6" gutterBottom style={{textAlign: "center"}}>
              <b>Ganti Kata Sandi</b>
            </Typography>
            <Typography variant="subtitle2" className={classes.changePasswordCaution}>
               Kata sandi adalah informasi pribadi yang tidak boleh diketahui oleh orang lain.
            </Typography>
          </Grid>
          <form onSubmit={onSubmit}>
            <List>
              <EditPasswordField
              id="old_password"
                value={old_password}
                on_change={onChange}
                edit_password_requirement="Masukkan Kata Sandi Lama"
              />
              <EditPasswordField
              id="new_password"
              value={new_password}
              on_change={onChange}
                edit_password_requirement="Masukkan Kata Sandi Baru"
              />
              <EditPasswordField
              id="new_password2"
              value={new_password2}
              on_change={onChange}
                edit_password_requirement="Konfirmasi Kata Sandi Baru"
              />
            </List>
            <Grid container justify="center" style={{marginTop: "15px"}}>
              <Button
                type="submit"
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

ProfilePasswordEditorDialog.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,

  changePassword: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
})

export default connect(mapStateToProps, { changePassword, logoutUser}) 
(ProfilePasswordEditorDialog);
