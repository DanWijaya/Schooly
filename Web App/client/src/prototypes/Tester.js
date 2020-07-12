import React, { Component } from "react";
import { Button, Divider, FormControl, Grid, IconButton, InputAdornment, Link, MenuItem, Paper, OutlinedInput, Select, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

const styles = (theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  container: {
    margin: "auto",
    maxWidth: "350px",
    padding: "20px",
  },
  errorInfo: {
    color: "red",
    fontSize: "10px",
  }
});

class Tester extends Component {
  render() {
    const { classes } = this.props;

    return(
      <div className={classes.root}>
        <Paper className={classes.container}>
          <Typography variant="h6" align="center">
            <b>Masuk ke Schooly</b>
          </Typography>
          <form>
            <Grid container direction="column" spacing={3} alignItems="stretch">
              <Grid item>
                <TextField fullWidth variant="outlined" />
              </Grid>
              <Grid item container>
                <TextField
                  label="Kata Sandi"
                  variant="outlined"
                  InputProps={{
                    endAdornment:
                      <InputAdornment position="end">
                        Test
                      </InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  style={{
                    backgroundColor: "#61BD4F",
                    color: "white",
                    width: "100%",
                  }}
                >
                  Masuk
                </Button>
              </Grid>
            </Grid>
          </form>
          <Divider fullWidth style={{marginTop: "20px"}} />
        </Paper>
      </div>
    )
  }
}

export default (withStyles(styles)(Tester))
