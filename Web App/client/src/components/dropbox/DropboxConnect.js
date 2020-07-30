import React, { useState, useEffect, useCallback  } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Dropbox } from "dropbox";
import { tokenUrl } from "../../utils/getDropboxToken";
import PropTypes from "prop-types";
import { setDropboxToken } from "../../actions/UserActions";
import FileList from "./filelist/FileList.js"
import "./DropboxConnect.css";
import { Breadcrumbs, Button, Grid, InputAdornment, IconButton, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { FaDropbox } from "react-icons/fa";
import { GoSearch } from "react-icons/go";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  dropboxLogo: {
    color: theme.palette.dropbox.main,
    width: "50px",
    height: "50px",
    [theme.breakpoints.up("sm")]: {
      width: "75px",
      height: "75px",
    },
  },
  connectButton: {
    maxWidth: "300px",
    backgroundColor: theme.palette.dropbox.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.dropbox.main,
      color: "white",
    },
  },
  closeButton: {
    color: theme.palette.error.main,
    "&:focus, &:hover": {
      color: theme.palette.error.dark,
    },
  },
  searchButton: {
    color: theme.palette.primary.main,
    "&:focus, &:hover": {
      color: theme.palette.primary.dark,
    },
  },
  viewDirectory: {
    display: "flex",
    alignItems: "center",
    fontFamily: "Franklin Gothic",
  },
  viewDirectoryPath: {
    fontFamily: "Franklin Gothic",
    cursor: "pointer",
  },
  homeDirectoryIcon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

function ViewDirectory (props) {
  // Hooks only allowed to be used inside a component.
  const classes = useStyles();
  const {handleUpdatePath, path} = props;
  let folders_name = path.split("/")
  let traverse_dir = "";
  let dir_list = [];

  for (var i = 1; i < folders_name.length; i++) {
    traverse_dir += `/${folders_name[i]}`
    dir_list.push(traverse_dir)
  }

  return (
    <Breadcrumbs
      component="div"
      separator={<NavigateNextIcon fontSize="small" />}
      className={classes.viewDirectory}
    >
      <div onClick={() => handleUpdatePath("")} style={{display: "flex"}}>
        <HomeIcon color={path ? "textPrimary" : "primary"} className={classes.homeDirectoryIcon}/>
        <Typography color={path ? "textPrimary" : "primary"} className={classes.viewDirectoryPath}>
          Dropbox
        </Typography>
      </div>
      {folders_name.map((name,i) => {
        if (i !== 0) {
          return(
            <Grid item onClick={() => handleUpdatePath(dir_list[i-1])}>
              <Typography color={ i === folders_name.length - 1 ? "primary" : "textPrimary"} className={classes.viewDirectoryPath}>
                {name}
              </Typography>
            </Grid>
          )
        }
      return null
      })
      }
    </Breadcrumbs>
  );
}

function DropboxConnect(props) {
  const classes = useStyles();
  // const [documents, updateDocs] = useState([]);
  // const [choosenFiles, updateChoosenFiles] = useState([]);
  // const [dropDown, updateDropDown] = useState(false);
  const [searchFilter, updateSearchFilter ] = useState("");
  const [allDocs, updateAllDocs] = useState([]);
  const [path, updatePath] = useState("");
  const [userName, updateUserName] = useState("");
  // const nodeDropdown = useRef();
  const { setDropboxToken } = props;
  const { dropbox_token } = props.auth;

  useEffect(() => {
    if(dropbox_token){
      let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });
      dropbox
        .usersGetCurrentAccount()
        .then(function (response) {
          updateUserName(response.email);
        })
        .catch(function (error) {
            console.error(error);
        });
    }
    // eslint-disable-next-line
  }, [dropbox_token]);

  useEffect(() => {
    let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });
    dropbox
      .filesListFolder({ path: path })
      .then((response) => {
        console.log("resonse.entries", response.entries);
        updateAllDocs(response.entries);
        updateSearchFilter("") // ini untuk clear search filter tiap kali ganti directory
      })
      .catch((response) => {
        console.log(response.error.error_summary);
      });

  }, [path, dropbox_token])

  const handleUpdatePath = useCallback((path) => {
    updatePath(path)
  },[])

  const getLinkToFile = useCallback((path) => {
    // console.log(path);
    let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });

    dropbox
      .filesGetTemporaryLink({ path: path})
      .then((response) => {
        window.location.href = response.link
      })
      .catch((error) => {
        console.error(error, "Error by downloading file");
      })
  },[dropbox_token]);

  const onChange = (e) => {
    switch(e.target.id){
      case "searchFilter":
        console.log(e.target.value)
        updateSearchFilter(e.target.value)
        break;

      default:
        break;
    }
  }

  const handleCloseDropbox = () => {
    console.log("AA")
    console.log(localStorage.dropbox_token)
    setDropboxToken(null)
  }

  if (dropbox_token) {
    console.log(searchFilter)
    console.log(allDocs)
    return(
      <div className={classes.root}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <FaDropbox className={classes.dropboxLogo} />
          </Grid>
          <Grid item>
            <Typography variant="h3" style={{fontFamily: "Franklin Gothic"}}>
              Dropbox
            </Typography>
            <Typography color="textSecondary">
              {userName}
            </Typography>
          </Grid>
        </Grid>
        <Grid container justify="space-between" alignItems="center" style={{marginTop: "20px", marginBottom: "7.5px"}}>
          <Grid item xs={7}>
            <ViewDirectory path={path} handleUpdatePath={handleUpdatePath}/>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              id="searchFilter"
              value={searchFilter}
              onChange={onChange}
              InputProps={{
                endAdornment:
                  <InputAdornment position="start">
                    <IconButton size="small" className={classes.searchButton}>
                      <GoSearch />
                    </IconButton>
                  </InputAdornment>
              }}
            />
          </Grid>
          <LightTooltip title="Matikan Dropbox">
            <IconButton onClick={handleCloseDropbox} className={classes.closeButton}>
              <ExitToAppIcon />
            </IconButton>
          </LightTooltip>
        </Grid>
        <FileList
          searchFilter={searchFilter}
          allDocs={allDocs}
          updatePath={handleUpdatePath}
          getLinkToFile={getLinkToFile}/>
      </div>
    )
  }
  else {
    return (
      <div className={classes.root}>
        <Grid container direction="column" spacing={5} alignItems="center">
          <Grid item container spacing={3} alignItems="center">
            <Grid item>
              <FaDropbox className={classes.dropboxLogo} />
            </Grid>
            <Grid item>
              <Typography variant="h3" style={{fontFamily: "Franklin Gothic"}}>
                Dropbox
              </Typography>
              <Typography color="error">
                Belum Terhubung
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="column" spacing={2} alignItems="center">
            <Grid item>
              <Typography align="center" gutterBottom>
                Hubungkan ke akun Dropbox Anda ke Schooly untuk mengakses, menggunggah dan mengunduh berkas yang ada di Schooly.
              </Typography>
              <Typography variant="body2" align="center" color="textSecondary">
                Dengan menghubungkan akun Dropbox Anda ke Schooly, Anda telah menyetujui <a href="https://www.dropbox.com/terms">
                Kebijakan Penggunan Dropbox</a> dan <Link to="/kebijakan-penggunaan">Kebijakan Penggunaan Schooly</Link> untuk penggunaan aplikasi pihak ketiga di Schooly.
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                href={tokenUrl}
                className={classes.connectButton}
              >
                Hubungkan Dropbox
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
};

DropboxConnect.propTypes = {
  setDropboxToken: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
})

export default connect(
  mapStateToProps, { setDropboxToken }
)(DropboxConnect);
