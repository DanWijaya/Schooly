import React from "react";
import {
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "20px",
    padding: "20px",
  },
  textFieldContainer: {
    maxWidth: "150px",
    width: "100%",
  },
}));

function FileSetting(props){
  const classes = useStyles();
  const { fileUploadLimit, setIsChanged, setfileUploadLimit } = props;

  return (
    <Paper variant="outlined" className={classes.root}>
      <Typography variant="h4" color="primary" paragraph>
        Berkas
      </Typography>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Typography>Batas Ukuran 1 Berkas</Typography>
        </Grid>
        <Grid item className={classes.textFieldContainer}>
          <TextField
            type="number"
            variant="outlined"
            value={fileUploadLimit}
            onChange={(e) => {
              setIsChanged(true)
              setfileUploadLimit(e.target.value);
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">MB</InputAdornment>,
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FileSetting;
