import React, { useState, useEffect, useCallback  } from "react";
import { connect } from "react-redux";
import { Dropbox } from "dropbox";
import { tokenUrl } from "../../utils/getDropboxToken";
import PropTypes from "prop-types";
import { setDropboxToken } from "../../actions/UserActions";
import FileList from "./FileList/FIleList.js";
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
    width: "100%",
    maxWidth: "300px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
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
    marginTop: "10px",
    marginBottom: "5px",
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


function DropboxConnect(props) {
  const classes = useStyles();
  // const [documents, updateDocs] = useState([]);
  // const [choosenFiles, updateChoosenFiles] = useState([]);
  // const [search, updateSearch] = useState("");
  const [userName, updateUserName] = useState("");
  // const [dropDown, updateDropDown] = useState(false);
  const [searchFilter, setSearchFilter ] = useState("");
  const [allDocs, updateAllDocs] = useState([]);
  const [path, updatePath] = useState("");
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
      })
      .catch((response) => {
        console.log(response.error.error_summary);
      });
  }, [path])


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

  const ViewDirectory = (folders) => {
    const classes = useStyles();

    let folders_name = folders.split("/")
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
          }})
        }
      </Breadcrumbs>
    );
  }

  const onChange = (e) => {
    switch(e.target.id){
      case "searchFilter":
        setSearchFilter(e.target.value)
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
        <Grid container alignItems="space-between" style={{marginTop: "20px", marginBottom: "7.5px"}}>
          <Grid item xs={6}>
            {ViewDirectory(path)}
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              variant="outlined"
              id="searchFilter"
              InputProps={{
                endAdornment:
                  <InputAdornment position="start">
                    <IconButton size="small" className={classes.searchButton}>
                      <GoSearch />
                    </IconButton>
                  </InputAdornment>
              }}
              value={searchFilter}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={handleCloseDropbox} className={classes.closeButton}>
              <ExitToAppIcon />
            </IconButton>
          </Grid>
        </Grid>
        <FileList allDocs={allDocs} updatePath={handleUpdatePath} getLinkToFile={getLinkToFile}/>
      </div>
    )
  }
  else {
    return (
      <div className={classes.root}>
        <Grid container direction="column" alignItems="center">
          <Typography variant="h5" align="center">
            Dropbox anda belum terhubung ke sistem Schooly
          </Typography>
          <Grid item style={{paddingTop: "20px"}}>
            <Button
              href={tokenUrl}
              startIcon={<FaDropbox />}
              className={classes.connectButton}
            >
              Hubungkan ke Dropbox
            </Button>
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
