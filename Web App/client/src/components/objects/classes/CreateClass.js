import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { clearErrors } from "../../../actions/ErrorActions";
import { clearSuccess } from "../../../actions/SuccessActions";
import { createClass } from "../../../actions/ClassActions";
import { getTeachers } from "../../../actions/UserActions";
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import UploadDialog from "../../misc/dialog/UploadDialog";
import { withStyles } from "@material-ui/core/styles";
import { Autocomplete }from '@material-ui/lab';

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
        maxWidth: "100%",
    },
    padding: "10px",
  },
  content: {
    padding: "20px",
  },
  createClassButton: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
});

class CreateClass extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      nihil: true,
      walikelas: {},
      ukuran: 0,
      openUploadDialog: null,
      // errors: {},
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.success && !prevProps.success) {
      this.handleOpenUploadDialog();
    }
  };

  handleOpenUploadDialog = () => {
    this.setState({ openUploadDialog: true });
  };

  // handleCloseUploadDialog = () => {
  //   this.setState({ openUploadDialog: false });
  // };

  onChange = (e, otherfield = null) => {
    if (otherfield) this.setState({ [otherfield]: e.target.value });
    else {
      this.setState({ [e.target.id]: e.target.value });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const classObject = {
      name: this.state.name,
      nihil: this.state.nihil,
      walikelas: this.state.walikelas,
      ukuran: 1, // Temporary biar tidak error
      ketua_kelas: this.state.ketua_kelas,
      sekretaris: this.state.sekretaris,
      bendahara: this.state.bendahara,
      errors: {},
    };
    this.props.createClass(classObject, this.props.history);
  };

  onSelect = (selectedList, selectedItem) => {
    if (selectedList.length > 1) selectedList.shift();
    this.setState({ walikelas: selectedList[0] });
  };

  onRemove = (selectedList, selectedItem) => {
    this.setState({ class_assigned: selectedList[0] });
  };

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (nextProps.errors) {this.setState({errors: nextProps.errors});}
  // }

  componentDidMount() {
    this.props.getTeachers();
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.clearSuccess();
  }

  render() {
    const { classes, success, errors } = this.props;

    const { all_teachers, user } = this.props.auth;

    const top100Films = [
      { title: 'The Shawshank Redemption', year: 1994 },
      { title: 'The Godfather', year: 1972 },
      { title: 'The Godfather: Part II', year: 1974 },
      { title: 'The Dark Knight', year: 2008 },
      { title: '12 Angry Men', year: 1957 },
      { title: "Schindler's List", year: 1993 },
      { title: 'Pulp Fiction', year: 1994 }
    ]
    // console.log(errors);
    // console.log(all_teachers);
    document.title = "Schooly | Buat Kelas";

    if (user.role === "Teacher" || user.role === "Admin") {
      return (
        <div className={classes.root}>
          <UploadDialog
            openUploadDialog={this.state.openUploadDialog}
            success={success}
            messageUploading="Kelas sedang dibuat"
            messageSuccess="Kelas telah dibuat"
            redirectLink={`/kelas/${success}`}
          />
          <Paper>
            <div className={classes.content}>
              <Typography variant="h5" gutterBottom>
                <b>Buat Kelas</b>
              </Typography>
              <Typography color="textSecondary">
                Setelah semua murid masuk, jangan lupa untuk menyunting kelas
                dan menentukan ketua kelas, sekretaris, dan bendahara kelas.
              </Typography>
            </div>
            <Divider />
            <form noValidate onSubmit={this.onSubmit}>
              <Grid
                container
                direction="column"
                spacing={4}
                className={classes.content}
              >
                <Grid item>
                  <Typography component="label" for="name" color="primary">
                    Nama Kelas
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="name"
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
                  <Typography component="label" for="walikelas" color="primary">
                    Wali Kelas
                  </Typography>
                  <FormControl
                    id="walikelas"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    error={Boolean(errors.walikelas)}
                  >
                    <Select
                      value={this.state.walikelas}
                      onChange={(event) => {
                        this.onChange(event, "walikelas");
                      }}
                    >
                      {Array.isArray(all_teachers)
                        ? all_teachers.map((walikelas) => (
                            <MenuItem value={walikelas}>
                              {walikelas.name}
                            </MenuItem>
                          ))
                        : null}
                    </Select>
                    <FormHelperText error>
                      {Boolean(errors.walikelas) ? errors.walikelas : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Typography
                    component="label"
                    for="matapelajaran"
                    color="primary"
                  >
                    Mata Pelajaran
                  </Typography>
                  <FormControl
                    id="matapelajaran"
                    color="primary"
                    fullWidth
                  >
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={top100Films} // Dummy
                      getOptionLabel={(option) => option.title}
                      filterSelectedOptions
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          size="small"
                          fullWidth
                          style={{border: "none"}}
                        />
                      )}   
                    />
                    <FormHelperText>

                    </FormHelperText>
                  </FormControl>
                </Grid>
                {/* <Grid item >
                  <Typography component="label" for="ukuran" color="primary">
                    Jumlah Murid
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="ukuran"
                    onChange={this.onChange}
                    value={2}
                    error={errors.ukuran}
                    type="number"
                    helperText={errors.ukuran}
                    className={classnames("", {
                      invalid: errors.ukuran
                    })}
                  />
                </Grid> */}
              </Grid>
              <Divider />
              <div
                style={{ display: "flex", justifyContent: "flex-end" }}
                className={classes.content}
              >
                <div>
                  <Button
                    variant="contained"
                    type="submit"
                    className={classes.createClassButton}
                  >
                    Buat Kelas
                  </Button>
                </div>
              </div>
            </form>
          </Paper>
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <Typography variant="h5" align="center">
            <b>Anda tidak mempunyai izin akses halaman ini.</b>
          </Typography>
        </div>
      );
    }
  }
}

CreateClass.propTypes = {
  createClass: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  getTeachers: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  success: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  success: state.success,
});

export default connect(mapStateToProps, {
  createClass,
  getTeachers,
  clearErrors,
  clearSuccess
})(withStyles(styles)(CreateClass));
