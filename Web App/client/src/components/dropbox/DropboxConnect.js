import React, { useState, useEffect, useCallback  } from "react";
// import { tokenUrl } from "../getToken";
import { tokenUrl } from "../../utils/getDropboxToken"
import { makeStyles } from "@material-ui/core/styles";
import { Dropbox } from "dropbox";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { GoSearch } from 'react-icons/go';
import { FaDropbox } from "react-icons/fa";
import {Breadcrumbs, Button, Grid, InputAdornment, IconButton, TextField, Typography } from "@material-ui/core";
import { setDropboxToken } from "../../actions/UserActions"
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import FileList from "./FileList/FileList"
import "./DropboxConnect.css"
import HomeIcon from '@material-ui/icons/Home';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  container: {
    maxHeight: 440
  },
  listItem: {
    padding: "10px 20px 10px 20px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  createButton: {
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: "#61BD4F",
    },
  },
  menuItem: {
    "&:hover": {
      backgroundColor: "#61BD4F",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
  containerLogin: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "relative",
  },
  closeButton: {
    width: "100%",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
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
  viewDirectory: {
    display: "flex",
    alignItems: "center"
  },
  iconDirectory: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));


function DropboxConnect(props) {
  const classes = useStyles();
  // const [documents, updateDocs] = useState([]);
  // const [choosenFiles, updateChoosenFiles] = useState([]);
  // const [search, updateSearch] = useState('');
  const [userName, updateUserName] = useState("");
  // const [dropDown, updateDropDown] = useState(false);
  const [searchFilter, setSearchFilter ] = useState("");
  const [allDocs, updateAllDocs] = useState([]);
  const [path, updatePath] = useState('');
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
      console.log('resonse.entries', response.entries);
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
  let dropbox = new Dropbox({ accessToken: dropbox_token });
  dropbox
    .filesGetTemporaryLink({ path: path })
    .then((response) => {
      window.location.href = response.link;
    })
    .catch((error) => {
      console.error(error, 'Error by downloading file');
    });
},[dropbox_token]);

const ViewDirectory = (folders) => {
  const classes = useStyles();

  let folders_name = folders.split("/")
  let traverse_dir = "";
  let dir_list = [];

  for ( var i = 1; i < folders_name.length; i++){
    traverse_dir += `/${folders_name[i]}`
    dir_list.push(traverse_dir)
  }

  return (
    <div className={classes.root}>
      
      <Breadcrumbs component="div" className={classes.viewDirectory} separator={<NavigateNextIcon fontSize="small" />}>
        <Grid container onClick={() => handleUpdatePath("")}>
          <HomeIcon color={path ? "textSecondary" : "primary"} className={classes.iconDirectory}/>
          <Typography color={path ? "textSecondary" : "primary"} style={{ cursor: "pointer"}}>
            Dropbox
          </Typography>
        </Grid>
        {folders_name.map((name,i) => {
          if(i !== 0){
            return(
          <Grid item onClick={() => handleUpdatePath(dir_list[i-1])}>
            <Typography color={ i === folders_name.length - 1 ? "primary" : "textSecondary"} style={{ cursor: "pointer"}}>
              {name}
            </Typography>
          </Grid>
          )}})
        }
      </Breadcrumbs>
    </div>
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

  if(dropbox_token){
    console.log(searchFilter)
    console.log(allDocs)

    return(
      <div className={classes.root}>
        <Typography variant="h5" align="center">Akun Dropbox {userName}</Typography>
          <Grid container spacing={5} alignItems="center" style={{paddingTop: "20px"}}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                variant="outlined"
                id="searchFilter"
                InputProps={{
                  endAdornment:
                    <InputAdornment position="start">
                      <IconButton size="small">
                        <GoSearch style={{color:"#2196f3"}}/>
                      </IconButton>
                    </InputAdornment>
                }}
                value={searchFilter}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Button startIcon onClick={handleCloseDropbox} className={classes.closeButton}>
                <b>Tutup Dropbox</b>
              </Button>
            </Grid>
          </Grid>
          {ViewDirectory(path)}
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
              className={classes.connectButton}>
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
